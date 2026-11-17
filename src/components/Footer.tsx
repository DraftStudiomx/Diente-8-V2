import Link from 'next/link';
import { NAV_LINKS } from '@/lib/links';

function ExtLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  const external = href.startsWith('http');
  return (
    <a href={href} className={className} {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
      {children}
    </a>
  );
}

export function CtaBand({ whatsapp }: { whatsapp: string }) {
  return (
    <section id="valoracion" className="cta-band">
      <div className="wrap">
        <h2>¿Primera vez en Diente 8?</h2>
        <div>
          <p>Cuéntanos qué necesitas y te ayudamos a encontrar la especialidad correcta antes de tu primera visita — sin compromiso.</p>
          <ExtLink href={whatsapp} className="btn btn-navy">
            Escríbenos por WhatsApp
          </ExtLink>
        </div>
      </div>
    </section>
  );
}

export function Footer({ big = false, whatsapp }: { big?: boolean; whatsapp: string }) {
  return (
    <footer className="footer">
      {big && (
        <div className="footer-big">
          <h2 data-reveal="wipe">Tu sonrisa no debería esperar otro año.</h2>
          <ExtLink href={whatsapp} className="btn btn-gold">
            Agenda tu cita
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
          <p className="footer-copy">© {new Date().getFullYear()} Diente8 Clínica Dental — León, Guanajuato</p>
        </div>
      </div>
    </footer>
  );
}
