const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure JS files for injection are copied for Vercel build
const tempDir = path.join(process.cwd(), 'server/temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Copy JS files to temp directory
const jsFiles = [
  'ew-log-viewer.js',
  'LLWebServerExtended.js',
  'scriptcustom.js',
  'envelope-cartesian.js'
];

const sourcePath = path.join(process.cwd(), 'client/src/assets/scripts');
if (fs.existsSync(sourcePath)) {
  jsFiles.forEach(file => {
    const sourceFile = path.join(sourcePath, file);
    const destFile = path.join(tempDir, file);
    
    if (fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, destFile);
      console.log(`Copied ${file} to server/temp/`);
    } else {
      console.log(`Warning: Source file ${sourceFile} not found`);
    }
  });
}

// Run build command
console.log('Building frontend...');
execSync('npm run build', { stdio: 'inherit' });