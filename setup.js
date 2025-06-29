#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Discord Bot Maker Setup');
console.log('==========================\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js version: ${nodeVersion.trim()}`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js v16 or higher.');
  process.exit(1);
}

// Check if npm is installed
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' });
  console.log(`✅ npm version: ${npmVersion.trim()}\n`);
} catch (error) {
  console.error('❌ npm is not installed. Please install npm.');
  process.exit(1);
}

// Install dependencies for each directory
const directories = ['backend', 'web', 'desktop'];

console.log('📦 Installing dependencies...\n');

directories.forEach(dir => {
  if (fs.existsSync(path.join(__dirname, dir))) {
    console.log(`Installing dependencies for ${dir}...`);
    try {
      execSync('npm install', { 
        cwd: path.join(__dirname, dir), 
        stdio: 'inherit' 
      });
      console.log(`✅ ${dir} dependencies installed\n`);
    } catch (error) {
      console.error(`❌ Failed to install dependencies for ${dir}`);
      process.exit(1);
    }
  }
});

// Install root dependencies
console.log('Installing root dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Root dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install root dependencies');
  process.exit(1);
}

// Create necessary directories
const dirsToCreate = [
  'backend/generated-bots',
  'backend/downloads'
];

dirsToCreate.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

console.log('\n🎉 Setup completed successfully!');
console.log('\nTo start the application:');
console.log('  npm run dev          # Start both backend and web servers');
console.log('  npm run server       # Start only the backend server');
console.log('  npm run web          # Start only the web server');
console.log('  npm run desktop      # Start the desktop application');
console.log('\nFor more information, check the README.md file.'); 