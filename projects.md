---
title: Projects
permalink: /projects/
---

# Featured Projects

<ul class="list-clean">
{% for project in site.projects %}
  <li class="project-item">
    <h3><a href="{{ project.url | relative_url }}">{{ project.title }}</a></h3>
    <p>{{ project.description }}</p>
    <div class="tags">
      {% for tag in project.tags %}
        <span class="tag">{{ tag }}</span>
      {% endfor %}
    </div>
    <div class="btn-row">
      {% if project.github %}<a class="btn" href="{{ project.github }}">GitHub</a>{% endif %}
      {% if project.demo %}<a class="btn" href="{{ project.demo }}">Demo</a>{% endif %}
    </div>
  </li>
{% endfor %}
</ul>
