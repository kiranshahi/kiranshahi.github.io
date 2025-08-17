(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('reveal-email');
    const link = document.getElementById('email-link');
    if (btn && link) {
      btn.addEventListener('click', function () {
        const email = 'kiran.shahi.c3@gmail.com';
        link.textContent = email;
        link.href = 'mailto:' + email;
        btn.remove();
      });
    }
  });
})();
