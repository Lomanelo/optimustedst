import fs from 'fs/promises';
import path from 'path';

type Program = Record<string, any> & { id: string; title?: string; title_ar?: string; programType?: string; speciality?: string };

const ROOT = process.cwd();
const PROGRAMS_JSON = path.join(ROOT, 'public', 'programs', 'index.json');
const BROCHURES_DIR = path.join(ROOT, 'public', 'brochures');

const hasArabic = (s: string) => /[\u0600-\u06FF]/.test(s || '');

const stripPdf = (s: string) => (s || '').replace(/\.pdf$/i, '');

const normalizeLatin = (s: string) =>
  stripPdf(s)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[–—:_]+/g, ' ')
    .replace(/[()]/g, ' ')
    .replace(/&/g, ' and ')
    .replace(/\s+/g, ' ')
    .trim();

// Arabic-friendly normalization: remove diacritics, normalize alef/hamza/taa marbuta, and common spelling variants.
const normalizeArabic = (s: string) => {
  let t = stripPdf(s);
  // remove diacritics + tatweel
  t = t.replace(/[\u064B-\u065F\u0670\u0640]/g, '');
  // normalize alef + hamza forms
  t = t.replace(/[أإآ]/g, 'ا');
  // normalize taa marbuta -> haa
  t = t.replace(/ة/g, 'ه');
  // normalize yaa/alef maqsura
  t = t.replace(/ى/g, 'ي');
  // normalize hamza-on-chair
  t = t.replace(/ؤ/g, 'و').replace(/ئ/g, 'ي');
  // normalize Persian/Urdu "چ" to "ج" (to match ماچستير/ماجستير)
  t = t.replace(/چ/g, 'ج');
  // normalize common MBA spelling variants
  t = t.replace(/ماجيستير/g, 'ماجستير').replace(/ماجستير/g, 'ماجستير'); // idempotent
  // punctuation + whitespace
  t = t
    .replace(/[–—:_]+/g, ' ')
    .replace(/[()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return t;
};

const normalize = (s: string) => (hasArabic(s) ? normalizeArabic(s) : normalizeLatin(s));

const compact = (s: string) => normalize(s).replace(/\s+/g, '');

const stripAccredPrefixesEn = (t: string) =>
  (t || '')
    .replace(/^triple\s+accredited\s+/i, '')
    .replace(/^dual[-\s]?accredited\s+/i, '')
    .trim();

const stripAccredSuffixAr = (t: string) =>
  (t || '')
    // remove common suffix after dash like " - ثلاثي الإعتماد"
    .replace(/[-–—]\s*(ثلاثي|ثنائي).+$/i, '')
    .replace(/\s+/g, ' ')
    .trim();

async function main() {
  const raw = await fs.readFile(PROGRAMS_JSON, 'utf8');
  const programs: Program[] = JSON.parse(raw);

  const brochureFiles = (await fs.readdir(BROCHURES_DIR)).filter((f) => f.toLowerCase().endsWith('.pdf'));
  const brochureByNorm = new Map<string, string>(); // normalized -> filename
  const brochureByCompact = new Map<string, string>(); // compact normalized -> filename
  const arabicBrochures: string[] = [];
  for (const file of brochureFiles) {
    brochureByNorm.set(normalize(file), file);
    brochureByCompact.set(compact(file), file);
    if (hasArabic(file)) arabicBrochures.push(file);
  }

  const findBrochure = (candidates: string[]): string | '' => {
    for (const c of candidates) {
      const n = normalize(c);
      const hit = brochureByNorm.get(n);
      if (hit) return `/brochures/${hit}`;
      const hit2 = brochureByCompact.get(compact(c));
      if (hit2) return `/brochures/${hit2}`;
    }
    return '';
  };

  const guessArabicBrochure = (program: Program): string | '' => {
    const titleAr = (program.title_ar || '').toString();
    if (!titleAr) return '';

    const pt = (program.programType || '').toString().toUpperCase();
    const wantMBA = pt === 'MBA' || pt === 'BBA';
    const wantDBA = pt === 'DBA';

    const candNorm = normalizeArabic(titleAr);
    const candCompact = compact(titleAr);

    const candTokens = new Set(candNorm.split(' ').filter(Boolean));
    let bestFile = '';
    let bestScore = 0;

    for (const file of arabicBrochures) {
      // type gating
      const nf = normalizeArabic(file);
      if (wantMBA && !nf.includes('ماجستير')) continue;
      if (wantDBA && !nf.includes('دكتور')) continue;

      // token overlap score
      const ft = nf.split(' ').filter(Boolean);
      const fTokens = new Set(ft);
      let inter = 0;
      for (const tok of candTokens) if (fTokens.has(tok)) inter++;
      const denom = Math.max(candTokens.size, fTokens.size, 1);
      let score = inter / denom;

      // substring bump (compact)
      const fc = compact(file);
      if (fc.includes(candCompact) || candCompact.includes(fc)) score += 0.35;
      // small bump if contains key words that appear in title
      if (nf.includes('اداره') && candNorm.includes('اداره')) score += 0.05;
      if (nf.includes('الاعمال') && candNorm.includes('الاعمال')) score += 0.05;

      if (score > bestScore) {
        bestScore = score;
        bestFile = file;
      }
    }

    // threshold tuned for short titles like "دكتوراه التحول الرقمي"
    if (bestFile && bestScore >= 0.22) return `/brochures/${bestFile}`;
    return '';
  };

  const updated = programs.map((p) => {
    const title = p.title || '';
    const titleAr = p.title_ar || '';
    const pt = (p.programType || '').toString().toUpperCase();
    const speciality = (p.speciality || '').toString();

    // English candidates
    const baseTitle = stripAccredPrefixesEn(title);
    const expectedIn = pt && speciality ? `${pt} in ${speciality}` : '';
    const expectedInCaps = pt && speciality ? `${pt} In ${speciality}` : '';
    const expectedNoIn = pt && speciality ? `${pt} ${speciality}` : '';

    const enCandidates = [
      p.brochure_en ? p.brochure_en.toString().replace(/^\/brochures\//, '').replace(/\.pdf$/i, '') : '',
      expectedIn,
      expectedInCaps,
      expectedNoIn,
      baseTitle,
      baseTitle.replace(/\s+in\s+/i, ' in '),
      baseTitle.replace(/\s+in\s+/i, ' In '),
      baseTitle.replace(/\s+In\s+/i, ' in '),
    ].filter(Boolean) as string[];

    // Arabic candidates
    const arCandidates = [
      p.brochure_ar ? p.brochure_ar.toString().replace(/^\/brochures\//, '').replace(/\.pdf$/i, '') : '',
      titleAr,
      stripAccredSuffixAr(titleAr),
    ].filter(Boolean) as string[];

    const brochure_en = findBrochure(enCandidates);
    let brochure_ar = findBrochure(arCandidates);
    if (!brochure_ar) {
      brochure_ar = guessArabicBrochure(p);
    }

    return {
      ...p,
      brochure_en: brochure_en || p.brochure_en || '',
      brochure_ar: brochure_ar || p.brochure_ar || '',
    };
  });

  await fs.writeFile(PROGRAMS_JSON, JSON.stringify(updated, null, 2), 'utf8');
  // eslint-disable-next-line no-console
  console.log(`Synced brochures for ${updated.length} programs -> public/programs/index.json`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


