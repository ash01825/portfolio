![Intro](/323977766968448090.webp)

# Mini-GPT

A decoder-only Transformer model I built in PyTorch while trying to properly understand how modern GPT-style models actually work instead of just calling APIs and pretending I understood them.

Started with Andrej Karpathy's nanoGPT videos and then slowly kept modifying and rebuilding parts of the model from there.

At first the goal was honestly just:
> "make text generation work."

Then it slowly turned into:
> "wait why does every modern model do this differently?"

and I kept going deeper.

Things I ended up experimenting with:
- masked multi-head attention
- RoPE embeddings
- KV caching
- LoRA fine-tuning
- DPO
- sparse expert routing
- inference optimization

---

## Why I Built This

Most of the time when people learn LLMs, they stay at the framework level forever.

Load model.  
Call generate().  
Fine-tune with a library.  
Done.

I wanted to understand what actually happens underneath all of that.

Things like:
- why inference gets slow so fast
- why KV caching matters so much
- why modern models moved away from learned positional embeddings
- why training large models becomes a memory problem immediately
- why everyone suddenly cares about bandwidth and latency all the time

A lot of these things don't fully click until you implement them yourself and watch them break.

So I started with TinyShakespeare, got basic generation working, then slowly kept rebuilding things piece by piece.

---

# How It Started

The first version was extremely small and honestly pretty bad.

Just:
- embeddings
- attention
- feedforward blocks
- causal masking
- next-token prediction

basically enough to make the model generate vaguely readable text instead of complete nonsense.

Most of the early work was just debugging:
- tensor shapes
- masking issues
- exploding loss
- attention bugs
- generation loops
- memory problems

which honestly taught me more than reading papers for another 3 weeks would've.

---

# Transformer Architecture

The core model is still a decoder-only Transformer built in PyTorch.

Main pieces:
- masked self-attention
- feedforward MLP blocks
- residual connections
- LayerNorm/RMSNorm experimentation
- autoregressive decoding

The architecture started very close to nanoGPT initially, but later I kept modifying parts while experimenting with more modern Transformer optimizations.

![transformer architecture](/attention_research_1.png.webp)

> use:
> - clean decoder-only transformer image
> - preferably something simple from nanoGPT/blogs
> - lightly annotate token flow + causal masking

---

# Attention + Causal Masking

This was probably the part where Transformers finally started making sense to me.

Especially causal masking.

```python
mask = torch.tril(torch.ones(T, T)).to(device)
att = att.masked_fill(mask == 0, float('-inf'))
att = F.softmax(att, dim=-1)
```

Simple idea, but once you actually implement it and debug it yourself, you understand very quickly why autoregressive generation becomes expensive.

You also start noticing how much of modern LLM engineering is really just:
- avoiding unnecessary recomputation
- optimizing memory movement
- making attention less painfully expensive

which is not what I expected initially.

![attention visualization](/head-view.gif)

> use:
> - causal masking visualization
> - token attention heatmap
> - attention flow diagram

---

# RoPE Embeddings

The earlier versions used learned positional embeddings because they were easier to understand initially.

Later I switched to RoPE mainly because basically every modern model architecture uses some variation of it now.

I mostly wanted to understand:
> why everyone moved to RoPE in the first place.

The longer I worked on the model, the more obvious it became that modern LLM architecture decisions are usually solving very specific scaling/inference problems instead of just being random research trends.

> use:
> - simple RoPE visualization
> - avoid giant equation screenshots

---

# KV Cache + Inference Optimization

This was probably the biggest realization in the entire project.

The first time I generated longer sequences, inference became painfully slow very quickly.

Then I implemented KV caching:

```python
k_cache = torch.cat([k_cache, k], dim=1)
v_cache = torch.cat([v_cache, v], dim=1)
```

and suddenly a lot of modern inference optimization started making way more sense.

You realize very quickly that autoregressive decoding is kind of brutal computationally if you recompute everything repeatedly.

A lot of modern LLM systems are basically giant optimization problems around:
- memory
- bandwidth
- batching
- cache reuse
- reducing recomputation

which was honestly way more systems-heavy than I expected before building this.

![kv cache diagram](/kv_cache.png)

> use:
> - KV cache visualization
> - token-by-token decoding diagram

---

# LoRA Fine-Tuning

Later I experimented with LoRA mostly because I wanted to understand how people fine-tune huge models without retraining the entire thing.

What surprised me wasn't just the parameter reduction itself.

It was realizing how much modern training pipelines rely on smart engineering tricks instead of brute-force scaling everything endlessly.

This also made experimentation much more practical on smaller hardware setups.

---

# DPO + Sparse Routing

I also spent some time experimenting with:
- DPO-style preference optimization
- sparse expert routing

mostly out of curiosity.

Not really trying to build a production RLHF pipeline or anything crazy.

I mainly wanted to understand:
- routing tradeoffs
- inference overhead
- expert specialization
- training complexity

A lot of these ideas sound simple while reading papers and suddenly become much less simple once tensors and routing logic are involved.

---

# Evaluation

Most evaluation was honestly pretty practical:
- text quality
- coherence
- generation stability
- HellaSwag experiments
- inference speed comparisons
- seeing whether optimizations actually helped or just looked cool on paper

The project was always more about understanding systems and architecture tradeoffs than trying to chase leaderboard numbers.

---

# What I Took Away From This

Before this project, I mostly thought modern LLM progress came from:
> bigger models + more data.

After implementing and debugging things myself, it became really obvious how much progress actually comes from:
- optimization
- inference engineering
- memory management
- architecture decisions
- systems design

A lot of the hardest problems honestly don't even feel like pure ML problems anymore.

- [[machine-learning]]