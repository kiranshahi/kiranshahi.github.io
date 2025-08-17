(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    const links = menu.querySelectorAll('a');

    function isMobile() {
      return window.getComputedStyle(toggle).display !== 'none';
    }

    function openMenu() {
      toggle.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      if (links.length) {
        links[0].focus();
      }
    }

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      toggle.focus();
    }

    toggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    links.forEach(link => {
      link.addEventListener('click', function () {
        if (isMobile()) {
          closeMenu();
        }
      });
    });

    if (!isMobile()) {
      menu.setAttribute('aria-hidden', 'false');
    }
  });
})();
