(function () {
  'use strict';
  function init() {
    var form = document.querySelector('.contact__form');
    var success = document.getElementById('form-success');
    if (!form || !success) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
      .then(function (res) {
        if (res.ok) {
          form.hidden = true;
          success.removeAttribute('hidden');
        } else {
          btn.disabled = false;
          btn.textContent = 'Send message →';
          alert('Something went wrong. Please email hello@zaaf.co.uk directly.');
        }
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = 'Send message →';
        alert('Network error. Please email hello@zaaf.co.uk directly.');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
