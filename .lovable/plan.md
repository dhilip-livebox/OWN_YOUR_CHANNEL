
# AI Live TV Channel — Phase 1 Landing Site

## Stack note
Project is on **TanStack Start + React + Tailwind v4** (not Next.js). I'll adapt the spec 1:1 — routing via `src/routes/*`, animations via Framer Motion (`motion`), icons via `lucide-react`. All acceptance criteria remain.

## Design system (locked)
Add to `src/styles.css` as tokens (oklch equivalents of the hex spec):
- `--background` #0A0E14, `--surface` #12161F, `--border` #232837
- `--primary` (gold) #F2B33D, `--accent` (blue) #3D8BF2, `--live` #3DDC97
- `--foreground` #F5F6F8, `--muted-foreground` #9AA3B2
- Fonts loaded via `<link>` in `__root.tsx`: **Space Grotesk** (headings), **Inter** (body)
- Subtle radial gold/blue glows behind hero + section headers; hairline cards; pulsing LIVE dot; scroll fade-up (reduced-motion aware)

## Routes
```
src/routes/
  __root.tsx          → fonts, dark bg, HeadContent
  index.tsx           → full landing (all sections, single scroll)
  resources.tsx       → gated free resources (unlocked via localStorage flag set after form submit)
  admin.tsx           → password-gated dashboard (server-side check)
  api/leads.ts        → server route: proxies POST/GET to Apps Script (keeps URL server-side)
```

## Homepage sections (`src/routes/index.tsx` + `src/components/landing/*`)
1. **Hero** — rotating headline (Framer Motion), sub, primary gold CTA "Register Free & Get Instant Access", ghost "See How It Works", animated concentric pulse-ring broadcast tower SVG background, LIVE trust strip
2. **HookStrip** — data-driven array of 10 hooks (from spec §7), pill cards, horizontal scroll on mobile / grid on desktop
3. **Benefits** — 4-col icon grid (no high-speed net, no PC-on, own servers, worldwide reach, monetize)
4. **PlatformGrid** — 12 platforms (FB, YT, IG, OTT, Mobile, Android TV, Smart TV, Apple TV, Roku, Websites, Cable, IPTV) as icon tiles, caption "One channel. Every screen. Simultaneously."
5. **JourneyTimeline** — vertical stepper on mobile / horizontal on desktop, 9 steps per spec
6. **VideoLibrary teaser** — Featured row + Latest row from `src/data/videos.json` (`{title, category, thumbnail, videoUrl, dateAdded, featured}`), category filter chips, "new daily" counter; clicking a card pre-registration opens the registration modal
7. **Registration** — split layout: left = value bullets (software/guides/videos/docs/training), right = form (fields per spec §5), success state reveals resource links + sets `localStorage.registered=true`
8. **SocialProof** — placeholder channel cards grid
9. **Footer** — logo, tagline, links, language dropdown (English active; Tamil/Hindi/Telugu/Kannada/Malayalam as "Coming Soon"), social icons

## Registration flow
- Client validates with **zod** (name, phone, email, country, state, city, language, interest[]+other)
- Submits to `POST /api/leads` server route → server reads `SHEETS_ENDPOINT` env, forwards JSON to Apps Script
- Response OK → success card with links to `/resources`, sets local flag
- Errors surfaced inline; respects `prefers-reduced-motion`

## Admin dashboard (`/admin`)
- Simple password gate: server function checks `ADMIN_PASSWORD` env against submitted password, sets an httpOnly session cookie (using TanStack Start `useSession` + `SESSION_SECRET`)
- After unlock: stat cards (Total / Today / Week / Month) + 30-day bar chart (**Recharts**)
- Data fetched via `GET /api/leads` → Apps Script `doGet` aggregate JSON
- Helper note linking to the Google Sheet with "File → Download → Excel" instructions
- Styled dark, gold/blue accents, information-dense

## Google Apps Script (delivered as file, not executed)
Create `apps-script/Code.gs` in repo (not bundled) containing:
- `doPost(e)` — parses JSON body, appends `[new Date(), name, phone, email, country, state, city, language, interest]` to sheet `AI-TV-Channel-Leads`
- `doGet(e)` — reads Timestamp column, returns `{total, today, week, month, daily:[{date,count}x30]}` JSON
- CORS headers via `ContentService.createTextOutput(...).setMimeType(JSON)`
- README section explaining: create Sheet → Extensions → Apps Script → paste → Deploy as Web App (Execute as Me, Anyone) → copy URL → save via secrets

## Secrets needed (I'll request via add_secret in build mode)
- `SHEETS_ENDPOINT` — Apps Script Web App URL (user provides after deploying the .gs file)
- `ADMIN_PASSWORD` — user-supplied
- `SESSION_SECRET` — auto-generated (generate_secret, 64 chars)

## Data files
- `src/data/hooks.ts` — array of 10 hook strings + icon names
- `src/data/platforms.ts` — 12 platforms with icon + label
- `src/data/journey.ts` — 9 timeline steps
- `src/data/videos.json` — ~8 placeholder video entries (2 featured), categories: Tutorials/Setup/AI/Monetization
- `src/data/channels.ts` — 6 placeholder social-proof entries

## Out of scope (per spec §8)
Multi-language content, AI automation features, full searchable video knowledge base, ad/monetization backend. Components stay data-driven so these can be added later without redesign.

## Acceptance mapping
Every checkbox in spec §9 is covered by the sections above (premium look, gold/blue only, mobile-first responsive, Sheets append works, admin reads Sheets, data-driven strips/grids/library, reduced-motion, no stock photos — SVG/icon-based visuals only).

## After you approve
Build order: tokens+fonts → shared UI (Nav/Footer/Section) → landing sections top→bottom → registration + `/api/leads` → admin + auth → `/resources` → Apps Script file + README → secrets prompt.

**Two things I'll need from you during build:**
1. The Apps Script Web App URL (after you deploy the `.gs` file I generate)
2. A password of your choice for `/admin`
