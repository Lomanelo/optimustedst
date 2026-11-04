# -*- coding: utf-8 -*-
from __future__ import annotations

import json
import os
import re
import shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BDIR = os.path.join(ROOT, "public", "brochures")
JPATH = os.path.join(ROOT, "public", "programs", "index.json")
DOWNLOADS = os.path.join(os.path.expanduser("~"), "Downloads")

PACK_REL = {
    "dba_en": os.path.join("DBA-20261104T172918Z-1-001", "DBA", "EN"),
    "dba_ar": os.path.join("DBA-20261104T172918Z-1-001", "DBA", "AR"),
    "mba_en": os.path.join("MBA-20261104T172914Z-1-001", "MBA", "EN"),
    "mba_ar": os.path.join("MBA-20261104T172914Z-1-001", "MBA", "AR"),
}

EN_MAP = {
    "dual-accredited-dba-in-strategic-management": "DBA In Strategic Management.pdf",
    "dual-accredited-dba-in-strategic-marketing": "DBA in Strategic Marketing.pdf",
    "dual-accredited-dba-in-quality-management": "DBA in Quality Management.pdf",
    "dual-accredited-dba-in-project-management": "DBA in Project Management.pdf",
    "dual-accredited-dba-in-logistics-and-supply-chain-management": "DBA in Logistics and Supply Chain Management.pdf",
    "dual-accredited-dba-in-human-resource-management": "DBA in Human Resource Management.pdf",
    "dual-accredited-dba-in-entrepreneurship-and-innovation": "DBA in Entrepreneurship and Innovation.pdf",
    "dual-accredited-dba-in-digital-transformation": "DBA In Digital Transformation.pdf",
    "dual-accredited-dba-in-business-consultation": "DBA In Business Consultation.pdf",
    "dual-accredited-dba-in-accounting-and-finance": "DBA in Accounting and Finance.pdf",
    "triple-mba-in-strategic-thinking": "MBA in Strategic thinking.pdf",
    "triple-mba-in-strategic-economic-leadership": "MBA in Strategic Economic Leadership.pdf",
    "triple-accredited-mba-in-quality-management": "MBA in Quality Management.pdf",
    "triple-accredited-mba-in-project-management": "MBA in Project Management.pdf",
    "triple-accredited-mba-in-marketing-management": "MBA in Marketing Management.pdf",
    "triple-accredited-mba-in-logistics-and-supply-chain-management": "MBA in Logistics and Supply Chain Management.pdf",
    "triple-accredited-mba-in-islamic-finance": "MBA in Islamic finance.pdf",
    "triple-accredited-mba-in-human-resource-management": "MBA in Human Resource Management.pdf",
    "triple-accredited-mba-in-hospital-management": "MBA in Hospital Management.pdf",
    "triple-accredited-mba-in-healthcare-management": "MBA in healthcare management.pdf",
    "triple-mba-in-fintech": "MBA in Fintech.pdf",
    "triple-accredited-mba-in-digital-transformation": "MBA in Digital Transformation.pdf",
    "triple-accredited-mba-in-banking-and-finance": "MBA in Banking and finance.pdf",
    "triple-accredited-mba-in-artificial-intelligence": "MBA in Artificial Intelligence.pdf",
    "triple-accredited-mba-in-accounting-and-finance": "MBA in Accounting and Finance.pdf",
}

EN_DEST = {
    "dual-accredited-dba-in-strategic-management": "DBA Strategic Management.pdf",
    "dual-accredited-dba-in-digital-transformation": "DBA in Digital Transformation.pdf",
    "dual-accredited-dba-in-business-consultation": "DBA in Business consultation.pdf",
}

