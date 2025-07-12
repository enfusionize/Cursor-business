#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing SHIFT Framework App setup...\n');

const tests = [
  {
    name: 'Package.json exists',
    test: () => fs.existsSync('package.json'),
    fix: 'Run npm init to create package.json'
  },
  {
    name: 'App.tsx exists',
    test: () => fs.existsSync('App.tsx'),
    fix: 'Create App.tsx in the root directory'
  },
  {
    name: 'Backend server exists',
    test: () => fs.existsSync('backend/server.js'),
    fix: 'Create backend/server.js'
  },
  {
    name: 'Theme file exists',
    test: () => fs.existsSync('src/styles/theme.ts'),
    fix: 'Create src/styles/theme.ts'
  },
  {
    name: 'Navigation exists',
    test: () => fs.existsSync('src/navigation/MainTabs.tsx'),
    fix: 'Create src/navigation/MainTabs.tsx'
  },
  {
    name: 'Home screen exists',
    test: () => fs.existsSync('src/screens/HomeScreen.tsx'),
    fix: 'Create src/screens/HomeScreen.tsx'
  },
  {
    name: 'Book reader exists',
    test: () => fs.existsSync('src/screens/BookReaderScreen.tsx'),
    fix: 'Create src/screens/BookReaderScreen.tsx'
  },
  {
    name: 'App.json exists',
    test: () => fs.existsSync('app.json'),
    fix: 'Create app.json for Expo configuration'
  },
  {
    name: 'Assets directory exists',
    test: () => fs.existsSync('assets'),
    fix: 'Create assets directory'
  },
  {
    name: 'Pages directory exists',
    test: () => fs.existsSync('assets/pages'),
    fix: 'Create assets/pages directory'
  }
];

let passed = 0;
let failed = 0;

tests.forEach(({ name, test, fix }) => {
  if (test()) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
    console.log(`   Fix: ${fix}`);
    failed++;
  }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! Your SHIFT Framework App is ready.');
  console.log('\n🚀 Next steps:');
  console.log('  1. Run: npm run dev');
  console.log('  2. Open Expo Go on your phone');
  console.log('  3. Scan the QR code');
  console.log('  4. Start your 68-day journey!');
} else {
  console.log('\n⚠️  Some tests failed. Please fix the issues above before proceeding.');
  process.exit(1);
}