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
    execSync('./node_modules/.bin/staticrypt --version', { stdio: 'inherit' });
  } catch (e) {
    console.log('⚠️ Could not run local staticrypt. Trying npx...');
  }

  // Encrypt using shell redirection to ensure we capture output
  // Using the temp file approach again, but via redirection
  const cmd = `./node_modules/.bin/staticrypt "${file}" -p "${password}" --short > "${tempFile}"`;
  console.log(`RUNNING: ${cmd.replace(password, '******')}`);
  
  try {
      execSync(cmd, { stdio: 'inherit' }); // 'inherit' allows stderr to show up
  } catch (e) {
      // If local binary fails, try global npx (but still with redirection)
       console.log('⚠️ Local binary failed, trying npx...');
       execSync(`npx staticrypt "${file}" -p "${password}" --short > "${tempFile}"`, { stdio: 'inherit' });
  }

  // DEBUG: List files
  console.log('📂 Recursive directory listing of dist:');
  execSync(`ls -R ${path.resolve('dist')}`, { stdio: 'inherit' });

  // Verify temp file exists and has content
  if (fs.existsSync(tempFile) && fs.statSync(tempFile).size > 0) {
      console.log('✅ Encrypted file created at: ' + tempFile);
      fs.renameSync(tempFile, file);
  } else {
      console.error(`❌ Expected encrypted file not found: ${tempFile}`);
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
