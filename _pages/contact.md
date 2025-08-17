---
title: "Contact"
layout: page
permalink: /contact/
hero_title: "Get in Touch"
hero_tagline: "Let's collaborate or just say hello"
author_profile: true
---
<div class="contact-hero">
  <div class="contact-hero__text">
    {% include hero.html %}
  </div>
  <div class="contact-hero__content">
    <div class="contact-section">
      <div class="contact-item">
        <span class="contact-icon"><i class="fas fa-envelope"></i></span>
        <span id="email-address" class="contact-link">****</span>
        <button id="copy-email" class="copy-email-btn">Copy Email</button>
        <span id="copy-feedback" class="copy-feedback" aria-live="polite"></span>
      </div>

      <div class="social-link">
        <i class="fab fa-linkedin" aria-hidden="true"></i>
        <a href="https://www.linkedin.com/in/kiranshahi/">linkedin.com/in/kiranshahi</a>
      </div>
      <div class="social-link">
        <i class="fab fa-github" aria-hidden="true"></i>
        <a href="https://github.com/kiranshahi">github.com/kiranshahi</a>
      </div>
    </div>

    <script src="{{ '/assets/js/contact.js' | relative_url }}" defer></script>
  </div>
</div>
