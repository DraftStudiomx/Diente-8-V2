'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Fades / wipes [data-reveal] elements in as they enter the viewport. Re-runs on each route.
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (!document.documentElement.classList.contains('d8-reveal')) return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'));
    const show = (n: HTMLElement) => n.classList.add('is-in');
    const timers: number[] = [];

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const n = e.target as HTMLElement;
          const above = e.boundingClientRect.bottom < 0;
          if (!e.isIntersecting && !above) return;
          // Siblings in the same grid come in one after another.
          const siblings = n.parentElement ? Array.from(n.parentElement.querySelectorAll(':scope > [data-reveal="ink"]')) : [];
          const delay = above || n.dataset.reveal !== 'ink' || siblings.length < 2 ? 0 : siblings.indexOf(n) * 110;
          timers.push(window.setTimeout(() => show(n), delay));
          io.unobserve(n);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
    );
    nodes.forEach((n) => io.observe(n));

    // Safety sweep: anything already scrolled past (anchor jumps) must never stay hidden.
    const sweep = () => {
      nodes.forEach((n) => {
        const r = n.getBoundingClientRect();
        if (r.bottom < 0 || r.top < window.innerHeight * 0.6) {
          show(n);
          io.unobserve(n);
        }
      });
    };
    window.addEventListener('scroll', sweep, { passive: true });
    timers.push(window.setTimeout(sweep, 60));

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', sweep);
      timers.forEach(clearTimeout);
    };
  }, [pathname]);

  return null;
}
