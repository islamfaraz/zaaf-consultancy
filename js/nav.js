(function () {
  'use strict';

  function init() {
    const nav = document.querySelector('.site-nav');
    const toggle = document.querySelector('.site-nav__mobile-toggle');
    const overlay = document.querySelector('.site-nav__mobile-overlay');
    const mobileLinks = document.querySelectorAll('.site-nav__mobile-link');
    const navLinks = document.querySelectorAll('.site-nav__link');

    if (!nav) return;

    // Scroll state
    function onScroll() {
      if (window.scrollY > 80) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile menu toggle
    if (toggle && overlay) {
      function openMenu() {
        toggle.setAttribute('aria-expanded', 'true');
        toggle.classList.add('is-open');
        overlay.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
        const firstLink = overlay.querySelector('a');
        if (firstLink) firstLink.focus();
      }

      function closeMenu() {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-open');
        overlay.setAttribute('hidden', '');
        document.body.style.overflow = '';
        toggle.focus();
      }

      toggle.addEventListener('click', function () {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      mobileLinks.forEach(function (link) {
        link.addEventListener('click', closeMenu);
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
          closeMenu();
        }
      });
    }

    // Active link tracking
    const sections = document.querySelectorAll('section[id]');
    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute('id');
              navLinks.forEach(function (link) {
                link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
              });
            }
          });
        },
        { threshold: 0.4 }
      );

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
