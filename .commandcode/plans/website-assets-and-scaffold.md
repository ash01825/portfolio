# Plan: Portfolio Website — Design Lock-in, Asset Collection & Project Scaffold

## Decisions Locked In

| Layer | Choice |
|-------|--------|
| **Vibe** | Editorial Luxury — warm creams, deep espresso, muted sage, film grain |
| **Fonts** | Geist (sans) + Geist Mono (code) |
| **Palette** | Warm Monochrome — bone base, charcoal text, spot pastel accents |
| **Color Modes** | Light + Dark with manual toggle and `prefers-color-scheme` respect |
| **Theme Strategy** | `next-themes` + Tailwind `dark:` variant + CSS custom properties |

---

## Phase 1: Design System (Tokens & Config)

**Goal:** Define every visual constant before writing any component.

### 1a. Color Tokens — Dual Mode

Light mode: Editorial Luxury + Warm Monochrome.
Dark mode: warm espresso darks (NOT cold blue-blacks). Same warmth, inverted luminance.
Theme switch uses Tailwind's `dark:` variant driven by `next-themes`.

#### Semantic Tokens (Light → Dark)

| Token | Light | Dark |
|-------|-------|------|
| Canvas/Background | `#FDFBF7` (warm cream) | `#1C1A18` (warm espresso) |
| Primary Surface | `#FFFFFF` (cards) | `#262320` (raised card) |
| Borders | `#EAE4D9` (warm hairline) | `#3D3832` (warm divider) |
| Body Text | `#2F2B28` (espresso-charcoal) | `#E8E4DF` (warm cream-white) |
| Secondary Text | `#78716C` (warm stone) | `#A49E96` (warm stone lt) |
| Subtle | `#A8A29E` (warm st-4) | `#6B6560` (warm muted) |

#### Spot Pastel Accents (same in both modes)

```
Sage Green:    bg: #EDF3EC / dark: #1E2F1D,  text: #346538 / dark: #7BC47F
Dusty Rose:    bg: #FDEBEC / dark: #3D1F1F,  text: #9F2F2D / dark: #E8837F
Warm Amber:    bg: #FBF3DB / dark: #3D3318,  text: #956400 / dark: #F0B848
Slate Blue:    bg: #E1F3FE / dark: #1A2D3A,  text: #1F6C9F / dark: #6DB3D9
```

#### Implementation Strategy

Use CSS custom properties in `globals.css` for the semantic tokens, then reference them in `tailwind.config.ts`:

```css
:root {
  --canvas: #FDFBF7;
  --surface: #FFFFFF;
  --border: #EAE4D9;
  --text-primary: #2F2B28;
  --text-secondary: #78716C;
  --text-subtle: #A8A29E;
}
.dark {
  --canvas: #1C1A18;
  --surface: #262320;
  --border: #3D3832;
  --text-primary: #E8E4DF;
  --text-secondary: #A49E96;
  --text-subtle: #6B6560;
}
```

Tailwind references:
```ts
colors: {
  canvas: 'var(--canvas)',
  surface: 'var(--surface)',
  border: 'var(--border)',
  'text-primary': 'var(--text-primary)',
  'text-secondary': 'var(--text-secondary)',
  'text-subtle': 'var(--text-subtle)',
}
```

#### Theme Toggle

- Subtle icon button in the navigation (Phosphor `Sun` / `Moon` icons)
- Morph transition between icons (rotate + fade)
- Persisted in localStorage via `next-themes`
- Respects `prefers-color-scheme` on first visit, then manual override wins

### 1b. Typography Tokens

| Role | Font | Weight | Size | Tracking | Leading |
|------|------|--------|------|----------|---------|
| Hero/Display | Geist Sans | 500 | `text-5xl md:text-7xl` | `tracking-tighter` | `leading-none` |
| Section Headings | Geist Sans | 500 | `text-3xl md:text-4xl` | `tracking-tight` | `leading-tight` |
| Body | Geist Sans | 400 | `text-base` | normal | `leading-relaxed` |
| Caption/Label | Geist Sans | 450 | `text-xs` | `tracking-[0.2em]` | normal |
| Code | Geist Mono | 400 | `text-sm` | normal | `leading-relaxed` |
| Editorial accent | Playfair Display or Newsreader | 400 italic | context-dependent | `-0.02em` | `1.1` |

### 1c. Spacing Scale

```
Section vertical:    py-24 md:py-32
Card internal:       p-6 md:p-8
Content max-width:   max-w-4xl (reading), max-w-7xl (layouts)
Card radius:         rounded-xl (12px) for standard, rounded-[2rem] for bento hero cards
```

### 1d. Motion Tokens

Per design-taste-frontend config (Motion Intensity: 6):
```
Default spring:      type: "spring", stiffness: 100, damping: 20
Easing:              cubic-bezier(0.32, 0.72, 0, 1) for enters
Duration:            600ms for scroll reveals, 700ms for major transitions
Stagger:             80ms per child
Scroll entry:        y: 12 → 0, opacity: 0 → 1
```

### 1e. File to Create

```
src/styles/tokens.ts        — color, spacing, motion constants (TypeScript-safe)
tailwind.config.ts          — theme.extend with all tokens
app/globals.css             — @font-face, CSS custom properties, film grain overlay
```

---

## Phase 2: Project Scaffold

### 2a. Initialize Next.js

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 2b. Install Dependencies

```bash
npm install framer-motion @reactflow/core @reactflow/background @reactflow/controls
npm install @phosphor-icons/react
npm install @next/mdx @mdx-js/loader @mdx-js/react
npm install next-mdx-remote  # for server-side MDX compilation
npm install gray-matter      # frontmatter parsing
npm install date-fns         # date formatting
npm install next-themes      # dark/light mode with system preference + manual toggle
```

