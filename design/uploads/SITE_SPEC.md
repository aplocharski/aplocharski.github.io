# Personal Website — Build Spec

**Aleksander Plocharski** · academic portfolio · GitHub Pages (`username.github.io`)
Single source of content: `content.json`. This spec defines layout, tabs, and components. Visual style is chosen separately in Claude Design.

---

## 1. Intent

- Distinctive, **not** a paper-template clone. A computer-graphics researcher's identity, expressed visually.
- **Persistent left identity rail + tabbed content** on desktop; responsive collapse on mobile.
- Plain static site (HTML/CSS/JS), **no build step**, deploys straight to GitHub Pages.
- All text/data comes from `content.json` so the site can be restyled without re-entering content.

---

## 2. Global layout

### Desktop — persistent left rail (~280–320px, always visible)
- Photo
- Name (**Aleksander Plocharski**) + title (PhD Candidate in Computer Graphics)
- Affiliations (2 lines)
- Short research-interests line
- Links row (icons): Google Scholar, GitHub, LinkedIn, ORCID
- Email(s) — supports more than one
- **Download CV** button
- Tab nav: Research · Teaching · Hobbies · About/CV

Active tab renders in the main pane to the right. The rail never scrolls away.

### Mobile — collapse-to-header
- Rail becomes a slim sticky top bar: small photo + name + menu (hamburger) button.
- Tapping the menu slides out the nav **plus** the full identity card (links, email(s), CV).
- Content stacks single-column. Priority: generous spacing, large tap targets, must look polished — mobile is a first-class layout, not an afterthought.

---

## 3. Tabs

### 3.1 Research — home / default tab
Top-to-bottom order:

1. **Hero** — the signature visual (see §5). Optional name/tagline overlay.
2. **Highlights strip** — 3–4 compact cards. Suggested: SIGGRAPH SRC 2024 (2nd place) · three top-venue papers in 2026 · optional featured project. Keep tight.
3. **Publications** — grouped by year (2026 → 2023). Each entry shows: title; authors with *your name bolded* (use `highlight_author`); venue + rank badge (CORE A\* / A, Q1 / Q2); year; type (paper / poster); status (accepted / in press / upcoming); links (paper / project / code / pdf, shown only when present); optional thumbnail. Posters marked; award-winning paper gets a small award tag.
4. **Talks** — conference presentations (8) + other talks (6). One list with a paper/poster/other distinction, or two sub-lists. Show date, event, location, title, type; flag `upcoming` items.
5. **Reviewing & Service** — **compact strip only**: reviewing venues as small badges + one line for the EUROGRAPHICS 2026 committee role. Low-key, not emphasized.

### 3.2 Teaching
- Short intro line.
- **Created course, featured first:** "Applications of Modern AI Methods in Computer Graphics" — designed, coordinated, and taught. Small feature card.
- **Courses taught** — the 6 aggregated courses, each with the terms taught.
- **Courses coordinated** — 3.
- **Supervised theses** — 2 (title + student names).

### 3.3 Hobbies
- Built as a **hobbies index** so it can grow. Currently one card: **Baking → gallery**.
- Gallery: responsive photo grid, optional captions, optional lightbox. Placeholder tiles until photos are added.
- A future second hobby = a new card / sub-page, not a rebuild.

### 3.4 About / CV — deferred stub
- Ship as a minimal placeholder (or hide from nav) for now; build later as a bonus.
- Will eventually hold: long bio, full work history (incl. CD PROJEKT RED), education, awards detail, grants, collaborations, outreach, C2 certificate — a web version of the CV.
- Nothing is blocked by deferring this: the CV download already lives in the rail.

---

## 4. Reusable components
- **Venue badge** — color-coded by rank (A\* / A / Q1 / Q2).
- **Publication entry** — as specified in §3.1.
- **Talk entry** — date · event · location · title · type · upcoming flag.
- **Highlight card** — icon/label/short line.
- **Photo gallery grid** — responsive, optional lightbox.
- **Link icon row** — Scholar / GitHub / LinkedIn / ORCID.
- **Tab nav** (desktop) + **mobile menu** (slide-out).

---

## 5. Visual direction — choose in Claude Design
Pick one and ask for 2–3 variants:
- **Procedural facade** — generative facade grid as hero, blueprint-style badges, structural typography.
- **Neural-SDF / geometry** — wireframe + isosurface line art, dark technical palette, monospace accents.
- **Editorial** — oversized type, left-indexed layout, lots of negative space, reads like a design portfolio.

Anti-template bonus: a small **generative / interactive hero** (three.js, a shader, or p5.js). It quietly demonstrates the skill and guarantees nobody mistakes the site for a template.

---

## 6. Tech notes
- Static HTML/CSS/JS; no framework or build tooling required.
- `content.json` as the data source (fetch at runtime or inline at build).
- Fully responsive; test the mobile layout explicitly.
- Deploy: repo named `username.github.io` → **Settings → Pages → enable**.

---

## 7. Build order
1. **Claude Design:** choose the visual direction — style the hero, the rail, and one publication entry. Export HTML/CSS or use the Claude Code handoff bundle.
2. **Claude Code:** scaffold the rail + tab shell + responsive collapse behavior.
3. Wire `content.json` → **Research** (publications, talks, highlights, reviewing strip).
4. Build **Teaching**.
5. Build **Hobbies** stub + gallery scaffold.
6. Add **About/CV** stub.
7. Add the interactive hero last.
8. Drop in assets (photo, CV PDF, thumbnails) → deploy.
