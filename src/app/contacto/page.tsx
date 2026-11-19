import type { Metadata } from 'next';
import { stegaClean } from 'next-sanity';
import Image from 'next/image';
import { ContactForm } from '@/components/ContactForm';
import { CtaBand, Footer } from '@/components/Footer';
import { ClinicJsonLd, Hours } from '@/components/sections';
import { fill, Rich } from '@/components/text';
import { getContent, whatsappHref } from '@/lib/content';
import { formatMxPhone } from '@/lib/links';

const description =
  'Contacta a Diente8, clínica dental en León, Guanajuato. Direcciones y horarios de Panorama y La Martinica, WhatsApp y formulario para agendar tu cita.';

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

        <div id="contacto" className="wrap contact-grid" style={{ marginBottom: 0 }}>
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
              {b.hours.length > 0 && (
                <div style={{ marginTop: 18 }}>
                  <Hours label={copy.hoursLabel} hours={b.hours} light />
                </div>
              )}
              {b.mapUrl && (
                <a className="contact-map" href={stegaClean(b.mapUrl)} target="_blank" rel="noopener">
                  {copy.branchesMapLink}
                </a>
              )}
            </div>
          ))}
          <div>
            <p className="eyebrow">{copy.contactWhatsappLabel}</p>
            {settings.whatsapp && (
              <a className="contact-phone" href={wa} {...ext}>
                {formatMxPhone(stegaClean(settings.whatsapp))}
              </a>
            )}
            <p className="contact-note">{fill(copy.contactAgendaText, vars)}</p>
            <a href={wa} className="btn btn-gold" {...ext}>
              {copy.contactAgendaButton}
            </a>
          </div>
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
        </div>
      </section>

      <section id="formulario" className="form-sec">
        <div className="wrap form-grid">
          <div>
            <p className="eyebrow">{copy.formEyebrow}</p>
            <h2>
              <Rich text={copy.formTitle} vars={vars} />
            </h2>
            <p className="form-intro">{fill(copy.formText, vars)}</p>
            {wa.startsWith('http') && (
              <a className="form-wa" href={wa} {...ext}>
                {copy.floatingWhatsapp} →
              </a>
            )}
          </div>
          <ContactForm
            copy={copy}
            branches={branches.map((b) => stegaClean(b.fullName))}
            specialties={specialties.map((s) => stegaClean(s.name))}
            whatsappHref={wa}
          />
        </div>
      </section>

      <section id="empresas" className="contact" style={{ paddingTop: 'clamp(72px, 10vw, 120px)' }}>
        <div className="wrap companies">
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
