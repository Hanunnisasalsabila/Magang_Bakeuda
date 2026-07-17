const fs = require('fs');
let f = fs.readFileSync('src/pages/FormulirLSPOP.jsx', 'utf8');
f = f.replace(/type="number"(\s+)value=/g, 'type="number" onWheel={(e) => e.target.blur()}$1value=');
fs.writeFileSync('src/pages/FormulirLSPOP.jsx', f);
console.log('Done');
