const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.dart')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'lib'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Fix background and onBackground
    content = content.replace(/\.background/g, '.surface');
    content = content.replace(/\.onBackground/g, '.onSurface');

    // Remove unused _titles in home screens
    if (file.endsWith('home_admin_screen.dart') || file.endsWith('home_desa_screen.dart')) {
        content = content.replace(/  final List<String> _titles = \[\n    'Dashboard',\n    'Verifikasi SPOP',\n    'Master Data',\n  \];\n/g, '');
        content = content.replace(/  final List<String> _titles = \[\n    'Dashboard',\n    'Pelacakan Dokumen',\n    'SPOP',\n    'LSPOP',\n  \];\n/g, '');
    }

    // Remove TODO: Notifikasi
    content = content.replace(/\/\/ TODO: Notifikasi/g, '');

    fs.writeFileSync(file, content);
});

console.log('Fixed more lints!');
