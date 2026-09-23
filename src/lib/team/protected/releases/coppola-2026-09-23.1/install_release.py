#!/usr/bin/env python3
"""Install an explicitly selected, checksum-pinned release without overwriting files."""
import argparse, hashlib, json, os, shutil, stat, tempfile, urllib.request, zipfile
from pathlib import Path, PurePosixPath

def digest(p):
    h=hashlib.sha256()
    with p.open('rb') as f:
        for b in iter(lambda:f.read(1048576),b''):h.update(b)
    return h.hexdigest()

def install(archive,expected,destination):
    archive=Path(archive).resolve(strict=True);destination=Path(destination).expanduser().absolute()
    if digest(archive)!=expected:raise ValueError('Release checksum mismatch; no files installed')
    destination.mkdir(parents=True,exist_ok=True)
    if destination.is_symlink():raise ValueError('Installation root must not be a link')
    with zipfile.ZipFile(archive) as z:
        total=0;entries=[];seen=set()
        for item in z.infolist():
            name=PurePosixPath(item.filename)
            if name.is_absolute() or '..' in name.parts or '\\' in item.filename or ':' in item.filename:raise ValueError('Unsafe archive path')
            mode=item.external_attr>>16
            if stat.S_ISLNK(mode) or (stat.S_IFMT(mode) not in (0,stat.S_IFREG,stat.S_IFDIR)):raise ValueError('Archive links/special files rejected')
            if item.is_dir():continue
            if item.filename in seen:raise ValueError('Duplicate archive entry')
            seen.add(item.filename);total+=item.file_size
            if total>600_000_000 or len(seen)>1000:raise ValueError('Archive exceeds permitted size')
            out=destination.joinpath(*name.parts)
            for parent in [out,*out.parents]:
                if parent==destination.parent:break
                if parent.is_symlink():raise ValueError('Installation path contains a link')
            content=z.read(item)
            if out.exists() and (not out.is_file() or out.read_bytes()!=content):raise ValueError('Local file differs; preserved: '+str(name))
            entries.append((out,content))
        for out,content in entries:
            if not out.exists():
                out.parent.mkdir(parents=True,exist_ok=True)
                with out.open('xb') as f:f.write(content)
    return {'destination':str(destination),'sha256_verified':True,'files':len(entries),'existing_files_preserved':True,'runtime_and_accounts':'not yet verified'}

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('archive');p.add_argument('sha256');p.add_argument('destination');a=p.parse_args()
    try:print(json.dumps(install(a.archive,a.sha256,a.destination),indent=2))
    except Exception as e:p.exit(1,str(e)+'\n')