AR_MAP = {
    "dual-accredited-dba-in-strategic-management": "دكتوراة  إداره الأعمال في الاداره الاستراتيجيه.pdf",
    "dual-accredited-dba-in-strategic-marketing": "دكتوراة إدارة الأعمال في التسويق الاستراتيجي.pdf",
    "dual-accredited-dba-in-quality-management": "دكتوراة إدارة الأعمال في إدارة الجودة.pdf",
    "dual-accredited-dba-in-project-management": "دكتوراة إدارة الأعمال في إدارة المشاريع.pdf",
    "dual-accredited-dba-in-logistics-and-supply-chain-management": "دكتوراة إدارة الأعمال في إدارة اللوجستيات وسلاسل الإمداد.pdf",
    "dual-accredited-dba-in-human-resource-management": "دكتوراة إدارة الأعمال في إدارة الموارد البشرية .pdf",
    "dual-accredited-dba-in-entrepreneurship-and-innovation": "دكتوراة إدارة الأعمال في ريادة الأعمال.pdf",
    "dual-accredited-dba-in-digital-transformation": "دكتوراة إداره الأعمال في التحول الرقمي.pdf",
    "dual-accredited-dba-in-business-consultation": "دكتوراة إداره الأعمال في استشارات الأعمال.pdf",
    "dual-accredited-dba-in-accounting-and-finance": "دكتوراة إدارة الأعمال في المحاسبة والتمويل.pdf",
    "triple-mba-in-strategic-thinking": "ماچستير في التفكير الإستراتيجي.pdf",
    "triple-mba-in-strategic-economic-leadership": "ماچستير في القيادة الاقتصادية الاستراتيجية.pdf",
    "triple-accredited-mba-in-quality-management": "ماچستير  إداره الأعمال في إداره الجوده.pdf",
    "triple-accredited-mba-in-project-management": "ماچستير  إداره الأعمال في إداره المشاريع.pdf",
    "triple-accredited-mba-in-marketing-management": "ماچستير  إداره الأعمال في إداره التسويق.pdf",
    "triple-accredited-mba-in-logistics-and-supply-chain-management": "ماچستير  إداره الأعمال في  اللوجستيات وسلسلة الإمداد.pdf",
    "triple-accredited-mba-in-islamic-finance": "ماجستير إدارة الأعمال في التمويل الإسلامي.pdf",
    "triple-accredited-mba-in-human-resource-management": "ماچستير إداره الأعمال في الموارد البشريه.pdf",
    "triple-accredited-mba-in-hospital-management": "ماچستير إداره الأعمال في إداره المستشفيات.pdf",
    "triple-accredited-mba-in-healthcare-management": "ماچستير في إدارة الرعاية الصحية.pdf",
    "triple-mba-in-fintech": "ماجيستير إدارة الأعمال في التقنية المالية.pdf",
    "triple-accredited-mba-in-digital-transformation": "ماچستير إداره الأعمال في التحول الرقمي.pdf",
    "triple-accredited-mba-in-banking-and-finance": "ماجستير إدارة الأعمال في البنوك والتمويل.pdf",
    "triple-accredited-mba-in-artificial-intelligence": "ماجستير إدارة الأعمال في الذكاء الاصطناعي.pdf",
    "triple-accredited-mba-in-accounting-and-finance": "ماچستير  إداره الأعمال في المحاسبة والمالية.pdf",
}

KEEP_UNCHANGED = {
    "Bachelor of Business Administration (BBA).pdf",
    "DBA in Business Psychology.pdf",
    "DBA in International Business Management.pdf",
    "DBA in Risk Management.pdf",
    "Exclusive Strategic DBA in hospitality and event  Management.pdf",
    "Exclusive Strategic DBA in sports Management.pdf",
    "MBA Exclusive hospitality and events Management.pdf",
    "MBA Exclusive Sports Management.pdf",
    "Triple MBA Exclusive hospitality and events Management.pdf",
    "Triple MBA Exclusive Sports Management.pdf",
    "ar-bachelor-of-business-administration-bba.pdf",
    "ar-dual-accredited-dba-in-business-psychology.pdf",
    "ar-dual-accredited-dba-in-international-business-management.pdf",
    "ar-dual-accredited-dba-in-risk-management.pdf",
    "ar-exclusive-strategic-dba-in-hospitality-and-event-management.pdf",
    "ar-exclusive-strategic-dba-in-sports-management.pdf",
    "ar-triple-mba-exclusive-hospitality-and-events-management.pdf",
    "ar-triple-mba-exclusive-sports-management.pdf",
    "MBA In Entrepreneurial Leadership and Innovation.pdf",
    "MBA In Strategic Mnangement.pdf",
}


