#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up SHIFT Framework App...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js ${nodeVersion.trim()} detected`);
} catch (error) {
  console.error('❌ Node.js not found. Please install Node.js 18+ first.');
  process.exit(1);
}

// Check if Expo CLI is installed
try {
  execSync('expo --version', { encoding: 'utf8' });
  console.log('✅ Expo CLI detected');
} catch (error) {
  console.log('📦 Installing Expo CLI...');
  try {
    execSync('npm install -g @expo/cli', { stdio: 'inherit' });
    console.log('✅ Expo CLI installed');
  } catch (installError) {
    console.error('❌ Failed to install Expo CLI. Please install manually: npm install -g @expo/cli');
  }
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Create assets directory structure
console.log('\n📁 Creating asset directories...');
const assetsDir = path.join(__dirname, 'assets');
const pagesDir = path.join(assetsDir, 'pages');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir);
}

console.log('✅ Asset directories created');

// Create placeholder assets
const placeholderAssets = [
  'assets/icon.png',
  'assets/splash.png',
  'assets/adaptive-icon.png',
  'assets/favicon.png',
  'assets/treeBg.png'
];

console.log('\n📝 Creating placeholder assets...');
placeholderAssets.forEach(asset => {
  const assetPath = path.join(__dirname, asset);
  if (!fs.existsSync(assetPath)) {
    // Create a simple placeholder file
    fs.writeFileSync(assetPath, 'Placeholder asset - replace with actual image');
    console.log(`✅ Created ${asset}`);
  }
});

// Create placeholder book pages
const bookPages = [
  'front-cover.png', 'inside-portal.png', 'back-cover.png', 'preface.png',
  'entrypoint.png', 'week1.png', 'week2.png', 'week3.png', 'day22.png',
  'week4.png', 'week5.png', 'week6.png', 'day44.png', 'week7.png',
  'week8.png', 'week9.png', 'day66.png', 'day67.png',
  'bonus-meditation.png', 'universal-circuits.png'
];

bookPages.forEach(page => {
  const pagePath = path.join(pagesDir, page);
  if (!fs.existsSync(pagePath)) {
    fs.writeFileSync(pagePath, `Placeholder book page - replace with actual ${page}`);
    console.log(`✅ Created ${page}`);
  }
});

console.log('\n🎉 Setup complete!');
console.log('\n📱 To start the app:');
console.log('  npm run dev          # Start both frontend and backend');
console.log('  npm start            # Start Expo development server only');
console.log('  npm run server       # Start backend API server only');
console.log('\n📚 Next steps:');
console.log('  1. Replace placeholder assets with actual images');
console.log('  2. Add your book page images to assets/pages/');
console.log('  3. Customize the theme in src/styles/theme.ts');
console.log('  4. Test the app with: npm run dev');
console.log('\n🌐 The app will be available at:');
console.log('  - Frontend: http://localhost:19002 (Expo)');
console.log('  - Backend:  http://localhost:3001 (API)');