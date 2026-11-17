import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="sec sec-cream" style={{ minHeight: '60vh' }}>
      <div className="wrap">
        <p className="eyebrow">Error 404</p>
        <h1 className="sec-title" style={{ marginBottom: 24 }}>
          Esta página no existe.
        </h1>
        <Link href="/" className="link-arrow">
          Volver al inicio →
        </Link>
      </div>
    </section>
  );
}
