#!/bin/bash
set -e
# Print current directory for debugging
echo "Build script: Current directory is $(pwd)"
# Try to find the workspace root
if [ -f "nx.json" ]; then
  echo "Found nx.json in current directory"
elif [ -f "../nx.json" ]; then
  cd ..
  echo "Changed to parent directory: $(pwd)"
elif [ -f "../../nx.json" ]; then
  cd ../..
  echo "Changed to grandparent directory: $(pwd)"
fi
# Verify we're in the right place
if [ ! -f "nx.json" ]; then
  echo "Error: Could not find nx.json. Current directory: $(pwd)"
  ls -la
  exit 1
fi
# Verify public folder exists
if [ ! -d "apps/potta/public" ]; then
  echo "Error: apps/potta/public not found in $(pwd)"
  echo "Contents:"
  ls -la apps/potta/ 2>/dev/null || echo "apps/potta directory not found"
  exit 1
fi
echo "Public folder found. Running build..."
npx nx build potta

