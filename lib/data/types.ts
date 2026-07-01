export interface GenderMedia {
  male?: string;
  female?: string;
}

export interface Exercise {
  id: string;
  name: string;
  aliases: string[];
  bodyPart: string;
  target: string;
  secondaryMuscles: string[];
  equipment: string;
  muscleGroup: string;
  difficulty: string;
  compound: boolean;
  unilateral: boolean;
  shortDescription: string;
  instructions: string;
  steps: string[];
  formCues: string[];
  commonMistakes: string[];
  breathing: string;
  videos: GenderMedia;
  thumbnails: GenderMedia;
}

export interface Meta {
  name: string;
  license: string;
  generatedAt: string;
  counts: { exercises: number; videos: number; maleVideos: number; femaleVideos: number };
  facets: { bodyParts: string[]; equipment: string[]; targets: string[]; difficulties: string[] };
}

export interface ExerciseFilter {
  bodyPart?: string;
  equipment?: string;
  target?: string;
  difficulty?: string;
  search?: string;
  limit?: number;
  offset?: number;
}
