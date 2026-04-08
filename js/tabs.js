(function () {
  'use strict';

  function initTabs(tablist) {
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const panels = tabs.map(function (tab) {
      return document.getElementById(tab.getAttribute('aria-controls'));
    });

    function activateTab(tab) {
      tabs.forEach(function (t) {
        t.setAttribute('aria-selected', 'false');
        t.classList.remove('is-active');
      });

      panels.forEach(function (panel) {
        if (panel) {
          panel.hidden = true;
          panel.classList.remove('is-active');
        }
      });

      tab.setAttribute('aria-selected', 'true');
      tab.classList.add('is-active');

      const targetPanel = document.getElementById(tab.getAttribute('aria-controls'));
      if (targetPanel) {
        targetPanel.hidden = false;
        targetPanel.classList.add('is-active');
      }
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        activateTab(tab);
      });

      tab.addEventListener('keydown', function (e) {
        let targetIndex = index;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          targetIndex = (index + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          targetIndex = (index - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          targetIndex = tabs.length - 1;
        } else {
          return;
        }

        tabs[targetIndex].focus();
        activateTab(tabs[targetIndex]);
      });
    });
  }

  function init() {
    const tablists = document.querySelectorAll('[role="tablist"]');
    tablists.forEach(initTabs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
