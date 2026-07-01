import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Nav, Footer } from '@/components/Nav';
import { ExercisePlayer } from '@/components/ExercisePlayer';
import { getAllExercises } from '@/lib/data/loader';
import { allSlugs, exerciseBySlug, slugFor } from '@/lib/slugs';
import { bodyPartSlug } from '@/lib/bodyparts';
import { exerciseJsonLd } from '@/lib/seo/jsonld';

export function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ex = exerciseBySlug(slug);
  if (!ex) return {};
  const title = `${ex.name} — Exercise Guide, Demo Video & Form Cues`;
  const description = `${ex.shortDescription} Watch the ${ex.name} demo video (male & female), with step-by-step instructions, form cues and common mistakes. Free & open source.`;
  return {
    title,
    description,
    alternates: { canonical: `/exercise/${slug}` },
    openGraph: {
      title,
      description,
      images: ex.thumbnails.male || ex.thumbnails.female ? [ex.thumbnails.male ?? ex.thumbnails.female!] : undefined,
    },
  };
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="chip">{children}</span>;
}

export default async function ExercisePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ex = exerciseBySlug(slug);
  if (!ex) notFound();

  // "Related" = same body part, first 6 others.
  const related = getAllExercises()
    .filter((e) => e.bodyPart === ex.bodyPart && e.id !== ex.id)
    .slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(exerciseJsonLd(ex, slug, bodyPartSlug(ex.bodyPart))) }} />
      <Nav />
      <main className="wrap">
        <p style={{ margin: '20px 0 0', color: 'var(--faint)', fontSize: 14 }}>
          <Link href="/exercises" style={{ color: 'var(--muted)' }}>Exercises</Link> ·{' '}
          <Link href={`/exercises/${bodyPartSlug(ex.bodyPart)}`} style={{ color: 'var(--muted)', textTransform: 'capitalize' }}>{ex.bodyPart}</Link>
        </p>

        <div className="detail">
          <ExercisePlayer videos={ex.videos} thumbnails={ex.thumbnails} name={ex.name} />

          <div>
            <h1 style={{ fontSize: 34, fontWeight: 800 }}>{ex.name}</h1>
            {ex.shortDescription ? <p style={{ color: 'var(--muted)', marginTop: 10 }}>{ex.shortDescription}</p> : null}

            <div className="meta-badges">
              <Badge>{ex.bodyPart}</Badge>
              <Badge>{ex.target}</Badge>
              <Badge>{ex.equipment}</Badge>
              {ex.difficulty ? <Badge>{ex.difficulty}</Badge> : null}
              <Badge>{ex.compound ? 'compound' : 'isolation'}</Badge>
              {ex.unilateral ? <Badge>unilateral</Badge> : null}
            </div>

            {ex.secondaryMuscles.length ? (
              <div className="block">
                <h3>Secondary muscles</h3>
                <div className="meta-badges" style={{ margin: 0 }}>
                  {ex.secondaryMuscles.map((m) => <Badge key={m}>{m}</Badge>)}
                </div>
              </div>
            ) : null}

            {ex.steps.length ? (
              <div className="block">
                <h3>How to do it</h3>
                <ol>{ex.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
              </div>
            ) : null}

            {ex.formCues.length ? (
              <div className="block">
                <h3>Form cues</h3>
                <ul>{ex.formCues.map((c) => <li key={c} className="good">{c}</li>)}</ul>
              </div>
            ) : null}

            {ex.commonMistakes.length ? (
              <div className="block">
                <h3>Common mistakes</h3>
                <ul>{ex.commonMistakes.map((c) => <li key={c}>{c}</li>)}</ul>
              </div>
            ) : null}

            {ex.breathing ? (
              <div className="block">
                <h3>Breathing</h3>
                <p style={{ margin: 0, color: 'var(--muted)' }}>{ex.breathing}</p>
              </div>
            ) : null}
          </div>
        </div>

        {related.length ? (
          <div className="section" style={{ paddingTop: 8 }}>
            <div className="section-head"><h2 style={{ fontSize: 22 }}>More {ex.bodyPart} exercises</h2></div>
            <div className="grid">
              {related.map((r) => (
                <Link key={r.id} href={`/exercise/${slugFor(r)}`} className="card">
                  <div className="media"><img src={r.thumbnails.male ?? r.thumbnails.female} alt={r.name} loading="lazy" /></div>
                  <div className="cap"><div className="nm">{r.name}</div><div className="mt">{r.target}</div></div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
