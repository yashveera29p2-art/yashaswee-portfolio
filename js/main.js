/* ============================================
   MAIN
   Navigation interactions: scroll state, mobile
   drawer toggle, and small init tasks. Scroll-reveal
   logic lives in scrollAnimations.js; background
   effects live in particles.js.
   ============================================ */

(function () {
  'use strict';

  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navDrawer = document.getElementById('navDrawer');
  const navDrawerClose = document.getElementById('navDrawerClose');
  const navDrawerLinks = navDrawer ? navDrawer.querySelectorAll('a') : [];
  const navResumeBtn = document.getElementById('navResumeBtn');
  const yearEl = document.getElementById('year');
  const hero = document.getElementById('top');

  /* ---------- Footer year ---------- */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- Nav: scrolled background state ---------- */
  function updateNavOnScroll() {
    if (!nav) return;
    const scrolled = window.scrollY > 24;
    nav.classList.toggle('is-scrolled', scrolled);
  }

  /* ---------- Nav: reveal "Resume" button once hero is scrolled past ---------- */
  function updateResumeBtnVisibility() {
    if (!navResumeBtn || !hero) return;
    const heroBottom = hero.getBoundingClientRect().bottom;
    navResumeBtn.style.display = heroBottom < 0 ? 'inline-flex' : 'none';
  }

  function onScroll() {
    updateNavOnScroll();
    updateResumeBtnVisibility();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load in case page is restored mid-scroll

  /* ---------- Mobile drawer ---------- */
  function openDrawer() {
    navDrawer.classList.add('is-open');
    navDrawer.setAttribute('aria-hidden', 'false');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    navDrawer.classList.remove('is-open');
    navDrawer.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', () => {
      const isOpen = navDrawer.classList.contains('is-open');
      isOpen ? closeDrawer() : openDrawer();
    });
  }

  if (navDrawerClose) {
    navDrawerClose.addEventListener('click', closeDrawer);
  }

  // Close drawer when a link inside it is tapped (anchor navigation)
  navDrawerLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  /* ---------- Toggle icon: morph hamburger bars when drawer opens ---------- */
  const bar1 = document.getElementById('bar1');
  const bar2 = document.getElementById('bar2');
  const bar3 = document.getElementById('bar3');

  if (navToggle && bar1 && bar2 && bar3) {
    navToggle.addEventListener('click', () => {
      const isOpen = navDrawer.classList.contains('is-open');
      if (isOpen) {
        bar1.style.transform = 'translateY(4.5px) rotate(45deg)';
        bar2.style.opacity = '0';
        bar3.style.transform = 'translateY(-4.5px) rotate(-45deg)';
      } else {
        bar1.style.transform = '';
        bar2.style.opacity = '';
        bar3.style.transform = '';
      }
    });
  }
})();