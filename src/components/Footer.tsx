import Link from 'next/link';
import type { SiteCopy } from '@/content/types';
import { getContent } from '@/lib/content';
import { NAV_LINKS } from '@/lib/links';
import { Rich } from './text';

function ExtLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  const external = href.startsWith('http');
  return (
    <a href={href} className={className} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
      {children}
    </a>
  );
}

export function CtaBand({ whatsapp, copy }: { whatsapp: string; copy: SiteCopy }) {
  return (
    <section id="valoracion" className="cta-band">
      <div className="wrap">
        <h2>
          <Rich text={copy.ctaTitle} />
        </h2>
        <div>
          <p>{copy.ctaText}</p>
          <ExtLink href={whatsapp} className="btn btn-navy">
            {copy.ctaButton}
          </ExtLink>
        </div>
      </div>
    </section>
  );
}

export async function Footer({ big = false, whatsapp, copy }: { big?: boolean; whatsapp: string; copy: SiteCopy }) {
  const { settings } = await getContent();
  return (
    <footer className="footer">
      {big && (
        <div className="footer-big">
          <h2 data-reveal="wipe">
            <Rich text={copy.footerTitle} />
          </h2>
          <ExtLink href={whatsapp} className="btn btn-gold">
            {copy.footerButton}
          </ExtLink>
        </div>
      )}
      <div className="footer-bar">
        <div className="wrap">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element -- small logo, already optimized */}
            <img src="/assets/logo-diente8-h.png" alt="Diente8 Clínica Dental" width={175} height={42} />
          </Link>
          <div className="footer-links">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
          <p className="footer-copy">
            © {new Date().getFullYear()} Diente8 Clínica Dental — León, Guanajuato ·{' '}
            <Link href="/aviso-de-privacidad" style={{ color: 'inherit', textDecoration: 'underline' }}>
              Aviso de privacidad
            </Link>
          </p>
          {settings.sanitaryName && (
            <p className="footer-copy footer-sanitary">
              Responsable sanitario: {settings.sanitaryName}
              {settings.sanitaryLicense && <> · Cédula profesional {settings.sanitaryLicense}</>}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
