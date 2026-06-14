const fs = require('fs');
const path = require('path');

const env = process.argv[2];

if (env !== 'waitlist' && env !== 'brand') {
	console.error('Invalid environment. Must be "waitlist" or "brand"');
	process.exit(1);
}

const rootDir = path.resolve(__dirname, '..');

const wranglerSrc = path.join(rootDir, `wrangler.${env}.jsonc`);
const wranglerDest = path.join(rootDir, 'wrangler.jsonc');

const llmSrc = path.join(rootDir, 'public', `llm.${env}.txt`);
const llmDest = path.join(rootDir, 'public', 'llm.txt');

try {
	fs.copyFileSync(wranglerSrc, wranglerDest);
	console.log(`Copied ${path.basename(wranglerSrc)} to wrangler.jsonc`);
	
	fs.copyFileSync(llmSrc, llmDest);
	console.log(`Copied ${path.basename(llmSrc)} to public/llm.txt`);
} catch (error) {
	console.error('Failed to copy configuration files:', error);
	process.exit(1);
}
