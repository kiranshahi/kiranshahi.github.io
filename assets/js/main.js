const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });
}

const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  root.setAttribute('data-theme', savedTheme);
}

if (themeToggle) {
  themeToggle.textContent = root.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', current);
    localStorage.setItem('theme', current);
    themeToggle.textContent = current === 'dark' ? '☀️' : '🌙';
  });
}

const filters = document.querySelectorAll('#pub-filters [data-filter]');
const publications = document.querySelectorAll('#publication-list .pub-item');

filters.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    publications.forEach((item) => {
      const tags = item.dataset.tags || '';
      item.style.display = filter === 'all' || tags.includes(filter) ? 'block' : 'none';
    });
  });
});
