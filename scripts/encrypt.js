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

  // Encrypt in place (default behavior creates [filename]_encrypted.html)
  // We remove the -o flag to avoid path issues
  execSync(`npx staticrypt "${file}" -p "${password}" --short`, { stdio: 'inherit' });

  // The default output filename is file path with _encrypted before extension
  // e.g. dist/members/index_encrypted.html
  const encryptedDefaultFile = path.resolve('dist/members/index_encrypted.html');

  // DEBUG: List files to see what staticrypt actually created
  console.log('📂 Recursive directory listing of dist:');
  execSync(`ls -R ${path.resolve('dist')}`, { stdio: 'inherit' });

  // Move the default output file to original file
  if (fs.existsSync(encryptedDefaultFile)) {
      fs.renameSync(encryptedDefaultFile, file);
  } else {
      console.error(`❌ Expected default encrypted file not found: ${encryptedDefaultFile}`);
      // Fallback: maybe it's just 'encrypted.html'? Let's check the listing.
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
