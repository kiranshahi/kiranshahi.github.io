---
title: "Contact"
layout: single
permalink: /contact/
---

I'm always happy to connect with fellow developers, researchers, and collaborators.

- Email: <span id="email-placeholder">****</span>  
  <button id="reveal-email">Show Email</button>
- LinkedIn: [linkedin.com/in/kiranshahi](https://www.linkedin.com/in/kiranshahi/)
- GitHub: [github.com/kiranshahi](https://github.com/kiranshahi)

Feel free to reach out with questions, ideas, or just to say hello.

<script>
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('reveal-email');
  const span = document.getElementById('email-placeholder');
  if (btn && span) {
    btn.addEventListener('click', function() {
      span.textContent = 'kiran.shahi.c3[at]gmail.com';
      btn.remove();
    });
  }
});
</script>
