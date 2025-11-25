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

// Copy routes-manifest.json to output root (Vercel expects it there)
if (manifestPath && fs.existsSync(manifestPath)) {
  const targetPath = path.join(outputDir, 'routes-manifest.json');
  fs.copyFileSync(manifestPath, targetPath);
  console.log(`✓ Found routes-manifest.json at: ${manifestPath}`);
  console.log(`✓ Copied routes-manifest.json to output root: ${targetPath}`);
  
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
  
  // Create/update package.json in output directory (Vercel needs this with Next.js dependency)
  const packageJsonSource = path.join('apps', 'potta', 'package.json');
  const packageJsonDest = path.join(outputDir, 'package.json');
  const rootPackageJson = path.join('package.json');
  
  let packageJson = {};
  if (fs.existsSync(packageJsonSource)) {
    packageJson = JSON.parse(fs.readFileSync(packageJsonSource, 'utf8'));
  }
  
  // Ensure Next.js is in dependencies (Vercel needs this to detect Next.js)
  if (!packageJson.dependencies) {
    packageJson.dependencies = {};
  }
  if (!packageJson.dependencies.next) {
    // Read from root package.json if available
    if (fs.existsSync(rootPackageJson)) {
      const rootPkg = JSON.parse(fs.readFileSync(rootPackageJson, 'utf8'));
      if (rootPkg.dependencies && rootPkg.dependencies.next) {
        packageJson.dependencies.next = rootPkg.dependencies.next;
        packageJson.dependencies.react = rootPkg.dependencies.react || '^19.2.0';
        packageJson.dependencies['react-dom'] = rootPkg.dependencies['react-dom'] || '^19.2.0';
      }
    } else {
      packageJson.dependencies.next = '16.0.3';
      packageJson.dependencies.react = '^19.2.0';
      packageJson.dependencies['react-dom'] = '^19.2.0';
    }
  }
  
  // Ensure scripts exist
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  packageJson.scripts.start = packageJson.scripts.start || 'next start';
  
  fs.writeFileSync(packageJsonDest, JSON.stringify(packageJson, null, 2));
  console.log('✓ Created/updated package.json in output directory with Next.js dependency');
  
  const nextConfigSource = path.join('apps', 'potta', 'next.config.js');
  const nextConfigDest = path.join(outputDir, 'next.config.js');
  if (fs.existsSync(nextConfigSource)) {
    fs.copyFileSync(nextConfigSource, nextConfigDest);
    console.log('✓ Copied next.config.js to output directory');
  } else {
    console.warn('⚠ next.config.js not found at:', nextConfigSource);
  }
  
  // Verify .next/server exists and check for serverless functions
  const serverDir = path.join(targetNextDir, 'server');
  if (fs.existsSync(serverDir)) {
    console.log('✓ .next/server directory found - serverless functions should be available');
    try {
      const serverContents = fs.readdirSync(serverDir);
      console.log(`  Server contents: ${serverContents.join(', ')}`);
      
      // Check for app directory (App Router serverless functions)
      const appDir = path.join(serverDir, 'app');
      if (fs.existsSync(appDir)) {
        const appRoutes = fs.readdirSync(appDir);
        console.log(`  ✓ Found ${appRoutes.length} app routes in .next/server/app`);
      }
      
      // Check for pages directory (Pages Router serverless functions)
      const pagesDir = path.join(serverDir, 'pages');
      if (fs.existsSync(pagesDir)) {
        const pageFiles = fs.readdirSync(pagesDir);
        console.log(`  ✓ Found ${pageFiles.length} page files in .next/server/pages`);
        
        // List the actual page files to verify they exist
        if (pageFiles.length > 0) {
          console.log(`  → Page files: ${pageFiles.slice(0, 5).join(', ')}${pageFiles.length > 5 ? '...' : ''}`);
          
          // Check if API routes exist
          const apiDir = path.join(pagesDir, 'api');
          if (fs.existsSync(apiDir)) {
            const apiFiles = fs.readdirSync(apiDir);
            console.log(`  → Found ${apiFiles.length} API route files in .next/server/pages/api`);
            if (apiFiles.length > 0) {
              console.log(`  → API files: ${apiFiles.join(', ')}`);
            }
          }
        } else {
          console.warn('  ⚠ WARNING: pages directory exists but is empty!');
        }
        
        // Ensure pages-manifest.json exists (Vercel needs this to detect serverless pages)
        const pagesManifestPath = path.join(targetNextDir, 'pages-manifest.json');
        const pagesManifestSource = path.join(nextDir, 'pages-manifest.json');
        if (fs.existsSync(pagesManifestSource)) {
          fs.copyFileSync(pagesManifestSource, pagesManifestPath);
          console.log('  ✓ Copied pages-manifest.json to .next directory');
          
          // Verify the manifest has content
          try {
            const manifestContent = JSON.parse(fs.readFileSync(pagesManifestSource, 'utf8'));
            const pageCount = Object.keys(manifestContent).length;
            console.log(`  → pages-manifest.json contains ${pageCount} entries`);
            if (pageCount > 0) {
              const sampleKeys = Object.keys(manifestContent).slice(0, 3);
              console.log(`  → Sample routes: ${sampleKeys.join(', ')}`);
            }
          } catch (e) {
            console.warn(`  ⚠ Could not parse pages-manifest.json: ${e.message}`);
          }
        } else {
          console.warn('  ⚠ pages-manifest.json not found in source - this may cause detection issues');
        }
      } else {
        console.warn('  ⚠ WARNING: .next/server/pages directory not found!');
      }
      
      // Check for middleware
      const middlewareFile = path.join(serverDir, 'middleware.js');
      if (fs.existsSync(middlewareFile)) {
        console.log('  ✓ Middleware.js found');
      }
    } catch (e) {
      console.log(`  Could not read server directory: ${e.message}`);
    }
  } else {
    console.warn('⚠ .next/server directory not found - this may cause "No serverless pages" error');
  }
  
  // Ensure pages-manifest.json is in the output root (some Vercel checks look here)
  const pagesManifestSource = path.join(nextDir, 'pages-manifest.json');
  const pagesManifestDest = path.join(outputDir, 'pages-manifest.json');
  if (fs.existsSync(pagesManifestSource)) {
    fs.copyFileSync(pagesManifestSource, pagesManifestDest);
    console.log('✓ Copied pages-manifest.json to output root');
    
    // Verify the manifest has content
    try {
      const manifestContent = JSON.parse(fs.readFileSync(pagesManifestSource, 'utf8'));
      const pageCount = Object.keys(manifestContent).length;
      console.log(`  → pages-manifest.json contains ${pageCount} page entries`);
      if (pageCount > 0) {
        console.log(`  → Sample entries: ${Object.keys(manifestContent).slice(0, 3).join(', ')}`);
      }
    } catch (e) {
      console.warn(`  ⚠ Could not parse pages-manifest.json: ${e.message}`);
    }
  } else {
    console.warn('⚠ pages-manifest.json not found in source .next directory');
  }
  
  // List final output directory structure for debugging
  console.log('\nFinal output directory structure:');
  try {
    const outputContents = fs.readdirSync(outputDir);
    console.log(`  Root contents: ${outputContents.join(', ')}`);
    if (fs.existsSync(targetNextDir)) {
      const nextContents = fs.readdirSync(targetNextDir);
      console.log(`  .next contents: ${nextContents.join(', ')}`);
    }
  } catch (e) {
    console.log(`  Could not list output directory: ${e.message}`);
  }
  
  console.log('✓ Build output structure verified');
  
  // Final verification: Check if pages-manifest.json exists and has content
  const finalPagesManifest = path.join(targetNextDir, 'pages-manifest.json');
  if (fs.existsSync(finalPagesManifest)) {
    try {
      const manifestContent = JSON.parse(fs.readFileSync(finalPagesManifest, 'utf8'));
      const pageCount = Object.keys(manifestContent).length;
      console.log(`✓ pages-manifest.json found with ${pageCount} entries`);
      if (pageCount === 0) {
        console.warn('⚠ WARNING: pages-manifest.json is empty - this may cause "No serverless pages" error');
      }
    } catch (e) {
      console.warn(`⚠ Could not parse pages-manifest.json: ${e.message}`);
    }
  } else {
    console.warn('⚠ WARNING: pages-manifest.json not found in .next directory - this may cause "No serverless pages" error');
  }
} else {
  console.error('✗ routes-manifest.json not found in any expected location');
  console.error('Searched in:');
  possibleNextDirs.forEach(dir => console.error(`  - ${dir}`));
  process.exit(1);
}

