import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Nav, Footer } from '@/components/Nav';
import { bodyPartGroups, bodyPartBySlug } from '@/lib/bodyparts';
import { slugFor } from '@/lib/slugs';
import { collectionJsonLd } from '@/lib/seo/jsonld';
import { SITE_URL } from '@/lib/site';

export function generateStaticParams() {
  return bodyPartGroups().map((g) => ({ bodyPart: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ bodyPart: string }> }): Promise<Metadata> {
  const { bodyPart } = await params;
  const g = bodyPartBySlug(bodyPart);
  if (!g) return {};
  const title = `${g.bodyPart} Exercises — ${g.exercises.length} with Demo Videos`;
  const description = `${g.exercises.length} ${g.bodyPart} exercises, each with a male & female demo video, step-by-step instructions and form cues. Free & open source.`;
  return { title: title.replace(/^\w/, (c) => c.toUpperCase()), description, alternates: { canonical: `/exercises/${bodyPart}` } };
}

export default async function BodyPartHub({ params }: { params: Promise<{ bodyPart: string }> }) {
  const { bodyPart } = await params;
  const g = bodyPartBySlug(bodyPart);
  if (!g) notFound();

  const ld = collectionJsonLd(
    `${g.bodyPart} exercises`,
    `${SITE_URL}/exercises/${bodyPart}`,
    g.exercises.map((e) => ({ name: e.name, url: `${SITE_URL}/exercise/${slugFor(e)}` })),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Nav />
      <main className="wrap">
        <p style={{ margin: '20px 0 0', color: 'var(--faint)', fontSize: 14 }}>
          <Link href="/exercises" style={{ color: 'var(--muted)' }}>Exercises</Link> ·{' '}
          <span style={{ textTransform: 'capitalize' }}>{g.bodyPart}</span>
        </p>
        <section className="hero" style={{ padding: '24px 0 16px', textAlign: 'left' }}>
          <h1 style={{ fontSize: 38, fontWeight: 800, textTransform: 'capitalize' }}>{g.bodyPart} exercises</h1>
          <p className="sub" style={{ margin: '10px 0 0' }}>
            {g.exercises.length} {g.bodyPart} exercises with male &amp; female demo videos, instructions and form cues.
          </p>
        </section>
        <div className="grid" style={{ paddingBottom: 40 }}>
          {g.exercises.map((ex) => (
            <Link key={ex.id} href={`/exercise/${slugFor(ex)}`} className="card">
              <div className="media"><img src={ex.thumbnails.male ?? ex.thumbnails.female} alt={`${ex.name} demo`} loading="lazy" /></div>
              <div className="cap"><div className="nm">{ex.name}</div><div className="mt">{ex.target} · {ex.equipment}</div></div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
