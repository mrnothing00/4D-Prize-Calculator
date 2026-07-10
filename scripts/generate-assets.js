const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'images');

// Ensure directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

/**
 * Draw "4D" text centered on a canvas with white background
 */
function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  // "4D" text - bold, dark
  const fontSize = Math.round(size * 0.42);
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = '#1a1a1a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('4D', size / 2, size / 2 + size * 0.02);

  return canvas;
}

/**
 * Draw Android adaptive icon foreground (just the "4D" text, no background)
 * Adaptive icons use a 108dp canvas with 72dp safe zone centered
 */
function drawAdaptiveForeground(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Transparent background
  ctx.clearRect(0, 0, size, size);

  // "4D" text centered in safe zone (inner 66.67%)
  const fontSize = Math.round(size * 0.30);
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = '#1a1a1a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('4D', size / 2, size / 2 + size * 0.015);

  return canvas;
}

/**
 * Draw Android adaptive icon background (solid white)
 */
function drawAdaptiveBackground(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  return canvas;
}

/**
 * Draw monochrome icon (black "4D" on transparent)
 */
function drawMonochrome(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, size, size);

  const fontSize = Math.round(size * 0.30);
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('4D', size / 2, size / 2 + size * 0.015);

  return canvas;
}

/**
 * Draw splash screen - white bg with "MY 4D Calculator" centered
 */
function drawSplash(width, height) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // White background
  ctx.fillStyle = '#F5F5F0';
  ctx.fillRect(0, 0, width, height);

  // "4D" large text
  const mainSize = Math.round(Math.min(width, height) * 0.18);
  ctx.font = `bold ${mainSize}px Arial, sans-serif`;
  ctx.fillStyle = '#1a1a1a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('4D', width / 2, height / 2 - mainSize * 0.3);

  // "MY 4D Calculator" subtitle below
  const subSize = Math.round(Math.min(width, height) * 0.035);
  ctx.font = `500 ${subSize}px Arial, sans-serif`;
  ctx.fillStyle = '#6B7280';
  ctx.textAlign = 'center';
  ctx.fillText('MY 4D Calculator', width / 2, height / 2 + mainSize * 0.5);

  return canvas;
}

/**
 * Draw splash icon (small centered icon for Android splash)
 */
function drawSplashIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, size, size);

  const fontSize = Math.round(size * 0.5);
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = '#1a1a1a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('4D', size / 2, size / 2 + size * 0.02);

  return canvas;
}

function saveCanvas(canvas, filename) {
  const buffer = canvas.toBuffer('image/png');
  const filepath = path.join(ASSETS_DIR, filename);
  fs.writeFileSync(filepath, buffer);
  console.log(`  Created: ${filename} (${canvas.width}x${canvas.height})`);
}

// Generate all assets
console.log('Generating app icons and splash screens...\n');

// Main icon (1024x1024) - used by iOS App Store and as fallback
saveCanvas(drawIcon(1024), 'icon.png');

// Favicon (48x48)
saveCanvas(drawIcon(48), 'favicon.png');

// Android adaptive icon layers (1024x1024)
saveCanvas(drawAdaptiveForeground(1024), 'android-icon-foreground.png');
saveCanvas(drawAdaptiveBackground(1024), 'android-icon-background.png');
saveCanvas(drawMonochrome(1024), 'android-icon-monochrome.png');

// Splash icon for Android (200x200)
saveCanvas(drawSplashIcon(200), 'splash-icon.png');

// Full splash screen image (1284x2778 - iPhone 14 Pro Max size, works for all)
saveCanvas(drawSplash(1284, 2778), 'splash.png');

console.log('\nDone! All assets generated.');
