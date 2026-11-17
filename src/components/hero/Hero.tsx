'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { specialtyHref } from '@/lib/links';
import './hero.css';

type Props = {
  years: number;
  specialtyCount: number;
  branchNames: string[];
  patients: number;
  patientsLabel: string;
  ctaHref: string;
};

// One specialty per layer of the tooth, in scroll order. `top` places the desktop callout on the artwork.
const LAYERS = [
  { layer: '01 · Esmalte', name: 'Odontología estética', desc: 'Carillas, coronas, blanqueamiento y diseño de sonrisa.', short: 'Carillas, coronas y blanqueamiento.', side: 'is-left', top: '22.8%', slug: 'odontologia-estetica' },
  { layer: '02 · Pulpa', name: 'Endodoncia', desc: 'Tratamos el nervio para conservar tu diente.', short: 'Tratamos el nervio para conservar tu diente.', side: 'is-right', top: '57%', slug: 'endodoncia' },
  { layer: '03 · Dentina', name: 'Odontología general', desc: 'Resinas y restauraciones que devuelven forma y función.', short: 'Resinas y restauraciones a tu medida.', side: 'is-left', top: '61.3%', slug: 'odontologia-general' },
  { layer: '04 · Raíz y encía', name: 'Periodoncia e implantes', desc: 'La base de todo: encías sanas y raíces firmes.', short: 'Encías sanas y raíces firmes.', side: 'is-right', top: '79.8%', slug: 'periodoncia' },
];

const fetchSvg = (path: string) =>
  fetch(path)
    .then((r) => (r.ok ? r.text() : ''))
    // The artwork references its raster layers relative to the site root.
    .then((t) => t.replaceAll('href="assets/', 'href="/assets/'))
    .catch(() => '');

