(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('copy-email');
    const span = document.getElementById('email-address');
    const feedback = document.getElementById('copy-feedback');
    if (btn && span) {
      btn.addEventListener('click', function () {
        const email = 'kiran.shahi.c3@gmail.com';
        span.textContent = email;
        navigator.clipboard.writeText(email).then(function () {
          if (feedback) {
            feedback.textContent = 'Copied!';
          }
          btn.classList.add('copied');
          setTimeout(function () {
            btn.classList.remove('copied');
            if (feedback) {
              feedback.textContent = '';
            }
          }, 2000);
        });
      });
    }
  });
})();
