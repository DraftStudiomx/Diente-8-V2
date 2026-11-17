'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { NAV_LINKS } from '@/lib/links';


export function Nav({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);

  // Close the mobile menu after navigating.
  useEffect(() => {
    if (menu.current) menu.current.open = false;
  }, [pathname]);

  if (pathname.startsWith('/studio')) return null; // the content editor has its own chrome

  const current = (href: string) => (pathname === href || pathname.startsWith(href + '/') ? 'page' : undefined);
  const external = ctaHref.startsWith('http');

  return (
    <nav className="nav" aria-label="Principal">
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          {/* eslint-disable-next-line @next/next/no-img-element -- small logo, already optimized */}
          <img src="/assets/logo-diente8-h.png" alt="Diente8 Clínica Dental" width={158} height={38} />
        </Link>
        <div className="nav-links">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link" aria-current={current(l.href)}>
              {l.label}
            </Link>
          ))}
          <a href={ctaHref} className="nav-cta" {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
            {ctaLabel}
          </a>
        </div>
        <details className="nav-menu" ref={menu}>
          <summary aria-label="Menú">
            <span />
            <span />
            <span />
          </summary>
          <div className="nav-panel">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} aria-current={current(l.href)}>
                {l.label}
              </Link>
            ))}
            <a href={ctaHref} className="nav-panel-cta" {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
              {ctaLabel}
            </a>
          </div>
        </details>
      </div>
    </nav>
  );
}
