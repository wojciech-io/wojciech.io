# Insight cover image generation brief

Instructions for generating hero/cover images for all wojciech.io/insights articles.
Use with Codex image generation, DALL-E, or Midjourney.

## Global style rules

Every cover must feel like the same visual system. Not a stock photo library. Not generic AI art. A cohesive editorial series.

**Format**: 1200x630px (OG ratio), landscape
**Palette**: dark background (#0c0c0c to #111111), lime accent (#EBFF00), muted grays (#2a2a2a, #4b5563, #6b7280, #9ca3af), occasional green (#22c55e) for "live/active" signals
**Feel**: technical editorial. Think Stripe blog covers meets Vercel dark mode meets Bloomberg Businessweek layouts. Clean geometry, purposeful negative space, subtle glow effects.
**Typography in image**: monospace only (if any text). Short labels, not sentences. Preferably no text at all so images work across languages.
**What to avoid**: stock photo vibes, people's faces, hands on keyboards, generic "AI brain" imagery, neon cyberpunk, busy/cluttered compositions, gradients that look like PowerPoint

## Per-article prompts

---

### 1. Most AI adoption frameworks are built for demos, not for teams
**File**: `ai-adoption-framework-b2b-saas-growth-teams.mdx`
**Concept**: A clean schematic showing a framework diagram where most paths are crossed out (red/dim) except one highlighted path (lime). Conveys "most approaches fail, one works."
**Prompt**: Dark technical blueprint background. A flow diagram with 5-6 branching paths, most faded and crossed out in dim red. One path glows lime-yellow, leading to a small "deployed" badge. Minimal, schematic, no text. Moody lighting from the active path. Top-down view.

---

### 2. The AI stack I actually run in production
**File**: `ai-production-stack.mdx`
**Concept**: A vertical stack of translucent dark panels/cards, each with a subtle icon or glyph representing a layer (brain, terminal, magnifier, database). The stack glows faintly lime at the edges.
**Prompt**: Isometric view of 4 dark glass panels stacked vertically with slight offset, floating in dark space. Each panel has a faint geometric icon etched in lime-yellow. Subtle ambient glow between layers. Clean, minimal, architectural. No text.

---

### 3. Rebuilding my site with Claude Code, Codex, and zero frontend experience
**File**: `astro-cloudflare-pages-portfolio-ai-workflow.mdx`
**Concept**: A split composition: left side shows raw code/terminal lines, right side shows a polished rendered website. A lime arrow or bridge connects them. The "before/after" of AI-assisted building.
**Prompt**: Dark split-screen composition. Left half: faint monospace code lines in gray on black. Right half: a clean rendered website wireframe glowing softly. A lime-yellow diagonal line bridges the two halves. Architectural, editorial, dark ambient lighting.

---

### 4. Your CRM is an expensive address book. Here is how to fix that.
**File**: `b2b-crm-revenue-operations-system-guide.mdx`
**Concept**: A Rolodex or address book partially disassembled, transforming into a circuit board or system diagram. Old form dissolving into new form.
**Prompt**: Dark background. A vintage contact card or Rolodex silhouette on the left, dissolving into geometric circuit-board patterns on the right. Lime-yellow traces connect the new system nodes. Muted, editorial, transformation visual. No text.

---

### 5. Campaigns plateau. Systems compound. The difference matters.
**File**: `b2b-revenue-system-design-operator-framework.mdx`
**Concept**: Two curves on a dark graph. One flatlines (campaigns), one curves upward exponentially (systems). Simple, stark, data-visual.
**Prompt**: Dark background with a subtle grid. Two curves: one in muted gray that plateaus and flatlines, one in glowing lime-yellow that compounds upward. No axes labels, no numbers. Just the two curves and the divergence point. Clean data visualization aesthetic.

---

### 6. The growth system I built when founder-led sales stopped scaling
**File**: `b2b-saas-growth-system-icp-acquisition-retention.mdx`
**Concept**: A funnel or pipeline diagram where the top (founder-led) is breaking/cracking, and below it a new engineered system glows with clean geometry.
**Prompt**: Dark technical illustration. Top section: a cracked, fading funnel shape in dim gray. Below: a clean, geometric pipeline with 4 connected nodes glowing lime-yellow, arrows flowing between them. Transition from broken to engineered. No text.

---

### 7. How I use Claude Code in client GTM work
**File**: `claude-code-client-gtm.mdx`
**Concept**: A terminal window with three parallel output streams (content, CRM, research), each showing a subtle progress indicator. The "operator cockpit" feel.
**Prompt**: Dark terminal window with three horizontal output lanes, each with a subtle progress bar at different completion stages. Lime-yellow accent on active elements. Dot-grid background visible behind the terminal. Clean, focused, operational.

---

### 8. The Claude Code GTM Agent Starter Pack
**File**: `claude-code-vs-clay.mdx`
**Concept**: A starter kit / toolbox layout. Four tools or components arranged in a grid, each in its own dark panel. The "unboxing" of a system.
**Prompt**: Top-down view of 4 dark panels arranged in a 2x2 grid on a dark surface, each containing a different abstract geometric tool shape. Lime-yellow edges on each panel. Subtle shadow beneath. Product photography aesthetic but for abstract technical tools. No text.

---

### 9. Cloudflare migration: what you get beyond hosting
**File**: `cloudflare-migration-zero-trust-free-tier.mdx`
**Concept**: An iceberg composition. Above the waterline: a simple website icon. Below: a massive infrastructure stack (shield, lock, tunnel, firewall layers).
**Prompt**: Dark composition with a horizontal dividing line. Above: a small, simple website shape. Below the line: a large stack of security layers, shields, and lock icons in dim gray and lime accents. The "hidden infrastructure" iceberg. Moody, editorial.

---

### 10. Why CRM-first beats prompt-first in AI adoption
**File**: `crm-first-ai-adoption.mdx`
**Concept**: Two starting points diverging. Left path starts with a chat bubble (prompt-first) and leads to chaos/scattered nodes. Right path starts with a database icon (CRM-first) and leads to an organized system.
**Prompt**: Dark background. Two paths diverging from center. Left path from a chat bubble icon leads to scattered, disconnected dim gray dots. Right path from a structured database icon leads to organized, connected lime-yellow nodes. Fork in the road visual. Minimal.

---

### 11. From Framer to Astro: the build vs buy decision behind this site
**File**: `framer-to-astro-build-vs-buy-website-rebuild.mdx`
**Concept**: A visual builder interface (drag-and-drop blocks) on the left fading out, code editor on the right fading in. The transition moment.
**Prompt**: Dark horizontal composition. Left: fading visual builder blocks/components in muted gray, slightly transparent. Right: emerging code structure with clean indentation glowing in lime-yellow. Center: the crossover point where both coexist. Editorial, transitional.

---

### 12. I replaced the Google Ads UI with a dashboard that tells me what to do next
**File**: `google-ads-ai-management-dashboard-guide.mdx`
**Concept**: A cluttered dashboard on the left (representing native Google Ads) compressing into a clean, minimal 3-metric cockpit on the right.
**Prompt**: Dark split composition. Left: a chaotic mess of tiny chart widgets, numbers, tabs stacked on each other in dim gray (information overload). Right: three clean metric cards with simple values, glowing lime accents on the key numbers. Compression from noise to signal.

---

### 13. Four layers that make a GTM agent actually work in production
**File**: `gtm-ai-agent-four-layer-architecture-guide.mdx`
**Concept**: Four horizontal layers/strata clearly separated, each with a distinct texture or pattern. Like geological layers but for a tech stack. Exploded axonometric view.
**Prompt**: Dark isometric/axonometric view of 4 horizontal rectangular layers floating with gaps between them. Each layer has a different subtle pattern (dots, lines, grid, solid). Lime-yellow connecting pins or pillars run through all 4 layers. Architectural diagram feel. No text.

---

### 14. When to build your GTM tool and when to just buy one
**File**: `gtm-tools-build-vs-buy-decision-framework.mdx`
**Concept**: A balance scale or seesaw. One side has a box/package (buy), the other has a wrench/blueprint (build). The scale tips slightly.
**Prompt**: Dark background. A minimal geometric balance/seesaw centered in frame. Left pan holds a clean box shape (buy), right pan holds a wrench or blueprint shape (build). Scale slightly tipped. Lime-yellow fulcrum point. Stark, simple, decision-moment visual.

---

### 15. Building a booking engine for a market nobody else wanted
**File**: `how-to-build-booking-engine-product-architecture.mdx`
**Concept**: A calendar grid where most cells are empty/dark, but a few cells glow with booking confirmations. The niche market: small but real.
**Prompt**: Dark background. A monthly calendar grid with most cells dim and empty. 4-5 scattered cells glow lime-yellow with small checkmark indicators. A tiny tent or campsite icon in the corner. Minimal, focused on the "small but active" feeling. No text on cells.

---

### 16. A GTM agent that runs outbound, enriches CRM, and costs $2 per run
**File**: `how-to-build-gtm-ai-agent-outbound-crm.mdx`
**Concept**: A receipt or cost breakdown. A short, clean list with a bold total: $2. The "this is what it actually costs" moment.
**Prompt**: Dark background. A minimal receipt-style vertical strip in the center, with 4-5 faint line items and a bold lime-yellow total line at the bottom showing a small number. Subtle dot-grid background. Clean, transactional, the "unglamorous truth about cost." No readable text, just shapes suggesting a receipt.

---

### 17. What 10+ shipped micro-apps taught me about building with AI
**File**: `how-to-build-micro-saas-with-ai-tools.mdx`
**Concept**: A grid of 10+ small app icons/squares, some polished (lime glow), some dimmed (abandoned/cut). The portfolio of shipped things.
**Prompt**: Dark background. A 3x4 grid of small rounded squares. Some glow with lime-yellow borders and subtle inner light (shipped). Some are dim gray with faint crack lines (abandoned). One has a "new" indicator. Portfolio gallery of micro-products. Top-down, minimal.

---

### 18. The browser bookmark is the wrong primitive
**File**: `kade-local-first-link-vault.mdx`
**Concept**: A browser bookmark star icon, broken or deconstructed, with a vault/lock forming from its pieces. The "wrong tool, right replacement."
**Prompt**: Dark background. A five-pointed star (bookmark icon) fracturing into geometric fragments on the left. On the right, those fragments reassemble into a clean vault/lock shape with a lime-yellow keyhole glow. Transformation, deconstruction to reconstruction. Minimal.

---

### 19. macOS Teleprompter for MacBook Notch: building a native Swift app
**File**: `macos-teleprompter-macbook-notch-native-app.mdx`
**Concept**: A MacBook screen top edge with the notch visible, and subtle text lines flowing upward near the camera. The product in its natural habitat.
**Prompt**: Dark background. Close-up of a MacBook screen's top edge showing the notch/camera area. Faint lime-yellow text lines scroll upward near the notch, slightly transparent. The rest of the screen is dark. Intimate, product-focused, showing the core concept. No readable text.

---

## Implementation

1. Generate each image at 1200x630px
2. Save as WebP, quality 85, to `public/images/insights/{slug}.webp`
3. Add `coverImage: "/images/insights/{slug}.webp"` to each article's frontmatter
4. Update `ArticleCover.astro` to render `coverImage` when present (fallback to SVG `coverType`)
5. Update content schema in `src/content/config.ts` to accept `coverImage` field

## Quality checklist per image

- [ ] Dark background (#0c0c0c range), not gray, not blue-black
- [ ] Lime accent (#EBFF00) used sparingly, not dominant
- [ ] No readable text in the image (works across languages)
- [ ] Clean composition with breathing room
- [ ] Would look good as an OG image when shared on LinkedIn/Twitter
- [ ] Consistent with the other covers in the series
