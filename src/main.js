import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

if (typeof window !== 'undefined') {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
}

// Check user motion preferences
const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Master Smooth Scroll Engine (Disabled/instant when reduced motion is preferred)
const lenis = new Lenis({
  duration: prefersReducedMotion ? 0.1 : 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: !prefersReducedMotion,
  touchMultiplier: 1.5,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Smooth anchor navigation handling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#' || targetId === '') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      lenis.scrollTo(targetEl, { offset: 0, duration: 1.2 });
    }
  });
});

// 2. Scene 01: Opening Elastic Triptych Column Expansion Machine (Desktop / Landscape >= 1024px)
const triptychCols = document.querySelectorAll('.triptych-column');
if (triptychCols.length === 3 && !prefersReducedMotion) {
  triptychCols.forEach((col, idx) => {
    col.addEventListener('mouseenter', () => {
      if (window.innerWidth < 1024) return;
      triptychCols.forEach((c, i) => {
        const img = c.querySelector('img');
        if (i === idx) {
          c.style.flexGrow = '2.8';
          if (img) {
            img.style.filter = 'brightness(0.95) contrast(1.15)';
            img.style.transform = 'scale(1.04)';
          }
        } else {
          c.style.flexGrow = '0.8';
          if (img) {
            img.style.filter = 'brightness(0.40) contrast(1.0)';
            img.style.transform = 'scale(1.0)';
          }
        }
      });
    });

    col.addEventListener('mouseleave', () => {
      if (window.innerWidth < 1024) return;
      triptychCols.forEach((c) => {
        c.style.flexGrow = '1';
        const img = c.querySelector('img');
        if (img) {
          img.style.filter = 'brightness(0.75) contrast(1.1)';
          img.style.transform = 'scale(1.0)';
        }
      });
    });
  });
}

// 3. Scroll-Driven Master State Machines
const mm = gsap.matchMedia();

// DESKTOP EXPERIENCE (>= 1024px) — LOCKED
mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
  // TIMELINE 1: Opening Triptych Scroll Takeover to 100vw
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero-section',
      start: 'top top',
      end: '+=100%',
      pin: true,
      scrub: 1,
    }
  });

  heroTl
    .to(['#triptych-header', '#triptych-footer'], {
      opacity: 0,
      y: -25,
      duration: 0.35,
      ease: 'power2.out'
    }, 0)
    .to('#triptych-content-1', {
      opacity: 0,
      y: -30,
      duration: 0.3,
      ease: 'power2.out'
    }, 0.1)
    .to(['#triptych-col-2', '#triptych-col-3'], {
      xPercent: 130,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.inOut'
    }, 0.1)
    .to('#triptych-col-1', {
      flexGrow: 10,
      duration: 0.8,
      ease: 'power3.out'
    }, 0.1);

  // TIMELINE 2: Scene 02 — O Rigor do Corte & Mask Reveal
  const rigorTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-rigor-section',
      start: 'top top',
      end: '+=120%',
      pin: true,
      scrub: 1,
    }
  });

  rigorTl
    .to('#rigor-text-primary', {
      opacity: 0,
      y: -40,
      duration: 0.35,
      ease: 'power2.in'
    }, 0.1)
    .fromTo('#rigor-layer-mask', 
      { clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' },
      { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 0.75, ease: 'power3.inOut' },
      0.2
    )
    .fromTo('#rigor-text-secondary',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
      0.5
    );

  // TIMELINE 3: Scene 03 — O Fogo da Cozinha & Parallax
  const fogoTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-fogo-section',
      start: 'top top',
      end: '+=120%',
      pin: true,
      scrub: 1,
    }
  });

  fogoTl
    .to('#fogo-marquee-band', {
      x: '-50vw',
      duration: 1,
      ease: 'none'
    }, 0)
    .fromTo('#fogo-card-1',
      { y: 80, scale: 0.94, opacity: 0.3 },
      { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
      0.1
    )
    .fromTo('#fogo-card-2',
      { y: 120, scale: 0.92, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' },
      0.35
    );

  // TIMELINE 4: Scene 04 — O Salão & Cocktail Elevation
  const salaoTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-salao-section',
      start: 'top top',
      end: '+=100%',
      pin: true,
      scrub: 1,
    }
  });

  salaoTl
    .fromTo('#salao-cocktail-layer',
      { y: 120, opacity: 0.2 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
      0.2
    );
});

// MOBILE CINEMATIC EXPERIENCE (< 1024px)
mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
  // TIMELINE 1: Opening Triptych Vertical Scroll Takeover (Mobile)
  const heroMobileTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero-section',
      start: 'top top',
      end: '+=90%',
      pin: true,
      scrub: 0.8,
    }
  });

  heroMobileTl
    .to(['#triptych-header', '#triptych-footer'], {
      opacity: 0,
      y: -20,
      duration: 0.35,
      ease: 'power2.out'
    }, 0)
    .to('#triptych-content-1', {
      opacity: 0,
      y: -20,
      duration: 0.3,
      ease: 'power2.out'
    }, 0.05)
    .to(['#triptych-col-2', '#triptych-col-3'], {
      yPercent: 120,
      opacity: 0,
      duration: 0.75,
      ease: 'power3.inOut'
    }, 0.1)
    .to('#triptych-col-1', {
      flexGrow: 10,
      duration: 0.75,
      ease: 'power3.out'
    }, 0.1)
    .to('#triptych-img-1', {
      scale: 1.08,
      duration: 0.75,
      ease: 'power2.out'
    }, 0.1);

  // TIMELINE 2: Scene 02 — O Rigor do Corte & Mask Reveal (Mobile)
  const rigorMobileTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-rigor-section',
      start: 'top top',
      end: '+=100%',
      pin: true,
      scrub: 0.8,
    }
  });

  rigorMobileTl
    .to('#rigor-text-primary', {
      opacity: 0,
      y: -25,
      duration: 0.3,
      ease: 'power2.in'
    }, 0.05)
    .fromTo('#rigor-layer-mask', 
      { clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' },
      { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 0.7, ease: 'power3.inOut' },
      0.15
    )
    .fromTo('#rigor-text-secondary',
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
      0.4
    );

  // TIMELINE 3: Scene 03 — O Fogo da Cozinha & Parallax (Mobile)
  const fogoMobileTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-fogo-section',
      start: 'top top',
      end: '+=100%',
      pin: true,
      scrub: 0.8,
    }
  });

  fogoMobileTl
    .to('#fogo-marquee-band', {
      x: '-75vw',
      duration: 1,
      ease: 'none'
    }, 0)
    .fromTo('#fogo-card-1',
      { y: 50, scale: 0.95, opacity: 0.25 },
      { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
      0.1
    )
    .fromTo('#fogo-card-2',
      { y: 70, scale: 0.93, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' },
      0.35
    );

  // TIMELINE 4: Scene 04 — O Salão & Cocktail Elevation (Mobile)
  const salaoMobileTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#scene-salao-section',
      start: 'top top',
      end: '+=90%',
      pin: true,
      scrub: 0.8,
    }
  });

  salaoMobileTl
    .fromTo('#salao-cocktail-layer',
      { y: 60, scale: 0.96, opacity: 0.2 },
      { y: 0, scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out' },
      0.15
    );

  // Scene 05 — A Mesa Reveal
  gsap.from('#scene-mesa .max-w-5xl', {
    scrollTrigger: {
      trigger: '#scene-mesa',
      start: 'top 85%',
      end: 'top 40%',
      scrub: 0.8,
    },
    y: 35,
    opacity: 0.3,
    ease: 'power2.out'
  });
});
