import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CtaBand, Footer } from '@/components/Footer';
import { SpecialtyCard } from '@/components/sections';
import { getContent, whatsappHref } from '@/lib/content';
import { specialtyHref } from '@/lib/links';
import './specialty.css';

type Params = { slug: string };

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const { specialties } = await getContent();
  return specialties.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { specialties } = await getContent();
  const s = specialties.find((x) => x.slug === slug);
  if (!s) return {};
  const url = specialtyHref(s.slug);
  return {
    title: s.seoTitle,
    description: s.seoDescription,
    alternates: { canonical: url },
    openGraph: { title: `${s.seoTitle} · Diente8 Clínica Dental`, description: s.seoDescription, url, images: [{ url: s.image.src }] },
  };
}

export default async function SpecialtyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { settings, specialties, doctors, branches } = await getContent();
  const s = specialties.find((x) => x.slug === slug);
  if (!s) notFound();

  const wa = whatsappHref(settings);
  const ext = wa.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {};
  const team = doctors.filter((d) => d.specialties.includes(s.slug));
  const featured = team.find((d) => d.featured);
  const rest = team.filter((d) => d !== featured);
  const branchName = (b: string | null) => branches.find((x) => x.slug === b)?.name;
  const teamBranches = [...new Set(team.map((d) => d.branch))];
  const where =
    teamBranches.length === 1 && teamBranches[0]
      ? `Disponible en Diente8 ${branchName(teamBranches[0])}.`
      : 'Disponible en Panorama y La Martinica, según la agenda de cada especialista.';
  const related = specialties.filter((x) => x.category === s.category && x.slug !== s.slug);
  const more = related.length >= 2 ? related.slice(0, 3) : [...related, ...specialties.filter((x) => x.category !== s.category)].slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalWebPage',
        name: s.headline,
        description: s.seoDescription,
        url: settings.siteUrl + specialtyHref(s.slug),
        inLanguage: 'es-MX',
        about: { '@type': 'MedicalSpecialty', name: s.name },
        provider: { '@type': 'Dentist', name: settings.name, url: settings.siteUrl },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: settings.siteUrl + '/' },
          { '@type': 'ListItem', position: 2, name: 'Especialidades', item: settings.siteUrl + '/especialidades' },
          { '@type': 'ListItem', position: 3, name: s.name, item: settings.siteUrl + specialtyHref(s.slug) },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <section className="sp-hero">
        <div className="wrap sp-hero-grid">
          <div>
            <nav aria-label="Ruta" className="sp-crumbs">
              <Link href="/especialidades">Especialidades</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{s.name}</span>
            </nav>
            <p className="eyebrow">
              {s.number} · {s.category}
            </p>
            <h1>{s.headline}</h1>
            <p className="sp-lead">{s.summary}</p>
            <div className="sp-ctas">
              <a href={wa} className="btn btn-gold" {...ext}>
                Agenda tu valoración
              </a>
              {team.length > 0 && (
                <a href="#especialistas" className="sp-ghost">
                  Conoce a {team.length === 1 ? 'tu especialista' : 'los especialistas'}
                </a>
              )}
            </div>
          </div>
          <div className="media sp-photo">
            <Image src={s.image.src} alt={s.image.alt} fill priority sizes="(max-width: 900px) 100vw, 560px" />
          </div>
        </div>
      </section>

      <section className="sec sec-cream">
        <div className="wrap sp-cols">
          <div data-reveal="ink">
            <h2 className="sp-h2">¿Cuándo acudir?</h2>
            <ul className="sp-list">
              {s.whenToVisit.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
          <div data-reveal="ink">
            <h2 className="sp-h2">Qué tratamos</h2>
            <ul className="sp-list sp-list-tags">
              {s.treatments.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="sp-where">{where}</p>
          </div>
        </div>
      </section>

      {team.length > 0 && (
        <section id="especialistas" className="sec sec-white">
          <div className="wrap">
            <div className="sec-head">
              <h2 data-reveal="wipe" className="sec-title">
                {team.length === 1 ? 'Tu especialista' : 'Especialistas'}
              </h2>
              <span className="sec-meta">{s.name}</span>
            </div>
            {featured && (
              <div data-reveal="ink" className="sp-featured">
                <Image src={featured.photo.src} alt={featured.photo.alt} width={168} height={168} />
                <div>
                  <p className="eyebrow">Especialista destacado</p>
                  <h3>
                    {featured.title} {featured.name}
                  </h3>
                  <p>{featured.bio ?? `${featured.specialtyLabel}. Valora y da seguimiento a tu caso dentro del mismo expediente de Diente8, en coordinación con el resto del equipo.`}</p>
                </div>
              </div>
            )}
            {rest.length > 0 && (
              <div className="grid-docs">
                {rest.map((d) => (
                  <div key={d.slug} data-reveal="ink" className="doc">
                    <Image src={d.photo.src} alt={d.photo.alt} width={112} height={112} />
                    <div>
                      <h3>
                        {d.title} {d.name}
                      </h3>
                      <p>{d.specialtyLabel}</p>
                      {d.branch && <p className="doc-branch">{branchName(d.branch)}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="sec sec-cream" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="wrap">
          <div className="sec-head">
            <h2 data-reveal="wipe" className="sec-title">
              Otras especialidades
            </h2>
            <span className="sec-meta">Un mismo expediente para todas</span>
          </div>
          <div className="grid-cards" style={{ marginBottom: 'clamp(36px, 4vw, 48px)' }}>
            {more.map((x) => (
              <SpecialtyCard key={x.slug} s={x} short />
            ))}
          </div>
          <Link href="/especialidades" className="link-arrow">
            Ver las {specialties.length} especialidades →
          </Link>
        </div>
      </section>

      <CtaBand whatsapp={wa} />
      <Footer whatsapp={wa} />
    </>
  );
}
