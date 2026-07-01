import Link from 'next/link';
import { REPO_URL, SITE_NAME } from '@/lib/site';

export function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="brand">
          <span className="dot" /> {SITE_NAME}
        </Link>
        <nav className="nav-links">
          <Link href="/exercises">Exercises</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/docs/api">API</Link>
          <Link href="/#instruct">Use it</Link>
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="btn">GitHub ★</a>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div>
          {SITE_NAME} — free & open source under the MIT license.{' '}
          <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub</a> ·{' '}
          <Link href="/docs">Docs</Link> ·{' '}
          <Link href="/docs/download">Download</Link>
        </div>
        <div style={{ marginTop: 8 }}>
          Exercise metadata is MIT licensed. Demo videos are provided for demonstration.
        </div>
        <div style={{ marginTop: 8 }}>
          Built by <a href="https://arhamamin.com" target="_blank" rel="noreferrer">arhamamin.com</a>
        </div>
      </div>
    </footer>
  );
}
