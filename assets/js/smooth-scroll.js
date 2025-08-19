(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    links.forEach(link => {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
          history.pushState(null, '', targetId);
        }
      });
    });
  });
})();
