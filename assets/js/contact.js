(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('reveal-email');
    const span = document.getElementById('email-placeholder');
    if (btn && span) {
      btn.addEventListener('click', function () {
        span.textContent = 'kiran.shahi.c3[at]gmail.com';
        btn.remove();
      });
    }
  });
})();
