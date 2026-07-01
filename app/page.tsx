import Link from 'next/link';
import { Nav, Footer } from '@/components/Nav';
import { VideoWall, type CardItem } from '@/components/VideoWall';
import { TryApiWidget } from '@/components/TryApiWidget';
import { InstructBlock } from '@/components/InstructBlock';
import { getAllExercises } from '@/lib/data/loader';
import { slugFor } from '@/lib/slugs';
import { bodyPartGroups } from '@/lib/bodyparts';
import { datasetJsonLd, faqJsonLd } from '@/lib/seo/jsonld';
import { INSTRUCT_PROMPT } from '@/lib/instruct';
import { FAQS } from '@/lib/faq';
import { COUNTS, REPO_URL, TAGLINE } from '@/lib/site';

export default function HomePage() {
  const items: CardItem[] = getAllExercises().map((ex) => ({
    id: ex.id,
    slug: slugFor(ex),
    name: ex.name,
    bodyPart: ex.bodyPart,
    target: ex.target,
    equipment: ex.equipment,
    video: ex.videos,
    thumb: ex.thumbnails,
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <Nav />

      <main>
        <section className="hero">
          <div className="wrap">
            <span className="badge">● Free forever · MIT licensed · No API key</span>
            <h1>
              The free exercise API<br />with <span className="hl">real demo videos</span>
            </h1>
            <p className="sub">{TAGLINE} {COUNTS.exercises} exercises, {COUNTS.videos} male &amp; female
              demo videos, form cues, common mistakes and step-by-step instructions.</p>
            <div className="cta">
              <a href={REPO_URL} target="_blank" rel="noreferrer" className="btn btn-primary">Get it on GitHub ★</a>
              <Link href="/docs/api" className="btn">Read the API docs</Link>
              <a href="#instruct" className="btn">Use it in 30s</a>
            </div>
            <div className="stats">
              <div className="stat"><div className="n">{COUNTS.exercises}</div><div className="l">Exercises</div></div>
              <div className="stat"><div className="n">{COUNTS.videos}</div><div className="l">Demo videos</div></div>
              <div className="stat"><div className="n">2×</div><div className="l">Male &amp; female</div></div>
              <div className="stat"><div className="n">$0</div><div className="l">Cost to run</div></div>
            </div>
          </div>
        </section>

        <VideoWall items={items} />

        <TryApiWidget />

        <section id="instruct" className="section">
          <div className="wrap">
            <div className="section-head">
              <div>
                <h2>Use it in 30 seconds</h2>
                <p>The demo is capped on purpose. For real use it&apos;s free — clone it, host it, or pull the videos.</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 18 }}>
              <div className="stat" style={{ textAlign: 'left' }}><div className="l">Option A</div><div style={{ fontWeight: 700, marginTop: 6 }}>Tell your agent to clone it</div><div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>Paste the prompt below into Claude Code / Cursor.</div></div>
              <div className="stat" style={{ textAlign: 'left' }}><div className="l">Option B</div><div style={{ fontWeight: 700, marginTop: 6 }}>Host it yourself</div><div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>One-click Vercel deploy — $0 infra.</div></div>
              <div className="stat" style={{ textAlign: 'left' }}><div className="l">Option C</div><div style={{ fontWeight: 700, marginTop: 6 }}>Download every video</div><div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}><code>bash scripts/download-all-videos.sh</code></div></div>
            </div>
            <InstructBlock prompt={INSTRUCT_PROMPT} />
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section-head"><div><h2>Browse by body part</h2><p>Category pages for every muscle group.</p></div></div>
            <div className="meta-badges" style={{ margin: 0 }}>
              {bodyPartGroups().map((g) => (
                <Link key={g.slug} href={`/exercises/${g.slug}`} className="chip" style={{ padding: '8px 14px', fontSize: 14 }}>
                  {g.bodyPart} exercises ({g.exercises.length})
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap">
            <div className="section-head"><div><h2>Frequently asked questions</h2></div></div>
            <div style={{ display: 'grid', gap: 12 }}>
              {FAQS.map((f) => (
                <div key={f.q} className="trybox" style={{ padding: 18 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700 }}>{f.q}</h3>
                  <p style={{ color: 'var(--muted)', margin: '8px 0 0' }}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
