import re

path = '/home/afifhnrstwn/Coding/Magang/Magang_Bakeuda/frontend-bakeuda/src/pages/DaftarSubjekPajak.jsx'
with open(path, 'r') as f:
    content = f.read()

content = content.replace(
    """<button
                        title="Detail Subjek"
                        className="px-3 py-1.5 flex items-center justify-center gap-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors mx-auto text-sm font-semibold"
                      >""",
    """<button
                        onClick={() => navigate(`/detail-subjek/${obj.nik}`)}
                        title="Detail Subjek"
                        className="px-3 py-1.5 flex items-center justify-center gap-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors mx-auto text-sm font-semibold"
                      >"""
)

with open(path, 'w') as f:
    f.write(content)
