const fs = require('fs');
const files = [
  'd:/Kuliah/magang/Magang_Bakeuda/frontend-bakeuda/src/pages/FormulirSPOP.jsx',
  'd:/Kuliah/magang/Magang_Bakeuda/frontend-bakeuda/src/pages/FormulirLSPOP.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace section headers
    content = content.replaceAll('font-section-header text-section-header font-bold text-on-surface-variant uppercase', 'font-display-sm text-primary font-bold uppercase');
    fs.writeFileSync(file, content);
  }
});
console.log('Done headers');
