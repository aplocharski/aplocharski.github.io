# Personal Website — Build Spec

**Aleksander Plocharski** · academic portfolio · GitHub Pages (`username.github.io`)
This spec now matches the final Claude Design handoff (`Directions.dc.html`). Content source: `content.json`.

## 0. Precedence
- The **Claude Design handoff is the source of truth for all visual design and layout** — typography, color, spacing, the Research sub-tab structure, and the mobile behavior described below.
- **This spec governs the non-visual requirements** the design file can't carry: plain static site, `content.json` as the data source, deferred placeholders, and build order.
- If any older layout wording here disagrees with the design, **the design wins**.

---

## 1. Intent
- Distinctive, **timeless, topic-agnostic** editorial + monospace-structural direction. Personality comes from typography and layout, not from research subject matter — so it survives a change of topic.
- **Persistent left identity rail + numbered section tabs** on desktop; responsive top-bar layout on mobile.
- Plain static site (HTML / CSS / vanilla JS), **no framework, no build step**, deploys straight to GitHub Pages.
- All text/data comes from `content.json` so the site can be restyled without re-entering content.

---

## 2. Global layout

### Desktop — persistent left rail (always visible)
Top to bottom, as in the design:
- Photo
- Name (**Aleksander Plocharski**)
- Sub-line: `phd candidate · computer graphics` (monospace)
- Affiliation (Warsaw University of Technology, Faculty of Mathematics & Information Science)
- Short bio paragraph
- **CONTACT** — `mail:` (supports more than one address; currently `<tbd>`)
- **SECTIONS** — numbered nav: `01 research` · `02 teaching` · `03 hobbies` · `04 about / cv`. Active item is filled dark with a ◀ marker.
- **LINKS** — vertical list: scholar · github · linkedin · orcid (each with an ↗)
- Location line: `warsaw, poland`

Active section renders in the main pane on the right. The rail stays fixed.

> Note: CV now lives inside the **About / CV** section (see §3.4), not as a separate rail button.

### Mobile
- **Sticky top bar:** `A. Plocharski` on the left, `NN / section` indicator on the right.
- On the landing (Research) view, the **full identity card** appears at the top: photo, name, sub-line, affiliation, bio, links as small bordered buttons, then the numbered nav buttons stacked (`01 research` … `04 about`).
- Other sections show the stacked nav buttons at the top, then the section content.
- Single-column, generous spacing, large tap targets. Mobile is a first-class layout.

---

## 3. Sections

### 3.1 Research — home / default
- Page title **"Research"** with a heavy underline rule. (No hero image — the design opens straight on the title.)
- **Highlights strip** — 3 cards:
  1. `award` — 2nd place, ACM SIGGRAPH 2024 Student Research Competition (Graduate)
  2. `2026` — three top-venue papers: EUROGRAPHICS ×2, Computer Graphics Forum
  3. `service` — IPC member, EUROGRAPHICS 2026, Short Papers track
- **Three sub-tabs** (bordered buttons; active is filled dark; **Publications** open by default):
  - **Publications** — each entry: teaser thumbnail (left), title, authors with *your name bolded* (`highlight_author`), and a monospace metadata line: `venue · type (journal/conference) · status (in press / published / to appear MM.YYYY) · year`. Posters marked. Long lists collapse behind a `_ N more` expander.
  - **Reviewing & Service** — the full reviewing list (venues + tracks) plus the EUROGRAPHICS 2026 committee role and its responsibilities.
  - **Talks** — grouped under `conference presentations`; each entry: date, `upcoming` tag where relevant, title, and `venue · location`. Expander reveals invited / seminars / panels.

### 3.2 Teaching
- Page title **"Teaching"** + rule, short intro line.
- **COURSES** — flat list. Each row: course name, inline tags where applicable (`CREATED`, `COORDINATOR`), right-aligned `N terms · year-range`, and a role line (`instructor · labs` / `project` / `coordinator`, `MSc elective`). The created course ("Applications of Modern AI Methods in Computer Graphics") carries both tags and a one-line description inline.
- **SUPERVISED THESES** — each: date, title, students, `BSc eng.` tag.

### 3.3 Hobbies — work-in-progress placeholder
- Title + rule, then a large placeholder panel: `// WORK IN PROGRESS`, "This section is being written", subline about hobbies coming soon.
- Future: a hobbies index with a Baking gallery (responsive photo grid). Not built yet.

### 3.4 About / CV — work-in-progress placeholder
- Title + rule, then the same placeholder panel: subline notes a fuller bio, education, experience, and a downloadable CV will live here.
- Future contents: long bio, full work history (incl. CD PROJEKT RED), education, awards detail, grants, collaborations, outreach, C2 certificate, and the CV download.

---

## 4. Reusable components
- **Numbered section nav** (rail on desktop, stacked buttons on mobile), active-state styling.
- **Sub-tab bar** (Research): bordered buttons, active filled dark.
- **Highlight card** — small label + one line.
- **Publication entry** — thumbnail + title + bolded authors + monospace metadata line.
- **Talk entry** — date · upcoming tag · title · venue · location.
- **Course row** — name + tags + right-aligned terms/years + role line.
- **Link list** — scholar / github / linkedin / orcid with ↗.
- **WIP placeholder panel** — for Hobbies and About/CV.

> Rank badges (CORE A\*/A, Q1/Q2) from the earlier draft are **not** surfaced in the final design; metadata is shown as clean monospace text. Add them later only if you want.

---

## 5. Visual direction (chosen)
Editorial + monospace-structural blend: display headings with heavy underline rules, monospace for labels/sub-lines/tags/metadata, warm off-white background, restrained palette. Topic-agnostic and timeless. No generative/interactive hero.

---

## 6. Tech notes
- Static HTML / CSS / vanilla JS; no framework or build tooling.
- `content.json` is the data source — do not hardcode content.
- Fully responsive; test the mobile layout explicitly.
- Deploy: repo named `username.github.io` → **Settings → Pages → enable**.

---

## 7. Build order
1. Scaffold the shell: left rail + numbered section nav + responsive mobile top-bar behavior.
2. Wire `content.json` → **Research**: highlights strip + the three sub-tabs (Publications default, Reviewing & Service, Talks).
3. Build **Teaching** (courses list + supervised theses).
4. Ship **Hobbies** and **About / CV** as the work-in-progress placeholder panels.
5. Drop in assets (photo, thumbnails) and later the CV/gallery → deploy.
