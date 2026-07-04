# Project Evolution Tree

Animated project portfolio and living changelog system built with React, Vite and TypeScript.

## What this site shows

- Full project portfolio with status, stack, health, risks and next milestones.
- Strict version hierarchy:
  - `1.0.0`, `2.0.0`, `3.0.0` = main trunk / major releases.
  - `1.1.0`, `2.1.0` = branch releases.
  - `1.1.1`, `2.1.1` = sub-branch / patch releases.
- Separate personal page for every project.
- Interactive project version tree with drawer details.
- Global roadmap board and chronological release feed.
- Searchable project catalog.

## Pages

- `/#/` — overview command center.
- `/#/projects` — searchable project catalog.
- `/#/projects/:slug` — full tree page for one project.
- `/#/roadmap` — released / in-progress / planned roadmap.

## Run locally

```bash
npm install
npm run dev
```

## Check before sending or deploying

```bash
npm run lint
npm run build
```

## Static hosting note

This project uses `HashRouter`, so it works on GitHub Pages and most static hosts without custom rewrite rules.
