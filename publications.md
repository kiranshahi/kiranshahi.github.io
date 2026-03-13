---
title: Publications
permalink: /publications/
---

# Publications

<p class="meta">Filter by topic:</p>
<div class="tags" id="pub-filters">
  <button class="btn" data-filter="all">All</button>
  <button class="btn" data-filter="medical-imaging">Medical Imaging</button>
  <button class="btn" data-filter="computer-vision">Computer Vision</button>
  <button class="btn" data-filter="sustainability">Sustainability</button>
</div>

<ul class="list-clean" id="publication-list">
{% for pub in site.data.publications %}
  <li class="pub-item" data-tags="{{ pub.tags | join: ' ' }}">
    <strong>{{ pub.title }}</strong><br>
    {{ pub.authors }}<br>
    <span class="meta"><em>{{ pub.venue }}</em>, {{ pub.year }}</span>
    <div class="btn-row">
      <a class="btn" href="{{ pub.links.pdf }}">PDF</a>
      <a class="btn" href="{{ pub.links.arxiv }}">arXiv</a>
      <a class="btn" href="{{ pub.links.doi }}">DOI</a>
      <a class="btn" href="{{ pub.links.code }}">Code</a>
    </div>
    <details>
      <summary>Abstract</summary>
      <p>{{ pub.abstract }}</p>
    </details>
  </li>
{% endfor %}
</ul>
