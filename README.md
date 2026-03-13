# Academic Researcher Website (Jekyll + GitHub Pages)

A clean, modern, GitHub Pages-compatible personal researcher website template.

## Folder Structure

```text
.
├── _config.yml
├── _data/
│   ├── publications.yml
│   └── social.yml
├── _includes/
│   ├── footer.html
│   └── header.html
├── _layouts/
│   └── default.html
├── _posts/
│   ├── 2025-11-18-cvpr-workshop-talk.md
│   └── 2026-01-10-new-paper-tmi.md
├── _projects/
│   ├── clinical-vision-stack.md
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── files/aarya-sharma-cv.pdf
├── index.html
├── about.md
├── publications.md
├── projects.md
├── cv.md
└── contact.md
```

## Local Development

```bash
bundle install
bundle exec jekyll serve
```

Visit: `http://localhost:4000`

## Deploy to GitHub Pages

1. Push this repository to GitHub under `<username>.github.io` or any repo using Pages.
2. In **Settings → Pages**, set source to **GitHub Actions** (or `main` branch root if using default Pages build).
3. If using Actions, keep `.github/workflows/jekyll.yml` enabled.
4. Every push to `main` redeploys the site.

## How to Customize

- **Profile details**: edit `_config.yml` (`author`, `email`, `social`, `cv_file`).
- **Publications**: add/edit entries in `_data/publications.yml`.
- **Projects**: add markdown files to `_projects/` with front matter.
- **CV content**: edit `cv.md` and replace `assets/files/aarya-sharma-cv.pdf`.
- **News**: add posts to `_posts/` with filenames `YYYY-MM-DD-title.md`.
- **Navigation**: update `nav_items` in `_config.yml`.
- **Styling**: adjust `assets/css/style.css`.
- **Behavior (menu/theme/filter)**: adjust `assets/js/main.js`.

## GitHub Pages Compatibility

The template uses only Pages-safe plugins:
- `jekyll-seo-tag`
- `jekyll-sitemap`
- `jekyll-feed`
