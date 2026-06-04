const fs = require('fs');

const backendUrl = process.env.BACKEND_URL;
if (!backendUrl) {
  console.log('⚠️  No BACKEND_URL set — keeping localhost for local dev');
  process.exit(0);
}

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(
  "window.BACKEND_URL='http://localhost:3001'",
  `window.BACKEND_URL='${backendUrl}'`
);
fs.writeFileSync('index.html', html);
console.log('✓ BACKEND_URL injected:', backendUrl);
