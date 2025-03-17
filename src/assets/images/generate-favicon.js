const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Note: This would require imagemagick to be installed
// For a real project, you'd use a favicon generation package instead.
console.log('This script would generate favicon sizes from the SVG.');
console.log('For demonstration purposes, we will copy the SVG to public directory.');

// Source and destination paths
const svgSource = path.join(__dirname, 'softball.svg');
const publicDir = path.join(__dirname, '../../../public');

// Copy the SVG to public directory
try {
  fs.copyFileSync(svgSource, path.join(publicDir, 'softball.svg'));
  console.log('Copied softball.svg to public directory');
} catch (err) {
  console.error('Error copying file:', err);
}

console.log('In a real project, you would generate multiple sizes and formats:');
console.log('- favicon.ico (16x16, 32x32, 48x48)');
console.log('- apple-touch-icon.png (180x180)');
console.log('- favicon-32x32.png');
console.log('- favicon-16x16.png');