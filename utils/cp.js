const fs = require('fs');

console.log('copy', process.argv[2], 'to', process.argv[3]);
fs.cpSync(process.argv[2], process.argv[3], { recursive: true, force: true });