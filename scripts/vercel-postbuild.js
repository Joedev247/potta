const fs = require('fs');
const path = require('path');

// Possible locations where .next might be
const possibleNextDirs = [
  path.join('dist', 'apps', 'potta', '.next'),
  path.join('apps', 'potta', '.next'),
  path.join('dist', 'apps', 'potta', 'standalone', 'apps', 'potta', '.next'),
  path.join('dist', 'apps', 'potta', 'standalone', '.next'),
];

const outputDir = path.join('dist', 'apps', 'potta');

// Find the actual .next directory
let nextDir = null;
let manifestPath = null;

console.log('Searching for .next directory...');
for (const dir of possibleNextDirs) {
  const manifest = path.join(dir, 'routes-manifest.json');
  if (fs.existsSync(manifest)) {
    nextDir = dir;
    manifestPath = manifest;
    console.log(`✓ Found .next at: ${dir}`);
    break;
  } else if (fs.existsSync(dir)) {
    console.log(`  Found .next directory at ${dir} but no routes-manifest.json`);
    try {
      const contents = fs.readdirSync(dir);
      console.log(`  Contents: ${contents.join(', ')}`);
    } catch (e) {
      console.log(`  Could not read contents: ${e.message}`);
    }
  }
}

// If not found, list all dist directories for debugging
if (!manifestPath) {
  console.log('\nSearching dist directory structure...');
  const distDir = path.join('dist', 'apps', 'potta');
  if (fs.existsSync(distDir)) {
    try {
      const contents = fs.readdirSync(distDir);
      console.log(`Contents of ${distDir}:`, contents);
      
      // Check for standalone structure
      const standaloneDir = path.join(distDir, 'standalone');
      if (fs.existsSync(standaloneDir)) {
        console.log(`\nChecking standalone directory...`);
        const walkDir = (dir, depth = 0) => {
          if (depth > 5) return; // Limit depth
          try {
            const items = fs.readdirSync(dir);
            items.forEach(item => {
              const fullPath = path.join(dir, item);
              const stat = fs.statSync(fullPath);
              if (stat.isDirectory() && item === '.next') {
                console.log(`  Found .next at: ${fullPath}`);
                const manifest = path.join(fullPath, 'routes-manifest.json');
                if (fs.existsSync(manifest)) {
                  nextDir = fullPath;
                  manifestPath = manifest;
                  console.log(`  ✓ Found routes-manifest.json!`);
                }
              } else if (stat.isDirectory()) {
                walkDir(fullPath, depth + 1);
              }
            });
          } catch (e) {
            // Ignore errors
          }
        };
        walkDir(standaloneDir);
      }
    } catch (e) {
      console.log(`Error reading dist: ${e.message}`);
    }
  }
}

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Don't copy routes-manifest.json to root - Vercel will find it in .next
if (manifestPath && fs.existsSync(manifestPath)) {
  console.log(`✓ Found routes-manifest.json at: ${manifestPath}`);
  
  // Also copy the entire .next folder to outputDir if it's not already there
  const targetNextDir = path.join(outputDir, '.next');
  if (nextDir && nextDir !== targetNextDir && fs.existsSync(nextDir)) {
    console.log(`Copying .next folder from ${nextDir} to ${targetNextDir}...`);
    const copyRecursive = (src, dest) => {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      const entries = fs.readdirSync(src, { withFileTypes: true });
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          copyRecursive(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    };
    copyRecursive(nextDir, targetNextDir);
    console.log('✓ Copied .next folder to output directory');
  }
  
  // Also copy public folder if it exists
  const publicSource = path.join('apps', 'potta', 'public');
  const publicDest = path.join(outputDir, 'public');
  if (fs.existsSync(publicSource) && !fs.existsSync(publicDest)) {
    console.log(`Copying public folder from ${publicSource} to ${publicDest}...`);
    const copyRecursive = (src, dest) => {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      const entries = fs.readdirSync(src, { withFileTypes: true });
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          copyRecursive(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    };
    copyRecursive(publicSource, publicDest);
    console.log('✓ Copied public folder to output directory');
  }
  
  // Copy package.json and next.config.js to output directory (Vercel needs these)
  const packageJsonSource = path.join('apps', 'potta', 'package.json');
  const packageJsonDest = path.join(outputDir, 'package.json');
  if (fs.existsSync(packageJsonSource) && !fs.existsSync(packageJsonDest)) {
    fs.copyFileSync(packageJsonSource, packageJsonDest);
    console.log('✓ Copied package.json to output directory');
  }
  
  const nextConfigSource = path.join('apps', 'potta', 'next.config.js');
  const nextConfigDest = path.join(outputDir, 'next.config.js');
  if (fs.existsSync(nextConfigSource) && !fs.existsSync(nextConfigDest)) {
    fs.copyFileSync(nextConfigSource, nextConfigDest);
    console.log('✓ Copied next.config.js to output directory');
  }
  
  // Verify .next/server exists (needed for serverless functions)
  const serverDir = path.join(targetNextDir, 'server');
  if (fs.existsSync(serverDir)) {
    console.log('✓ .next/server directory found - serverless functions should be available');
    try {
      const serverContents = fs.readdirSync(serverDir);
      console.log(`  Server contents: ${serverContents.join(', ')}`);
    } catch (e) {
      console.log(`  Could not read server directory: ${e.message}`);
    }
  } else {
    console.warn('⚠ .next/server directory not found - this may cause "No serverless pages" error');
  }
  
  console.log('✓ Build output structure verified');
} else {
  console.error('✗ routes-manifest.json not found in any expected location');
  console.error('Searched in:');
  possibleNextDirs.forEach(dir => console.error(`  - ${dir}`));
  process.exit(1);
}

