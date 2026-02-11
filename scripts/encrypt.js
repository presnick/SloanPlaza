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

  // Debug: check tool availability
  try {
    console.log('🔎 Checking staticrypt version:');
    execSync('../../node_modules/.bin/staticrypt --version', { stdio: 'inherit' });
  } catch (e) {
    console.log('⚠️ Could not run local staticrypt.');
  }

  // STRATEGY: Change directory to the target folder to avoid path issues
  const targetDir = path.dirname(file);
  const targetFile = path.basename(file); // index.html
  console.log(`📂 Changing working directory to: ${targetDir}`);
  process.chdir(targetDir);

  // Encrypt in place (default behavior creates [filename]_encrypted.html)
  // We use npx to ensure we get the right binary, or local path if npx fails
  // simpler command: npx staticrypt index.html -p "..." --short
  const cmd = `npx staticrypt "${targetFile}" -p "${password}" --short`;
  console.log(`RUNNING: ${cmd.replace(password, '******')}`);
  
  execSync(cmd, { stdio: 'inherit' });

  const expectedOutput = 'index_encrypted.html';

  // DEBUG: List files in current dir
  console.log('📂 Directory listing of current dir:');
  execSync('ls -la', { stdio: 'inherit' });

  // Verify output exists and rename
  if (fs.existsSync(expectedOutput)) {
      console.log('✅ Encrypted file created: ' + expectedOutput);
      // We are in the dir, so just rename
      fs.renameSync(expectedOutput, targetFile);
  } else {
      console.error(`❌ Expected encrypted file not found: ${expectedOutput}`);
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
