(function () {
  'use strict';

  function init() {
    var nav = document.querySelector('.site-nav');
    var toggle = document.querySelector('.site-nav__mobile-toggle');
    var overlay = document.querySelector('.site-nav__mobile-overlay');
    var mobileLinks = document.querySelectorAll('.site-nav__mobile-link');
    var navLinks = document.querySelectorAll('.site-nav__link');

    if (!nav) return;

    // Scroll state — add .is-scrolled after 80px
    function onScroll() {
      if (window.scrollY > 80) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile menu
    if (toggle && overlay) {
      function getFocusable() {
        return Array.prototype.slice.call(
          overlay.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')
        ).filter(function (el) { return !el.disabled && !el.hidden; });
      }

      function openMenu() {
        toggle.setAttribute('aria-expanded', 'true');
        toggle.classList.add('is-open');
        overlay.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
        var focusable = getFocusable();
        if (focusable.length) { focusable[0].focus(); }
      }

      function closeMenu() {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-open');
        overlay.setAttribute('hidden', '');
        document.body.style.overflow = '';
        toggle.focus();
      }

      toggle.addEventListener('click', function () {
        var isOpen = toggle.getAttribute('aria-expanded') === 'true';
        if (isOpen) { closeMenu(); } else { openMenu(); }
      });

      mobileLinks.forEach(function (link) {
        link.addEventListener('click', closeMenu);
      });

      document.addEventListener('keydown', function (e) {
        if (toggle.getAttribute('aria-expanded') !== 'true') { return; }
        if (e.key === 'Escape') {
          closeMenu();
          return;
        }
        if (e.key === 'Tab') {
          var focusable = getFocusable();
          if (!focusable.length) { return; }
          var first = focusable[0];
          var last  = focusable[focusable.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
          } else {
            if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
          }
        }
      });
    }

    // Active section detection
    var sections = document.querySelectorAll('section[id]');
    if ('IntersectionObserver' in window && sections.length) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              var href = link.getAttribute('href');
              link.classList.toggle('is-active', href === '#' + id);
            });
          }
        });
      }, { threshold: 0.35 });

      sections.forEach(function (section) {
        sectionObserver.observe(section);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
