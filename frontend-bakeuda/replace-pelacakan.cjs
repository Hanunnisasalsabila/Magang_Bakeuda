const fs = require('fs');
const file = 'd:/Kuliah/magang/Magang_Bakeuda/frontend-bakeuda/src/pages/PelacakanDokumen.jsx';

if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replaceAll('text-display-sm ', '');
  content = content.replaceAll('text-headline-md ', '');
  content = content.replaceAll('className="text-on-surface-variant text-sm mt-1"', 'className="font-label-sm text-on-surface-variant mt-1"');
  content = content.replaceAll('className="text-sm text-on-surface-variant mt-1 italic"', 'className="font-label-sm text-on-surface-variant mt-1 italic"');
  fs.writeFileSync(file, content);
}
console.log('Done pelacakan');
