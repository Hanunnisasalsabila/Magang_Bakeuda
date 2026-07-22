const fs = require('fs');
const file = 'frontend-bakeuda/src/pages/Spop/Step4DataBangunan.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/type=\"number\"\s*onWheel=\{\(e\) => e\.target\.blur\(\)\}/g, 'type="text" inputMode="decimal"');
content = content.replace(/onChange=\{\(?(e)?\)?\s*=>\s*handleTextChange\('([^']+)',\s*e\)\}/g, "onChange={(e) => handleTextChange('$2', { target: { value: e.target.value.replace(/[^0-9.]/g, '') } })}");

fs.writeFileSync(file, content, 'utf8');
console.log("Replaced successfully!");
