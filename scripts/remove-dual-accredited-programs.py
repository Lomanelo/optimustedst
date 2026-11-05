# -*- coding: utf-8 -*-
from __future__ import annotations

import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JPATH = os.path.join(ROOT, "public", "programs", "index.json")
BDIR = os.path.join(ROOT, "public", "brochures")
PDIR = os.path.join(ROOT, "public", "ProgramPhotos")


def is_dual_accredited(p: dict) -> bool:
    if p.get("exclusive"):
        return False
    slug = (p.get("slug") or "").lower()
    title = (p.get("title") or "").lower()
    if slug.startswith("dual-accredited-"):
        return True
    if slug.startswith("exclusive") or "exclusive" in title:
        return False
    if (p.get("programType") or "").upper() == "BBA":
        return False
    if re.search(r"\bdual[- ]accredited\b", title) or re.search(r"\bdual mba\b", title):
        return True
    if slug.startswith("triple-accredited-mba") or slug.startswith("triple-mba-in-"):
        return True
    return False


def main() -> None:
    programs = json.loads(open(JPATH, encoding="utf-8").read())
    keep, drop = [], []
    for p in programs:
        if is_dual_accredited(p):
            drop.append(p)
        else:
            keep.append(p)

    open(JPATH, "w", encoding="utf-8", newline="\n").write(
        json.dumps(keep, ensure_ascii=False, indent=2) + "\n"
    )

    def asset_path(val: str) -> str:
        return os.path.normcase(os.path.normpath(os.path.join(ROOT, "public", val.lstrip("/"))))

    used_files = set()
    for p in keep:
        for key in ("brochure_en", "brochure_ar", "thumbnail"):
            val = p.get(key) or ""
            if val.startswith("/"):
                used_files.add(asset_path(val))

    drop_files = set()
    for p in drop:
        for key in ("brochure_en", "brochure_ar", "thumbnail"):
            val = p.get(key) or ""
            if val.startswith("/"):
                drop_files.add(asset_path(val))

    extras = [
        os.path.join(BDIR, "MBA In Entrepreneurial Leadership and Innovation.pdf"),
        os.path.join(BDIR, "MBA In Strategic Mnangement.pdf"),
        os.path.join(BDIR, "ar-mba-entrepreneurial-leadership-and-innovation.pdf"),
        os.path.join(BDIR, "ar-mba-strategic-mnangement.pdf"),
    ]

    print("KEPT", len(keep))
    for p in keep:
        print(" ", p.get("slug"))
    print("REMOVED", len(drop))
    for p in drop:
        print(" ", p.get("slug"))

    deleted = []
    for path in list(drop_files) + extras:
        path = os.path.normpath(path)
        if os.path.isfile(path) and os.path.normcase(path) not in used_files:
            os.remove(path)
            deleted.append(os.path.relpath(path, ROOT))
    if os.path.isdir(PDIR):
        for name in os.listdir(PDIR):
            path = os.path.join(PDIR, name)
            if not os.path.isfile(path):
                continue
            if os.path.normcase(os.path.normpath(path)) in used_files:
                continue
            lower = name.lower()
            if "dual-accredited" in lower or "triple accredited mba" in lower:
                os.remove(path)
                deleted.append(os.path.relpath(path, ROOT))

    print("DELETED_ASSETS", len(deleted))
    for name in deleted:
        print(" ", name)


if __name__ == "__main__":
    main()
