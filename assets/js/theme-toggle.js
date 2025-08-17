(function () {
  const html = document.documentElement;
  const stored = localStorage.getItem('theme');
  if (stored) {
    html.setAttribute('data-theme', stored);
  }

  function setIcon(theme) {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.innerHTML = theme === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    }
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', current);
    localStorage.setItem('theme', current);
    setIcon(current);
  }

  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', toggleTheme);
      const theme = html.getAttribute('data-theme') || 'light';
      setIcon(theme);
    }
  });
})();
