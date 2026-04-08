(function () {
  'use strict';

  function initWorkFilter() {
    var filterGroup = document.querySelector('[data-filter]');
    if (!filterGroup) { return; }

    var btns  = Array.prototype.slice.call(document.querySelectorAll('.work__filter-btn'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('#work-bento .case-card'));

    if (!btns.length || !cards.length) { return; }

    function setFilter(value) {
      // Update button states
      btns.forEach(function (btn) {
        var active = btn.getAttribute('data-filter') === value;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      // Show / hide cards with a fade
      cards.forEach(function (card) {
        var domains = (card.getAttribute('data-domain') || 'all').split(' ');
        var visible = value === 'all' || domains.indexOf(value) !== -1;

        if (visible) {
          card.style.display = '';
          // Trigger reflow so animation re-fires
          card.offsetHeight; // eslint-disable-line no-unused-expressions
          card.style.animation = 'none';
          card.offsetHeight;
          card.style.animation = '';
        } else {
          card.style.display = 'none';
        }
      });
    }

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setFilter(btn.getAttribute('data-filter'));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWorkFilter);
  } else {
    initWorkFilter();
  }
})();
