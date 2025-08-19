#!/bin/bash
set -e

# Build the site
bundle exec jekyll build

BLOG_PAGE="_site/blog/index.html"

# Verify hero section exists
if ! grep -q '<section class="page-hero"' "$BLOG_PAGE"; then
  echo "Missing hero section in $BLOG_PAGE" >&2
  exit 1
fi

# Verify post list exists
if ! grep -q '<section class="blog-posts"' "$BLOG_PAGE"; then
  echo "Missing post list in $BLOG_PAGE" >&2
  exit 1
fi

# Check links and structure
bundle exec htmlproofer ./_site --disable-external
