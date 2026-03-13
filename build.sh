#!/bin/bash
set -euo pipefail

# Build the site
bundle exec jekyll build

# Check links and structure
bundle exec htmlproofer ./_site --disable-external
