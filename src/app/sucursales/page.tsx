import type { Metadata } from 'next';
import { CtaBand, Footer } from '@/components/Footer';
import { BranchCards, ClinicJsonLd, SectionHead } from '@/components/sections';
import { getContent, whatsappHref } from '@/lib/content';

const description =
  'Diente8 tiene 2 sucursales en León, Guanajuato: Panorama y La Martinica. Consulta dirección, especialidades disponibles y cómo llegar a cada consultorio.';

export const metadata: Metadata = {
  title: 'Sucursales',
  description,
  alternates: { canonical: '/sucursales' },
  openGraph: { title: 'Sucursales · Diente8 Clínica Dental', description, url: '/sucursales' },
};

export default async function BranchesPage() {
  const content = await getContent();
  const wa = whatsappHref(content.settings);
  return (
    <>
      <ClinicJsonLd content={content} />
      <section id="sucursales" className="sec sec-white" style={{ borderTop: 0 }}>
        <div className="wrap">
          <SectionHead as="h1" title="Sucursales" meta="Dos ubicaciones en León" />
          <BranchCards branches={content.branches} />
        </div>
      </section>
      <CtaBand whatsapp={wa} />
      <Footer whatsapp={wa} />
    </>
  );
}
