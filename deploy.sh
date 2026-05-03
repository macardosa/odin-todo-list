#!/bin/bash

# Stop on error
set -e

# Ensure we are on main branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "main" ]; then
  echo "You must be on 'main' branch to deploy (current: $current_branch)"
  exit 1
fi

# Ensure working tree is clean
if ! git diff-index --quiet HEAD --; then
  echo "Commit your changes first"
  exit 1
fi

# Create gh-pages branch if it doesn't exist
if ! git show-ref --verify --quiet refs/heads/gh-pages; then
  echo "Creating gh-pages branch"
  git branch gh-pages
fi

# Follow your exact steps
git checkout gh-pages
git merge main --no-edit

# Build project
npm run build

git add dist -f
git commit -m "Deployment commit" || echo "Nothing to commit"

git subtree push --prefix dist origin gh-pages

git checkout main