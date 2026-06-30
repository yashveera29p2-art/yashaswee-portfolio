/* ============================================
   SCROLL ANIMATIONS
   IntersectionObserver-driven reveal system.
   Any element with [data-reveal] starts hidden
   (see animations.css) and receives .is-visible
   once it enters the viewport. Respects
   prefers-reduced-motion.
   ============================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const revealEls = document.querySelectorAll('[data-reveal]');

  // If the user prefers reduced motion, reveal everything immediately
  // and skip setting up the observer entirely.
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // animate once, then stop watching
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px', // trigger slightly before full visibility
    }
  );

  revealEls.forEach((el) => observer.observe(el));
})();