import { execSync } from 'child_process';
import fs from 'fs';

const password = process.env.SITE_PASSWORD;
const file = 'dist/members/index.html';

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
  // Overwrite the file with the encrypted version
  // --short flag prevents interactive prompt for short passwords
  execSync(`npx staticrypt "${file}" -p "${password}" -o "${file}" --short`, { stdio: 'inherit' });
  console.log('✅ Encryption complete.');
} catch (e) {
  console.error('❌ Encryption failed.', e);
  process.exit(1);
}
