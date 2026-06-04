import { readFileSync, writeFileSync } from 'fs';

const backendUrl = process.env.BACKEND_URL;
if (!backendUrl) {
  console.log('⚠️  No BACKEND_URL set — keeping localhost');
  process.exit(0);
}

let html = readFileSync('index.html', 'utf8');
html = html.replace(
  "window.BACKEND_URL='http://localhost:3001'",
  `window.BACKEND_URL='${backendUrl}'`
);
writeFileSync('index.html', html);
console.log('✓ BACKEND_URL injected:', backendUrl);
