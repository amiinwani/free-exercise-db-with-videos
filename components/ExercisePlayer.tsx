'use client';

import { useState } from 'react';

interface Props {
  videos: { male?: string; female?: string };
  thumbnails: { male?: string; female?: string };
  name: string;
}

export function ExercisePlayer({ videos, thumbnails, name }: Props) {
  const hasMale = !!videos.male;
  const hasFemale = !!videos.female;
  const [gender, setGender] = useState<'male' | 'female'>(hasMale ? 'male' : 'female');

  const src = videos[gender] ?? videos.male ?? videos.female;
  const poster = thumbnails[gender] ?? thumbnails.male ?? thumbnails.female;

  return (
    <div>
      <div className="player">
        {src ? (
          <video key={src} src={src} poster={poster} controls autoPlay muted loop playsInline />
        ) : (
          <img src={poster} alt={name} />
        )}
      </div>
      {hasMale && hasFemale ? (
        <div className="toggle" style={{ marginTop: 12 }} role="group" aria-label="Gender">
          <button className={gender === 'male' ? 'on' : ''} onClick={() => setGender('male')}>Male</button>
          <button className={gender === 'female' ? 'on' : ''} onClick={() => setGender('female')}>Female</button>
        </div>
      ) : null}
    </div>
  );
}
