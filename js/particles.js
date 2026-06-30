/* ============================================
   PARTICLES
   Lightweight ambient canvas effect for the hero
   section — faint drifting nodes with occasional
   connecting lines, evoking a network/security-scan
   feel without being distracting. Built with vanilla
   canvas, no libraries.
   ============================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Skip entirely for reduced-motion users — the hero still works
  // perfectly well with just the static glow blobs.
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  const hero = document.getElementById('top');

  let particles = [];
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let animationId = null;
  let isVisible = true;

  const CONFIG = {
    density: 14000,     // 1 particle per N px² of canvas area
    maxParticles: 60,
    maxSpeed: 0.15,
    linkDistance: 130,
    colors: ['rgba(224, 38, 63,', 'rgba(61, 139, 255,'], // red, blue (alpha appended per-use)
  };

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function initParticles() {
    const count = Math.min(
      CONFIG.maxParticles,
      Math.floor((width * height) / CONFIG.density)
    );

    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * CONFIG.maxSpeed,
      vy: (Math.random() - 0.5) * CONFIG.maxSpeed,
      radius: Math.random() * 1.4 + 0.6,
      colorIndex: Math.random() > 0.75 ? 1 : 0, // mostly red nodes, occasional blue
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // Update + draw nodes
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = CONFIG.colors[p.colorIndex] + '0.55)';
      ctx.fill();
    }

    // Draw faint connecting lines between nearby nodes
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.linkDistance) {
          const opacity = (1 - dist / CONFIG.linkDistance) * 0.12;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(154, 154, 162, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    if (isVisible) {
      animationId = requestAnimationFrame(step);
    }
  }

  function start() {
    if (!animationId) {
      animationId = requestAnimationFrame(step);
    }
  }

  function stop() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // Pause the animation when the hero scrolls out of view —
  // saves CPU/battery on long scroll sessions.
  if ('IntersectionObserver' in window && hero) {
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          isVisible ? start() : stop();
        });
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(hero);
  }

  // Pause when the browser tab itself is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else if (isVisible) {
      start();
    }
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 150);
  });

  resize();
  start();
})();