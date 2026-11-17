import type { Metadata } from 'next';
import Image from 'next/image';
import { CtaBand, Footer } from '@/components/Footer';
import { SectionHead } from '@/components/sections';
import { fill } from '@/components/text';
import { getContent, whatsappHref } from '@/lib/content';

const description =
  'Conoce a los 15 especialistas de Diente8 en León, Guanajuato: ortodoncia, odontopediatría, implantología, cirugía maxilofacial, endodoncia y más, repartidos entre Panorama y La Martinica.';

export const metadata: Metadata = {
  title: 'Equipo',
  description,
  alternates: { canonical: '/equipo' },
  openGraph: { title: 'Equipo · Diente8 Clínica Dental', description, url: '/equipo' },
};

export default async function TeamPage() {
  const { settings, doctors, branches, specialties, copy } = await getContent();
  const vars = { especialidades: specialties.length, especialistas: doctors.length, años: settings.years };
  const wa = whatsappHref(settings);
  const branchName = (slug: string | null) => branches.find((b) => b.slug === slug)?.name;

  return (
    <>
      <section id="equipo" className="sec sec-cream">
        <div className="wrap">
          <SectionHead as="h1" tight title={fill(copy.teamTitle, vars)} meta={fill(copy.teamMeta, vars)} />
          <p style={{ margin: '0 0 clamp(48px, 6vw, 72px)', maxWidth: 620, fontSize: 15, lineHeight: 1.6, color: 'rgba(22,35,42,0.6)', fontWeight: 300 }}>
            {fill(copy.teamIntro, vars)}
          </p>
          <div className="grid-docs">
            {doctors.map((d) => (
              <div key={d.slug} data-reveal="ink" className="doc" id={d.slug}>
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
        </div>
      </section>
      <CtaBand whatsapp={wa} copy={copy} />
      <Footer whatsapp={wa} copy={copy} />
    </>
  );
}