### 2c. Configure

- `next.config.mjs` — MDX support, image domains
- `tsconfig.json` — path aliases, strict mode
- `tailwind.config.ts` — tokens from Phase 1
- `.gitignore` — standard Next.js + `.commandcode/` exclusion

---

## Phase 3: Content Architecture

### 3a. Frontmatter Schema (TypeScript types — no code yet)

```ts
type ContentType = 'blog' | 'project' | 'writeup' | 'concept';

interface ContentFrontmatter {
  title: string;
  type: ContentType;
  tags: string[];
  connectedNodes: string[];  // slugs of related content
  bannerImage?: string;
  date: string;              // ISO date
  summary?: string;          // one-line for graph tooltip
}
```

### 3b. Directory Structure

```
content/
  blog/
    first-post.mdx
  projects/
    project-one.mdx
  concepts/
    some-idea.mdx
public/
  images/
    banners/
    profile.jpg
    og-template.png
  fonts/
    geist-sans-*.woff2
    geist-mono-*.woff2
```

### 3c. Graph Generation Strategy

- At build time, read all MDX files from `content/`
- Parse frontmatter with `gray-matter`
- Build nodes from frontmatter fields
- Build edges from `connectedNodes` references
- Export as static JSON consumed by React Flow at runtime

---

## Phase 4: Asset Collection Checklist

### Content Assets (From your portfolio.txt)

#### Bio (raw)
> hi I'm arsh, junior cs grad. I like ai/ml. I have fun building models and systems. In between I read and play. have fun with codeforces. currently thinking and building distributed systems and inference optimization.

This will be refined into a polished homepage intro while keeping the casual, authentic voice.

#### Photo
- **Source:** `WhatsApp Image 2026-05-14 at 10.04.33.jpeg`
- **Needs:** Crop to 1:1 or 3:4 headshot, lighting adjustment, warm tone grading to match Editorial Luxury palette
- **Target:** `public/images/profile.webp` (processed)

#### Links
- GitHub: `https://github.com/ash01825`
- Project: `https://github.com/ash01825/Runic` (→ first blog post)
- Codeforces (implied from bio)
- Others to add: LinkedIn? Email? Twitter/X?

#### Content pieces
1. **Runic** — project writeup/blog post based on your GitHub repo. Needs to be written in MDX with proper frontmatter for the graph.
2. **TBD** — second content slot (another project, a technical writeup on distributed systems or inference optimization)
3. **TBD** — third content slot

---

### Full Website Content Map

| Page | What's on it |
|------|-------------|
| **Homepage** | Name, bio, profile photo, social links, knowledge graph canvas |
| **Graph nodes** | Runic (project), AI/ML (concept), Distributed Systems (concept), Inference Optimization (concept) — plus more as content grows |
| **Graph edges** | Runic ↔ Distributed Systems, Runic ↔ Inference Optimization (based on Runic's actual tech), AI/ML ↔ Inference Optimization |
| **Reading page /runic** | MDX blog post about the Runic project — what it is, tech stack, architecture, why built |
| **Footer/global** | Theme toggle (light/dark), subtle nav

### Technical Assets (We Generate)

- [ ] **Favicon** — monogram or minimal mark from initials, SVG-based
- [ ] **OG image** — auto-generated from title + name at build time
- [ ] **Film grain overlay** — CSS `background-image` with SVG noise filter, `opacity-[0.03]`, `pointer-events-none`, `fixed`
- [ ] **Geist font files** — self-host .woff2 from Vercel's CDN or `next/font/google`
- [ ] **Phosphor Icons** — tree-shake via `@phosphor-icons/react` individual imports

### Pages to Build (in order)

1. **Root layout** — fonts, metadata, film grain, `next-themes` provider, nav shell with theme toggle
2. **Homepage** — name, bio, profile photo, social links, graph container
3. **Reading page** (`/[slug]`) — MDX rendering, banner, code blocks, clean typography
4. **Graph component** — React Flow with custom nodes, focus/defocus, transitions

---

## Phase 5: Implementation Order

1. **Scaffold + tokens** — project init, tailwind config, globals.css, font setup
2. **Root layout** — metadata, film grain, nav placeholder
3. **TypeScript types** — content schema, graph types
4. **Content pipeline** — MDX loader, frontmatter parser, graph builder
5. **Homepage shell** — all elements except the graph
6. **Graph component** — React Flow integration, custom nodes, interactions
7. **Reading page** — MDX renderer, code highlighting, banner image
8. **Mobile pass** — responsive graph, touch interactions, layout collapse
9. **Polish** — motion refinement, performance audit, OG images, favicon

---

## Verification

- [ ] `npm run dev` starts without errors
- [ ] Homepage renders name, bio, profile area, social links
- [ ] Graph renders from content layer with correct nodes/edges
- [ ] Node click opens reading page with MDX content
- [ ] Focus/defocus transitions are smooth (60fps)
- [ ] Theme toggle switches light ↔ dark, persists across reloads
- [ ] `prefers-color-scheme` respected on first visit, manual toggle overrides
- [ ] All text has sufficient contrast in both modes (WCAG AA minimum)
- [ ] Film grain visible but subtle on both light and dark backgrounds
- [ ] Mobile layout is usable — graph has touch alternative
- [ ] No Inter, Roboto, gradient, or neon anywhere
- [ ] No pure black (#000) or pure white (#FFF) used directly
- [ ] Lighthouse: 90+ performance, 100 accessibility
