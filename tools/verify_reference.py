import hashlib,json
from pathlib import Path
R=Path(__file__).resolve().parents[1]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
p=json.loads((R/'PROVENANCE.json').read_text())
for f in p['source_files']:assert sha(R/'vendor'/f['source'])==f['sha256'],f['source']
for f in p['visual_references']:assert sha(R/f['file'])==f['sha256'],f['file']
for name in ['index.html','reference.js','ui/liquid-glass.css','ui/liquid-tokens.css','ui/liquid-tokens.json','ui/lighting.js','ui/controls.js','ui/icons.json']:
 assert (R/name).is_file(),name
print('PASS: standalone Liquid Glass reference and all preserved source/image hashes')
