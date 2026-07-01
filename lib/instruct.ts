import { REPO_URL, COUNTS } from './site';

// The copy-paste prompt that turns any coding agent into the installer.
export const INSTRUCT_PROMPT = `You are setting up a free, open-source exercise database with real demo videos.

1. Clone the repo:
   git clone ${REPO_URL}
   cd free-exercise-db-with-videos

2. Install and run the API locally:
   npm install && npm run dev
   # → API live at http://localhost:3000/api/v1/exercises
   # (or deploy to Vercel for a free public instance — see the Deploy button in the README)

3. (Optional) Download every video + thumbnail locally:
   bash scripts/download-all-videos.sh
   # → pulls all ${COUNTS.videos} videos + posters into ./videos and ./thumbnails

4. The full dataset is data/exercises.json — ${COUNTS.exercises} exercises, each with
   male & female video URLs, thumbnails, step-by-step instructions, form cues,
   common mistakes and breathing. Query it via GET /api/v1/exercises
   (filters: bodyPart, equipment, target, difficulty, search, limit, offset).`;