def resolve_pack(rel: str) -> str:
    for base in (BDIR, DOWNLOADS):
        path = os.path.join(base, rel)
        if os.path.isdir(path):
            return path
    return ""


def copyf(src: str, dest_name: str) -> str:
    dest = os.path.join(BDIR, dest_name)
    shutil.copy2(src, dest)
    return dest_name


def has_arabic(s: str) -> bool:
    return bool(re.search(r"[\u0600-\u06FF]", s or ""))


def main():
    dba_en = resolve_pack(PACK_REL["dba_en"])
    dba_ar = resolve_pack(PACK_REL["dba_ar"])
    mba_en = resolve_pack(PACK_REL["mba_en"])
    mba_ar = resolve_pack(PACK_REL["mba_ar"])
    if not all([dba_en, dba_ar, mba_en, mba_ar]):
        raise SystemExit("New brochure packs not found")

    programs = json.loads(open(JPATH, encoding="utf-8").read())
    used = set()

    for p in programs:
        slug = p.get("slug") or p["id"]
        pt = (p.get("programType") or "").upper()
        en_src_name = EN_MAP.get(slug)
        if en_src_name:
            folder = dba_en if pt == "DBA" else mba_en
            src = os.path.join(folder, en_src_name)
            if not os.path.isfile(src):
                print("MISSING_EN", slug, src)
                continue
            dest_name = EN_DEST.get(slug, en_src_name)
            copyf(src, dest_name)
            p["brochure_en"] = f"/brochures/{dest_name}"
            used.add(os.path.normcase(dest_name))
            print(f"EN {slug} <- {en_src_name} => {dest_name} ({os.path.getsize(src)})")

        ar_src_name = AR_MAP.get(slug)
        if ar_src_name:
            folder = dba_ar if pt == "DBA" else mba_ar
            src = os.path.join(folder, ar_src_name)
            if not os.path.isfile(src):
                print("MISSING_AR", slug, ar_src_name)
                continue
            ascii_name = f"ar-{slug}.pdf"
            copyf(src, ascii_name)
            p["brochure_ar"] = f"/brochures/{ascii_name}"
            used.add(os.path.normcase(ascii_name))
            print(f"AR {slug} <- {ar_src_name} ({os.path.getsize(src)})")

    extras = [
        (os.path.join(mba_en, "MBA In Entrepreneurial Leadership and Innovation.pdf"), "MBA In Entrepreneurial Leadership and Innovation.pdf"),
        (os.path.join(mba_en, "MBA In Strategic Mnangement.pdf"), "MBA In Strategic Mnangement.pdf"),
        (os.path.join(mba_ar, "ماچستير إدارة الأعمال في القيادة الريادية والابتكار.pdf"), "ar-mba-entrepreneurial-leadership-and-innovation.pdf"),
        (os.path.join(mba_ar, "ماچستير في القيادة الاستراتيجيه.pdf"), "ar-mba-strategic-mnangement.pdf"),
    ]
    for src, dest in extras:
        if os.path.isfile(src):
            copyf(src, dest)
            used.add(os.path.normcase(dest))
            print("EXTRA", dest, os.path.getsize(src))

    open(JPATH, "w", encoding="utf-8", newline="\n").write(json.dumps(programs, ensure_ascii=False, indent=2) + "\n")

    for p in programs:
        for key in ("brochure_en", "brochure_ar"):
            val = p.get(key) or ""
            if val.startswith("/brochures/"):
                used.add(os.path.normcase(os.path.basename(val)))
    for name in KEEP_UNCHANGED:
        used.add(os.path.normcase(name))

    deleted = []
    for name in os.listdir(BDIR):
        path = os.path.join(BDIR, name)
        if name.startswith("DBA-20261104") or name.startswith("MBA-20261104"):
            if os.path.isdir(path):
                shutil.rmtree(path, ignore_errors=True)
                deleted.append(name + "/")
            continue
        if not os.path.isfile(path) or not name.lower().endswith(".pdf"):
            continue
        if os.path.normcase(name) in used:
            continue
        # Drop superseded native-script copies and leftover pack filenames.
        os.remove(path)
        deleted.append(name)

    print("JSON_OK")
    print("DELETED", len(deleted))
    for name in deleted:
        print("  -", name)


if __name__ == "__main__":
    main()
