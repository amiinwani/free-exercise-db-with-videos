# Free Exercise DB with Videos 🏋️

**The free, open-source exercise API with real male & female demo videos.**

A free exercise database and REST API: **317 exercises**, **593 HD demo videos** (male & female),
plus step-by-step instructions, form cues, common mistakes, breathing and thumbnails for every
exercise. No API key, no database, MIT licensed. Self-host the whole thing in one click.

<p>
  <img alt="MIT License" src="https://img.shields.io/badge/license-MIT-c6ef3a">
  <img alt="Exercises" src="https://img.shields.io/badge/exercises-317-blue">
  <img alt="Demo videos" src="https://img.shields.io/badge/demo%20videos-593-orange">
  <img alt="No API key" src="https://img.shields.io/badge/API%20key-not%20required-brightgreen">
</p>

> 🔎 **Looking for a free exercise API, exercise database, or exercise video API?** This is a
> zero-cost, self-hostable alternative to ExerciseDB / wger with actual demo videos for every
> movement — male and female, on a zero-egress CDN.

---

## ✨ Why this exists

Most "free exercise APIs" give you names and maybe a GIF. This one gives you **a real video demo of
every exercise** — performed by a male *and* a female model — alongside genuinely useful coaching
metadata (ordered steps, form cues, common mistakes, breathing). It runs with **no database and no
API key**, so cloning it and deploying to Vercel costs **$0**.

| | This repo | Typical free exercise DBs |
|---|---|---|
| Real demo videos (male + female) | ✅ 593 videos | ❌ GIFs or nothing |
| Step-by-step instructions | ✅ | sometimes |
| Form cues + common mistakes | ✅ | ❌ |
| Runs with zero infra / no key | ✅ | varies |
| License | MIT | varies |

## 🚀 Quick start

```bash
git clone https://github.com/arhamwani765/free-exercise-db-with-videos
cd free-exercise-db-with-videos
npm install && npm run dev
# → http://localhost:3000/api/v1/exercises
```

## 🤖 INSTRUCT — set it up with your AI agent

Paste this prompt into Claude Code, Cursor, or any coding agent and it will do the whole setup:

```text
You are setting up a free, open-source exercise database with real demo videos.

1. Clone the repo:
   git clone https://github.com/arhamwani765/free-exercise-db-with-videos
   cd free-exercise-db-with-videos

2. Install and run the API locally:
   npm install && npm run dev
   # → API live at http://localhost:3000/api/v1/exercises
   # (or deploy to Vercel for a free public instance — see the Deploy button in the README)

3. (Optional) Download every video + thumbnail locally:
   bash scripts/download-all-videos.sh
   # → pulls all 593 videos + posters into ./videos and ./thumbnails

4. The full dataset is data/exercises.json — 317 exercises, each with male & female
   video URLs, thumbnails, step-by-step instructions, form cues, common mistakes and
   breathing. Query it via GET /api/v1/exercises
   (filters: bodyPart, equipment, target, difficulty, search, limit, offset).
```

## 📡 API reference

Base URL `/api/v1`. All responses are JSON: `{ success, count?, data }`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/exercises` | List / filter. Query: `bodyPart, equipment, target, difficulty, search, limit, offset` |
| GET | `/api/v1/exercises/:id` | One exercise by id |
| GET | `/api/v1/search?q=` | Search name, alias, target, muscle |
| GET | `/api/v1/bodyparts` | Body-part facets + counts |
| GET | `/api/v1/equipment` | Equipment facets + counts |
| GET | `/api/v1/targets` | Target-muscle facets + counts |

```bash
curl "http://localhost:3000/api/v1/exercises?bodyPart=back&limit=1"
```
```json
{
  "success": true,
  "count": 57,
  "data": [{
    "id": "0489",
    "name": "45 Degree Hyperextension",
    "bodyPart": "back",
    "target": "erector spinae",
    "equipment": "leverage machine",
    "difficulty": "beginner",
    "steps": ["…"],
    "formCues": ["Keep back straight", "Hinge from hips"],
    "commonMistakes": ["Rounding the back"],
    "videos": {
      "male":   "https://…/exercise-videos/male/45-degree-hyperextension.mp4",
      "female": "https://…/exercise-videos/female/45-degree-hyperextension.mp4"
    },
    "thumbnails": { "male": "https://…/male/45-degree-hyperextension.jpg" }
  }]
}
```

A machine-readable [`openapi.yaml`](./openapi.yaml) ships in the repo root.

## 📥 Use it — three ways

**A. Tell your agent to clone it** — paste the INSTRUCT block above.

**B. Host it yourself (free)** — one-click deploy, no database, no key:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/arhamwani765/free-exercise-db-with-videos)

**C. Download the data / videos**

- Full dataset: [`data/exercises.json`](./data/exercises.json) (317 exercises)
- Per-exercise: `data/exercises/<id>.json` · by body part: `data/by-bodypart/<part>.json`
- Every video + thumbnail:
  ```bash
  bash scripts/download-all-videos.sh
  # → ./videos/{male,female}/*.mp4  and  ./thumbnails/{male,female}/*.jpg
  ```

## 🧾 Dataset

Every exercise includes: `name`, `aliases`, `bodyPart`, `target`, `secondaryMuscles`, `equipment`,
`difficulty`, `compound`, `unilateral`, `shortDescription`, `instructions`, `steps`, `formCues`,
`commonMistakes`, `breathing`, `videos {male, female}`, `thumbnails {male, female}`.

- **317** exercises across 10 body parts and 13 equipment types
- **593** demo videos — **290** male + **303** female
- Difficulty split: beginner / intermediate / advanced

## 🔧 Self-hosting notes

- **No database.** The dataset is static JSON in `data/`, read in-memory. Deploys cost $0.
- `DEMO_MODE=true` enables the 4-request/IP demo limit — leave it unset for **unlimited** self-hosted use.
- Videos are served from a zero-egress CDN. Want to re-host them? Run `download-all-videos.sh`,
  move the files to your CDN, and update the URLs via `scripts/export-from-source.mjs`.

## 📄 License

Code and exercise metadata are released under the **[MIT License](./LICENSE)** — use them freely in
commercial and personal projects. The demo videos are provided for demonstration; see
[Credits](#-credits) for provenance.

## 🙌 Credits

- Exercise metadata (instructions, cues, mistakes, descriptions) generated and curated for this project.
- Demo videos: animated exercise video set. See repository history for details.

---

Keywords: free exercise api · exercise database · exercise video api · workout api · fitness api ·
open source exercise db · gym exercises json · exercise demonstrations · self-hosted exercise api.
