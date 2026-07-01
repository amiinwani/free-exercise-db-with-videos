import Link from 'next/link';
import { Nav, Footer } from '@/components/Nav';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <div className="wrap">
        <div className="docs">
          <nav>
            <div style={{ color: 'var(--faint)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Docs</div>
            <Link href="/docs">Overview</Link>
            <Link href="/docs/api">API reference</Link>
            <Link href="/docs/self-host">Self-hosting</Link>
            <Link href="/docs/download">Download data</Link>
          </nav>
          <div className="prose">{children}</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
