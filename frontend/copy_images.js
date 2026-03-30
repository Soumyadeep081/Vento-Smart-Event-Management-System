const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\91620\\.gemini\\antigravity\\brain\\0b27d641-ab7e-4b54-ac80-856b892c8d1d\\media__1774546244754.png';
const dest = 'c:\\Users\\91620\\vento\\frontend\\public\\hero_vibe.png';

try {
  fs.copyFileSync(src, dest);
  console.log('Successfully copied image to ' + dest);
} catch (err) {
  console.error('Error copying image:', err);
}
