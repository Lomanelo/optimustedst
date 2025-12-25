import fs from 'fs/promises';
import path from 'path';

type Program = Record<string, any> & { id: string; title?: string; title_ar?: string; programType?: string };

const ROOT = process.cwd();
const PROGRAMS_JSON = path.join(ROOT, 'public', 'programs', 'index.json');

const stripPrefixes = (t: string) =>
  (t || '')
    .replace(/^triple\s+accredited\s+/i, '')
    .replace(/^dual[-\s]?accredited\s+/i, '')
    .trim();

const normalizeSpaces = (s: string) => (s || '').replace(/\s+/g, ' ').trim();

const titleToRawSpeciality = (title: string) => {
  const base = normalizeSpaces(stripPrefixes(title));
  // common forms:
  // "MBA In X", "DBA In X", "BBA In X"
  const inMatch = base.match(/\b(?:MBA|DBA|BBA)\s+In\s+(.+)$/i);
  if (inMatch?.[1]) return normalizeSpaces(inMatch[1]);

  // "DBA Strategic Management"
  const dbaLoose = base.match(/\bDBA\s+(.+)$/i);
  if (dbaLoose?.[1]) return normalizeSpaces(dbaLoose[1]);

  return '';
};

// Canonical mapping for consistent filters/translations
const CANON: Record<
  string,
  { speciality: string; speciality_ar: string }
> = {
  'digital transformation': { speciality: 'Digital Transformation', speciality_ar: 'التحول الرقمي' },
  'strategic management': { speciality: 'Strategic Management', speciality_ar: 'الإدارة الاستراتيجية' },
  'healthcare management': { speciality: 'Healthcare Management', speciality_ar: 'إدارة الرعاية الصحية' },
  'project management': { speciality: 'Project Management', speciality_ar: 'إدارة المشاريع' },
  'accounting and finance': { speciality: 'Accounting & Finance Management', speciality_ar: 'إدارة المحاسبة والمالية' },
  'accounting & finance': { speciality: 'Accounting & Finance Management', speciality_ar: 'إدارة المحاسبة والمالية' },
  'marketing management': { speciality: 'Marketing Management', speciality_ar: 'إدارة التسويق' },
  'logistics and supply chain management': { speciality: 'Logistics & Supply Chain Management', speciality_ar: 'إدارة اللوجستيات وسلسلة التوريد' },
  'logistics & supply chain management': { speciality: 'Logistics & Supply Chain Management', speciality_ar: 'إدارة اللوجستيات وسلسلة التوريد' },
  'human resource management': { speciality: 'Human Resources Management', speciality_ar: 'إدارة الموارد البشرية' },
  'human resources management': { speciality: 'Human Resources Management', speciality_ar: 'إدارة الموارد البشرية' },
  'quality management': { speciality: 'Quality Management', speciality_ar: 'إدارة الجودة' },
  'entrepreneurship and innovation': { speciality: 'Entrepreneurship & Innovation', speciality_ar: 'ريادة الأعمال والابتكار' },
  'entrepreneurship & innovation': { speciality: 'Entrepreneurship & Innovation', speciality_ar: 'ريادة الأعمال والابتكار' },
  'international business management': { speciality: 'International Business Management', speciality_ar: 'إدارة الأعمال الدولية' },
  'sports management': { speciality: 'Sports Management', speciality_ar: 'إدارة الرياضة' },
  'hospitality and events management': { speciality: 'Hospitality & Events Management', speciality_ar: 'إدارة الضيافة والفعاليات' },
  'hospitality & events management': { speciality: 'Hospitality & Events Management', speciality_ar: 'إدارة الضيافة والفعاليات' },

  // extra specialties present in your brochures
  'banking and finance': { speciality: 'Banking and Finance', speciality_ar: 'البنوك والتمويل' },
  'artificial intelligence': { speciality: 'Artificial Intelligence', speciality_ar: 'الذكاء الاصطناعي' },
  fintech: { speciality: 'Fintech', speciality_ar: 'التقنية المالية' },
  'islamic finance': { speciality: 'Islamic Finance', speciality_ar: 'التمويل الإسلامي' },
  'hospital management': { speciality: 'Hospital Management', speciality_ar: 'إدارة المستشفيات' },
  'strategic economic leadership': { speciality: 'Strategic Economic Leadership', speciality_ar: 'القيادة الاقتصادية الاستراتيجية' },
  'strategic thinking': { speciality: 'Strategic Thinking', speciality_ar: 'التفكير الإستراتيجي' },
  'risk management': { speciality: 'Risk Management', speciality_ar: 'إدارة المخاطر' },
  'business consultation': { speciality: 'Business Consultation', speciality_ar: 'الاستشارات الإدارية' },
  'business psychology': { speciality: 'Business Psychology', speciality_ar: 'علم النفس الإداري' },
};

const keyOf = (s: string) =>
  normalizeSpaces(s)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeRaw = (raw: string) => {
  let r = normalizeSpaces(raw);
  // standardize some common title variants
  r = r.replace(/\band\b/gi, 'and');
  r = r.replace(/\bAnd\b/g, 'and');
  return r;
};

async function main() {
  const raw = await fs.readFile(PROGRAMS_JSON, 'utf8');
  const programs: Program[] = JSON.parse(raw);

  let changed = 0;

  const updated = programs.map((p) => {
    const title = (p.title || '').toString();
    const programType = (p.programType || '').toString().toUpperCase();

    // BBA always business administration unless explicitly set otherwise
    if (programType === 'BBA') {
      const next = {
        ...p,
        speciality: 'Business Administration',
        speciality_ar: p.speciality_ar || 'إدارة الأعمال',
      };
      if (p.speciality !== next.speciality || p.speciality_ar !== next.speciality_ar) changed++;
      return next;
    }

    const rawSpec = normalizeRaw(titleToRawSpeciality(title));
    const key = keyOf(rawSpec);

    const canon = CANON[key];
    if (canon) {
      const next = {
        ...p,
        speciality: canon.speciality,
        speciality_ar: canon.speciality_ar,
      };
      if (p.speciality !== next.speciality || p.speciality_ar !== next.speciality_ar) changed++;
      return next;
    }

    // If we can’t map, at least ensure speciality isn’t clearly wrong:
    // if title contains a recognizable speciality but current speciality doesn't match, set to rawSpec.
    if (rawSpec && (!p.speciality || keyOf(p.speciality) !== key)) {
      const next = {
        ...p,
        speciality: rawSpec,
        speciality_ar: p.speciality_ar || '',
      };
      if (p.speciality !== next.speciality) changed++;
      return next;
    }

    return p;
  });

  await fs.writeFile(PROGRAMS_JSON, JSON.stringify(updated, null, 2), 'utf8');
  // eslint-disable-next-line no-console
  console.log(`Synced specialities for programs. Updated: ${changed}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});




