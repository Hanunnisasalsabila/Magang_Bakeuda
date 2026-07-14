const fs = require('fs');
const files = [
  'd:/Kuliah/magang/Magang_Bakeuda/frontend-bakeuda/src/pages/FormulirSPOP.jsx',
  'd:/Kuliah/magang/Magang_Bakeuda/frontend-bakeuda/src/pages/FormulirLSPOP.jsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replaceAll('className="text-sm font-bold text-primary uppercase"', 'className="font-label-sm text-on-surface-variant font-bold uppercase"');
    content = content.replaceAll('className="text-sm font-bold text-primary"', 'className="font-label-sm text-on-surface-variant font-bold"');
    content = content.replaceAll('className="p-3 border border-outline-variant rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full', 'className="p-3 bg-background border border-outline-variant text-on-surface rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full');
    content = content.replaceAll('className="p-3 border border-outline-variant rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full tracking-widest', 'className="p-3 bg-background border border-outline-variant text-on-surface rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full tracking-widest');
    content = content.replaceAll('bg-blue-600 hover:bg-blue-700 text-white', 'bg-primary hover:bg-primary-dark text-on-primary');
    fs.writeFileSync(file, content);
  }
});
console.log('Done');
