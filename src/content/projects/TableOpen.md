# TableOpen
Github:https://github.com/ash01825/TableOpen


An open-source database GUI I'm currently building.
Fast, native and focused on the actual workflows developers use every day.

![TableOpen](/Screenshot2026-05-2094048.png)

## Why I Started Building This

I wanted to build a serious open-source project for myself and started looking around for software people genuinely wanted but still complained about constantly.

Database GUIs came up again and again.

A lot of people liked TablePlus because it feels fast and polished, but it's paid and closed source. The free alternatives exist, but most of them feel outdated, heavy or cluttered.

What surprised me was that there still wasn't a database client that was:
- modern
- open-source
- actually pleasant to use
- and fully free

all at the same time.

So I started building TableOpen mostly because I thought something like this should already exist.

---

## What I'm Trying To Build

The idea behind TableOpen is pretty simple:

build a database GUI that feels lightweight, responsive and pleasant to use without sacrificing serious functionality.

A lot of database tools become cluttered very quickly. Huge menus, too many panels, weird interactions, slow startup times.

I wanted something that feels closer to tools like Linear or Raycast:
- opens instantly
- stays responsive
- keyboard friendly
- clean UI
- low friction

Still early and still rebuilding a lot of things as the architecture evolves.

Some parts were initially built fast to validate workflows and technical decisions quickly. As the project grows, a lot of systems are being redesigned or rewritten properly instead of endlessly patched forward.

---
# Early Metrics

These are current local benchmark/profiling numbers during development and are still being validated as the architecture stabilizes.

| Metric | Current Result |
|---|---|
| Memory usage vs Electron-based clients | ~55% lower |
| Grid rendering performance | 100k+ rows virtualized smoothly |
| UI freeze reduction during large renders | ~70% lower |
| Query latency improvement from native Rust services | ~40% lower |
| Concurrent async query targets | 100+ queries |


## Current Status

Right now most of the frontend architecture and application foundation is done.

### already built

- application shell
- layout system
- design system
- typed ipc layer
- monaco integration
- zustand stores
- virtualized grid foundation
- sqlite query flow
- component system

### currently working on

- row editing flow
- schema introspection
- postgres support
- ssh tunneling
- query history
- autocomplete improvements
- performance optimization

### intentionally not in v1

- mysql
- mongodb
- ai query generation
- plugin systems
- charting
- migration tooling

I'd rather make one workflow excellent than support everything badly.
# Architecture
![TableOpen Architecture](/TableOpenArch.png)

Basic architecture flow:

```txt

React Frontend
      ↓
Typed IPC
      ↓
Tauri Commands
      ↓
Services
      ↓
Database Layer
      ↓
SQLite / PostgreSQL

```

The frontend and backend communicate through typed IPC contracts so the Rust and TypeScript layers stay aligned properly.
One thing I specifically wanted to avoid was random untyped payloads moving around everywhere.
## Tech Stack

### frontend

- React
- TypeScript
- Zustand
- TanStack Virtual
- Monaco Editor

### backend

- Rust
- Tauri
- rusqlite
- tokio-postgres

---


## Challenges So Far

A few things ended up being much harder than expected:

- frontend/backend type synchronization
- virtualization edge cases during editing
- async query handling
- schema introspection
- transaction safety
- designing postgres support cleanly without overengineering too early

This project has pushed me much deeper into:

- systems thinking
- desktop architecture
- database internals
- UI performance
- typed contracts
- async systems

---


## Demo

Working video:

https://drive.google.com/file/d/13B_SN143MNpwvvTDM0b3PdloSGaUxlP8/view?usp=sharing


## Notes

This project is still heavily in progress.

A lot of the difficult engineering work is still ahead:

- postgres edge cases
- ssh reliability
- transaction handling
- editing workflows
- query performance
- scaling architecture cleanly

But that's also the interesting part.

[[projects]]