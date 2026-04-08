(function () {
  'use strict';

  let ticking = false;
  let scrollY = 0;
  const root = document.documentElement;

  function updateParallax() {
    root.style.setProperty('--scroll-y', scrollY + 'px');

    const scrollIndicator = document.querySelector('.hero__scroll-indicator');
    if (scrollIndicator) {
      const heroHeight = window.innerHeight;
      const progress = scrollY / heroHeight;
      if (progress > 0.3) {
        scrollIndicator.classList.add('is-hidden');
      } else {
        scrollIndicator.classList.remove('is-hidden');
      }
    }

    ticking = false;
  }

  function onScroll() {
    scrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  function init() {
    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
