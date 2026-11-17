import type { Metadata } from 'next';
import Image from 'next/image';
import { CtaBand, Footer } from '@/components/Footer';
import { ClinicJsonLd } from '@/components/sections';
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
  const { settings, branches, insurers, specialties } = content;
  const wa = whatsappHref(settings);
  const ext = wa.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {};

  return (
    <>
      <ClinicJsonLd content={content} />
      <section className="contact">
        <div className="wrap">
          <p className="eyebrow" style={{ marginBottom: 16 }}>
            Contáctanos
          </p>
          <h1>Hablemos de tu sonrisa.</h1>
          <p className="contact-lead">Escríbenos, agenda tu valoración o consulta si tu seguro dental aplica en Diente8.</p>
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
            <p className="eyebrow">Síguenos</p>
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
            <p className="eyebrow">Agenda</p>
            <p className="contact-note">Escríbenos y te confirmamos horario el mismo día.</p>
            <a href={wa} className="btn btn-gold" {...ext}>
              Agenda tu cita
            </a>
          </div>
        </div>

        <div id="empresas" className="wrap companies">
          <div>
            <p className="eyebrow">Empresas y seguros dentales</p>
            <h2>Una molestia dental también le cuesta tiempo a tu empresa.</h2>
            <p className="companies-lead">
              Trabajamos con seguros dentales que facilitan la atención de tus colaboradores — acceso directo a las {specialties.length}{' '}
              especialidades, diagnósticos oportunos y menos ausentismo por citas dispersas entre clínicas.
            </p>
          </div>
          <div data-reveal="ink">
            <p className="ins-label">Aseguradoras con las que trabajamos</p>
            <div className="ins-grid">
              {insurers.map((i) => (
                <div key={i.name} className="ins">
                  <Image src={i.logo.src} alt={i.logo.alt} width={i.logo.width} height={i.logo.height} />
                </div>
              ))}
            </div>
            <a href={wa} className="btn btn-gold" {...ext}>
              ¿Tu aseguradora aplica? Pregúntanos
            </a>
          </div>
        </div>
      </section>
      <CtaBand whatsapp={wa} />
      <Footer whatsapp={wa} />
    </>
  );
}
