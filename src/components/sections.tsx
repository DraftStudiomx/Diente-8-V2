import { stegaClean } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';
import { formatMxPhone, mapEmbedSrc, specialtyHref } from '@/lib/links';
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

export function SpecialtyCard({ s, more, showNumber = false, short = false }: { s: Specialty; more: string; showNumber?: boolean; short?: boolean }) {
  return (
    <article data-reveal="ink" className="card card-linked" id={showNumber ? `esp-${s.number}` : undefined}>
      <div className="media">
        <Image src={s.image.src} alt={s.image.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 400px" />
      </div>
      <div className="card-body">
        {showNumber && <div className="card-num">{s.number}</div>}
        <h3 className="card-title">
          <Link href={specialtyHref(s.slug)} className="card-link">
            {s.name}
          </Link>
        </h3>
        <p className="card-text">{short ? s.teaser : s.summary}</p>
        <span className="card-more" aria-hidden="true">
          {more}
        </span>
      </div>
    </article>
  );
}

export function BranchCards({
  branches,
  mapLabel,
  hoursLabel,
  showMap = false,
}: {
  branches: Branch[];
  mapLabel: string;
  hoursLabel: string;
  showMap?: boolean;
}) {
  return (
    <div className="grid-branches">
      {branches.map((b) => (
        <article key={b.slug} data-reveal="ink" className="branch" id={b.slug}>
          <div className="media">
            <Image src={b.photo.src} alt={b.photo.alt} fill sizes="(max-width: 900px) 100vw, 600px" />
          </div>
          <div className="branch-body">
            <h3 className="branch-name">{b.fullName}</h3>
            <p className="branch-addr">{b.addressLines.join(' ')}</p>
            {b.hours.length > 0 && <Hours label={hoursLabel} hours={b.hours} />}
            <p className="branch-note">{b.note}</p>
            {b.mapUrl && (
              <a className="link-arrow" href={stegaClean(b.mapUrl)} target="_blank" rel="noopener" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                {mapLabel}
              </a>
            )}
          </div>
          {showMap && (
            <div className="branch-map">
              <iframe
                title={stegaClean(`Mapa de ${b.fullName}`)}
                src={mapEmbedSrc(stegaClean(`Diente8 ${b.addressLines.join(' ')}`))}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

export function Hours({ label, hours, light = false }: { label: string; hours: Branch['hours']; light?: boolean }) {
  return (
    <div className={light ? 'hours hours-light' : 'hours'}>
      <p className="hours-label">{label}</p>
      <dl>
        {hours.map((h, i) => (
          <div key={i}>
            <dt>{h.days}</dt>
            <dd>{h.time}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function TeamFigure({ doctors }: { doctors: Doctor[] }) {
  const strip = [...doctors].sort((a, b) => a.stripOrder - b.stripOrder);
  const alt = stegaClean(
    'Equipo de especialistas de Diente8: ' + strip.map((d) => `${d.title} ${d.shortName} (${d.specialtyLabel.toLowerCase()})`).join(', ') + '.',
  );
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
  const abs = (src: string) => (src.startsWith('http') ? src : settings.siteUrl + src);
  const phone = settings.phone ?? settings.whatsapp;
  const data = stegaClean({
    '@context': 'https://schema.org',
    '@graph': branches.map((b) => ({
      '@type': 'Dentist',
      name: `Diente8 – ${b.name}`,
      url: settings.siteUrl,
      image: abs(b.photo.src),
      ...(b.phone || phone ? { telephone: formatMxPhone(b.phone ?? phone ?? '', { international: true }) } : {}),
      ...(settings.email ? { email: settings.email } : {}),
      address: {
        '@type': 'PostalAddress',
        ...(b.streetAddress ? { streetAddress: b.streetAddress } : {}),
        ...(b.postalCode ? { postalCode: b.postalCode } : {}),
        addressLocality: 'León',
        addressRegion: 'Guanajuato',
        addressCountry: 'MX',
      },
      ...(b.mapUrl ? { hasMap: b.mapUrl } : {}),
      ...(b.openingHours.length ? { openingHours: b.openingHours } : {}),
      sameAs: [settings.instagram, settings.facebook],
      medicalSpecialty: ['Dentistry'],
    })),
  });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
