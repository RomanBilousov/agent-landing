// Lightweight scroll-reveal animations (no deps)
// Respects prefers-reduced-motion.

(() => {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.14, rootMargin: '0px 0px -10% 0px' }
  );

  els.forEach((el, i) => {
    el.style.setProperty('--d', `${Math.min(i * 70, 280)}ms`);
    io.observe(el);
  });
})();
