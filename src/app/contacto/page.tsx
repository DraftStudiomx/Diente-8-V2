import type { Metadata } from 'next';
import Image from 'next/image';
import { CtaBand, Footer } from '@/components/Footer';
import { ClinicJsonLd } from '@/components/sections';
import { fill, Rich } from '@/components/text';
import { getContent, whatsappHref } from '@/lib/content';

const description =
  'Contacta a Diente8, clínica dental en León, Guanajuato. Direcciones de Panorama y La Martinica, redes sociales y cómo agendar tu cita.';

export const metadata: Metadata = {
  title: 'Contacto',
  description,
  alternates: { canonical: '/contacto' },
  openGraph: { title: 'Contacto · Diente8 Clínica Dental', description, url: '/contacto' },
};

export default async function ContactPage() {
  const content = await getContent();
  const { settings, branches, insurers, specialties, doctors, copy } = content;
  const wa = whatsappHref(settings);
  const ext = wa.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {};
  const vars = { especialidades: specialties.length, especialistas: doctors.length, años: settings.years };

  return (
    <>
      <ClinicJsonLd content={content} />
      <section className="contact">
        <div className="wrap">
          <p className="eyebrow" style={{ marginBottom: 16 }}>
            {copy.contactEyebrow}
          </p>
          <h1>
            <Rich text={copy.contactTitle} vars={vars} />
          </h1>
          <p className="contact-lead">{fill(copy.contactLead, vars)}</p>
        </div>

        <div id="contacto" className="wrap contact-grid">
          {branches.map((b) => (
            <div key={b.slug}>
              <p className="eyebrow">{b.name}</p>
              <p className="contact-addr">
                {b.addressLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < b.addressLines.length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          ))}
          <div>
            <p className="eyebrow">{copy.contactSocialLabel}</p>
            <div className="contact-social">
              <a href={settings.instagram} target="_blank" rel="noopener">
                Instagram @diente8_
              </a>
              <a href={settings.facebook} target="_blank" rel="noopener">
                Facebook Diente8 Clínica Dental
              </a>
            </div>
          </div>
          <div>
            <p className="eyebrow">{copy.contactAgendaLabel}</p>
            <p className="contact-note">{fill(copy.contactAgendaText, vars)}</p>
            <a href={wa} className="btn btn-gold" {...ext}>
              {copy.contactAgendaButton}
            </a>
          </div>
        </div>

        <div id="empresas" className="wrap companies">
          <div>
            <p className="eyebrow">{copy.companiesEyebrow}</p>
            <h2>
              <Rich text={copy.companiesTitle} vars={vars} />
            </h2>
            <p className="companies-lead">{fill(copy.companiesText, vars)}</p>
          </div>
          <div data-reveal="ink">
            <p className="ins-label">{copy.insurersLabel}</p>
            <div className="ins-grid">
              {insurers.map((i) => (
                <div key={i.name} className="ins">
                  <Image src={i.logo.src} alt={i.logo.alt} width={i.logo.width} height={i.logo.height} />
                </div>
              ))}
            </div>
            <a href={wa} className="btn btn-gold" {...ext}>
              {copy.insurersButton}
            </a>
          </div>
        </div>
      </section>
      <CtaBand whatsapp={wa} copy={copy} />
      <Footer whatsapp={wa} copy={copy} />
    </>
  );
}
