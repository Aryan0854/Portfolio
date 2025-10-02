#!/bin/bash
# Deploy to GitHub Pages

# Exit on any error
set -e

# Build the project
echo "Building the project..."
npm run build

# Deploy to GitHub Pages
echo "Deploying to GitHub Pages..."
npx gh-pages -d dist

echo "Deployment completed!"