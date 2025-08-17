(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('nav-menu');
    const nav = document.querySelector('.site-nav');
    if (!toggle || !menu || !nav) return;

    const links = menu.querySelectorAll('a');

    function isMobile() {
      return window.getComputedStyle(toggle).display !== 'none';
    }

    function openMenu() {
      toggle.setAttribute('aria-expanded', 'true');
      if (isMobile()) {
        menu.setAttribute('aria-hidden', 'false');
      }
      if (links.length) {
        links[0].focus();
      }
    }

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      if (isMobile()) {
        menu.setAttribute('aria-hidden', 'true');
      }
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

    document.addEventListener('click', function (e) {
      if (isMobile() && toggle.getAttribute('aria-expanded') === 'true') {
        if (!nav.contains(e.target)) {
          closeMenu();
        }
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      }
    });

    window.addEventListener('resize', function () {
      if (!isMobile()) {
        menu.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'false');
      } else if (toggle.getAttribute('aria-expanded') !== 'true') {
        menu.setAttribute('aria-hidden', 'true');
      }
    });

    if (isMobile()) {
      menu.setAttribute('aria-hidden', 'true');
    } else {
      menu.setAttribute('aria-hidden', 'false');
    }
  });
})();
