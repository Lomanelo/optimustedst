/**
 * Firebase Deployment Script
 * 
 * This script helps deploy Firebase resources including:
 * - Firestore security rules
 * - Storage security rules
 * - Firebase Hosting
 * 
 * Usage: 
 * 1. Install Firebase CLI if not already installed:
 *    npm install -g firebase-tools
 * 
 * 2. Login to Firebase:
 *    firebase login
 * 
 * 3. Run the script:
 *    node deploy-firebase.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the current project directory
const projectDir = process.cwd();

// Check if firebase.json exists
if (!fs.existsSync(path.join(projectDir, 'firebase.json'))) {
  console.error('firebase.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Check if user is logged in to Firebase
try {
  console.log('Checking Firebase login status...');
  execSync('firebase projects:list', { stdio: 'inherit' });
} catch (error) {
  console.error('You are not logged in to Firebase. Please run "firebase login" first.');
  process.exit(1);
}

// Deploy Firestore rules
try {
  console.log('\n🔒 Deploying Firestore security rules...');
  execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
} catch (error) {
  console.error('Error deploying Firestore rules:', error.message);
}

// Deploy Storage rules
try {
  console.log('\n🔒 Deploying Storage security rules...');
  execSync('firebase deploy --only storage', { stdio: 'inherit' });
} catch (error) {
  console.error('Error deploying Storage rules:', error.message);
}

// Build the project
try {
  console.log('\n🏗️ Building the project...');
  execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('Error building the project:', error.message);
  process.exit(1);
}

// Deploy hosting
try {
  console.log('\n🚀 Deploying to Firebase Hosting...');
  execSync('firebase deploy --only hosting', { stdio: 'inherit' });
} catch (error) {
  console.error('Error deploying to hosting:', error.message);
}

console.log('\n✅ Deployment complete!');
console.log('\nIf you experience permission issues, please check the following:');
console.log('1. Make sure your Firebase project ID in .firebaserc matches your actual project');
console.log('2. Verify you have the correct permissions in the Firebase Console');
console.log('3. Check the Firebase Authentication method is enabled for Email/Password');
console.log('4. Make sure your Cloud Firestore database is created in the Firebase Console');
console.log('\nFor more information, visit https://firebase.google.com/docs'); 