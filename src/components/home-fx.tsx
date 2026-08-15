'use client';

import { useEffect } from 'react';

/**
 * Motion layer for the Chronicle homepage (MI 2026-08-15: "more interactive
 * ... right now is boring and predictable", reference manychat.com/creators).
 * Adds NO visual design of its own — it only choreographs what is already
 * on the page: scroll reveals with stagger, rule draw-ins, and a gentle
 * parallax on the photo bands. Runs once, respects prefers-reduced-motion,
 * and the page stays fully readable if JS never executes (the `.fx` class
 * gates every hidden initial state).
 */
export default function HomeFx() {
  useEffect(() => {
    const root = document.querySelector('.ch');
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root.classList.add('fx');

    // Single reveals: every section headline rises in.
    root.querySelectorAll('main h1, main h2, .fx-rv').forEach((el) => el.setAttribute('data-rv', ''));

    // Group reveals: children stagger by index (ledgers, sheets, card rows).
    root.querySelectorAll('.stagger').forEach((group) => {
      Array.from(group.children).forEach((el, i) => {
        el.setAttribute('data-rv', '');
        (el as HTMLElement).style.setProperty('--i', String(Math.min(i, 10)));
      });
    });

    // Heavy chapter rules draw in from the left.
    root.querySelectorAll('.heavy').forEach((el) => el.setAttribute('data-draw', ''));

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('rv-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    root.querySelectorAll('[data-rv], [data-draw]').forEach((el) => io.observe(el));

    // Parallax on the photo bands (act breaks + CITC): the image drifts
    // slower than the page. Scale compensates so edges never show.
    const pxImgs = Array.from(root.querySelectorAll<HTMLElement>('[data-px] img'));
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const vh = window.innerHeight;
        for (const img of pxImgs) {
          const holder = img.parentElement as HTMLElement;
          const r = holder.getBoundingClientRect();
          if (r.bottom < -80 || r.top > vh + 80) continue;
          const d = (r.top + r.height / 2 - vh / 2) * -0.08;
          img.style.transform = `translateY(${d.toFixed(1)}px) scale(1.14)`;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
