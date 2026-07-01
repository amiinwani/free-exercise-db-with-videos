import { COUNTS } from './site';

export const FAQS = [
  {
    q: 'Is this exercise API really free?',
    a: `Yes. It's MIT licensed and completely free — no API key, no sign-up, no usage limits when self-hosted. It includes ${COUNTS.exercises} exercises and ${COUNTS.videos} demo videos.`,
  },
  {
    q: 'Do the exercises come with videos?',
    a: `Every one of the ${COUNTS.exercises} exercises has a real demo video — a male and a female version where available (${COUNTS.videos} videos total) — plus a thumbnail, step-by-step instructions, form cues and common mistakes.`,
  },
  {
    q: 'Do I need an API key or a database?',
    a: 'No. The dataset is static JSON served in-memory, so there is no database and no key. Cloning and deploying to Vercel costs nothing.',
  },
  {
    q: 'Can I self-host the exercise API?',
    a: 'Yes — one-click deploy to Vercel, or run it locally with npm. Self-hosted instances have no rate limit. The public demo here is capped at 4 requests per IP.',
  },
  {
    q: 'How do I download all the exercise data and videos?',
    a: 'The full dataset is data/exercises.json in the repo. Run scripts/download-all-videos.sh to pull every video and thumbnail locally.',
  },
  {
    q: 'What can I build with it?',
    a: 'Workout apps, fitness trackers, personal-training tools, AI coaching agents, or any product that needs exercise names, instructions, muscle targeting and demo videos.',
  },
];
