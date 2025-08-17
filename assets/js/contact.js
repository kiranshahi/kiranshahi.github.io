(function () {
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('copy-email');
    const link = document.getElementById('email-address');
    const feedback = document.getElementById('copy-feedback');

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
        link.textContent = email;
        link.href = 'mailto:' + email;

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

    const form = document.querySelector('.contact-form');
    if (form) {
      const status = form.querySelector('.form-status');
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (status) {
          status.textContent = '';
          status.classList.remove('error');
        }
        const name = form.querySelector('input[name="name"]').value.trim();
        const email = form.querySelector('input[name="email"]').value.trim();
        const message = form.querySelector('textarea[name="message"]').value.trim();
        if (!name || !email || !message) {
          if (status) {
            status.textContent = 'Please fill in all fields.';
            status.classList.add('error');
          }
          return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          if (status) {
            status.textContent = 'Please enter a valid email address.';
            status.classList.add('error');
          }
          return;
        }
        try {
          const response = await fetch(form.action, {
            method: form.method,
            headers: { 'Accept': 'application/json' },
            body: new FormData(form)
          });
          if (response.ok) {
            if (status) {
              status.textContent = 'Thanks for your message!';
            }
            form.reset();
          } else {
            throw new Error('Network response was not ok');
          }
        } catch (error) {
          if (status) {
            status.textContent = 'Oops! There was a problem submitting your form.';
            status.classList.add('error');
          }
        }
      });
    }
  });
})();
