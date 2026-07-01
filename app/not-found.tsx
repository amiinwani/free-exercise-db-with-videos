import Link from 'next/link';
import { Nav, Footer } from '@/components/Nav';

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="wrap" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, fontWeight: 800 }}>404</h1>
        <p style={{ color: 'var(--muted)', marginTop: 10 }}>That exercise or page doesn&apos;t exist.</p>
        <p style={{ marginTop: 20 }}><Link href="/" className="btn btn-primary">Back to all exercises</Link></p>
      </main>
      <Footer />
    </>
  );
}