export function Hero({ years, specialtyCount, branchNames, patients, patientsLabel, ctaHref }: Props) {
  const heroRef = useRef<HTMLElement>(null);
  const toothRef = useRef<HTMLDivElement>(null);
  const monoRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const external = ctaHref.startsWith('http');

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    let disposed = false;
    const cleanups: Array<() => void> = [];

    // The hero sits under the sticky nav, so it is sized (and pinned) to the viewport minus the nav.
    const navHeight = () => {
      const nav = document.querySelector('nav');
      return nav ? Math.round(nav.getBoundingClientRect().height) : 0;
    };
    const syncNav = () => hero.style.setProperty('--d8-nav-h', navHeight() + 'px');
    syncNav();
    window.addEventListener('resize', syncNav);
    cleanups.push(() => window.removeEventListener('resize', syncNav));

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    (async () => {
      const [tooth, mono, word, libs] = await Promise.all([
        fetchSvg('/assets/hero/diente8-tooth.svg'),
        fetchSvg('/assets/hero/diente8-monogram.svg'),
        fetchSvg('/assets/hero/diente8-wordmark.svg'),
        reduce
          ? Promise.resolve(null)
          : Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/DrawSVGPlugin'), import('lenis')]).catch(() => null),
      ]);
      if (disposed) return;
      // Decorative artwork (aria-hidden) is injected outside React so it is never re-rendered.
      if (toothRef.current) toothRef.current.innerHTML = tooth;
      if (monoRef.current) monoRef.current.innerHTML = mono;
      if (wordRef.current) wordRef.current.innerHTML = word;

      if (!libs || !tooth) {
        hero.classList.add('is-static');
        return;
      }
      const [{ gsap }, { ScrollTrigger }, { DrawSVGPlugin }, { default: Lenis }] = libs;
      gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
      ScrollTrigger.config({ ignoreMobileResize: true }); // URL-bar show/hide on phones shouldn't re-layout the pin

      const lenis = new Lenis({ lerp: 0.1 });
      lenis.on('scroll', ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.addEventListener('refreshInit', syncNav);
      cleanups.push(() => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
        ScrollTrigger.removeEventListener('refreshInit', syncNav);
      });

      const q = (s: string) => Array.from(hero.querySelectorAll<HTMLElement>(s));
      gsap.set(hero.querySelector('.d8h-tooth'), { xPercent: -50, yPercent: -50, x: 0, y: 0 });

      // Intro on load: the gold outline draws, then the real tooth appears inside it.
      const intro = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .fromTo('.t-outline', { opacity: 1, drawSVG: 0 }, { drawSVG: '100%', duration: 2.2, ease: 'power2.inOut' }, 0)
          .from('.t-photo', { opacity: 0, duration: 1.4, ease: 'power2.out' }, 1.5)
          .to('.t-outline', { opacity: 0, duration: 1.2 }, 2.4)
          .from('.d8h-glow', { opacity: 0, scale: 0.6, duration: 1.8 }, 0.6)
          .to('.d8h-hint', { opacity: 1, duration: 0.8 }, 1.6);
        gsap.to('.tooth', { y: -8, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 50%' });
      }, hero);
      cleanups.push(() => intro.revert());

      const countUp = () => {
        const tl = gsap.timeline();
        q('[data-count]').forEach((el) => {
          const o = { v: 0 };
          const end = Number(el.dataset.count);
          const sfx = el.dataset.suffix ?? '';
          tl.to(o, { v: end, duration: 1, ease: 'none', onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('es-MX') + sfx; } }, 0);
        });
        return tl;
      };

      // Scroll story (pinned + scrubbed), rebuilt per breakpoint.
      const mm = gsap.matchMedia(hero);
      cleanups.push(() => mm.revert());
      mm.add(
        {
          desktop: '(min-width: 768px)',
          tabletPortrait: '(min-width: 768px) and (max-width: 1180px) and (orientation: portrait)',
          mobile: '(max-width: 767px)',
        },
        (ctx) => {
          const { desktop, tabletPortrait } = ctx.conditions as Record<string, boolean>;
          const sideBySide = desktop && !tabletPortrait;
          gsap.set('.d8h-copy', { yPercent: sideBySide ? -50 : 0, y: 0 });
          gsap.set('.leader', { drawSVG: 0 });
          gsap.set('.dot', { scale: 0, transformOrigin: '50% 50%' });
          gsap.set('.t-pulp-glow', { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' });
          gsap.set('.t-canals path', { drawSVG: 0 });
          gsap.set('.d8h-finale', { opacity: 1 });
          gsap.set(['.d8h-mono', '.d8h-word', '.d8h-line', '.d8h-stats'], { autoAlpha: 0 });
          gsap.set('.mono-l', { xPercent: -18 });
          gsap.set('.mono-r', { xPercent: 18 });

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: hero,
              start: () => 'top ' + navHeight(),
              end: '+=' + (desktop ? 380 : 320) + '%',
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // Act 1: copy leaves, the tooth takes center stage.
          const center = tabletPortrait
            ? { top: '50%', scale: 1 }
            : desktop
              ? { left: '50%', top: '52%', scale: 0.8 }
              : { top: '42%', scale: 1.22 };
          tl.to('.d8h-hint', { autoAlpha: 0, duration: 0.3 }, 0)
            .to('.d8h-copy', { y: -80, autoAlpha: 0, duration: 1 }, 0)
            .to('.d8h-tooth', { ...center, duration: 1.2, ease: 'power1.inOut' }, 0);

          // Act 2: a gold scan line sweeps down — above it the cutaway render, below it the whole tooth.
          const scan = { duration: 1.2, ease: 'power1.inOut' };
          tl.to('.scan', { opacity: 1, duration: 0.15 }, 0.9)
            .fromTo('.scan', { y: -80 }, { y: 720, ...scan }, 0.9)
            .fromTo('.scan-top', { attr: { height: 120 } }, { attr: { height: 920 }, ...scan }, 0.9)
            .fromTo('.scan-bot', { attr: { y: -80 } }, { attr: { y: 720 }, ...scan }, 0.9)
            .to('.scan', { opacity: 0, duration: 0.2 }, 1.95);

          // Act 3: one specialty per layer, on the real anatomy.
          const callouts = desktop ? q('.d8h-callout') : q('.d8h-mcap');
          const leaders = q('.leader');
          const dots = q('.dot');
          callouts.forEach((c, i) => {
            const at = 2.2 + i * 1.1;
            tl.to(dots[i], { scale: 1, duration: 0.25 }, at);
            // Pulp: light flows from the chamber down each canal.
            if (i === 1)
              tl.to('.t-pulp-glow', { opacity: 1, scale: 1, duration: 0.5 }, at).to(
                '.t-canals path',
                { drawSVG: '100%', duration: 0.8, stagger: 0.08 },
                at + 0.2,
              );
            if (desktop) {
              tl.to(leaders[i], { drawSVG: '100%', duration: 0.5 }, at).fromTo(
                c,
                { autoAlpha: 0, x: c.classList.contains('is-left') ? 20 : -20 },
                { autoAlpha: 1, x: 0, duration: 0.5 },
                at + 0.3,
              );
            } else {
              tl.fromTo(c, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4 }, at);
              if (i < callouts.length - 1) tl.to(c, { autoAlpha: 0, y: -16, duration: 0.35 }, at + 0.65);
            }
          });

          // Act 4: the tooth steps back and the Diente8 monogram closes in.
          const f = 2.2 + callouts.length * 1.1 + 0.4;
          tl.to([...callouts, ...leaders, ...dots, '.t-pulp-glow', '.t-canals path'], { autoAlpha: 0, duration: 0.5 }, f)
            .to('.d8h-tooth', { scale: 0.55, autoAlpha: 0, duration: 1, ease: 'power2.in' }, f + 0.4)
            .to('.d8h-mono', { autoAlpha: 1, duration: 0.4 }, f + 1)
            .to(['.mono-l', '.mono-r'], { xPercent: 0, duration: 1, ease: 'power3.out' }, f + 1)
            .to('.d8h-word', { autoAlpha: 1, duration: 0.6 }, f + 1.6)
            .fromTo('.d8h-line', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, f + 1.9)
            .fromTo('.d8h-stats', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, f + 2.2)
            .add(countUp(), f + 2.3);
          tl.to({}, { duration: 0.8 }); // brief hold before unpinning
        },
      );

      // Fonts and lazy images change heights below the hero; re-measure once everything is in.
      document.fonts?.ready.then(() => !disposed && ScrollTrigger.refresh());
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener('load', onLoad, { once: true });
      cleanups.push(() => window.removeEventListener('load', onLoad));
    })();

    return () => {
      disposed = true;
      cleanups.reverse().forEach((fn) => fn());
    };
  }, []);

  const branches = branchNames.join(' y ');

  return (
    <header id="top" className="d8h" ref={heroRef}>
      <div className="d8h-grain" aria-hidden="true" />

      <div className="d8h-copy">
        <p className="d8h-eyebrow">Clínica dental en León, Guanajuato</p>
        <h1 className="d8h-title">
          <span>{years} años cuidando</span>
          <span>
            la sonrisa de <em>tu familia</em>
          </span>
        </h1>
        <p className="d8h-sub">
          {specialtyCount} especialidades de la odontología bajo un mismo techo, en {branchNames.length} sucursales — {branches} — con un trato
          cercano para que cuidar tus dientes deje de ser algo que se posterga.
        </p>
        <div className="d8h-ctas">
          <a href={ctaHref} className="d8h-btn" {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
            Agenda tu cita
          </a>
          <Link href="/especialidades" className="d8h-btn-ghost">
            Ver especialidades
          </Link>
        </div>
      </div>

      <div className="d8h-tooth">
        <div className="d8h-glow" aria-hidden="true" />
        <div className="d8h-svg" ref={toothRef} />
        {LAYERS.map((l) => (
          <Link key={l.slug} className={`d8h-callout ${l.side}`} style={{ top: l.top }} href={specialtyHref(l.slug)}>
            <i>{l.layer}</i>
            <b>{l.name}</b>
            <span className="d8h-desc">{l.desc}</span>
          </Link>
        ))}
      </div>

      <div className="d8h-mcaps" aria-hidden="true">
        {LAYERS.map((l) => (
          <div key={l.slug} className="d8h-mcap">
            <i>{l.layer}</i>
            <b>{l.name}</b>
            <p>{l.short}</p>
          </div>
        ))}
      </div>

      <div className="d8h-finale">
        <div className="d8h-mono" ref={monoRef} role="img" aria-label="Diente8" />
        <div className="d8h-word" ref={wordRef} />
        <p className="d8h-line">
          Cada parte de tu diente, <em>un solo lugar</em> para cuidarla.
        </p>
        <div className="d8h-stats">
          <div>
            <div className="d8h-num" data-count={years}>{years}</div>
            <div className="d8h-label">años de experiencia</div>
          </div>
          <div>
            <div className="d8h-num" data-count={specialtyCount}>{specialtyCount}</div>
            <div className="d8h-label">especialidades bajo un techo</div>
          </div>
          <div>
            <div className="d8h-num" data-count={patients} data-suffix="+">
              {patients.toLocaleString('es-MX')}+
            </div>
            <div className="d8h-label">{patientsLabel}</div>
          </div>
        </div>
      </div>

      <div className="d8h-hint" aria-hidden="true">
        Desliza<span />
      </div>
    </header>
  );
}
