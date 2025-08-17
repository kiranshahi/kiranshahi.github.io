(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('copy-email');
    const link = document.getElementById('email-address');
    const feedback = document.getElementById('copy-feedback');
    if (btn && link) {
      btn.addEventListener('click', function () {
        const email = link.getAttribute('data-email') || 'kiran.shahi.c3@gmail.com';
        link.textContent = email;
        link.href = 'mailto:' + email;
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
