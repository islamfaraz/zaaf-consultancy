(function () {
  'use strict';

  var initialized = false;

  function init() {
    if (initialized) return;
    var accordion = document.querySelector('.exp-accordion');
    if (!accordion) return;

    var items = Array.prototype.slice.call(accordion.querySelectorAll('.exp-item'));

    items.forEach(function (item) {
      var trigger = item.querySelector('.exp-item__trigger');
      var panel   = item.querySelector('.exp-item__panel');
      if (!trigger || !panel) return;

      trigger.addEventListener('click', function () {
        var isOpen = item.hasAttribute('data-open');
        // Close all
        items.forEach(function (i) {
          i.removeAttribute('data-open');
          var t = i.querySelector('.exp-item__trigger');
          var p = i.querySelector('.exp-item__panel');
          if (t) t.setAttribute('aria-expanded', 'false');
          if (p) p.setAttribute('hidden', '');
        });
        // Open clicked if it was closed
        if (!isOpen) {
          item.setAttribute('data-open', '');
          trigger.setAttribute('aria-expanded', 'true');
          panel.removeAttribute('hidden');
          // Scroll into view if needed (mobile)
          if (window.innerWidth < 900) {
            setTimeout(function () {
              item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 80);
          }
        }
      });

      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          var next = item.nextElementSibling;
          if (next) { var t = next.querySelector('.exp-item__trigger'); if (t) t.focus(); }
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          var prev = item.previousElementSibling;
          if (prev) { var t = prev.querySelector('.exp-item__trigger'); if (t) t.focus(); }
        }
        if (e.key === 'Home') {
          e.preventDefault();
          var t = items[0].querySelector('.exp-item__trigger'); if (t) t.focus();
        }
        if (e.key === 'End') {
          e.preventDefault();
          var t = items[items.length - 1].querySelector('.exp-item__trigger'); if (t) t.focus();
        }
      });
    });

    // Auto-open first item
    if (items.length > 0) {
      var first = items[0];
      var ft = first.querySelector('.exp-item__trigger');
      var fp = first.querySelector('.exp-item__panel');
      first.setAttribute('data-open', '');
      if (ft) ft.setAttribute('aria-expanded', 'true');
      if (fp) fp.removeAttribute('hidden');
    }

    initialized = true;
  }

  function tryInit() {
    var section = document.getElementById('expertise');
    if (section && getComputedStyle(section).display !== 'none') {
      if (!initialized) init();
    }
  }

  window.addEventListener('pagechange', function (e) {
    if (e.detail && e.detail.page === 'expertise') {
      initialized = false;
      setTimeout(init, 80);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
  } else {
    tryInit();
  }

})();
