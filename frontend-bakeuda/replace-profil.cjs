const fs = require('fs');
const file = 'd:/Kuliah/magang/Magang_Bakeuda/frontend-bakeuda/src/pages/ProfilPengguna.jsx';

if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replaceAll('text-2xl font-bold text-gray-900', 'font-display-md font-bold text-on-surface');
  content = content.replaceAll('text-sm text-gray-500 font-medium', 'font-label-md text-on-surface-variant');
  content = content.replaceAll('text-sm font-semibold text-gray-600', 'font-label-sm font-bold text-on-surface-variant uppercase');
  content = content.replaceAll('text-base font-bold text-gray-900', 'font-body-md text-on-surface font-bold');
  content = content.replaceAll('text-base font-mono font-bold text-gray-900', 'font-data-mono font-bold text-on-surface');
  
  // Headers in ProfilPengguna
  content = content.replaceAll('text-xl font-bold text-gray-900', 'font-display-sm text-primary font-bold uppercase');
  
  // Card backgrounds
  content = content.replaceAll('bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm', 'bg-surface-container-lowest p-6 md:p-8 rounded-xl border border-outline-variant shadow-sm');
  
  // Inputs
  content = content.replaceAll('className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-600"', 'className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-low text-on-surface-variant font-data-mono"');
  content = content.replaceAll('className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"', 'className="w-full px-4 py-2 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-on-surface"');
  
  // Buttons
  content = content.replaceAll('bg-blue-600 hover:bg-blue-700 text-white', 'bg-primary hover:bg-primary-dark text-on-primary');
  content = content.replaceAll('border border-gray-300 bg-white text-gray-700 hover:bg-gray-50', 'bg-background border border-outline-variant text-primary hover:bg-surface-container-lowest active:bg-primary/10');

  fs.writeFileSync(file, content);
}
console.log('Done profil');
