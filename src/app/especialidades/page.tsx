import type { Metadata } from 'next';
import { stegaClean } from 'next-sanity';
import { CtaBand, Footer } from '@/components/Footer';
import { SectionHead, SpecialtyCard } from '@/components/sections';
import { fill } from '@/components/text';
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
  const { settings, specialties, doctors, copy } = await getContent();
  const wa = whatsappHref(settings);
  const vars = { especialidades: specialties.length, especialistas: doctors.length, años: settings.years };
  // Group by the clean category text (in preview, each document's text carries its own invisible edit marker).
  const groups = [...new Set(specialties.map((s) => stegaClean(s.category)))];

  return (
    <>
      <section id="especialidades" className="sec sec-cream">
        <div className="wrap">
          <SectionHead as="h1" title={fill(copy.specialtiesTitle, vars)} meta={fill(copy.specialtiesMeta, vars)} />
          {groups.map((g) => {
            const items = specialties.filter((s) => stegaClean(s.category) === g);
            return (
              <div key={g} className="group-block">
                <p data-reveal="ink" className="group-label">
                  {items[0].category}
                </p>
                <div className="grid-cards group">
                  {items.map((s) => (
                    <SpecialtyCard key={s.slug} s={s} more={copy.cardMore} showNumber />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <CtaBand whatsapp={wa} copy={copy} />
      <Footer whatsapp={wa} copy={copy} />
    </>
  );
}
