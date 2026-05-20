# LoRA vs QLoRA — why efficient fine-tuning actually matters

Earlier this year I tried fine-tuning a 7B model on our college's RTX 4090 (24GB VRAM) and kept hitting OOM errors. Not the obvious kind — the kind where you think you're doing everything right but the GPU runs out of memory halfway through training anyway. That's what made me actually sit down and understand what's happening at the memory level.

Once I worked through it, LoRA and QLoRA stopped feeling like random tricks and started making sense as actual engineering solutions to real constraints.

## The memory problem nobody warns you about

When you train a 7B model, the weights themselves are ~14GB in fp16. That sounds manageable on a 24GB GPU. The problem is everything else.

You also need:
- **Gradients** — same size as the model, ~14GB
- **Optimizer states** — this is the killer

Adam (which everyone uses) stores two moving averages per parameter: first moment and second moment, both in fp32. For 7B parameters that's `7B × 4 bytes × 2 = 56GB` just for optimizer states.

So you're training a "14GB model" but the optimizer alone needs 56GB. Add gradients and activations and you're looking at 80-100GB total. A single 4090 has 24GB. Even high-memory GPUs start feeling tight once activations and long sequence lengths enter the picture.

I had to recalculate that twice when I first worked it out because it seemed wrong.

## LoRA: train 0.1% of the model instead

LoRA's idea: freeze the base model completely and only train small adapter matrices.

Instead of updating a weight matrix `W` directly, you learn two tiny matrices `A` and `B` where the update is `ΔW = BA`. During the forward pass: `h = W₀x + BAx`. Base weights stay frozen, adapters handle the task-specific changes.

![LoRA Adapter Diagram](/ee7f7d37-3c0a-4f4a-9244-f73287af6211_1456x612.jpg)

For a 4096×4096 weight matrix with rank r=8: you train `4096×8 + 8×4096 = 65k` parameters instead of `16M`. That's 256× smaller. Do this across all attention layers and you end up with ~0.1-1% of the model being trainable.

The memory difference becomes pretty ridiculous once you work through the numbers.. Optimizer states drop from 56GB to a few hundred megabytes.

The question is why this works at all. Why would tiny adapters be enough to fine-tune a whole model?

The idea is basically that the updates during fine-tuning don't actually need the full dimensionality of the original weight matrices. The model already knows language — fine-tuning is more like steering it toward a style or domain. Those kinds of adjustments apparently don't need full-rank updates to every weight matrix.People checked this empirically by looking at the singular values of full fine-tuning updates and found that most of the useful signal was concentrated in a surprisingly small number of components.

There's also an initialization trick. Matrix `A` is initialized with small Gaussian values, `B` starts at zero. So at the beginning `BA = 0` — the adapter contributes nothing and the model behaves exactly like the pretrained base. This helps training stability.

```python
class LoRALinear(nn.Module):
    def __init__(self, in_features, out_features, rank=8):
        super().__init__()
        self.weight = nn.Parameter(torch.randn(out_features, in_features), 
                                   requires_grad=False)  # frozen
        self.lora_A = nn.Parameter(torch.randn(rank, in_features) * 0.01)
        self.lora_B = nn.Parameter(torch.zeros(out_features, rank))

    def forward(self, x):
        return x @ self.weight.T + x @ self.lora_A.T @ self.lora_B.T
```

Rank selection is mostly empirical. r=8 or r=16 works for instruction tuning on already-decent base models. Higher ranks (r=32, r=64) help when you're teaching genuinely new behaviors. Which layers to target also matters — usually Q, K, V, O projections in attention. Adding MLP layers is expensive but sometimes helps for factual tasks.

## QLoRA: quantize the base, keep adapters precise

LoRA fixes the optimizer problem but you still need to load the full base model for the forward pass. 7B in fp16 is 14GB. 13B is 26GB. On a 24GB GPU, even 13B barely fits.

QLoRA's move: store the base model in 4-bit, keep LoRA adapters in bf16.

A 7B model in 4-bit is ~3.5GB instead of 14GB. That's the entire difference between "barely runs" and "actually usable" on consumer hardware.

![QLoRA Diagram](/ae2cd9af-0b52-416f-b94e-0d97904825e4_505x420.webp)

The weird part is that 4-bit quantization doesn't destroy the model. This confused me initially because throwing away bits of precision sounds bad.

The reason it works: transformer weights aren't uniformly distributed. They cluster around zero, roughly normally distributed. Standard quantization uses evenly-spaced buckets, which wastes precision on ranges where no weights actually live.

NF4 (Normal Float 4-bit) is smarter. It places quantization levels based on the quantiles of a normal distribution — more levels where weights are dense, fewer where they're sparse. You're using your 16 possible values (2⁴) where the data actually is.

```python
# Conceptual: NF4 levels come from quantiles of N(0,1)
def get_nf4_levels():
    quantiles = np.linspace(0, 1, 17)[:-1] + 1 / (2 * 16)
    levels = norm.ppf(quantiles)  # inverse CDF
    return levels / levels.max()
```

Each block of weights gets its own scale factor. During the forward pass you dequantize on-the-fly: multiply the 4-bit level by the scale factor to get bf16. GPUs handle this well enough that the memory savings outweigh the compute cost.

QLoRA also quantizes the scale factors themselves (double quantization) — they go from fp32 to fp8. Small saving per layer but adds up.

The adapters stay in bf16 the whole time. Base model is 4-bit in storage, bf16 during computation. Only the trainable parts need full precision for stable gradient updates.

## What this actually means

| | Full Fine-Tuning | LoRA | QLoRA |
|---|---|---|---|
| Trainable params | All (~7B) | ~0.1-1% | ~0.1-1% |
| Base model | fp16 | fp16 | nf4 (4-bit) |
| Memory (7B) | ~80-100GB | ~18-22GB | ~8-12GB |
| Single 4090 | No | Maybe | Yes |

On our 4090 setup: we can fine-tune 7B models comfortably with QLoRA. 13B is tight but possible. Anything larger needs multi-GPU or cloud.

A few implementation notes: `bitsandbytes` handles the 4-bit quantization and is sensitive to CUDA versions. The `peft` library wraps most of this cleanly. Gradient flow is correct because dequantization happens before the backward pass — base weights are nf4 in storage, bf16 during computation.

```python
from transformers import AutoModelForCausalLM, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,
)

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    quantization_config=bnb_config,
    device_map="auto",
)

lora_config = LoraConfig(
    r=16, lora_alpha=32,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    task_type="CAUSAL_LM",
)

model = get_peft_model(model, lora_config)
# trainable params: ~42M || all params: ~6.8B || trainable: 0.62%
```

After training you can merge the adapter back into the base weights: `W_merged = W₀ + BA`. At inference you're just running the merged model with no adapter overhead.

## Why this matters

The practical impact is about who can participate. Before LoRA, customizing models required clusters. After QLoRA, you can fine-tune competitive models on a single consumer GPU.

That shortened the feedback loop. You can actually run experiments and iterate instead of theorizing or burning cloud credits. A lot of the work on instruction following, domain adaptation, and alignment became tractable because of this.

The interesting thing is that both LoRA and QLoRA are basically solving the same kind of problem:
what actually needs to stay expensive and precise, and what can be compressed or approximated without hurting the model too much?

That's pretty standard systems engineering thinking applied to machine learning. Memory bandwidth is expensive, VRAM is limited, so you structure your storage and computation accordingly.

For us, the concrete difference is being able to iterate on 7B models at all instead of only running inference. Being able to actually run experiments instead of just reading papers changes the learning process completely.. That's probably the most direct way these techniques changed things.