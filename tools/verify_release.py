"""Portable read-only release hash/path verifier. Python standard library only."""
from pathlib import Path,PurePosixPath
import hashlib,json,sys
def verify(root):
 root=Path(root).resolve();m=json.loads((root/'ARCHIVE-MANIFEST.json').read_text(encoding='utf-8'));expected={};folded=set()
 for f in m['files']:
  rel=f['path'];p=PurePosixPath(rel);assert not p.is_absolute()and'..'not in p.parts and'\\'not in rel,rel
  assert rel.casefold()not in folded,rel;folded.add(rel.casefold());expected[rel]=f
 actual={p.relative_to(root).as_posix():p for p in root.rglob('*')if p.is_file()and p.relative_to(root).as_posix()not in ['ARCHIVE-MANIFEST.json','ARCHIVE-SHA256SUMS.txt']}
 assert set(actual)==set(expected),(set(actual)-set(expected),set(expected)-set(actual))
 for rel,p in actual.items():
  assert p.stat().st_size==expected[rel]['bytes'],rel
  with p.open('rb')as h:assert hashlib.file_digest(h,'sha256').hexdigest()==expected[rel]['sha256'],rel
 sums={}
 for line in(root/'ARCHIVE-SHA256SUMS.txt').read_text(encoding='utf-8').splitlines():
  h,rel=line.split('  ',1);assert rel not in sums;sums[rel]=h
 assert set(sums)==set(actual)|{'ARCHIVE-MANIFEST.json'}
 for rel,h in sums.items():
  with(root/rel).open('rb')as f:assert hashlib.file_digest(f,'sha256').hexdigest()==h,rel
 return{'status':'PASS','release':m['release'],'files':len(actual)+2,'bytes':sum(p.stat().st_size for p in root.rglob('*')if p.is_file())}
if __name__=='__main__':print(json.dumps(verify(Path(__file__).resolve().parents[1]if len(sys.argv)==1 else Path(sys.argv[1])),indent=2))
