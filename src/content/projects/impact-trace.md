# ImpactTrace

Know what breaks before you ship.

ImpactTrace analyzes repository structure and uses AI-assisted dependency analysis to map the possible blast radius of a code change in seconds.

Paste a diff. Scan a repo. Watch impacted files appear live.

![hero screenshot](/img.png)



---

## What It Does

A lot of changes don't fail immediately.

Something compiles fine, tests pass, deployment goes through — and then some completely different service quietly breaks because of an implicit dependency nobody noticed.

ImpactTrace tries to surface those relationships before shipping.

The system:
- scans repositories
- builds dependency graphs
- analyzes diffs
- streams impact analysis live
- visualizes affected files and relationships

The interesting part is that it doesn't just follow imports directly. It also tries to reason about behavioral and shared-state relationships using repository context.

---

## Features

- GitHub repository scanning
- dependency graph generation
- git diff analysis
- live streamed analysis using SSE
- blast radius visualization
- severity-based impact mapping
- markdown report export
- local analysis history persistence

---

## Tech Stack

### frontend
- React
- TypeScript
- Vite
- React Flow
- Zustand
- Framer Motion
- Tailwind CSS

### backend
- Node.js
- Express
- TypeScript
- Server-Sent Events
- simple-git

### ai
- OpenRouter
- NVIDIA Nemotron 120B

---

## Analysis Flow

The backend clones and scans repositories, extracts dependency relationships and builds structured context around the proposed change.

That context gets sent to the model for analysis.

The response streams back progressively using SSE, so instead of waiting for one huge response, impacted nodes and relationships appear live as the analysis runs.

Current analysis includes:
- direct dependencies
- transitive dependencies
- behavioral relationships
- shared-state impacts
- severity estimation

---

## Why We Switched Models

The project initially started on IBM Granite models through watsonx.

It worked, but we kept running into issues around:
- structured output consistency
- context limits
- dependency graph size
- parsing reliability

We eventually switched to NVIDIA Nemotron through OpenRouter because the larger context window and much cleaner JSON output worked significantly better for repository-scale analysis.

---

## Challenges

Some things that ended up being harder than expected:
- handling inconsistent model responses
- managing prompt size with larger repositories
- keeping graph visualization readable
- syncing streamed updates cleanly
- extracting useful repository context without overwhelming the model

The streaming workflow and graph visualization ended up being some of the most interesting parts of the project.

---

## Demo

Live Deployment:

https://impacttrace22.vercel.app/

Github: https://github.com/ash01825/ImpactTrace

---

## Project Structure

```txt
ImpactTrace/
├── backend/
│   ├── routes/
│   ├── services/
│   ├── parsers/
│   └── types/
│
├── frontend/
│   ├── components/
│   ├── hooks/
│   ├── store/
│   └── routes/
│
└── demo-repo/
```

---

## Notes

This project started mostly as an experiment around AI-assisted developer tooling and repository analysis.

It ended up becoming a really fun mix of:
- graph visualization
- streaming systems
- repository analysis
- prompt engineering
- developer tooling UX
- dependency mapping

[[projects]]