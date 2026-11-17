import type { Metadata } from 'next';
import { Fragment } from 'react';
import { CtaBand, Footer } from '@/components/Footer';
import { SectionHead, SpecialtyCard } from '@/components/sections';
import { getContent, whatsappHref } from '@/lib/content';

const description =
  'Las 11 especialidades odontológicas de Diente8 en León, Guanajuato: general, estética, ortodoncia, endodoncia, periodoncia, implantología, cirugía maxilofacial, odontopediatría y más, bajo un mismo techo.';

export const metadata: Metadata = {
  title: 'Especialidades',
  description,
  alternates: { canonical: '/especialidades' },
  openGraph: { title: 'Especialidades · Diente8 Clínica Dental', description, url: '/especialidades' },
};

export default async function SpecialtiesPage() {
  const { settings, specialties } = await getContent();
  const wa = whatsappHref(settings);
  const groups = [...new Set(specialties.map((s) => s.category))];

  return (
    <>
      <section id="especialidades" className="sec sec-cream">
        <div className="wrap">
          <SectionHead as="h1" title="Especialidades" meta={`${specialties.length} áreas, un mismo expediente`} />
          {groups.map((g) => (
            <Fragment key={g}>
              <p data-reveal="ink" className="group-label">
                {g}
              </p>
              <div className="grid-cards group">
                {specialties
                  .filter((s) => s.category === g)
                  .map((s) => (
                    <SpecialtyCard key={s.slug} s={s} showNumber />
                  ))}
              </div>
            </Fragment>
          ))}
        </div>
      </section>
      <CtaBand whatsapp={wa} />
      <Footer whatsapp={wa} />
    </>
  );
}
