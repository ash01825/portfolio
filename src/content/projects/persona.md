# Persona 🧠

The Greatest Minds in the Palm of Your Hand.

![persona](/Screenshot2026-07-06at1.31.2PM.png)

Persona is a platform for navigating the intellectual DNA of historical and modern figures. We haven't just built a chatbot—we have built an autonomous AI pipeline that ingests everything a thinker ever wrote, said, or published, and constructs an interactive, multi-modal knowledge graph of their ideas, beliefs, creations, and contradictions.

With Persona, you don't just talk to history. You explore it, question it, and visualize how world-changing ideas evolved over time.

## 🌌 The Universe of a Mind

Every great thinker is a universe of interconnected ideas. For our initial demo, we have fully mapped two of history's most brilliant minds: Albert Einstein and Nikola Tesla.

When you explore a Persona, you are navigating an actual, highly structured graph database built entirely by AI reading primary sources.

Every node in these graphs represents a distinct concept, belief, finding, or creation. Every edge represents a relationship—how one idea influenced, supported, or contradicted another. When you chat with these minds, the agent traverses this very graph to construct its answers, citing the exact source documents it used.

## ⚙️ How We Built It: The Architecture Deep-Dive

Building a digital clone of a human mind requires more than just a system prompt. It requires a robust, hybrid memory architecture. Here is the exact technical pipeline we built to make Persona a reality:

### Phase 1: The Autonomous BFS Source Gathering Agent
To capture a mind, we need their actual words, not just Wikipedia summaries. We built a Recursive Source Gathering Agent using **Tavily**, **Firecrawl**, and **Gemini**.
- **Targeted Search:** The agent uses Tavily to search for primary sources (e.g., "Nikola Tesla original patents pdf").
- **Web Scraping & Local Parsing:** The agent routes URLs. Web pages are scraped into Markdown using Firecrawl. Documents are routed to a local parser using `unstructured` to save on scraping API costs.
- **LLM Evaluation:** Google Gemini (Flash-Lite) reads the scraped markdown and evaluates the text. If the text is a high-quality primary source, it gives it a score (0-100).
- **Recursive Citations (BFS):** The agent extracts hyperlinks, asks Gemini if any point to better citations, and adds them to a Breadth-First Search queue.

### Phase 2: The Cognee Extraction Pipeline
We use **Cognee** (a hybrid graph-vector memory engine) to process the gathered sources.
- **Chunking:** The top-ranked historical sources are sliced into ~800-token chunks.
- **Structured LLM Extraction:** We pass each chunk to Gemini using Instructor (json_mode). The LLM extracts exactly 8 ontological node types and 5 specific relationship edge types.
- **Deduplication:** Using Cognee's Dedup() deterministic hashing, identical concepts are automatically merged into the exact same node.

### Phase 3: The Hybrid Database Layer
Cognee orchestrates the storage of this extracted intellectual DNA across three different databases simultaneously:
- **The Graph Layer (Neo4j):** All nodes and relationships are written to a Neo4j database to allow for complex traversal queries.
- **The Vector Layer (LanceDB / pgvector):** All nodes are embedded using Jina AI Embeddings (2048 dims) and stored in a vector database for semantic similarity search.
- **The Relational Layer (PostgreSQL):** Document metadata, source chunk text, and system state are stored relationally.

Below is the Mind Universe built from the ideas of one of history's greatest minds, ***Albert Einstein***.
![persona-albert](/Screenshot2026-07-06at11.13.08AM.png)