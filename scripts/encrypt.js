import { execSync } from 'child_process';
import fs from 'fs';

const password = process.env.SITE_PASSWORD;
// We encrypt the 'members' index page.
const file = 'dist/members/index.html';

if (!password) {
  console.log('⚠️  SITE_PASSWORD not set. Skipping encryption (development mode).');
  process.exit(0);
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
