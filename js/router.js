(function () {
  'use strict';

  // Map nav hrefs to page IDs
  var PAGE_MAP = {
    '#services':  'services',
    '#expertise': 'expertise',
    '#process':   'process',
    '#work':      'work',
    '#about':     'about',
    '#contact':   'home',
    '#hero':      'home'
  };

  var currentPage = 'home';

  function getMainSections() {
    return Array.prototype.slice.call(
      document.querySelectorAll('[data-page]')
    );
  }

  function showPage(pageId) {
    var sections = getMainSections();
    sections.forEach(function (section) {
      var pages = (section.getAttribute('data-page') || '').split(' ');
      if (pages.indexOf(pageId) !== -1) {
        section.hidden = false;
        section.classList.remove('page--hidden');
        section.classList.add('page--visible');
      } else {
        section.hidden = true;
        section.classList.remove('page--visible');
        section.classList.add('page--hidden');
      }
    });

    // Update nav active state
    document.querySelectorAll('.site-nav__link').forEach(function (link) {
      var href = link.getAttribute('href');
      var linkPage = PAGE_MAP[href] || null;
      link.classList.toggle('is-active', linkPage === pageId);
    });

    // Logo always goes home
    var logo = document.querySelector('.site-nav__logo');
    if (logo) {
      logo.classList.toggle('is-active', pageId === 'home');
    }

    // Update page title
    var titles = {
      home:      'ZAAF Consultancy — We build the infrastructure that scales.',
      services:  'Services — ZAAF Consultancy',
      expertise: 'Expertise — ZAAF Consultancy',
      process:   'How We Work — ZAAF Consultancy',
      work:      'Work — ZAAF Consultancy',
      about:     'About — ZAAF Consultancy'
    };
    document.title = titles[pageId] || titles.home;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    currentPage = pageId;

    // Notify page-specific scripts
    window.dispatchEvent(new CustomEvent('pagechange', { detail: { page: pageId } }));

    // Re-trigger reveal animations for new page
    setTimeout(function () {
      var reveals = document.querySelectorAll('[data-page="' + pageId + '"] [data-reveal], [data-reveal][data-page="' + pageId + '"]');
      // Trigger scroll-trigger on visible sections
      if (window.__triggerReveal) { window.__triggerReveal(); }
    }, 50);
  }

  function handleNavClick(e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var href = link.getAttribute('href');
    var pageId = PAGE_MAP[href];

    if (pageId !== undefined) {
      e.preventDefault();
      showPage(pageId);

      // Close mobile overlay if open
      var overlay = document.querySelector('.site-nav__mobile-overlay');
      var toggle  = document.querySelector('.site-nav__mobile-toggle');
      if (overlay && !overlay.hidden) {
        overlay.setAttribute('hidden', '');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'false');
          toggle.classList.remove('is-open');
        }
        document.body.style.overflow = '';
      }
    }
  }

  function init() {
    // Attach click handler to nav
    var nav = document.querySelector('.site-nav');
    if (nav) {
      nav.addEventListener('click', handleNavClick);
    }

    // Wire footer links into router
    var footer = document.querySelector('.site-footer');
    if (footer) {
      footer.addEventListener('click', handleNavClick);
    }

    // Logo click goes home
    var logo = document.querySelector('.site-nav__logo');
    if (logo) {
      logo.addEventListener('click', function (e) {
        e.preventDefault();
        showPage('home');
      });
    }

    // CTA "Let's talk" goes to contact (part of home)
    var cta = document.querySelector('.site-nav__cta');
    if (cta) {
      cta.addEventListener('click', function (e) {
        e.preventDefault();
        showPage('home');
        setTimeout(function () {
          var contact = document.getElementById('contact');
          if (contact) contact.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      });
    }

    // Hero CTAs
    document.querySelectorAll('a[href="#contact"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        showPage('home');
        setTimeout(function () {
          var contact = document.getElementById('contact');
          if (contact) contact.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      });
    });

    document.querySelectorAll('a[href="#work"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        showPage('work');
      });
    });

    // Show home by default
    showPage('home');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
