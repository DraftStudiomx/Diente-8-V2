import type { Metadata } from 'next';
import Link from 'next/link';
import { CtaBand, Footer } from '@/components/Footer';
import { Hero } from '@/components/hero/Hero';
import { BranchCards, ClinicJsonLd, FaqList, SectionHead, SpecialtyCard, TeamFigure } from '@/components/sections';
import { homeSpecialtySlugs } from '@/content/local';
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

const PILLARS = [
  'Un equipo, un historial — no repites tu caso en cada consultorio',
  'Técnica moderna, mínimamente invasiva',
  'Trato pensado para toda la familia, de niños a adultos mayores',
];

const ABOUT = [
  {
    title: 'Todas las especialidades, un equipo',
    text: 'No coordinas entre distintas clínicas: tu historial y tu tratamiento viajan contigo dentro de Diente8.',
  },
  {
    title: 'Técnica moderna, trato humano',
    text: 'Usamos procedimientos mínimamente invasivos, pero la conversación antes de cada tratamiento sigue siendo con una persona, no un formulario.',
  },
  {
    title: 'Pensado para toda la familia',
    text: 'Desde el primer diente de leche hasta la rehabilitación de un adulto mayor, en Panorama y La Martinica, León.',
  },
];

export default async function HomePage() {
  const content = await getContent();
  const { settings, specialties, branches, doctors, faqs } = content;
  const wa = whatsappHref(settings);
  const preview = homeSpecialtySlugs.map((slug) => specialties.find((s) => s.slug === slug)).filter((s) => s !== undefined);

  return (
    <>
      <ClinicJsonLd content={content} />
      <Hero
        years={settings.years}
        specialtyCount={specialties.length}
        branchNames={branches.map((b) => b.name)}
        patients={settings.patients}
        patientsLabel={settings.patientsLabel}
        ctaHref={wa}
      />

      <section id="pacientes" className="sec sec-cream" style={{ paddingBlock: 'clamp(80px, 11vw, 150px)' }}>
        <div className="pain">
          <div data-reveal="rule" className="pain-rule" />
          <p data-reveal="ink">
            Cambiar de dentista según el problema <em>—uno para los niños, otro para las encías, otro para las prótesis—</em> hace que la
            mayoría termine posponiendo el tratamiento completo. Y lo que se pospone, se complica.
          </p>
        </div>
      </section>

      <section className="pillars">
        <div className="wrap">
          {PILLARS.map((p, i) => (
            <div key={p} data-reveal="ink" className="pillar">
              <div className="pillar-num">{String(i + 1).padStart(2, '0')}</div>
              <h3>{p}</h3>
            </div>
          ))}
        </div>
      </section>

      <section id="especialidades" className="sec sec-cream">
        <div className="wrap">
          <SectionHead title="Especialidades" meta={`${specialties.length} áreas, un mismo expediente`} />
          <div className="grid-cards" style={{ marginBottom: 'clamp(36px, 4vw, 48px)' }}>
            {preview.map((s) => (
              <SpecialtyCard key={s.slug} s={s} short />
            ))}
          </div>
          <Link href="/especialidades" className="link-arrow">
            Ver las {specialties.length} especialidades →
          </Link>
        </div>
      </section>

      <section id="sucursales" className="sec sec-white">
        <div className="wrap">
          <SectionHead title="Sucursales" meta="Dos ubicaciones en León" />
          <BranchCards branches={branches} />
          <Link href="/sucursales" className="link-arrow" style={{ marginTop: 'clamp(28px, 3vw, 40px)' }}>
            Ver ambas sucursales →
          </Link>
        </div>
      </section>

      <section id="equipo" className="sec sec-cream">
        <div className="wrap">
          <SectionHead title="Equipo" meta={`${doctors.length} especialistas`} />
          <TeamFigure doctors={doctors} />
          <Link href="/equipo" className="link-arrow">
            Conoce a todo el equipo →
          </Link>
        </div>
      </section>

      <section id="nosotros" className="sec sec-navy about">
        <div className="wrap">
          <h2 data-reveal="wipe">
            Casi dos décadas construyendo <em>confianza</em>, no solo tratando dientes.
          </h2>
          <div className="about-grid">
            {ABOUT.map((a) => (
              <div key={a.title} data-reveal="ink">
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="sec sec-cream" style={{ borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <SectionHead title="Preguntas frecuentes" />
          <FaqList faqs={faqs} />
        </div>
      </section>

      <section className="sec sec-white">
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <p className="eyebrow" style={{ marginBottom: 'clamp(36px, 5vw, 60px)' }}>
            Lo que dicen nuestros pacientes
          </p>
          <div className="video-frame">
            <video controls preload="metadata" playsInline poster="/assets/content/martinica-consultorio.jpg">
              <source src="/assets/videos/testimonial-paciente.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <CtaBand whatsapp={wa} />
      <Footer big whatsapp={wa} />
    </>
  );
}
