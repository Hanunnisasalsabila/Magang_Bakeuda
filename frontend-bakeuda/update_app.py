import re

path = '/home/afifhnrstwn/Coding/Magang/Magang_Bakeuda/frontend-bakeuda/src/App.jsx'
with open(path, 'r') as f:
    content = f.read()

# Import DetailSubjekPajak
if 'DetailSubjekPajak' not in content:
    content = re.sub(
        r"(import DaftarSubjekPajak from '\./pages/DaftarSubjekPajak';)",
        r"\1\nimport DetailSubjekPajak from './pages/DetailSubjekPajak';",
        content
    )

# Add route
if '<Route path="/detail-subjek/:nik" element={<DetailSubjekPajak />} />' not in content:
    content = re.sub(
        r"(<Route path=\"/daftar-subjek\" element={<DaftarSubjekPajak />} />)",
        r"\1\n        <Route path=\"/detail-subjek/:nik\" element={<DetailSubjekPajak />} />",
        content
    )

with open(path, 'w') as f:
    f.write(content)
