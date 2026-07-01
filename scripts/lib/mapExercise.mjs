// Pure mapper: source Mongo exercise doc -> public camelCase Exercise.
// No I/O, no dependencies — safe to unit test in isolation.
//
// Deliberately DROPS third-party / internal fields:
//   - gif_url, image        (ExerciseDB assets — not ours to redistribute)
//   - video_url             (empty legacy Veo field)
//   - video_prompt, action_block, thumbnail_prompt, composition_hint (internal)
//   - custom_thumbnail_url, is_new, rationale_for_addition, enrichment_version
//   - _id, __v, createdAt, updatedAt, priority, video_updated_at, thumbnail_updated_at

const str = (v) => (typeof v === 'string' ? v : '');
const arr = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string' && x.length) : []);

/** Build a `{ male?, female? }` object, omitting empty/whitespace values. */
function genderMap(male, female) {
  const out = {};
  if (str(male).trim()) out.male = male;
  if (str(female).trim()) out.female = female;
  return out;
}

/**
 * @param {object} doc source Mongo exercise document
 * @returns {object} public Exercise (camelCase)
 */
export function mapExercise(doc) {
  return {
    id: str(doc.exerciseId),
    name: str(doc.name),
    aliases: arr(doc.aliases),
    bodyPart: str(doc.body_part),
    target: str(doc.target),
    secondaryMuscles: arr(doc.secondary_muscles),
    equipment: str(doc.equipment),
    muscleGroup: str(doc.muscle_group),
    difficulty: str(doc.difficulty),
    compound: doc.compound === true,
    unilateral: doc.unilateral === true,
    shortDescription: str(doc.short_description),
    instructions: str(doc.instructions),
    steps: arr(doc.steps),
    formCues: arr(doc.form_cues),
    commonMistakes: arr(doc.common_mistakes),
    breathing: str(doc.breathing),
    videos: genderMap(doc.video_url_male, doc.video_url_female),
    thumbnails: genderMap(doc.poster_url_male, doc.poster_url_female),
  };
}
