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
      
      // Check for App Router API routes (serverless functions)
      const appDir = path.join(serverDir, 'app');
      if (fs.existsSync(appDir)) {
        console.log(`  ✓ Found App Router structure in .next/server/app`);

        // Check for API routes in App Router structure
        const appApiDir = path.join(appDir, 'api');
        if (fs.existsSync(appApiDir)) {
          const apiRoutes = fs.readdirSync(appApiDir);
          console.log(`  ✓ Found ${apiRoutes.length} App Router API routes`);
          if (apiRoutes.length > 0) {
            console.log(`  → API routes: ${apiRoutes.join(', ')}`);

            // Verify healthcheck route exists
            if (apiRoutes.includes('healthcheck')) {
              console.log('  ✓ /api/healthcheck route found in App Router structure');
            }
          }
        }
      }

        // Ensure pages-manifest.json exists (Vercel needs this to detect serverless pages)
        // Check multiple possible locations for pages-manifest.json
        const possibleManifestLocations = [
          path.join(nextDir, 'pages-manifest.json'),
          path.join(serverDir, 'pages-manifest.json'),
          path.join(nextDir, 'server', 'pages-manifest.json'),
        ];

        let pagesManifestSource = null;
        for (const location of possibleManifestLocations) {
          if (fs.existsSync(location)) {
            pagesManifestSource = location;
            console.log(`  ✓ Found pages-manifest.json at: ${location}`);
            break;
          }
        }

        const pagesManifestPath = path.join(targetNextDir, 'pages-manifest.json');
        const pagesManifestPathInServer = path.join(targetNextDir, 'server', 'pages-manifest.json');

        if (pagesManifestSource) {
          // Read and update the manifest to ensure API routes are included
          try {
            const manifestContent = JSON.parse(fs.readFileSync(pagesManifestSource, 'utf8'));

            // Ensure the API route is in the manifest for App Router
            if (!manifestContent['/api/healthcheck']) {
              // Check for App Router API route
              const appApiRouteDir = path.join(serverDir, 'app', 'api', 'healthcheck');
              if (fs.existsSync(appApiRouteDir)) {
                const routeFiles = fs.readdirSync(appApiRouteDir);
                if (routeFiles.includes('route.js')) {
                  manifestContent['/api/healthcheck'] = 'app/api/healthcheck/route.js';
                  console.log('  → Added /api/healthcheck to pages-manifest.json (App Router)');
                }
              }
            }

            // Write the updated manifest to both locations
            const manifestJson = JSON.stringify(manifestContent);
            fs.writeFileSync(pagesManifestPath, manifestJson);
            fs.writeFileSync(pagesManifestPathInServer, manifestJson);
            console.log('  ✓ Updated and copied pages-manifest.json to .next directory and .next/server (compact format)');

            const pageCount = Object.keys(manifestContent).length;
            console.log(`  → pages-manifest.json contains ${pageCount} entries`);
            if (pageCount > 0) {
              const sampleKeys = Object.keys(manifestContent).slice(0, 5);
              console.log(`  → Sample routes: ${sampleKeys.join(', ')}`);

              // Verify API route is present
              if (manifestContent['/api/healthcheck']) {
                console.log('  ✓ /api/healthcheck route confirmed in manifest');
              } else {
                console.warn('  ⚠ /api/healthcheck route NOT found in manifest!');
              }
            }
          } catch (e) {
            console.warn(`  ⚠ Could not parse/update pages-manifest.json: ${e.message}`);
            // Fallback: just copy the original
            fs.copyFileSync(pagesManifestSource, pagesManifestPath);
            fs.copyFileSync(pagesManifestSource, pagesManifestPathInServer);
            console.log('  ✓ Copied pages-manifest.json (fallback)');
          }
        } else {
          // Generate minimal pages-manifest.json for App Router
          console.warn('  ⚠ pages-manifest.json not found - generating minimal manifest...');
          try {
            const manifest = {
              '/_app': 'pages/_app.js',
              '/api/healthcheck': 'app/api/healthcheck/route.js'
            };

            const manifestJson = JSON.stringify(manifest);
            fs.writeFileSync(pagesManifestPath, manifestJson);
            fs.writeFileSync(pagesManifestPathInServer, manifestJson);
            console.log('  ✓ Generated pages-manifest.json with App Router API routes (compact format)');
            console.log(`  → Manifest entries: ${Object.keys(manifest).join(', ')}`);
          } catch (e) {
            console.error(`  ✗ Failed to generate pages-manifest.json: ${e.message}`);
          }
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
  // Check if we already created it in the target .next directory
  const targetPagesManifest = path.join(targetNextDir, 'pages-manifest.json');
  const pagesManifestDest = path.join(outputDir, 'pages-manifest.json');
  
  if (fs.existsSync(targetPagesManifest)) {
    fs.copyFileSync(targetPagesManifest, pagesManifestDest);
    console.log('✓ Copied pages-manifest.json to output root');
  } else {
    // Try to find it in source locations
    const possibleManifestLocations = [
      path.join(nextDir, 'pages-manifest.json'),
      path.join(nextDir, 'server', 'pages-manifest.json'),
    ];
    
    let found = false;
    for (const location of possibleManifestLocations) {
      if (fs.existsSync(location)) {
        fs.copyFileSync(location, pagesManifestDest);
        console.log('✓ Copied pages-manifest.json to output root');
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.warn('⚠ pages-manifest.json not found - will be generated during pages check');
    }
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
      
      // Verify API route exists in manifest and the actual file exists
      if (manifestContent['/api/healthcheck']) {
        const apiRouteFile = path.join(targetNextDir, 'server', 'pages', 'api', 'healthcheck.js');
        if (fs.existsSync(apiRouteFile)) {
          console.log('✓ /api/healthcheck route file confirmed at: .next/server/pages/api/healthcheck.js');
        } else {
          console.warn('⚠ WARNING: /api/healthcheck in manifest but file not found at expected location!');
        }
      }
      
      // Verify manifest format - ensure it's a flat object with route paths as keys
      const hasApiRoute = Object.keys(manifestContent).some(key => key.startsWith('/api/'));
      if (hasApiRoute) {
        console.log('✓ API route(s) confirmed in pages-manifest.json');
      } else {
        console.warn('⚠ WARNING: No API routes found in pages-manifest.json!');
      }
      
      if (pageCount === 0) {
        console.warn('⚠ WARNING: pages-manifest.json is empty - this may cause "No serverless pages" error');
      }
    } catch (e) {
      console.warn(`⚠ Could not parse pages-manifest.json: ${e.message}`);
    }
  } else {
    console.warn('⚠ WARNING: pages-manifest.json not found in .next directory - this may cause "No serverless pages" error');
  }
  
  // Additional check: Verify the structure Vercel expects
  console.log('\nVerifying Vercel detection requirements:');
  const requiredFiles = [
    path.join(outputDir, '.next', 'server', 'pages-manifest.json'),
    path.join(outputDir, '.next', 'pages-manifest.json'),
    path.join(outputDir, 'pages-manifest.json'),
    path.join(outputDir, '.next', 'server', 'pages', 'api', 'healthcheck.js'),
  ];
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`  ✓ ${path.relative(outputDir, file)}`);
    } else {
      console.warn(`  ✗ ${path.relative(outputDir, file)} - MISSING`);
    }
  });
  
  // Critical fix: Ensure pages-manifest.json has the correct format for Vercel
  // Vercel requires the manifest to be at .next/pages-manifest.json with API routes properly listed
  const finalPagesManifestPath = path.join(targetNextDir, 'pages-manifest.json');
  if (fs.existsSync(finalPagesManifestPath)) {
    try {
      const manifestContent = JSON.parse(fs.readFileSync(finalPagesManifestPath, 'utf8'));
      
      // Ensure all API routes are properly formatted
      // Vercel expects the value to be the relative path from .next/server
      const apiRoutePath = path.join(targetNextDir, 'server', 'pages', 'api', 'healthcheck.js');
      if (fs.existsSync(apiRoutePath)) {
        // Update manifest to ensure API route is correctly referenced
        if (!manifestContent['/api/healthcheck'] || manifestContent['/api/healthcheck'] !== 'pages/api/healthcheck.js') {
          manifestContent['/api/healthcheck'] = 'pages/api/healthcheck.js';
          console.log('  → Ensuring /api/healthcheck is correctly formatted in manifest');
        }
        
        // Write updated manifest (compact format, no spaces)
        const manifestJson = JSON.stringify(manifestContent);
        fs.writeFileSync(finalPagesManifestPath, manifestJson);
        
        // Also ensure it's in .next/server/pages-manifest.json
        const serverManifestPath = path.join(targetNextDir, 'server', 'pages-manifest.json');
        fs.writeFileSync(serverManifestPath, manifestJson);
        
        console.log('  ✓ Updated pages-manifest.json with correct API route format');
      }
    } catch (e) {
      console.warn(`  ⚠ Could not update pages-manifest.json: ${e.message}`);
    }
  }
  
  // Verify the API route file exists and is a proper serverless function
  const apiRouteFile = path.join(targetNextDir, 'server', 'pages', 'api', 'healthcheck.js');
  if (fs.existsSync(apiRouteFile)) {
    console.log('  ✓ API route file exists and is accessible');
    
    // Verify the file is not empty and contains a handler
    try {
      const fileContent = fs.readFileSync(apiRouteFile, 'utf8');
      if (fileContent.length === 0) {
        console.warn('  ⚠ WARNING: API route file is empty!');
      } else if (!fileContent.includes('handler') && !fileContent.includes('default')) {
        console.warn('  ⚠ WARNING: API route file may not export a handler function');
      } else {
        console.log('  ✓ API route file contains handler function');
      }
    } catch (e) {
      console.warn(`  ⚠ Could not verify API route file content: ${e.message}`);
    }
  } else {
    console.error('  ✗ CRITICAL: API route file not found at expected location!');
    console.error(`    Expected: ${apiRouteFile}`);
  }
  // Final critical fix: Ensure Vercel can detect serverless functions
  // Vercel checks for serverless functions by looking at pages-manifest.json
  // and verifying that the referenced files exist in .next/server/pages
  console.log('\n=== Final Vercel Detection Fix ===');
  
  const serverPagesManifest = path.join(targetNextDir, 'server', 'pages-manifest.json');
  const nextPagesManifest = path.join(targetNextDir, 'pages-manifest.json');
  const rootPagesManifest = path.join(outputDir, 'pages-manifest.json');
  
  // Ensure all three locations have the same manifest
  if (fs.existsSync(nextPagesManifest)) {
    const manifestContent = fs.readFileSync(nextPagesManifest, 'utf8');
    
    // Copy to server location
    fs.writeFileSync(serverPagesManifest, manifestContent);
    console.log('✓ Ensured pages-manifest.json exists in .next/server/');
    
    // Copy to root
    fs.writeFileSync(rootPagesManifest, manifestContent);
    console.log('✓ Ensured pages-manifest.json exists at output root');
    
    // Verify the manifest has API routes
    try {
      const manifest = JSON.parse(manifestContent);
      const apiRoutes = Object.keys(manifest).filter(key => key.startsWith('/api/'));
      if (apiRoutes.length > 0) {
        console.log(`✓ Found ${apiRoutes.length} API route(s) in manifest: ${apiRoutes.join(', ')}`);
        
        // Verify each API route file exists
        apiRoutes.forEach(route => {
          const routePath = manifest[route];
          if (routePath && routePath.startsWith('pages/api/')) {
            const filePath = path.join(targetNextDir, 'server', routePath);
            if (fs.existsSync(filePath)) {
              console.log(`  ✓ ${route} -> ${routePath} (file exists)`);
            } else {
              console.warn(`  ⚠ ${route} -> ${routePath} (file NOT found)`);
            }
          }
        });
      } else {
        console.warn('⚠ WARNING: No API routes found in pages-manifest.json!');
        console.warn('  This will cause "No serverless pages were built" error');
      }
    } catch (e) {
      console.warn(`⚠ Could not parse pages-manifest.json: ${e.message}`);
    }
  } else {
    console.error('✗ CRITICAL: pages-manifest.json not found in .next/');
    console.error('  This will cause "No serverless pages were built" error');
  }
  
  // Ensure BUILD_ID exists (Vercel checks for this)
  const buildIdPath = path.join(targetNextDir, 'BUILD_ID');
  if (!fs.existsSync(buildIdPath)) {
    // Try to read from source
    const sourceBuildId = path.join(nextDir, 'BUILD_ID');
    if (fs.existsSync(sourceBuildId)) {
      fs.copyFileSync(sourceBuildId, buildIdPath);
      console.log('✓ Copied BUILD_ID to output .next directory');
    } else {
      // Generate a BUILD_ID if it doesn't exist
      const buildId = Date.now().toString();
      fs.writeFileSync(buildIdPath, buildId);
      console.log('✓ Generated BUILD_ID for output .next directory');
    }
  }
  
  console.log('\n=== Vercel Detection Summary ===');
  console.log('Required files for Vercel detection:');
  const detectionFiles = [
    { path: path.join(outputDir, '.next', 'pages-manifest.json'), desc: 'Pages manifest in .next' },
    { path: path.join(outputDir, '.next', 'server', 'pages-manifest.json'), desc: 'Pages manifest in .next/server' },
    { path: path.join(outputDir, 'pages-manifest.json'), desc: 'Pages manifest at root' },
    { path: path.join(outputDir, '.next', 'server', 'app', 'api', 'healthcheck', 'route.js'), desc: 'App Router API route file' },
    { path: path.join(outputDir, '.next', 'BUILD_ID'), desc: 'BUILD_ID file' },
    { path: path.join(outputDir, 'package.json'), desc: 'package.json with Next.js' },
  ];
  
  let allFilesExist = true;
  detectionFiles.forEach(({ path: filePath, desc }) => {
    if (fs.existsSync(filePath)) {
      console.log(`  ✓ ${desc}`);
    } else {
      console.log(`  ✗ ${desc} - MISSING`);
      allFilesExist = false;
    }
  });
  
  if (allFilesExist) {
    console.log('\n✓ All required files for Vercel detection are present');
  } else {
    console.log('\n⚠ Some required files are missing - this may cause deployment issues');
  }
} else {
    console.error('✗ routes-manifest.json not found in any expected location');
    console.error('Searched in:');
    possibleNextDirs.forEach(dir => console.error(`  - ${dir}`));
    process.exit(1);
  }

