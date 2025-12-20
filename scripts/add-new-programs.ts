import fs from 'fs/promises';
import path from 'path';

type Program = Record<string, any> & { id: string };

const ROOT = process.cwd();
const PROGRAMS_JSON = path.join(ROOT, 'public', 'programs', 'index.json');

const slugify = (s: string) =>
  (s || '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

function upsertProgram(list: Program[], program: Program) {
  const idx = list.findIndex((p) => p.id === program.id || (p.slug && program.slug && p.slug === program.slug));
  if (idx === -1) {
    list.push(program);
    return;
  }
  list[idx] = {
    ...list[idx],
    ...program
  };
}

async function main() {
  const raw = await fs.readFile(PROGRAMS_JSON, 'utf8');
  const programs: Program[] = JSON.parse(raw);

  // 1) BBA
  {
    const title = 'Bachelor of Business Administration (BBA)';
    const id = slugify(title);
    upsertProgram(programs, {
      id,
      slug: id,
      title,
      title_ar: 'بكالوريوس إداره الأعمال',
      shortDescription:
        "An internationally recognized online bachelor’s degree designed for growth without disrupting your lifestyle or daily commitments.",
      shortDescription_ar:
        'بكالوريوس أونلاين مرن ومعترف به دولياً مصمم للنمو المهني دون تعطيل نمط حياتك أو التزاماتك اليومية.',
      description:
        "Pursuing an internationally accredited online bachelor’s degree is a strategic move for anyone looking to grow in Saudi Arabia’s fast-evolving market. Through a combination of theory and practice, learners develop analytical skills, practical business insight, and adaptability needed for today’s competitive environment. Built on global academic standards, the curriculum covers core subjects such as Principles of Management, Business Mathematics, Organizational Behavior, Marketing, and Strategic Management, alongside applied areas like Financial Accounting and Business Statistics.",
      description_ar:
        'برنامج بكالوريوس عملي يهدف إلى بناء أساس قوي في إدارة الأعمال والقيادة والتسويق والمالية، مع مرونة مناسبة للمهنيين العاملين ودعم لمسار مهني متوافق مع تطلعات رؤية المملكة 2030.',
      programType: 'BBA',
      speciality: 'Business Administration',
      speciality_ar: 'إدارة الأعمال',
      duration: '3 Academic Years',
      duration_ar: '3 سنوات',
      price: 0,
      // BBA should NOT be an exclusive program
      exclusive: false,
      thumbnail: '/ProgramPhotos/Bachelor of Business Administration (BBA).png',
      brochure_en: '/brochures/Bachelor of Business Administration (BBA).pdf',
      brochure_ar: '/brochures/بكالوريوس إداره الأعمال.pdf',
      // Curriculum snapshot from brochure (grouped by year)
      modules: [
        'Y1: Principles of Management',
        'Y1: Macroeconomics',
        'Y1: Organizational Behavior',
        'Y1: Principles of Financial Management',
        'Y1: Business Mathematics',
        'Y1: Microeconomics',
        'Y1: Financial Accounting I',
        'Y1: Islamic Studies',
        'Y1: Introduction to Business',
        'Y1: Introduction to Information Technology',
        'Y1: Academic English',
        'Y2: Entrepreneurship',
        'Y2: Principles of Marketing',
        'Y2: Management Information System',
        'Y2: Business Law',
        'Y2: Community Service',
        'Y2: Operation Management',
        'Y2: English Language Integrated Skills',
        'Y2: Financial Accounting II',
        'Y2: Strategic Management',
        'Y2: Human Resource Management',
        'Y2: Professional Ethics',
        'Y2: Electronic Commerce',
        'Y2: Business Statistics',
        'Y3: International Banking',
        'Y3: Quantitative Methods',
        'Y3: International Management',
        'Y3: Project Research',
        'Y3: International Marketing',
        'Y3: Business Planning',
        'Y3: Consumer Behaviour',
        'Y3: International Business',
        'Y3: International Financial Management',
        'Y3: Practical Training',
        'Y3: Cooperatives, Small and Medium Entreprises'
      ],
      // If Arabic course titles aren't provided, fall back to EN instead of showing an empty section in Arabic UI
      modules_ar: [
        'Y1: مبادئ الإدارة',
        'Y1: الاقتصاد الكلي',
        'Y1: السلوك التنظيمي',
        'Y1: مبادئ الإدارة المالية',
        'Y1: رياضيات الأعمال',
        'Y1: الاقتصاد الجزئي',
        'Y1: المحاسبة المالية 1',
        'Y1: الدراسات الإسلامية',
        'Y1: مقدمة في الأعمال',
        'Y1: مقدمة في تقنية المعلومات',
        'Y1: اللغة الإنجليزية الأكاديمية',
        'Y2: ريادة الأعمال',
        'Y2: مبادئ التسويق',
        'Y2: نظم معلومات الإدارة',
        'Y2: قانون الأعمال',
        'Y2: خدمة المجتمع',
        'Y2: إدارة العمليات',
        'Y2: مهارات اللغة الإنجليزية المتكاملة',
        'Y2: المحاسبة المالية 2',
        'Y2: الإدارة الاستراتيجية',
        'Y2: إدارة الموارد البشرية',
        'Y2: أخلاقيات المهنة',
        'Y2: التجارة الإلكترونية',
        'Y2: إحصاء الأعمال',
        'Y3: البنوك الدولية',
        'Y3: الأساليب الكمية',
        'Y3: الإدارة الدولية',
        'Y3: بحث المشروع',
        'Y3: التسويق الدولي',
        'Y3: تخطيط الأعمال',
        'Y3: سلوك المستهلك',
        'Y3: الأعمال الدولية',
        'Y3: الإدارة المالية الدولية',
        'Y3: تدريب عملي',
        'Y3: التعاونيات والمشروعات الصغيرة والمتوسطة'
      ],
      careerOpportunities: [
        'Supervisory, managerial, or specialized business roles',
        'Entrepreneur / Small business owner',
        'Business operations roles',
        'Marketing and sales roles',
        'Finance and administration roles'
      ],
      careerOpportunities_ar: [
        'أدوار إشرافية أو إدارية أو أدوار متخصصة في الأعمال',
        'رائد أعمال / صاحب مشروع صغير',
        'أدوار العمليات وإدارة الأعمال',
        'أدوار التسويق والمبيعات',
        'المالية والإدارة'
      ],
      keyFeatures: [
        { title: 'Career Advancement', description: 'Unlock more opportunities for promotions and career growth.' },
        { title: 'Global Perspective', description: 'Study in a program with strong international focus and relevance.' },
        { title: 'Practical Skills Development', description: 'Enhance your skills to meet the demands of today’s job market.' },
        { title: 'Flexible Study Mode', description: 'Study online without leaving your job or relocating.' },
        { title: 'British-Aligned Education Standards', description: 'Curriculum follows British standards, ranked among the top globally.' },
        { title: 'Fast-Track Career Acceleration', description: 'Maximum Flexibility 24/7 Access.' },
        { title: 'AI-Driven Personalization', description: 'Student Academic Support.' },
        { title: 'Graduation Ceremony in Switzerland', description: '' }
      ],
      keyFeatures_ar: [
        { title: 'التقدم الوظيفي', description: 'استكشف فرصا جديدة للترقية والنمو المهني.' },
        { title: 'نظرة عالمية', description: 'الدراسة في برنامج يركز على الجوانب الدولية ومرتبط ارتباطً ا قويا بالواقع العالمي.' },
        { title: 'تطوير المهارات العملية', description: 'عزز مهاراتك لتلبية متطلبات سوق العمل الحديثة.' },
        { title: 'وضع الدراسة المرن', description: 'الدراسة عبر الإنترنت دون الحاجة للتخلي عن وظيفتك أو الانتقال إلى مكان آخر.' },
        { title: 'معايير التعليم المعتمدة في بريطانيا', description: 'المنهج الدراسي يتبع المعايير البريطانية التي تُصنف من بين الأفضل عالميا.' },
        { title: 'دعم تطوير المسار المهني بشكل سريع', description: 'مرونة الدراسة في أي وقت على مدار اليوم.' },
        { title: 'التخصيص الذكي بالذكاء الاصطناعي', description: 'دعم أكاديمي خاص للطلاب.' },
        { title: 'حفل التخرج في سويسرا', description: '' }
      ],
      requirements: [
        'Working professionals in Saudi Arabia seeking an internationally accredited bachelor’s degree without pausing their careers',
        'Ambitious young employees & fresh graduates aiming to move into supervisory/managerial roles',
        'Employees seeking promotion or salary growth needing a recognized qualification',
        'Entrepreneurs and small business owners who want stronger management, finance, marketing, and strategy foundations',
        'Career shifters (engineering/IT/admin) wanting a solid business foundation',
        'Saudi & expatriate talents seeking a flexible online program aligned with Vision 2030'
      ],
      requirements_ar: [
        'المهنيون العاملون في المملكة الراغبون بالحصول على بكالوريوس دولي معتمد دون إيقاف مسيرتهم',
        'الموظفون الشباب والخريجون الجدد الراغبون بالانتقال إلى أدوار إشرافية أو إدارية',
        'الأشخاص الساعون للترقية أو زيادة الدخل ويحتاجون لمؤهل معترف به لتعزيز السيرة الذاتية',
        'رواد الأعمال وأصحاب المشاريع الصغيرة الراغبون بفهم الإدارة والمالية والتسويق والاستراتيجية',
        'الراغبون بتغيير المسار المهني من تخصصات أخرى إلى الإدارة والأعمال',
        'مواهب سعودية ومقيمة تبحث عن برنامج مرن ومتوافق مع رؤية 2030 ومتطلبات سوق العمل'
      ]
    });
  }

  // 1b) Triple MBA Exclusive - Hospitality & Events
  {
    const title = 'Trible MBA Exclusive hospitality and events Management';
    const id = slugify(title);
    upsertProgram(programs, {
      id,
      slug: id,
      title,
      title_ar: 'ماچستير إدارة الأعمال في إداره الضيافه و الفاعليات',
      shortDescription: 'Exclusive triple-accredited MBA track for Saudi Nationals aligned with Vision 2030.',
      shortDescription_ar: 'ماجستير حصري (ثلاثي الاعتماد) للسعوديين ومتوافق مع رؤية 2030.',
      description:
        "The rapid transformation of Saudi Arabia's hospitality and events industry, fueled by Vision 2030 and ambitious tourism development initiatives, has led to a growing demand for highly specialized management professionals. This MBA track is designed to equip students with comprehensive industry expertise and leadership skills essential for success in tourism, hospitality, and event sectors while respecting Saudi cultural values and traditions.",
      description_ar:
        'إن التحول السريع في مجال الضيافة والفعاليات في المملكة العربية السعودية، المدفوع برؤية 2030 والمبادرات الطموحة لتطوير السياحة، خلق حاجة متزايدة للمهنيين المتخصصين في الإدارة. تم تصميم هذا المسار لتزويد الطلاب بالخبرة الشاملة والمهارات القيادية اللازمة للنجاح في قطاعات السياحة والضيافة والفعاليات.',
      programType: 'MBA',
      speciality: 'Hospitality & Events Management',
      speciality_ar: 'إدارة الضيافة والفعاليات',
      duration: '1 Academic Year',
      duration_ar: 'سنة واحده',
      price: 0,
      exclusive: true,
      // Use the same photo as the existing exclusive Hospitality program
      thumbnail: '/ProgramPhotos/event  Management.jpeg',
      brochure_en: '/brochures/Trible MBA Exclusive hospitality and events Management.pdf',
      brochure_ar: '/brochures/ماچستير إدارة الأعمال في إداره الضيافه و الفاعليات.pdf',
      modules: [
        'Digital Tourism and Hospitality',
        'Managerial Finance',
        'International Business',
        'Human Capital Management',
        'Business Research',
        'Organizational Behavior',
        'Contemporary Management and Leadership',
        'Strategic Management',
        'Services Quality Management for Tourism and Hospitality',
        'Operation Management in Hospitality',
        'Event Management',
        'Marketing Management'
      ],
      modules_ar: [
        'السياحة والضيافة الرقمية',
        'التمويل الإداري',
        'الأعمال الدولية',
        'إدارة رأس المال البشري',
        'البحث في مجال الأعمال',
        'السلوك التنظيمي',
        'الإدارة والقيادة المعاصرة',
        'الإدارة الإستراتيجية',
        'إدارة جودة الخدمات في السياحة والضيافة',
        'إدارة العمليات في قطاع الضيافة',
        'إدارة الفعاليات',
        'إدارة التسويق'
      ],
      careerOpportunities: [
        'Hotel Manager',
        'Event Coordinator',
        'Resort Manager',
        'Catering Manager',
        'Hospitality Consultant',
        'Event Planner'
      ],
      careerOpportunities_ar: [
        'مدير فندق',
        'منسق فعاليات',
        'مدير منتجع',
        'مدير خدمات الطعام',
        'مستشار ضيافة',
        'منظم فعاليات'
      ],
      keyFeatures: [
        { title: 'Career Advancement', description: 'Unlock more opportunities for promotions and career growth.' },
        { title: 'Global Perspective', description: 'Study in a program with strong international focus and relevance.' },
        { title: 'Practical Skills Development', description: 'Enhance your skills to meet the demands of today’s job market.' },
        { title: 'Flexible Study Mode', description: 'Study online without leaving your job or relocating.' },
        { title: 'British-Aligned Education Standards', description: 'Curriculum follows British standards, ranked among the top globally.' },
        { title: 'Fast-Track Career Acceleration', description: 'Maximum Flexibility 24/7 Access.' },
        { title: 'AI-Driven Personalization', description: 'Student Academic Support.' },
        { title: 'Graduation Ceremony in Switzerland', description: '' }
      ],
      keyFeatures_ar: [
        { title: 'التقدم الوظيفي', description: 'استكشف فرصا جديدة للترقية والنمو المهني.' },
        { title: 'تطوير المهارات العملية', description: 'عزز مهاراتك لتلبية متطلبات سوق العمل الحديثة.' },
        { title: 'نظرة عالمية', description: 'الدراسة في برنامج يركز على الجوانب الدولية ومرتبط ارتباطً ا قويا بالواقع العالمي.' },
        { title: 'معايير التعليم المعتمدة في بريطانيا', description: 'المنهج الدراسي يتبع المعايير البريطانية التي تُصنف من بين الأفضل عالميا.' },
        { title: 'وضع الدراسة المرن', description: 'الدراسة عبر الإنترنت دون الحاجة للتخلي عن وظيفتك أو الانتقال إلى مكان آخر.' },
        { title: 'التخصص وعمق المعرفة', description: 'احصل على فهم عميق للمفاهيم الأساسية في الأعمال التجارية الدولية.' },
        { title: 'دعم تطوير المسار المهني بشكل سريع', description: 'مرونة الدراسة في أي وقت على مدار اليوم.' },
        { title: 'التخصيص الذكي بالذكاء الاصطناعي', description: 'دعم أكاديمي خاص للطلاب.' },
        { title: 'حفل التخرج في سويسرا', description: '' }
      ],
      requirements: [],
      requirements_ar: []
    });
  }

  // 1c) Triple MBA Exclusive - Sports
  {
    const title = 'Trible MBA Exclusive Sports Management';
    const id = slugify(title);
    upsertProgram(programs, {
      id,
      slug: id,
      title,
      title_ar: 'ماجيستير إداره الأعمال  في إداره الرياضه',
      shortDescription: 'Exclusive triple-accredited MBA track for Saudi Nationals aligned with Vision 2030.',
      shortDescription_ar: 'ماجستير حصري (ثلاثي الاعتماد) للسعوديين ومتوافق مع رؤية 2030.',
      description:
        "The unprecedented transformation of Saudi Arabia's sports industry, driven by Vision 2030 and ambitious initiatives for athletic development, has created urgent demand for specialized management professionals. This MBA track equips students with comprehensive industry knowledge and leadership skills for professional sports, athletic development, and sports entertainment sectors while promoting Saudi cultural values and national identity.",
      description_ar:
        'إن التحول غير المسبوق في صناعة الرياضة في المملكة العربية السعودية، المدفوع برؤية 2030 والمبادرات الطموحة لتطوير الرياضة، خلق حاجة ملحة للمهنيين المتخصصين في الإدارة. تم تصميم هذا المسار لتزويد الطلاب بالمعرفة الشاملة والمهارات القيادية الضرورية للنجاح في قطاعات الرياضة الاحترافية وتطوير الرياضة وصناعة الترفيه الرياضي.',
      programType: 'MBA',
      speciality: 'Sports Management',
      speciality_ar: 'إدارة الرياضة',
      duration: '1 Academic Year',
      duration_ar: 'سنة واحده',
      price: 0,
      exclusive: true,
      // Use the same photo as the existing exclusive Sports program
      thumbnail: '/ProgramPhotos/Sports Management.jpg',
      brochure_en: '/brochures/Trible MBA Exclusive Sports Management.pdf',
      brochure_ar: '/brochures/ماجيستير إداره الأعمال  في إداره الرياضه.pdf',
      modules: [
        'Marketing Management',
        'International Business',
        'Sports Operations',
        'Strategic Management',
        'Business Research',
        'Human Capital Management',
        'Sports Economics',
        'Sports Media and Sponsorship',
        'Managerial Finance',
        'Contemporary Management and Leadership',
        'Organizational Behavior',
        'Sports Event Management'
      ],
      modules_ar: [
        'إدارة التسويق',
        'الأعمال الدولية',
        'العمليات الرياضية',
        'الإدارة الإستراتيجية',
        'البحث في مجال الأعمال',
        'إدارة رأس المال البشري',
        'اقتصاديات الرياضة',
        'الإعلام الرياضي والرعاية',
        'التمويل الإداري',
        'الإدارة والقيادة المعاصرة',
        'السلوك التنظيمي',
        'إدارة الفعاليات الرياضية'
      ],
      careerOpportunities: [
        'Sports Manager',
        'Event Planner',
        'Sports Marketing Manager',
        'Event Coordinator',
        'Sports Coordinator',
        'Sponsorship Manager'
      ],
      careerOpportunities_ar: [
        'مدير رياضة',
        'منظم فعاليات',
        'مدير تسويق رياضي',
        'منسق فعاليات',
        'منسق رياضي',
        'مدير الرعاية'
      ],
      keyFeatures: [
        { title: 'Career Advancement', description: 'Unlock more opportunities for promotions and career growth.' },
        { title: 'Global Perspective', description: 'Study in a program with strong international focus and relevance.' },
        { title: 'Practical Skills Development', description: 'Enhance your skills to meet the demands of today’s job market.' },
        { title: 'Flexible Study Mode', description: 'Study online without leaving your job or relocating.' },
        { title: 'British-Aligned Education Standards', description: 'Curriculum follows British standards, ranked among the top globally.' },
        { title: 'Fast-Track Career Acceleration', description: 'Maximum Flexibility 24/7 Access.' },
        { title: 'AI-Driven Personalization', description: 'Student Academic Support.' },
        { title: 'Graduation Ceremony in Switzerland', description: '' }
      ],
      keyFeatures_ar: [
        { title: 'التقدم الوظيفي', description: 'استكشف فرصا جديدة للترقية والنمو المهني.' },
        { title: 'تطوير المهارات العملية', description: 'عزز مهاراتك لتلبية متطلبات سوق العمل الحديثة.' },
        { title: 'نظرة عالمية', description: 'الدراسة في برنامج يركز على الجوانب الدولية ومرتبط ارتباطً ا قويا بالواقع العالمي.' },
        { title: 'معايير التعليم المعتمدة في بريطانيا', description: 'المنهج الدراسي يتبع المعايير البريطانية التي تُصنف من بين الأفضل عالميا.' },
        { title: 'وضع الدراسة المرن', description: 'الدراسة عبر الإنترنت دون الحاجة للتخلي عن وظيفتك أو الانتقال إلى مكان آخر.' },
        { title: 'التخصص وعمق المعرفة', description: 'احصل على فهم عميق للمفاهيم الأساسية في الأعمال التجارية الدولية.' },
        { title: 'دعم تطوير المسار المهني بشكل سريع', description: 'مرونة الدراسة في أي وقت على مدار اليوم.' },
        { title: 'التخصيص الذكي بالذكاء الاصطناعي', description: 'دعم أكاديمي خاص للطلاب.' },
        { title: 'حفل التخرج في سويسرا', description: '' }
      ],
      requirements: [],
      requirements_ar: []
    });
  }

  // 2) Exclusive DBA - Hospitality & Events
  {
    const title = 'Exclusive Strategic DBA in Hospitality and Event Management';
    const id = slugify(title);
    upsertProgram(programs, {
      id,
      slug: id,
      title,
      title_ar: 'دكتوراه إدارة الأعمال في الضيافة والفعاليات الاستراتيجية',
      shortDescription:
        'Dual-accredited exclusive strategic DBA for Saudi Nationals aligned with Vision 2030 and tourism development.',
      shortDescription_ar:
        'دكتوراه استراتيجية حصرية (باعتماد دولي مزدوج) للسعوديين ومتوافقة مع رؤية 2030 وتطوير السياحة.',
      description:
        "In alignment with Saudi Arabia's transformative Vision 2030 and ambitious tourism development initiatives, the Kingdom's rapidly evolving hospitality and events industry demands a new generation of highly specialized, research-oriented leaders. This DBA program is designed to cultivate executive-level professionals capable of driving strategic innovation, conducting rigorous applied research, and shaping world-class guest experiences while honoring Saudi cultural values and traditions.",
      description_ar:
        'بالتوافق مع رؤية المملكة 2030 ومشاريع تطوير السياحة، يهدف هذا البرنامج إلى تأهيل نخبة من القادة القادرين على ابتكار حلول استراتيجية وإجراء أبحاث تطبيقية متقدمة والمساهمة في تطوير تجارب ضيافة متميزة مع الحفاظ على الهوية الثقافية والقيم السعودية.',
      programType: 'DBA',
      speciality: 'Hospitality & Events Management',
      speciality_ar: 'إدارة الضيافة والفعاليات',
      duration: '2.5 Academic Year',
      duration_ar: 'سنتين و نصف',
      price: 0,
      exclusive: true,
      thumbnail: '/ProgramPhotos/event  Management.jpeg',
      brochure_en: '/brochures/Exclusive Strategic DBA in hospitality and event  Management.pdf',
      brochure_ar: '/brochures/دكتوراه إدارة الأعمال في الضيافة والفعاليات الاستراتيجية.pdf',
      modules: [
        'Destination Management',
        'Organizational Development',
        'Advanced Statistics',
        'Advanced Financial Management',
        'Business Analytics and Strategic Decision Making',
        'Sustainable Tourism and Event Practices',
        'Research Methodology',
        'Strategic Management and Innovation in Global Hospitality and Events'
      ],
      modules_ar: [
        'إدارة الوجهات السياحية',
        'تطوير المنظمات',
        'الإحصاء المتقدم',
        'الإدارة المالية المتقدمة',
        'تحليلات الأعمال واتخاذ القرارات الإستراتيجية',
        'ممارسات السياحة والفعاليات المستدامة',
        'منهجية البحث العلمي',
        'الإدارة الإستراتيجية والابتكار في الضيافة والفعاليات العالمية'
      ],
      careerOpportunities: [
        'Chief Experience Officer (CXO)',
        'Vice President of Guest Services or Customer Experience',
        'Head of Event Planning & Strategy (Corporate or Mega Events)',
        'Academic Lecturer or Researcher in Hospitality & Events',
        'General Manager of Hotel or Resort'
      ],
      careerOpportunities_ar: [
        'مدير عام للفعاليات الدولية',
        'استشاري استراتيجيات السياحة والفعاليات',
        'الرئيس التنفيذي لمنشأة ضيافة أو سلسلة فنادق'
      ],
      keyFeatures: [
        { title: 'Career Advancement', description: 'Unlock more opportunities for promotions and career growth.' },
        { title: 'Global Perspective', description: 'Study in a program with strong international focus and relevance.' },
        { title: 'Practical Skills Development', description: 'Enhance your skills to meet the demands of today’s job market.' },
        { title: 'Flexible Study Mode', description: 'Study online without leaving your job or relocating.' },
        { title: 'British-Aligned Education Standards', description: 'Curriculum follows British standards, ranked among the top globally.' },
        { title: 'Fast-Track Career Acceleration', description: 'Maximum Flexibility 24/7 Access.' },
        { title: 'AI-Driven Personalization', description: 'Student Academic Support.' },
        { title: 'Graduation Ceremony in Switzerland', description: '' }
      ],
      keyFeatures_ar: [
        { title: 'التقدم الوظيفي', description: 'استكشف فرصا جديدة للترقية والنمو المهني.' },
        { title: 'تطوير المهارات العملية', description: 'عزز مهاراتك لتلبية متطلبات سوق العمل الحديثة.' },
        { title: 'نظرة عالمية', description: 'الدراسة في برنامج يركز على الجوانب الدولية ومرتبط ارتباطً ا قويا بالواقع العالمي.' },
        { title: 'معايير التعليم المعتمدة في بريطانيا', description: 'المنهج الدراسي يتبع المعايير البريطانية التي تُصنف من بين الأفضل عالميا.' },
        { title: 'وضع الدراسة المرن', description: 'الدراسة عبر الإنترنت دون الحاجة للتخلي عن وظيفتك أو الانتقال إلى مكان آخر.' },
        { title: 'التخصص وعمق المعرفة', description: 'احصل على فهم عميق للمفاهيم الأساسية في الأعمال التجارية الدولية.' },
        { title: 'دعم تطوير المسار المهني بشكل سريع', description: 'مرونة الدراسة في أي وقت على مدار اليوم.' },
        { title: 'التخصيص الذكي بالذكاء الاصطناعي', description: 'دعم أكاديمي خاص للطلاب.' },
        { title: 'حفل التخرج في سويسرا', description: '' }
      ],
      requirements: [],
      requirements_ar: []
    });
  }

  // 3) Exclusive DBA - Sports
  {
    const title = 'Exclusive Strategic DBA in Sports Management';
    const id = slugify(title);
    upsertProgram(programs, {
      id,
      slug: id,
      title,
      title_ar: 'دكتوراه إدارة الأعمال في إدارة الرياضة الاستراتيجية',
      shortDescription:
        'Dual-accredited exclusive strategic DBA for Saudi Nationals aligned with Vision 2030 and sports development initiatives.',
      shortDescription_ar:
        'دكتوراه استراتيجية حصرية (باعتماد دولي مزدوج) للسعوديين ومتوافقة مع رؤية 2030 وتطوير القطاع الرياضي.',
      description:
        "In alignment with Saudi Arabia's Vision 2030 sports development initiatives, the Kingdom's rapidly evolving sports industry demands highly specialized, research-oriented leaders. This DBA program addresses the critical need for advanced scholarly inquiry and strategic leadership within domestic sports, international sporting events, and mega-events, preparing graduates to shape the future of the sector.",
      description_ar:
        'في ظل التحولات الكبرى التي تشهدها المملكة ضمن رؤية 2030 ومبادرات تطوير القطاع الرياضي، يهدف هذا البرنامج إلى إعداد قادة يمتلكون خبرات بحثية وقدرات استراتيجية لإحداث تأثير فعّال في الرياضة المحلية والفعاليات الدولية الكبرى مع التركيز على البحث العلمي والممارسات القيادية المتقدمة.',
      programType: 'DBA',
      speciality: 'Sports Management',
      speciality_ar: 'إدارة الرياضة',
      duration: '2.5 Academic Year',
      duration_ar: 'سنتين و نصف',
      price: 0,
      exclusive: true,
      thumbnail: '/ProgramPhotos/Sports Management.jpg',
      brochure_en: '/brochures/Exclusive Strategic DBA in sports Management.pdf',
      brochure_ar: '/brochures/دكتوراه إدارة الأعمال في إدارة الرياضة الاستراتيجية.pdf',
      modules: [
        'Research Methodology',
        'Advanced Financial Management',
        'Sports Finance and Investment Strategies',
        'Organizational Development',
        'Business Analytics and Strategic Decision Making',
        'Advanced Statistics',
        'Sports Policies and Governance',
        'Strategic Leadership and Innovation in Global Sports'
      ],
      modules_ar: [
        'منهجية البحث العلمي',
        'الإدارة المالية المتقدمة',
        'التمويل الرياضي واستراتيجيات الاستثمار',
        'تطوير المنظمات',
        'تحليلات الأعمال واتخاذ القرارات الإستراتيجية',
        'الإحصاء المتقدم',
        'السياسات الرياضية والحوكمة',
        'القيادة الإستراتيجية والابتكار في الرياضة العالمية'
      ],
      careerOpportunities: [
        'Consultant for Sports Federations or Governing Bodies (e.g., FIFA, IOC)',
        'Event Director (International Sports Events & Tournaments)',
        'Head of Sports Development Programs',
        'Director of Sports Operations'
      ],
      careerOpportunities_ar: [
        'الرئيس التنفيذي لنادٍ رياضي (CEO)',
        'مدير إدارة الفعاليات الرياضية الكبرى',
        'أستاذ جامعي أو محاضر في إدارة الرياضة',
        'باحث في استراتيجيات وتطوير قطاع الرياضة',
        'مدير تطوير استراتيجي في مؤسسات رياضية دولية'
      ],
      keyFeatures: [
        { title: 'Career Advancement', description: 'Unlock more opportunities for promotions and career growth.' },
        { title: 'Global Perspective', description: 'Study in a program with strong international focus and relevance.' },
        { title: 'Practical Skills Development', description: 'Enhance your skills to meet the demands of today’s job market.' },
        { title: 'Flexible Study Mode', description: 'Study online without leaving your job or relocating.' },
        { title: 'British-Aligned Education Standards', description: 'Curriculum follows British standards, ranked among the top globally.' },
        { title: 'Fast-Track Career Acceleration', description: 'Maximum Flexibility 24/7 Access.' },
        { title: 'AI-Driven Personalization', description: 'Student Academic Support.' },
        { title: 'Graduation Ceremony in Switzerland', description: '' }
      ],
      keyFeatures_ar: [
        { title: 'التقدم الوظيفي', description: 'استكشف فرصا جديدة للترقية والنمو المهني.' },
        { title: 'تطوير المهارات العملية', description: 'عزز مهاراتك لتلبية متطلبات سوق العمل الحديثة.' },
        { title: 'نظرة عالمية', description: 'الدراسة في برنامج يركز على الجوانب الدولية ومرتبط ارتباطً ا قويا بالواقع العالمي.' },
        { title: 'معايير التعليم المعتمدة في بريطانيا', description: 'المنهج الدراسي يتبع المعايير البريطانية التي تُصنف من بين الأفضل عالميا.' },
        { title: 'وضع الدراسة المرن', description: 'الدراسة عبر الإنترنت دون الحاجة للتخلي عن وظيفتك أو الانتقال إلى مكان آخر.' },
        { title: 'التخصص وعمق المعرفة', description: 'احصل على فهم عميق للمفاهيم الأساسية في الأعمال التجارية الدولية.' },
        { title: 'دعم تطوير المسار المهني بشكل سريع', description: 'مرونة الدراسة في أي وقت على مدار اليوم.' },
        { title: 'التخصيص الذكي بالذكاء الاصطناعي', description: 'دعم أكاديمي خاص للطلاب.' },
        { title: 'حفل التخرج في سويسرا', description: '' }
      ],
      requirements: [],
      requirements_ar: []
    });
  }

  await fs.writeFile(PROGRAMS_JSON, JSON.stringify(programs, null, 2), 'utf8');
  // eslint-disable-next-line no-console
  console.log(`Added/ensured programs. Total now: ${programs.length}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


