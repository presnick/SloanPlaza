import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const password = process.env.SITE_PASSWORD;
const file = path.resolve('dist/members/index.html');
const tempFile = path.resolve('dist/members/encrypted.html');

console.log('Build script running.');
console.log('Checking for SITE_PASSWORD...');

if (!password) {
  console.log('⚠️  SITE_PASSWORD is empty or undefined.');
  console.log('Dump of (safe) env vars:', Object.keys(process.env));
  process.exit(0);
} else {
    console.log('✅ SITE_PASSWORD found (length: ' + password.length + ')');
}

if (!fs.existsSync(file)) {
  console.error(`❌ Expected file to encrypt not found: ${file}`);
  process.exit(1);
}

console.log(`🔒 Encrypting ${file}...`);
try {
  // Read original content summary
  const originalContent = fs.readFileSync(file, 'utf8');
  console.log(`📄 Original content start: ${originalContent.substring(0, 50)}...`);

  // STRATEGY: Change directory to the target folder to avoid path issues
  const targetDir = path.dirname(file);
  const targetFile = path.basename(file);
  process.chdir(targetDir);

  // Encrypt in place (default behavior creates [filename]_encrypted.html)
  // We use npx to ensure we get the right binary, or local path if npx fails
  const cmd = `npx staticrypt "${targetFile}" -p "${password}" --short`;
  
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (e) {
    console.error('❌ Encryption command failed.');
    process.exit(1);
  }

  const expectedOutput = 'encrypted/index.html';

  // Verify output exists and rename
  if (fs.existsSync(expectedOutput)) {
      console.log('✅ Encrypted file created: ' + expectedOutput);
      // We are in the dir, so just rename.
      // Rename effectively moves it out of the subdir and overwrites original.
      fs.renameSync(expectedOutput, targetFile);
      
      // Clean up the empty directory
      try {
        fs.rmdirSync('encrypted');
      } catch (e) {
        // Ignore cleanup errors
      }
  } else if (fs.existsSync('index_encrypted.html')) {
      // Fallback in case behavior changes
      console.log('✅ Encrypted file created (fallback): index_encrypted.html');
      fs.renameSync('index_encrypted.html', targetFile);
  } else {
      console.error(`❌ Expected encrypted file not found in 'encrypted/' or as 'index_encrypted.html'`);
      process.exit(1);
  }

  // Read new content summary
  const newContent = fs.readFileSync(file, 'utf8');
  console.log(`📄 New content start: ${newContent.substring(0, 50)}...`);

  if (newContent === originalContent) {
    console.error('❌ Error: File content did not change!');
    process.exit(1);
  }
  
  console.log('✅ Encryption complete and verified.');
} catch (e) {
  console.error('❌ Encryption failed.', e);
  process.exit(1);
}
