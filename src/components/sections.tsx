import Image from 'next/image';
import type { Branch, Doctor, Faq, SiteContent, Specialty } from '@/content/types';

export function SectionHead({ title, meta, as: Tag = 'h2', tight = false }: { title: string; meta?: string; as?: 'h1' | 'h2'; tight?: boolean }) {
  return (
    <div className="sec-head" style={tight ? { marginBottom: 12 } : undefined}>
      <Tag data-reveal="wipe" className="sec-title">
        {title}
      </Tag>
      {meta && <span className="sec-meta">{meta}</span>}
    </div>
  );
}

export function SpecialtyCard({ s, showNumber = false, short = false }: { s: Specialty; showNumber?: boolean; short?: boolean }) {
  return (
    <article data-reveal="ink" className="card" id={showNumber ? `esp-${s.number}` : undefined}>
      <div className="media">
        <Image src={s.image.src} alt={s.image.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 400px" />
      </div>
      <div className="card-body">
        {showNumber && <div className="card-num">{s.number}</div>}
        <h3 className="card-title">{s.name}</h3>
        <p className="card-text">{short ? s.teaser : s.summary}</p>
      </div>
    </article>
  );
}

export function BranchCards({ branches }: { branches: Branch[] }) {
  return (
    <div className="grid-branches">
      {branches.map((b) => (
        <article key={b.slug} data-reveal="ink" className="branch" id={b.slug}>
          <div className="media">
            <Image src={b.photo.src} alt={b.photo.alt} fill sizes="(max-width: 900px) 100vw, 600px" />
          </div>
          <div className="branch-body">
            <h3 className="branch-name">{b.fullName}</h3>
            <p className="branch-addr">{b.slug === 'panorama' ? 'León, Gto. — consultorio #158' : b.addressLines.join(' ')}</p>
            <p className="branch-note">{b.note}</p>
            {b.mapUrl && (
              <a className="link-arrow" href={b.mapUrl} target="_blank" rel="noopener" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                Cómo llegar →
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export function TeamFigure({ doctors }: { doctors: Doctor[] }) {
  const strip = [...doctors].sort((a, b) => a.stripOrder - b.stripOrder);
  const alt =
    'Equipo de especialistas de Diente8: ' + strip.map((d) => `${d.title} ${d.shortName} (${d.specialtyLabel.toLowerCase()})`).join(', ') + '.';
  return (
    <figure data-reveal="ink" style={{ margin: '0 0 clamp(36px, 4vw, 48px)' }}>
      <Image className="team-full" src="/assets/equipo/plantilla-especialistas-diente8.webp" alt={alt} width={1600} height={908} sizes="(max-width: 1240px) 100vw, 1240px" />
      <ul className="team-strip" aria-label="Especialistas de Diente8">
        {strip.map((d) => (
          <li key={d.slug}>
            <Image src={d.photo.src} alt="" width={104} height={104} />
            <b>
              {d.title} {d.shortName}
            </b>
            <span>{d.specialtyLabel}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div>
      {faqs.map((f) => (
        <details key={f.question} data-reveal="ink" className="faq">
          <summary>
            {f.question}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

// schema.org data for local SEO: one Dentist entry per branch.
export function ClinicJsonLd({ content }: { content: SiteContent }) {
  const { settings, branches } = content;
  const data = {
    '@context': 'https://schema.org',
    '@graph': branches.map((b) => ({
      '@type': 'Dentist',
      name: `Diente8 – ${b.name}`,
      url: settings.siteUrl,
      image: settings.siteUrl + b.photo.src,
      ...(b.phone || settings.phone ? { telephone: b.phone ?? settings.phone } : {}),
      address: {
        '@type': 'PostalAddress',
        ...(b.streetAddress ? { streetAddress: b.streetAddress } : {}),
        addressLocality: 'León',
        addressRegion: 'Guanajuato',
        addressCountry: 'MX',
      },
      sameAs: [settings.instagram, settings.facebook],
      medicalSpecialty: ['Dentistry'],
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
