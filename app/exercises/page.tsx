import type { Metadata } from 'next';
import Link from 'next/link';
import { Nav, Footer } from '@/components/Nav';
import { bodyPartGroups } from '@/lib/bodyparts';
import { slugFor } from '@/lib/slugs';
import { collectionJsonLd } from '@/lib/seo/jsonld';
import { SITE_URL, COUNTS } from '@/lib/site';

export const metadata: Metadata = {
  title: `All ${COUNTS.exercises} Exercises with Demo Videos — Free Exercise Database`,
  description: `Browse all ${COUNTS.exercises} exercises with male & female demo videos, grouped by body part. Free, open-source, MIT licensed. Each includes steps, form cues and common mistakes.`,
  alternates: { canonical: '/exercises' },
};

export default function ExercisesIndex() {
  const groups = bodyPartGroups();
  const ld = collectionJsonLd(
    'All exercises',
    `${SITE_URL}/exercises`,
    groups.flatMap((g) => g.exercises).map((e) => ({ name: e.name, url: `${SITE_URL}/exercise/${slugFor(e)}` })),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Nav />
      <main className="wrap">
        <section className="hero" style={{ padding: '48px 0 20px', textAlign: 'left' }}>
          <h1 style={{ fontSize: 40, fontWeight: 800 }}>All {COUNTS.exercises} exercises</h1>
          <p className="sub" style={{ margin: '12px 0 0' }}>
            Every exercise comes with a male &amp; female demo video, steps, form cues and common mistakes.
            Browse by body part below.
          </p>
          <div className="meta-badges" style={{ marginTop: 18 }}>
            {groups.map((g) => (
              <Link key={g.slug} href={`/exercises/${g.slug}`} className="chip" style={{ padding: '6px 12px' }}>
                {g.bodyPart} ({g.exercises.length})
              </Link>
            ))}
          </div>
        </section>

        {groups.map((g) => (
          <section key={g.slug} className="section" style={{ padding: '20px 0' }}>
            <div className="section-head">
              <h2 style={{ fontSize: 24, textTransform: 'capitalize' }}>
                <Link href={`/exercises/${g.slug}`}>{g.bodyPart} exercises</Link>
              </h2>
              <Link href={`/exercises/${g.slug}`} style={{ color: 'var(--muted)', fontSize: 14 }}>
                View all {g.exercises.length} →
              </Link>
            </div>
            <div className="grid">
              {g.exercises.slice(0, 12).map((ex) => (
                <Link key={ex.id} href={`/exercise/${slugFor(ex)}`} className="card">
                  <div className="media"><img src={ex.thumbnails.male ?? ex.thumbnails.female} alt={`${ex.name} demo`} loading="lazy" /></div>
                  <div className="cap"><div className="nm">{ex.name}</div><div className="mt">{ex.target}</div></div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
