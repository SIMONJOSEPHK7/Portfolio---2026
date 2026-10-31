const fs = require('fs');
const code = fs.readFileSync('script.js', 'utf8');
try {
  new Function(code);
  console.log('JS syntax OK');
} catch (e) {
  console.log('JS ERROR:', e.message);
}