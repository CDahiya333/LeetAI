// This is a utility script to generate icon files
// In a real project, you would create actual icon files instead

import * as fs from 'fs';
import * as path from 'path';

// Function to create a simple SVG icon as a placeholder
function createSVGIcon(size: number): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#4285F4" />
    <circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="#FFFFFF" />
    <circle cx="${size/2}" cy="${size/2}" r="${size/6}" fill="#34A853" />
  </svg>`;
}

// Create the assets directory if it doesn't exist
const assetsDir = path.resolve(__dirname, '../assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Generate icons of different sizes
[16, 48, 128].forEach(size => {
  const iconContent = createSVGIcon(size);
  fs.writeFileSync(path.join(assetsDir, `icon${size}.svg`), iconContent);
  console.log(`Created icon${size}.svg`);
});

console.log('Icon generation complete!');