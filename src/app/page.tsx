import type { Metadata } from 'next';
import Link from 'next/link';
import { CtaBand, Footer } from '@/components/Footer';
import { Hero } from '@/components/hero/Hero';
import { BranchCards, ClinicJsonLd, FaqList, FeaturedDoctor, SectionHead, SpecialtyCard, TeamFigure } from '@/components/sections';
import { fill, Rich } from '@/components/text';
import { getContent, whatsappHref } from '@/lib/content';

export const metadata: Metadata = {
  title: { absolute: 'Diente8 · Clínica dental en León, Guanajuato' },
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Diente8 · Clínica dental en León, Guanajuato',
    description: '11 especialidades de la odontología bajo un mismo techo, en 2 sucursales en León: Panorama y La Martinica.',
    url: '/',
  },
};

export default async function HomePage() {
  const content = await getContent();
  const { settings, specialties, branches, doctors, faqs, homeSpecialties, copy } = content;
  const wa = whatsappHref(settings);
  const vars = { especialidades: specialties.length, especialistas: doctors.length, años: settings.years };
  const featured = doctors.find((d) => d.featured);
  const featuredSpecialty = featured && specialties.find((s) => s.slug === featured.specialties[0]);
  const preview = homeSpecialties.map((slug) => specialties.find((s) => s.slug === slug)).filter((s) => s !== undefined);

  return (
    <>
      <ClinicJsonLd content={content} />
      <Hero
        years={settings.years}
        specialtyCount={specialties.length}
        patients={settings.patients}
        patientsLabel={settings.patientsLabel}
        ctaHref={wa}
        copy={copy}
      />

      <section id="pacientes" className="sec sec-cream" style={{ paddingBlock: 'clamp(80px, 11vw, 150px)' }}>
        <div className="pain">
          <div data-reveal="rule" className="pain-rule" />
          <p data-reveal="ink">
            <Rich text={copy.painText} vars={vars} />
          </p>
        </div>
      </section>

      <section className="pillars">
        <div className="wrap">
          {copy.pillars.map((p, i) => (
            <div key={i} data-reveal="ink" className="pillar">
              <div className="pillar-num">{String(i + 1).padStart(2, '0')}</div>
              <h3>
                <Rich text={p} vars={vars} />
              </h3>
            </div>
          ))}
        </div>
      </section>

      <section id="especialidades" className="sec sec-cream">
        <div className="wrap">
          <SectionHead title={fill(copy.homeSpecialtiesTitle, vars)} meta={fill(copy.homeSpecialtiesMeta, vars)} />
          <div className="grid-cards" style={{ marginBottom: 'clamp(36px, 4vw, 48px)' }}>
            {preview.map((s) => (
              <SpecialtyCard key={s.slug} s={s} more={copy.cardMore} short />
            ))}
          </div>
          <Link href="/especialidades" className="link-arrow">
            {fill(copy.homeSpecialtiesLink, vars)}
          </Link>
        </div>
      </section>

      <section id="sucursales" className="sec sec-white">
        <div className="wrap">
          <SectionHead title={fill(copy.homeBranchesTitle, vars)} meta={fill(copy.homeBranchesMeta, vars)} />
          <BranchCards branches={branches} mapLabel={copy.branchesMapLink} hoursLabel={copy.hoursLabel} />
          <Link href="/sucursales" className="link-arrow" style={{ marginTop: 'clamp(28px, 3vw, 40px)' }}>
            {fill(copy.homeBranchesLink, vars)}
          </Link>
        </div>
      </section>

      <section id="equipo" className="sec sec-cream">
        <div className="wrap">
          <SectionHead title={fill(copy.homeTeamTitle, vars)} meta={fill(copy.homeTeamMeta, vars)} />
          <TeamFigure doctors={doctors} />
          {featured && <FeaturedDoctor doctor={featured} specialty={featuredSpecialty} label={copy.spFeaturedLabel} linkLabel={copy.featuredLink} compact />}
          <Link href="/equipo" className="link-arrow">
            {fill(copy.homeTeamLink, vars)}
          </Link>
        </div>
      </section>

      <section id="nosotros" className="sec sec-navy about">
        <div className="wrap">
          <h2 data-reveal="wipe">
            <Rich text={copy.aboutTitle} vars={vars} />
          </h2>
          <div className="about-grid">
            {copy.aboutItems.map((a, i) => (
              <div key={i} data-reveal="ink">
                <h3>{a.title}</h3>
                <p>{fill(a.text, vars)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="sec sec-cream" style={{ borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <SectionHead title={fill(copy.faqTitle, vars)} />
          <FaqList faqs={faqs} />
        </div>
      </section>

      <section className="sec sec-white">
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <p className="eyebrow" style={{ marginBottom: 'clamp(36px, 5vw, 60px)' }}>
            {copy.videoLabel}
          </p>
          <div className="video-frame">
            <video controls preload="metadata" playsInline poster="/assets/content/martinica-consultorio.jpg">
              <source src="/assets/videos/testimonial-paciente.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <CtaBand whatsapp={wa} copy={copy} />
      <Footer big whatsapp={wa} copy={copy} />
    </>
  );
}
