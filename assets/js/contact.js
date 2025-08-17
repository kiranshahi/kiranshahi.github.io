(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('copy-email');
    const link = document.getElementById('email-address');
    const emailText = document.getElementById('email-text');
    const feedback = document.getElementById('copy-feedback');
    let revealed = false;

    function manualCopy(message) {
      if (feedback) {
        feedback.textContent = message;
      }
      if (document.createRange && window.getSelection) {
        const range = document.createRange();
        range.selectNodeContents(link);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setTimeout(function () {
        if (window.getSelection) {
          window.getSelection().removeAllRanges();
        }
        if (feedback) {
          feedback.textContent = '';
        }
      }, 2000);
    }

    if (btn && link) {
      btn.addEventListener('click', function () {
        const email = link.getAttribute('data-email') || 'kiran.shahi.c3@gmail.com';

        if (!revealed) {
          if (emailText) {
            emailText.textContent = email;
          }
          link.href = 'mailto:' + email;
          btn.textContent = 'Copy Email';
          btn.setAttribute('aria-label', 'Copy email address');
          revealed = true;
          return;
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
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
          }).catch(function () {
            manualCopy('Copy failed. Press Ctrl+C to copy.');
          });
        } else {
          manualCopy('Press Ctrl+C to copy.');
        }
      });
    }
  });
})();
