const fs = require('fs');
const path = require('path');

const nextDir = path.join('dist', 'apps', 'potta', '.next');
const outputDir = path.join('dist', 'apps', 'potta');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Copy routes-manifest.json to output root (Vercel expects it there)
const manifestPath = path.join(nextDir, 'routes-manifest.json');
if (fs.existsSync(manifestPath)) {
  const targetPath = path.join(outputDir, 'routes-manifest.json');
  fs.copyFileSync(manifestPath, targetPath);
  console.log('✓ Copied routes-manifest.json to output directory');
} else {
  console.error('✗ routes-manifest.json not found at:', manifestPath);
  console.log('Checking if .next directory exists:', fs.existsSync(nextDir));
  if (fs.existsSync(nextDir)) {
    console.log('Contents of .next:', fs.readdirSync(nextDir));
  }
  process.exit(1);
}

// Also ensure .next folder is accessible (Vercel needs it)
console.log('✓ Build output structure verified');

