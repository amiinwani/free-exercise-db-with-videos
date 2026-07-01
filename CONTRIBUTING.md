# Contributing

Thanks for helping improve the free exercise database!

## Ways to contribute

- **Fix metadata** — a wrong muscle, a typo in a cue, a better instruction. Edit the exercise in
  `data/exercises/<id>.json` (and the matching entry in `data/exercises.json`) and open a PR.
- **Improve the site or API** — the app is a standard Next.js project. `npm run dev`, make changes,
  `npm test` and `npm run build` before opening a PR.
- **Report issues** — bad video, broken thumbnail, incorrect data: open an issue with the exercise id.

## Local setup

```bash
npm install
npm run dev            # site + API on :3000
npm test               # unit tests (node:test)
npm run build          # production build (also typechecks)
```

## Regenerating the dataset

`data/` is generated from an internal source by `scripts/export-from-source.mjs` (requires
`MONGODB_URI`). Most contributors won't run this — edit the JSON directly instead.

## Ground rules

- Keep the data honest — no invented exercises or fake videos.
- Keep it dependency-light and database-free; the whole point is $0 self-hosting.
- Match the existing code style.
