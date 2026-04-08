(function () {
  'use strict';

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  function init() {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      observer.observe(el);
    });
  }

  // Expose re-trigger for router page switches
  window.__triggerReveal = function () {
    var newEls = document.querySelectorAll('[data-reveal]:not(.is-visible)');
    newEls.forEach(function (el) {
      if (observer) observer.observe(el);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
