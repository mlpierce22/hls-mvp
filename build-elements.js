const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './docs/runtime-es5.js',
    './docs/polyfills-es5.js',
    './docs/scripts.js',
    './docs/main-es5.js',
  ];

  await fs.ensureDir('elements');
  await concat(files, 'elements/elements.js');
})();