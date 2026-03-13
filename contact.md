---
title: Contact
permalink: /contact/
---

# Contact
I welcome collaborations on academic research, applied AI systems, and interdisciplinary projects.

- **Email:** [{{ site.email }}](mailto:{{ site.email }})
- **Affiliation:** {{ site.author.affiliation }}

## Professional Profiles
<ul>
{% for social in site.data.social %}
  <li><a href="{{ social.url }}" target="_blank" rel="noopener noreferrer">{{ social.name }}</a></li>
{% endfor %}
</ul>
