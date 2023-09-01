const fs = require('fs');
const path = require('path');

const files = [
  { from: 'index.js', to: 'index.js' },
];

const destPath = path.resolve(__dirname, '../dist');

if (fs.existsSync(destPath)) {
  fs.rmSync(destPath, { recursive: true, force: true });
}
fs.mkdirSync(destPath);

files.forEach((file) => {
  fs.copyFileSync(
    path.resolve(__dirname, '../src', file.from),
    path.resolve(__dirname, '../dist', file.to),
  );
});
