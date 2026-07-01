'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

export interface CardItem {
  id: string;
  slug: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  video: { male?: string; female?: string };
  thumb: { male?: string; female?: string };
}

type Gender = 'male' | 'female';

function pick(m: { male?: string; female?: string }, g: Gender): string | undefined {
  return m[g] ?? m.male ?? m.female;
}

function Card({ item, gender }: { item: CardItem; gender: Gender }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [inView, setInView] = useState(false);
  const src = pick(item.video, gender);
  const poster = pick(item.thumb, gender);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (inView) el.play().catch(() => {});
    else el.pause();
  }, [inView, src]);

  return (
    <Link href={`/exercise/${item.slug}`} className="card">
      <div className="media">
        <video
          ref={ref}
          src={inView ? src : undefined}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
        />
      </div>
      <div className="cap">
        <div className="nm">{item.name}</div>
        <div className="mt">{item.bodyPart} · {item.target}</div>
      </div>
    </Link>
  );
}

export function VideoWall({ items }: { items: CardItem[] }) {
  const [q, setQ] = useState('');
  const [gender, setGender] = useState<Gender>('male');

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return items;
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(n) ||
        i.bodyPart.toLowerCase().includes(n) ||
        i.target.toLowerCase().includes(n) ||
        i.equipment.toLowerCase().includes(n),
    );
  }, [q, items]);

  return (
    <div id="exercises" className="section">
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2>Browse the demo videos</h2>
            <p>{filtered.length} of {items.length} exercises · every one has a real demo video</p>
          </div>
          <span className="demo-pill">Live demo</span>
        </div>

        <div className="toolbar">
          <input
            className="input"
            placeholder="Search exercises, muscles, equipment…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="toggle" role="group" aria-label="Gender">
            <button className={gender === 'male' ? 'on' : ''} onClick={() => setGender('male')}>Male</button>
            <button className={gender === 'female' ? 'on' : ''} onClick={() => setGender('female')}>Female</button>
          </div>
        </div>

        <div className="grid">
          {filtered.slice(0, 120).map((item) => (
            <Card key={item.id} item={item} gender={gender} />
          ))}
        </div>
        {filtered.length > 120 ? (
          <p style={{ color: 'var(--faint)', marginTop: 18, textAlign: 'center' }}>
            Showing 120 of {filtered.length}. The full set of {items.length} is in the API and the dataset.
          </p>
        ) : null}
      </div>
    </div>
  );
}
