import { CMSContent, CMS_SECTIONS } from '../src/types/cms';

// This script extracts all current website text content
export const extractedContent: CMSContent[] = [
  // NAVBAR CONTENT
  {
    id: 'navbar_programs',
    key: 'navbar_programs',
    section: CMS_SECTIONS.NAVBAR,
    content_en: 'Programs',
    content_ar: 'البرامج',
    description: 'Navigation menu item for programs page',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'navbar_about',
    key: 'navbar_about',
    section: CMS_SECTIONS.NAVBAR,
    content_en: 'About',
    content_ar: 'عن أوبتيموس',
    description: 'Navigation menu item for about page',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'navbar_blog',
    key: 'navbar_blog',
    section: CMS_SECTIONS.NAVBAR,
    content_en: 'Blog',
    content_ar: 'المدونة',
    description: 'Navigation menu item for blog page',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'navbar_contact',
    key: 'navbar_contact',
    section: CMS_SECTIONS.NAVBAR,
    content_en: 'Contact',
    content_ar: 'اتصل بنا',
    description: 'Navigation menu item for contact page',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'navbar_dashboard',
    key: 'navbar_dashboard',
    section: CMS_SECTIONS.NAVBAR,
    content_en: 'Dashboard',
    content_ar: 'لوحة التحكم',
    description: 'Navigation menu item for dashboard (logged-in users)',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'navbar_login',
    key: 'navbar_login',
    section: CMS_SECTIONS.NAVBAR,
    content_en: 'Login',
    content_ar: 'تسجيل الدخول',
    description: 'Navigation menu item for login',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'navbar_register',
    key: 'navbar_register',
    section: CMS_SECTIONS.NAVBAR,
    content_en: 'Register',
    content_ar: 'التسجيل',
    description: 'Navigation menu item for registration',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'navbar_sign_out',
    key: 'navbar_sign_out',
    section: CMS_SECTIONS.NAVBAR,
    content_en: 'Sign out',
    content_ar: 'تسجيل الخروج',
    description: 'Sign out button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'navbar_sign_out',
    key: 'navbar_sign_out',
    section: CMS_SECTIONS.NAVBAR,
    content_en: 'Sign out',
    content_ar: 'تسجيل الخروج',
    description: 'Sign out button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'navbar_signing_out',
    key: 'navbar_signing_out',
    section: CMS_SECTIONS.NAVBAR,
    content_en: 'Signing out...',
    content_ar: 'جاري تسجيل الخروج...',
    description: 'Signing out progress text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // HERO SECTION CONTENT
  {
    id: 'hero_badge',
    key: 'hero_badge',
    section: CMS_SECTIONS.HERO,
    content_en: 'Online',
    content_ar: 'عبر الإنترنت',
    description: 'Badge text on hero section',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'hero_title',
    key: 'hero_title',
    section: CMS_SECTIONS.HERO,
    content_en: 'MBA . PHD',
    content_ar: 'ماجستير إدارة الأعمال • دكتوراه',
    description: 'Main title on hero section',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'hero_subtitle',
    key: 'hero_subtitle',
    section: CMS_SECTIONS.HERO,
    content_en: "Shaping Tomorrow's Leaders in KSA",
    content_ar: 'تشكيل قادة الغد في المملكة العربية السعودية',
    description: 'Subtitle on hero section',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'hero_cta_explore',
    key: 'hero_cta_explore',
    section: CMS_SECTIONS.HERO,
    content_en: 'Explore Programs',
    content_ar: 'استكشف البرامج',
    description: 'Primary CTA button on hero section',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'hero_cta_register',
    key: 'hero_cta_register',
    section: CMS_SECTIONS.HERO,
    content_en: 'Register',
    content_ar: 'سجل الآن',
    description: 'Secondary CTA button on hero section',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // PROGRAMS OVERVIEW CONTENT
  {
    id: 'programs_overview_title',
    key: 'programs_overview_title',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Our Programs',
    content_ar: 'برامجنا',
    description: 'Main title for programs overview section',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_overview_subtitle',
    key: 'programs_overview_subtitle',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Choose from our range of accredited programs designed for future leaders',
    content_ar: 'اختر من مجموعة برامجنا المعتمدة المصممة لقادة المستقبل',
    description: 'Subtitle for programs overview section',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_bachelors_title',
    key: 'programs_bachelors_title',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: "Bachelor's Programs",
    content_ar: 'برامج البكالوريوس',
    description: 'Title for bachelor programs card',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_bachelors_desc',
    key: 'programs_bachelors_desc',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Undergraduate degrees in Business, Technology, and Liberal Arts',
    content_ar: 'درجات البكالوريوس في الأعمال والتكنولوجيا والفنون الحرة',
    description: 'Description for bachelor programs',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_masters_title',
    key: 'programs_masters_title',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'MBA Programs',
    content_ar: 'برامج ماجستير إدارة الأعمال',
    description: 'Title for MBA programs card',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_masters_desc',
    key: 'programs_masters_desc',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Advanced business education for experienced professionals',
    content_ar: 'تعليم الأعمال المتقدم للمهنيين ذوي الخبرة',
    description: 'Description for MBA programs',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_doctoral_title',
    key: 'programs_doctoral_title',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'DBA Programs',
    content_ar: 'برامج دكتوراه إدارة الأعمال',
    description: 'Title for DBA programs card',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_doctoral_desc',
    key: 'programs_doctoral_desc',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Doctoral programs for business leaders and researchers',
    content_ar: 'برامج الدكتوراه لقادة الأعمال والباحثين',
    description: 'Description for DBA programs',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_view_details',
    key: 'programs_view_details',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'View Details',
    content_ar: 'عرض التفاصيل',
    description: 'Button text for viewing program details',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_learn_more',
    key: 'programs_learn_more',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Learn More',
    content_ar: 'اعرف المزيد',
    description: 'Learn more link text in program cards',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_bachelor_title',
    key: 'programs_bachelor_title',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: "Bachelor's Degrees",
    content_ar: 'درجات البكالوريوس',
    description: 'Title for bachelor programs card',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_bachelor_description',
    key: 'programs_bachelor_description',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Foundational business education with specializations in management, finance, marketing, and international business.',
    content_ar: 'تعليم الأعمال الأساسي مع التخصصات في الإدارة والمالية والتسويق والأعمال الدولية',
    description: 'Description for bachelor programs',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_mba_title',
    key: 'programs_mba_title',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'MBA Programs',
    content_ar: 'برامج ماجستير إدارة الأعمال',
    description: 'Title for MBA programs card',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_mba_description',
    key: 'programs_mba_description',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Advanced business administration with flexible formats including executive, online, and specialized industry tracks.',
    content_ar: 'إدارة الأعمال المتقدمة مع أشكال مرنة تشمل التنفيذي والإنترنت والمسارات الصناعية المتخصصة',
    description: 'Description for MBA programs',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_doctorate_title',
    key: 'programs_doctorate_title',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Doctorate of Business',
    content_ar: 'دكتوراه الأعمال',
    description: 'Title for doctorate programs card',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_doctorate_description',
    key: 'programs_doctorate_description',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Research-focused doctorate developing thought leaders who drive innovation in business practice and theory.',
    content_ar: 'دكتوراه تركز على البحث لتطوير قادة الفكر الذين يقودون الابتكار في ممارسة الأعمال والنظرية',
    description: 'Description for doctorate programs',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_view_all_button',
    key: 'programs_view_all_button',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'View All Programs',
    content_ar: 'عرض جميع البرامج',
    description: 'Button text to view all programs',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_explore_mba',
    key: 'program_explore_mba',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Explore MBA Programs',
    content_ar: 'استكشف برامج الماجستير',
    description: 'Link text to explore MBA programs',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_explore_phd',
    key: 'program_explore_phd',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Explore PhD Programs',
    content_ar: 'استكشف برامج الدكتوراه',
    description: 'Link text to explore PhD programs',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // HOW IT WORKS CONTENT
  {
    id: 'how_it_works_title',
    key: 'how_it_works_title',
    section: CMS_SECTIONS.HOW_IT_WORKS,
    content_en: 'How It Works',
    content_ar: 'كيف يعمل',
    description: 'Main title for how it works section',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'how_it_works_subtitle',
    key: 'how_it_works_subtitle',
    section: CMS_SECTIONS.HOW_IT_WORKS,
    content_en: 'Your journey to success in 4 simple steps',
    content_ar: 'رحلتك نحو النجاح في 4 خطوات بسيطة',
    description: 'Subtitle for how it works section',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'how_it_works_step1_title',
    key: 'how_it_works_step1_title',
    section: CMS_SECTIONS.HOW_IT_WORKS,
    content_en: 'Choose Your Program',
    content_ar: 'اختر برنامجك',
    description: 'Step 1 title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'how_it_works_step1_desc',
    key: 'how_it_works_step1_desc',
    section: CMS_SECTIONS.HOW_IT_WORKS,
    content_en: 'Browse our accredited programs and select the one that fits your goals',
    content_ar: 'تصفح برامجنا المعتمدة واختر ما يناسب أهدافك',
    description: 'Step 1 description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'how_it_works_step2_title',
    key: 'how_it_works_step2_title',
    section: CMS_SECTIONS.HOW_IT_WORKS,
    content_en: 'Apply Online',
    content_ar: 'قدم طلبك عبر الإنترنت',
    description: 'Step 2 title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'how_it_works_step2_desc',
    key: 'how_it_works_step2_desc',
    section: CMS_SECTIONS.HOW_IT_WORKS,
    content_en: 'Complete your application with required documents in minutes',
    content_ar: 'أكمل طلبك مع المستندات المطلوبة في دقائق',
    description: 'Step 2 description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'how_it_works_step3_title',
    key: 'how_it_works_step3_title',
    section: CMS_SECTIONS.HOW_IT_WORKS,
    content_en: 'Start Learning',
    content_ar: 'ابدأ التعلم',
    description: 'Step 3 title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'how_it_works_step3_desc',
    key: 'how_it_works_step3_desc',
    section: CMS_SECTIONS.HOW_IT_WORKS,
    content_en: 'Access your courses online and learn at your own pace',
    content_ar: 'الوصول إلى دوراتك عبر الإنترنت والتعلم بالسرعة التي تناسبك',
    description: 'Step 3 description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'how_it_works_step4_title',
    key: 'how_it_works_step4_title',
    section: CMS_SECTIONS.HOW_IT_WORKS,
    content_en: 'Graduate & Succeed',
    content_ar: 'تخرج وانجح',
    description: 'Step 4 title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'how_it_works_step4_desc',
    key: 'how_it_works_step4_desc',
    section: CMS_SECTIONS.HOW_IT_WORKS,
    content_en: 'Earn your accredited degree and advance your career',
    content_ar: 'احصل على شهادتك المعتمدة وطور مسارك المهني',
    description: 'Step 4 description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // FOOTER CONTENT
  {
    id: 'footer_about_title',
    key: 'footer_about_title',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'About OPTIMUS',
    content_ar: 'عن أوبتيموس',
    description: 'Footer about section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_about_desc',
    key: 'footer_about_desc',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Empowering the next generation of leaders through quality education and innovative learning solutions.',
    content_ar: 'تمكين الجيل القادم من القادة من خلال التعليم الجيد وحلول التعلم المبتكرة.',
    description: 'Footer about description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_quicklinks_title',
    key: 'footer_quicklinks_title',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Quick Links',
    content_ar: 'روابط سريعة',
    description: 'Footer quick links section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_programs_title',
    key: 'footer_programs_title',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Programs',
    content_ar: 'البرامج',
    description: 'Footer programs section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_contact_title',
    key: 'footer_contact_title',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Contact',
    content_ar: 'اتصل بنا',
    description: 'Footer contact section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_copyright',
    key: 'footer_copyright',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'OPTIMUS Education. All rights reserved.',
    content_ar: 'أوبتيموس للتعليم - جميع الحقوق محفوظة',
    description: 'Footer copyright text (year is added automatically by Footer component)',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_quick_links_title',
    key: 'footer_quick_links_title',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Quick Links',
    content_ar: 'روابط سريعة',
    description: 'Footer quick links section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_link_programs',
    key: 'footer_link_programs',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Programs',
    content_ar: 'البرامج',
    description: 'Footer programs link',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_link_about',
    key: 'footer_link_about',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'About',
    content_ar: 'عن أوبتيموس',
    description: 'Footer about link',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_link_admissions',
    key: 'footer_link_admissions',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Admissions',
    content_ar: 'القبول',
    description: 'Footer admissions link',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_link_contact',
    key: 'footer_link_contact',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Contact',
    content_ar: 'اتصل بنا',
    description: 'Footer contact link',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_link_career_guide',
    key: 'footer_link_career_guide',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Career Guide',
    content_ar: 'دليل المهنة',
    description: 'Footer career guide link',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_link_program_showcase',
    key: 'footer_link_program_showcase',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Program Showcase',
    content_ar: 'معرض البرامج',
    description: 'Footer program showcase link',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_contact_info_title',
    key: 'footer_contact_info_title',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Contact Info',
    content_ar: 'معلومات الاتصال',
    description: 'Footer contact info section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_address',
    key: 'footer_address',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Riyadh, Saudi Arabia',
    content_ar: 'الرياض، المملكة العربية السعودية',
    description: 'Footer contact address',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_get_in_touch',
    key: 'footer_get_in_touch',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Get in Touch',
    content_ar: 'تواصل معنا',
    description: 'Footer get in touch link',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_newsletter_title',
    key: 'footer_newsletter_title',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Newsletter',
    content_ar: 'النشرة الإخبارية',
    description: 'Footer newsletter section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_newsletter_description',
    key: 'footer_newsletter_description',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Stay updated with our latest programs and news.',
    content_ar: 'ابق على اطلاع بآخر برامجنا وأخبارنا.',
    description: 'Footer newsletter description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_newsletter_placeholder',
    key: 'footer_newsletter_placeholder',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Enter your email',
    content_ar: 'أدخل بريدك الإلكتروني',
    description: 'Footer newsletter input placeholder',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_newsletter_subscribe',
    key: 'footer_newsletter_subscribe',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Subscribe',
    content_ar: 'اشترك',
    description: 'Footer newsletter subscribe button',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_privacy_policy',
    key: 'footer_privacy_policy',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Privacy Policy',
    content_ar: 'سياسة الخصوصية',
    description: 'Footer privacy policy link',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_link_blog',
    key: 'footer_link_blog',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Blog',
    content_ar: 'المدونة',
    description: 'Footer blog link',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_terms_of_service',
    key: 'footer_terms_of_service',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Terms of Service',
    content_ar: 'شروط الخدمة',
    description: 'Footer terms of service link',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // PROGRAM OVERVIEW CONTENT
  {
    id: 'program_overview_certification',
    key: 'program_overview_certification',
    section: CMS_SECTIONS.PROGRAMS,
    content_en: 'Get certified in a year – fully online',
    content_ar: 'احصل على الشهادة في عام واحد - بالكامل عبر الإنترنت',
    description: 'Program overview certification tagline',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_mba_description',
    key: 'program_mba_description',
    section: CMS_SECTIONS.PROGRAMS,
    content_en: 'Advanced management and leadership programs designed for working professionals seeking career advancement.',
    content_ar: 'برامج إدارة وقيادة متقدمة مصممة للمهنيين العاملين الساعين لتطوير مهنهم',
    description: 'MBA program description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_phd_description',
    key: 'program_phd_description',
    section: CMS_SECTIONS.PROGRAMS,
    content_en: 'Doctoral programs for academic and professional excellence in specialized fields of study.',
    content_ar: 'برامج الدكتوراه للتميز الأكاديمي والمهني في مجالات الدراسة المتخصصة',
    description: 'PhD program description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_page_title',
    key: 'programs_page_title',
    section: CMS_SECTIONS.PROGRAMS,
    content_en: 'Our Programs',
    content_ar: 'برامجنا',
    description: 'Programs page main title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_page_subtitle',
    key: 'programs_page_subtitle',
    section: CMS_SECTIONS.PROGRAMS,
    content_en: 'Discover our comprehensive range of educational programs designed for tomorrow\'s leaders.',
    content_ar: 'اكتشف مجموعتنا الشاملة من البرامج التعليمية المصممة لقادة المستقبل.',
    description: 'Programs page subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_filters_title',
    key: 'programs_filters_title',
    section: CMS_SECTIONS.PROGRAMS,
    content_en: 'Filters',
    content_ar: 'المرشحات',
    description: 'Programs filters section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_clear_all',
    key: 'programs_clear_all',
    section: CMS_SECTIONS.PROGRAMS,
    content_en: 'Clear All',
    content_ar: 'مسح الكل',
    description: 'Clear all filters button',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_program_type',
    key: 'programs_program_type',
    section: CMS_SECTIONS.PROGRAMS,
    content_en: 'Program Type',
    content_ar: 'نوع البرنامج',
    description: 'Program type filter label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_speciality',
    key: 'programs_speciality',
    section: CMS_SECTIONS.PROGRAMS,
    content_en: 'Speciality',
    content_ar: 'التخصص',
    description: 'Speciality filter label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_study_time',
    key: 'programs_study_time',
    section: CMS_SECTIONS.PROGRAMS,
    content_en: 'Study time',
    content_ar: 'وقت الدراسة',
    description: 'Study time filter label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_showing_count',
    key: 'programs_showing_count',
    section: CMS_SECTIONS.PROGRAMS,
    content_en: 'Showing {count} of {total} programs',
    content_ar: 'عرض {count} من {total} برنامج',
    description: 'Programs count display',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_no_results',
    key: 'programs_no_results',
    section: CMS_SECTIONS.PROGRAMS,
    content_en: 'No programs match your current filters.',
    content_ar: 'لا توجد برامج تطابق المرشحات الحالية.',
    description: 'No programs found message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_clear_filters',
    key: 'programs_clear_filters',
    section: CMS_SECTIONS.PROGRAMS,
    content_en: 'Clear Filters',
    content_ar: 'مسح المرشحات',
    description: 'Clear filters button',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_learn_more',
    key: 'programs_learn_more',
    section: CMS_SECTIONS.PROGRAMS,
    content_en: 'Learn More',
    content_ar: 'اعرف المزيد',
    description: 'Learn more button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // ABOUT PAGE CONTENT
  {
    id: 'about_title',
    key: 'about_title',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'About Us',
    content_ar: 'عن أوبتيموس',
    description: 'About page main title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_mission_title',
    key: 'about_mission_title',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Our Mission',
    content_ar: 'مهمتنا',
    description: 'About page mission section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_mission_description',
    key: 'about_mission_description',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'To provide world-class education that empowers professionals to excel in their careers and make a positive impact in their communities.',
    content_ar: 'تقديم تعليم عالمي المستوى يمكّن المهنيين من التفوق في مهنهم وإحداث تأثير إيجابي في مجتمعاتهم.',
    description: 'About page mission description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_stats_students',
    key: 'about_stats_students',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Students Worldwide',
    content_ar: 'طالب حول العالم',
    description: 'Students statistics label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_stats_programs',
    key: 'about_stats_programs',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Programs Available',
    content_ar: 'برنامج متاح',
    description: 'Programs statistics label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_stats_satisfaction',
    key: 'about_stats_satisfaction',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Satisfaction Rate',
    content_ar: 'معدل الرضا',
    description: 'Satisfaction statistics label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_stats_support',
    key: 'about_stats_support',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: '24/7 Support',
    content_ar: 'دعم على مدار الساعة',
    description: 'Support statistics label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_why_choose_title',
    key: 'about_why_choose_title',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Why Choose Optimus?',
    content_ar: 'لماذا تختار أوبتيموس؟',
    description: 'Why choose section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_why_choose_subtitle',
    key: 'about_why_choose_subtitle',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Discover what sets us apart in the world of professional education.',
    content_ar: 'اكتشف ما يميزنا في عالم التعليم المهني.',
    description: 'Why choose section subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_accreditations_title',
    key: 'about_accreditations_title',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Global Accreditations',
    content_ar: 'الاعتمادات العالمية',
    description: 'Accreditations section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_accreditations_subtitle',
    key: 'about_accreditations_subtitle',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Our programs are recognized by leading international bodies.',
    content_ar: 'برامجنا معترف بها من قبل الهيئات الدولية الرائدة',
    description: 'Accreditations section subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_faculty_title',
    key: 'about_faculty_title',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Expert Faculty',
    content_ar: 'أعضاء هيئة تدريس خبراء',
    description: 'Faculty section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_faculty_subtitle',
    key: 'about_faculty_subtitle',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Learn from industry leaders and academic experts with real-world experience.',
    content_ar: 'تعلم من قادة الصناعة والخبراء الأكاديميين ذوي الخبرة الواقعية.',
    description: 'Faculty section subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_accredited_title',
    key: 'about_accredited_title',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Internationally Accredited',
    content_ar: 'معتمد دولياً',
    description: 'Accredited feature title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_accredited_desc',
    key: 'about_accredited_desc',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Our qualifications are recognized worldwide by employers and institutions.',
    content_ar: 'مؤهلاتنا معترف بها عالمياً من قبل أصحاب العمل والمؤسسات.',
    description: 'Accredited feature description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_flexible_title',
    key: 'about_flexible_title',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Flexible Learning',
    content_ar: 'تعلم مرن',
    description: 'Flexible learning feature title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_flexible_desc',
    key: 'about_flexible_desc',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Study at your own pace with our fully online, self-paced learning platform.',
    content_ar: 'ادرس بالسرعة التي تناسبك مع منصة التعلم الذاتي عبر الإنترنت.',
    description: 'Flexible learning feature description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_career_title',
    key: 'about_career_title',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Career Advancement',
    content_ar: 'تطوير المهنة',
    description: 'Career advancement feature title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_career_desc',
    key: 'about_career_desc',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Gain practical skills and knowledge that directly impact your career growth.',
    content_ar: 'اكتسب مهارات ومعرفة عملية تؤثر مباشرة على نمو مسيرتك المهنية.',
    description: 'Career advancement feature description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // ACCREDITATIONS SECTION CONTENT
  {
    id: 'accreditations_title',
    key: 'accreditations_title',
    section: CMS_SECTIONS.ACCREDITATIONS,
    content_en: 'Accreditations & Partnerships',
    content_ar: 'الاعتمادات والشراكات',
    description: 'Accreditations page main title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'accreditations_subtitle',
    key: 'accreditations_subtitle',
    section: CMS_SECTIONS.ACCREDITATIONS,
    content_en: 'Our programs are recognized by leading educational institutions and industry bodies worldwide.',
    content_ar: 'برامجنا معترف بها من قبل المؤسسات التعليمية الرائدة والهيئات الصناعية في جميع أنحاء العالم.',
    description: 'Accreditations page subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'accreditations_main_title',
    key: 'accreditations_main_title',
    section: CMS_SECTIONS.ACCREDITATIONS,
    content_en: 'Accreditations',
    content_ar: 'الاعتمادات',
    description: 'Accreditations section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'accreditations_main_subtitle',
    key: 'accreditations_main_subtitle',
    section: CMS_SECTIONS.ACCREDITATIONS,
    content_en: 'Officially recognized and accredited by leading international bodies',
    content_ar: 'معترف بها رسمياً ومعتمدة من قبل الهيئات الدولية الرائدة',
    description: 'Accreditations section subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'accreditations_partnerships_title',
    key: 'accreditations_partnerships_title',
    section: CMS_SECTIONS.ACCREDITATIONS,
    content_en: 'Academic Partnerships',
    content_ar: 'الشراكات الأكاديمية',
    description: 'Academic partnerships section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'accreditations_partnerships_subtitle',
    key: 'accreditations_partnerships_subtitle',
    section: CMS_SECTIONS.ACCREDITATIONS,
    content_en: 'Collaborating with prestigious institutions to deliver exceptional education',
    content_ar: 'التعاون مع المؤسسات المرموقة لتقديم تعليم استثنائي',
    description: 'Academic partnerships section subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'accreditation_vern',
    key: 'accreditation_vern',
    section: CMS_SECTIONS.ACCREDITATIONS,
    content_en: 'VERN University of Applied Sciences',
    content_ar: 'جامعة فيرن للعلوم التطبيقية',
    description: 'VERN accreditation name',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'accreditation_ibas',
    key: 'accreditation_ibas',
    section: CMS_SECTIONS.ACCREDITATIONS,
    content_en: 'International Business Academy of Switzerland',
    content_ar: 'الأكاديمية الدولية للأعمال في سويسرا',
    description: 'IBAS accreditation name',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // CONTACT PAGE CONTENT
  {
    id: 'contact_title',
    key: 'contact_title',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Contact Us',
    content_ar: 'اتصل بنا',
    description: 'Contact page main title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_subtitle',
    key: 'contact_subtitle',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Get in touch with us to learn more about our programs or to schedule a consultation.',
    content_ar: 'تواصل معنا لمعرفة المزيد عن برامجنا أو لتحديد موعد استشارة.',
    description: 'Contact page subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_get_in_touch',
    key: 'contact_get_in_touch',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Get in Touch',
    content_ar: 'تواصل معنا',
    description: 'Get in touch section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_address_label',
    key: 'contact_address_label',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Address',
    content_ar: 'العنوان',
    description: 'Address label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_phone_label',
    key: 'contact_phone_label',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Phone',
    content_ar: 'الهاتف',
    description: 'Phone label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_email_label',
    key: 'contact_email_label',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Email',
    content_ar: 'البريد الإلكتروني',
    description: 'Email label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_specific_inquiries',
    key: 'contact_specific_inquiries',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Specific Inquiries',
    content_ar: 'استفسارات محددة',
    description: 'Specific inquiries section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_admissions_label',
    key: 'contact_admissions_label',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Admissions',
    content_ar: 'القبول',
    description: 'Admissions label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_support_label',
    key: 'contact_support_label',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Support',
    content_ar: 'الدعم',
    description: 'Support label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_marketing_label',
    key: 'contact_marketing_label',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Marketing',
    content_ar: 'التسويق',
    description: 'Marketing label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_operating_hours',
    key: 'contact_operating_hours',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Operating Hours',
    content_ar: 'ساعات العمل',
    description: 'Operating hours section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_monday',
    key: 'contact_monday',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Monday',
    content_ar: 'الاثنين',
    description: 'Monday label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_tuesday',
    key: 'contact_tuesday',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Tuesday',
    content_ar: 'الثلاثاء',
    description: 'Tuesday label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_wednesday',
    key: 'contact_wednesday',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Wednesday',
    content_ar: 'الأربعاء',
    description: 'Wednesday label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_thursday',
    key: 'contact_thursday',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Thursday',
    content_ar: 'الخميس',
    description: 'Thursday label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_friday',
    key: 'contact_friday',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Friday',
    content_ar: 'الجمعة',
    description: 'Friday label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_saturday',
    key: 'contact_saturday',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Saturday',
    content_ar: 'السبت',
    description: 'Saturday label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_sunday',
    key: 'contact_sunday',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Sunday',
    content_ar: 'الأحد',
    description: 'Sunday label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_closed',
    key: 'contact_closed',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Closed',
    content_ar: 'مغلق',
    description: 'Closed status for operating hours',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // CONTACT FORM CONTENT
  {
    id: 'contact_form_title',
    key: 'contact_form_title',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Send a Message',
    content_ar: 'أرسل رسالة',
    description: 'Contact form title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_name_label',
    key: 'contact_form_name_label',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Full Name',
    content_ar: 'الاسم الكامل',
    description: 'Contact form name field label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_name_placeholder',
    key: 'contact_form_name_placeholder',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Enter your full name',
    content_ar: 'أدخل اسمك الكامل',
    description: 'Contact form name field placeholder',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_email_label',
    key: 'contact_form_email_label',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Email Address',
    content_ar: 'عنوان البريد الإلكتروني',
    description: 'Contact form email field label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_email_placeholder',
    key: 'contact_form_email_placeholder',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Enter your email address',
    content_ar: 'أدخل عنوان بريدك الإلكتروني',
    description: 'Contact form email field placeholder',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_phone_label',
    key: 'contact_form_phone_label',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Phone Number',
    content_ar: 'رقم الهاتف',
    description: 'Contact form phone field label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_phone_placeholder',
    key: 'contact_form_phone_placeholder',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Enter your phone number',
    content_ar: 'أدخل رقم هاتفك',
    description: 'Contact form phone field placeholder',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_inquiry_type',
    key: 'contact_form_inquiry_type',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Inquiry Type',
    content_ar: 'نوع الاستفسار',
    description: 'Contact form inquiry type field label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_select_inquiry',
    key: 'contact_form_select_inquiry',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Select inquiry type',
    content_ar: 'اختر نوع الاستفسار',
    description: 'Contact form inquiry type placeholder',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_inquiry_general',
    key: 'contact_inquiry_general',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'General Information',
    content_ar: 'معلومات عامة',
    description: 'General inquiry type option',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_inquiry_admissions',
    key: 'contact_inquiry_admissions',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Admissions',
    content_ar: 'القبول',
    description: 'Admissions inquiry type option',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_inquiry_programs',
    key: 'contact_inquiry_programs',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Program Information',
    content_ar: 'معلومات البرنامج',
    description: 'Programs inquiry type option',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_inquiry_financial',
    key: 'contact_inquiry_financial',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Financial Aid',
    content_ar: 'المساعدة المالية',
    description: 'Financial aid inquiry type option',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_inquiry_technical',
    key: 'contact_inquiry_technical',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Technical Support',
    content_ar: 'الدعم الفني',
    description: 'Technical support inquiry type option',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_inquiry_partnership',
    key: 'contact_inquiry_partnership',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Partnership Opportunities',
    content_ar: 'فرص الشراكة',
    description: 'Partnership inquiry type option',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_message_label',
    key: 'contact_form_message_label',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Message',
    content_ar: 'الرسالة',
    description: 'Contact form message field label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_message_placeholder',
    key: 'contact_form_message_placeholder',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Please describe your inquiry in detail...',
    content_ar: 'يرجى وصف استفسارك بالتفصيل...',
    description: 'Contact form message field placeholder',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_submit_button',
    key: 'contact_form_submit_button',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Send Message',
    content_ar: 'إرسال الرسالة',
    description: 'Contact form submit button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_sending',
    key: 'contact_form_sending',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Sending...',
    content_ar: 'جاري الإرسال...',
    description: 'Contact form sending state text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_success',
    key: 'contact_form_success',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Thank you for your message! We will get back to you soon.',
    content_ar: 'شكراً لك على رسالتك! سنعاود الاتصال بك قريباً.',
    description: 'Contact form success message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_error',
    key: 'contact_form_error',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'There was an error submitting your message. Please try again.',
    content_ar: 'حدث خطأ في إرسال رسالتك. يرجى المحاولة مرة أخرى.',
    description: 'Contact form error message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_disclaimer',
    key: 'contact_form_disclaimer',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'By submitting this form, you agree to receive communications from Optimus Education. We respect your privacy and will never share your information with third parties.',
    content_ar: 'بإرسال هذا النموذج، أنت توافق على تلقي اتصالات من أوبتيموس للتعليم. نحن نحترم خصوصيتك ولن نشارك معلوماتك مع أطراف ثالثة.',
    description: 'Contact form privacy disclaimer',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // BLOG PAGE CONTENT
  {
    id: 'blog_title',
    key: 'blog_title',
    section: CMS_SECTIONS.BLOG_PAGE,
    content_en: 'Blog & Insights',
    content_ar: 'المدونة والرؤى',
    description: 'Blog page main title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'blog_subtitle',
    key: 'blog_subtitle',
    section: CMS_SECTIONS.BLOG_PAGE,
    content_en: 'Stay updated with the latest trends in education, career development, and industry insights.',
    content_ar: 'ابق على اطلاع بأحدث الاتجاهات في التعليم والتطوير المهني ورؤى الصناعة.',
    description: 'Blog page subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'blog_noBlogPosts',
    key: 'blog_noBlogPosts',
    section: CMS_SECTIONS.BLOG_PAGE,
    content_en: 'No blog posts found.',
    content_ar: 'لم يتم العثور على مقالات مدونة',
    description: 'Message when no blog posts are found',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'blog_noBlogPostsDescription',
    key: 'blog_noBlogPostsDescription',
    section: CMS_SECTIONS.BLOG_PAGE,
    content_en: 'Learn more about Optimus Education and our mission to shape tomorrow\'s leaders.',
    content_ar: 'تعلم المزيد عن أوبتيموس للتعليم ومهمتنا لتشكيل قادة المستقبل',
    description: 'Description text for about page and when no blog posts found',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'blog_readMore',
    key: 'blog_readMore',
    section: CMS_SECTIONS.BLOG_PAGE,
    content_en: 'Read More',
    content_ar: 'اقرأ المزيد',
    description: 'Read more link text for blog posts',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // DASHBOARD CONTENT
  {
    id: 'dashboard_welcome_title',
    key: 'dashboard_welcome_title',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Welcome back',
    content_ar: 'مرحباً بعودتك',
    description: 'Dashboard welcome message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_progress_label',
    key: 'dashboard_progress_label',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Progress',
    content_ar: 'التقدم',
    description: 'Progress stats label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_lessons',
    key: 'dashboard_lessons',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'lessons',
    content_ar: 'دروس',
    description: 'Lessons unit label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_upcoming_deadlines_label',
    key: 'dashboard_upcoming_deadlines_label',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Upcoming Deadlines',
    content_ar: 'المواعيد النهائية القادمة',
    description: 'Upcoming deadlines stats label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_this_week',
    key: 'dashboard_this_week',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'this week',
    content_ar: 'هذا الأسبوع',
    description: 'This week label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_certificates_label',
    key: 'dashboard_certificates_label',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Certificates',
    content_ar: 'الشهادات',
    description: 'Certificates stats label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_earned',
    key: 'dashboard_earned',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'earned',
    content_ar: 'مكتسبة',
    description: 'Earned label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_enrolled_courses_label',
    key: 'dashboard_enrolled_courses_label',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Enrolled Courses',
    content_ar: 'الدورات المسجلة',
    description: 'Enrolled courses stats label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_active',
    key: 'dashboard_active',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'active',
    content_ar: 'نشطة',
    description: 'Active label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_recent_courses_title',
    key: 'dashboard_recent_courses_title',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Recent Courses',
    content_ar: 'الدورات الأخيرة',
    description: 'Recent courses section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_recent_activity_title',
    key: 'dashboard_recent_activity_title',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Recent Activity',
    content_ar: 'النشاط الأخير',
    description: 'Recent activity section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_no_recent_activity',
    key: 'dashboard_no_recent_activity',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'No recent activity',
    content_ar: 'لا يوجد نشاط حديث',
    description: 'No recent activity message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_quick_actions_title',
    key: 'dashboard_quick_actions_title',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Quick Actions',
    content_ar: 'إجراءات سريعة',
    description: 'Quick actions section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_browse_programs_action',
    key: 'dashboard_browse_programs_action',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Browse Programs',
    content_ar: 'تصفح البرامج',
    description: 'Browse programs action title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_explore_courses',
    key: 'dashboard_explore_courses',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Explore available courses',
    content_ar: 'استكشف الدورات المتاحة',
    description: 'Explore courses description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_view_schedule_action',
    key: 'dashboard_view_schedule_action',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'View Schedule',
    content_ar: 'عرض الجدول',
    description: 'View schedule action title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_check_calendar',
    key: 'dashboard_check_calendar',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Check your calendar',
    content_ar: 'تحقق من التقويم الخاص بك',
    description: 'Check calendar description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_certificates_action',
    key: 'dashboard_certificates_action',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Certificates',
    content_ar: 'الشهادات',
    description: 'Certificates action title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_view_achievements',
    key: 'dashboard_view_achievements',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'View your achievements',
    content_ar: 'عرض إنجازاتك',
    description: 'View achievements description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_student_label',
    key: 'dashboard_student_label',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'STUDENT',
    content_ar: 'طالب',
    description: 'Student role label in sidebar',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_admin_label',
    key: 'dashboard_admin_label',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'ADMIN',
    content_ar: 'مشرف',
    description: 'Admin role label in sidebar',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_view_profile',
    key: 'dashboard_view_profile',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'View Profile',
    content_ar: 'عرض الملف الشخصي',
    description: 'View profile link text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_log_out',
    key: 'dashboard_log_out',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Log out',
    content_ar: 'تسجيل الخروج',
    description: 'Log out button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // ADMIN DASHBOARD CONTENT
  {
    id: 'admin_dashboard_title',
    key: 'admin_dashboard_title',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Admin Dashboard',
    content_ar: 'لوحة تحكم المشرف',
    description: 'Admin dashboard page title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_dashboard_subtitle',
    key: 'admin_dashboard_subtitle',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Welcome to Optimus Education admin panel',
    content_ar: 'مرحبًا بك في لوحة تحكم أوبتيموس للتعليم',
    description: 'Admin dashboard subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_total_programs',
    key: 'admin_total_programs',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Total Programs',
    content_ar: 'إجمالي البرامج',
    description: 'Total programs stat label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_total_users',
    key: 'admin_total_users',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Total Users',
    content_ar: 'إجمالي المستخدمين',
    description: 'Total users stat label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_total_courses',
    key: 'admin_total_courses',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Total Courses',
    content_ar: 'إجمالي الدورات',
    description: 'Total courses stat label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_total_enrollments',
    key: 'admin_total_enrollments',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Total Enrollments',
    content_ar: 'إجمالي التسجيلات',
    description: 'Total enrollments stat label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_quick_actions',
    key: 'admin_quick_actions',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Quick Actions',
    content_ar: 'إجراءات سريعة',
    description: 'Quick actions section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_create_program',
    key: 'admin_create_program',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Create Program',
    content_ar: 'إنشاء برنامج',
    description: 'Create program action',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_add_user',
    key: 'admin_add_user',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Add User',
    content_ar: 'إضافة مستخدم',
    description: 'Add user action',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // ADMIN SETTINGS CONTENT
  {
    id: 'admin_settings_subtitle',
    key: 'admin_settings_subtitle',
    section: CMS_SECTIONS.SOCIAL_MEDIA_SETTINGS,
    content_en: "Manage your website's social media links and other settings",
    content_ar: 'إدارة روابط وسائل التواصل الاجتماعي وإعدادات أخرى لموقعك',
    description: 'Settings page subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_settings_preview',
    key: 'admin_settings_preview',
    section: CMS_SECTIONS.SOCIAL_MEDIA_SETTINGS,
    content_en: 'Preview',
    content_ar: 'معاينة',
    description: 'Preview section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // ADMIN PROGRAMS MANAGEMENT CONTENT
  {
    id: 'admin_program_management_title',
    key: 'admin_program_management_title',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Program Management',
    content_ar: 'إدارة البرامج',
    description: 'Program management page title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_filter_programs',
    key: 'admin_filter_programs',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Filter Programs:',
    content_ar: 'تصفية البرامج:',
    description: 'Filter programs label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_all_status',
    key: 'admin_all_status',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'All Status',
    content_ar: 'جميع الحالات',
    description: 'All status filter option',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_published',
    key: 'admin_published',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Published',
    content_ar: 'منشور',
    description: 'Published status',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_draft',
    key: 'admin_draft',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Draft',
    content_ar: 'مسودة',
    description: 'Draft status',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_all_types',
    key: 'admin_all_types',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'All Types',
    content_ar: 'جميع الأنواع',
    description: 'All types filter option',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_admin_created',
    key: 'admin_admin_created',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Admin Created',
    content_ar: 'أنشأه المشرف',
    description: 'Admin created filter option',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_template_programs',
    key: 'admin_template_programs',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Template Programs',
    content_ar: 'برامج نموذجية',
    description: 'Template programs filter option',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_sort',
    key: 'admin_sort',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Sort',
    content_ar: 'ترتيب',
    description: 'Sort button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_no_programs_found',
    key: 'admin_no_programs_found',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'No programs found',
    content_ar: 'لم يتم العثور على برامج',
    description: 'No programs found message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_delete_confirmation',
    key: 'admin_delete_confirmation',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Are you sure you want to delete this program? This action cannot be undone.',
    content_ar: 'هل أنت متأكد من رغبتك في حذف هذا البرنامج؟ لا يمكن التراجع عن هذا الإجراء.',
    description: 'Delete program confirmation message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_type_label',
    key: 'admin_type_label',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Type:',
    content_ar: 'النوع:',
    description: 'Type label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_speciality_label',
    key: 'admin_speciality_label',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Speciality:',
    content_ar: 'التخصص:',
    description: 'Speciality label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_price_label',
    key: 'admin_price_label',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Price:',
    content_ar: 'السعر:',
    description: 'Price label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'admin_duration_label',
    key: 'admin_duration_label',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Duration:',
    content_ar: 'المدة:',
    description: 'Duration label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // CMS PAGE ADDITIONAL CONTENT
  {
    id: 'cms_page_subtitle',
    key: 'cms_page_subtitle',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Manage all website text content in English and Arabic',
    content_ar: 'إدارة جميع محتوى النص في الموقع باللغتين الإنجليزية والعربية',
    description: 'CMS page subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // GENERAL LABELS
  {
    id: 'label_loading',
    key: 'label_loading',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Loading...',
    content_ar: 'جاري التحميل...',
    description: 'Loading state text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_save',
    key: 'label_save',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Save',
    content_ar: 'حفظ',
    description: 'Save button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_cancel',
    key: 'label_cancel',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Cancel',
    content_ar: 'إلغاء',
    description: 'Cancel button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_edit',
    key: 'label_edit',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Edit',
    content_ar: 'تعديل',
    description: 'Edit button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_delete',
    key: 'label_delete',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Delete',
    content_ar: 'حذف',
    description: 'Delete button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_add',
    key: 'label_add',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Add',
    content_ar: 'إضافة',
    description: 'Add button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_create',
    key: 'label_create',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Create',
    content_ar: 'إنشاء',
    description: 'Create button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_update',
    key: 'label_update',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Update',
    content_ar: 'تحديث',
    description: 'Update button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_submit',
    key: 'label_submit',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Submit',
    content_ar: 'إرسال',
    description: 'Submit button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_back',
    key: 'label_back',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Back',
    content_ar: 'رجوع',
    description: 'Back button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_next',
    key: 'label_next',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Next',
    content_ar: 'التالي',
    description: 'Next button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_previous',
    key: 'label_previous',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Previous',
    content_ar: 'السابق',
    description: 'Previous button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_search',
    key: 'label_search',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Search',
    content_ar: 'بحث',
    description: 'Search button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_filter',
    key: 'label_filter',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Filter',
    content_ar: 'تصفية',
    description: 'Filter button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_reset',
    key: 'label_reset',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Reset',
    content_ar: 'إعادة تعيين',
    description: 'Reset button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_close',
    key: 'label_close',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Close',
    content_ar: 'إغلاق',
    description: 'Close button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_yes',
    key: 'label_yes',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Yes',
    content_ar: 'نعم',
    description: 'Yes button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_no',
    key: 'label_no',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'No',
    content_ar: 'لا',
    description: 'No button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_confirm',
    key: 'label_confirm',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Confirm',
    content_ar: 'تأكيد',
    description: 'Confirm button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_download',
    key: 'label_download',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Download',
    content_ar: 'تحميل',
    description: 'Download button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_upload',
    key: 'label_upload',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Upload',
    content_ar: 'رفع',
    description: 'Upload button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_view',
    key: 'label_view',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'View',
    content_ar: 'عرض',
    description: 'View button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_details',
    key: 'label_details',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Details',
    content_ar: 'تفاصيل',
    description: 'Details button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_select',
    key: 'label_select',
    section: CMS_SECTIONS.FORM_LABELS,
    content_en: 'Select',
    content_ar: 'اختر',
    description: 'Select label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_select_type',
    key: 'label_select_type',
    section: CMS_SECTIONS.FORM_LABELS,
    content_en: 'Select Type',
    content_ar: 'اختر النوع',
    description: 'Select type placeholder',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_weeks',
    key: 'label_weeks',
    section: CMS_SECTIONS.FORM_LABELS,
    content_en: 'weeks',
    content_ar: 'أسابيع',
    description: 'Weeks unit label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_minutes',
    key: 'label_minutes',
    section: CMS_SECTIONS.FORM_LABELS,
    content_en: 'min',
    content_ar: 'دقيقة',
    description: 'Minutes abbreviation',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_try_adjusting_filters',
    key: 'label_try_adjusting_filters',
    section: CMS_SECTIONS.ERROR_MESSAGES,
    content_en: 'Try adjusting your search criteria or filters.',
    content_ar: 'حاول تعديل معايير البحث أو المرشحات.',
    description: 'Try adjusting filters message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // PROFILE PAGE CONTENT
  {
    id: 'profile_not_authenticated_title',
    key: 'profile_not_authenticated_title',
    section: CMS_SECTIONS.PROFILE_PAGE,
    content_en: 'Not Authenticated',
    content_ar: 'غير مصدق',
    description: 'Not authenticated title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'profile_please_login',
    key: 'profile_please_login',
    section: CMS_SECTIONS.PROFILE_PAGE,
    content_en: 'Please log in to view your profile',
    content_ar: 'يرجى تسجيل الدخول لعرض ملفك الشخصي',
    description: 'Please login message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'profile_personal_info',
    key: 'profile_personal_info',
    section: CMS_SECTIONS.PROFILE_PAGE,
    content_en: 'Personal Information',
    content_ar: 'المعلومات الشخصية',
    description: 'Personal information section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'profile_display_name',
    key: 'profile_display_name',
    section: CMS_SECTIONS.PROFILE_PAGE,
    content_en: 'Display Name',
    content_ar: 'اسم العرض',
    description: 'Display name label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'profile_no_name_set',
    key: 'profile_no_name_set',
    section: CMS_SECTIONS.PROFILE_PAGE,
    content_en: 'No name set',
    content_ar: 'لم يتم تعيين اسم',
    description: 'No name set placeholder',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'profile_your_user_id',
    key: 'profile_your_user_id',
    section: CMS_SECTIONS.PROFILE_PAGE,
    content_en: 'Your User ID:',
    content_ar: 'معرف المستخدم الخاص بك:',
    description: 'User ID label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'profile_update_success',
    key: 'profile_update_success',
    section: CMS_SECTIONS.PROFILE_PAGE,
    content_en: 'Profile updated successfully',
    content_ar: 'تم تحديث الملف الشخصي بنجاح',
    description: 'Profile update success message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'profile_firebase_instructions',
    key: 'profile_firebase_instructions',
    section: CMS_SECTIONS.PROFILE_PAGE,
    content_en: 'Navigate to the Firebase Console',
    content_ar: 'انتقل إلى وحدة تحكم Firebase',
    description: 'Firebase instruction step 1',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // REGISTRATION FORM CONTENT
  {
    id: 'registration_personal_info',
    key: 'registration_personal_info',
    section: CMS_SECTIONS.REGISTER_PAGE,
    content_en: 'Personal Information',
    content_ar: 'المعلومات الشخصية',
    description: 'Registration step 1 title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'registration_academic_info',
    key: 'registration_academic_info',
    section: CMS_SECTIONS.REGISTER_PAGE,
    content_en: 'Academic Information',
    content_ar: 'المعلومات الأكاديمية',
    description: 'Registration step 2 title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'registration_additional_info',
    key: 'registration_additional_info',
    section: CMS_SECTIONS.REGISTER_PAGE,
    content_en: 'Additional Information',
    content_ar: 'معلومات إضافية',
    description: 'Registration step 3 title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'registration_successful_title',
    key: 'registration_successful_title',
    section: CMS_SECTIONS.REGISTER_PAGE,
    content_en: 'Registration Successful!',
    content_ar: 'تم التسجيل بنجاح!',
    description: 'Registration success title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'registration_error_alert',
    key: 'registration_error_alert',
    section: CMS_SECTIONS.REGISTER_PAGE,
    content_en: 'There was an error submitting your form. Please try again later.',
    content_ar: 'حدث خطأ في إرسال النموذج. يرجى المحاولة مرة أخرى لاحقًا.',
    description: 'Registration error alert',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // PROGRAM DETAIL CONTENT
  {
    id: 'program_request_info_title',
    key: 'program_request_info_title',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Request Information',
    content_ar: 'طلب معلومات',
    description: 'Request information form title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_info_submitted',
    key: 'program_info_submitted',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Your information has been submitted successfully. Our team will contact you shortly.',
    content_ar: 'تم إرسال معلوماتك بنجاح. سيتواصل معك فريقنا قريبًا.',
    description: 'Program info submitted success message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_download_brochure',
    key: 'program_download_brochure',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Downloading program brochure...',
    content_ar: 'جاري تحميل كتيب البرنامج...',
    description: 'Download brochure message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_get_detailed_info',
    key: 'program_get_detailed_info',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Get detailed information about this program, including curriculum, fees, and admission requirements.',
    content_ar: 'احصل على معلومات مفصلة حول هذا البرنامج، بما في ذلك المنهج والرسوم ومتطلبات القبول.',
    description: 'Get detailed info description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // LANDING PAGE CONTENT
  {
    id: 'landing_join_thousands',
    key: 'landing_join_thousands',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Join thousands of successful professionals who have advanced their careers with Optimus Education',
    content_ar: 'انضم إلى آلاف المحترفين الناجحين الذين طوروا مسيراتهم المهنية مع أوبتيموس للتعليم',
    description: 'Landing page hero text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'landing_request_program_info',
    key: 'landing_request_program_info',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Request Program Information',
    content_ar: 'طلب معلومات البرنامج',
    description: 'Landing page form title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'landing_request_submitted',
    key: 'landing_request_submitted',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Your request has been submitted successfully. Our admissions team will contact you shortly.',
    content_ar: 'تم إرسال طلبك بنجاح. سيتواصل معك فريق القبول قريبًا.',
    description: 'Landing page success message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'landing_submitting',
    key: 'landing_submitting',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Submitting...',
    content_ar: 'جاري الإرسال...',
    description: 'Submitting button state',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'landing_request_information',
    key: 'landing_request_information',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Request Information',
    content_ar: 'طلب معلومات',
    description: 'Request information button',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // SUCCESS/ERROR MESSAGES
  {
    id: 'message_content_updated',
    key: 'message_content_updated',
    section: CMS_SECTIONS.SUCCESS_MESSAGES,
    content_en: 'Content updated successfully! Changes are now live on the website.',
    content_ar: 'تم تحديث المحتوى بنجاح! التغييرات الآن مباشرة على الموقع.',
    description: 'Content update success message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'message_content_update_failed',
    key: 'message_content_update_failed',
    section: CMS_SECTIONS.ERROR_MESSAGES,
    content_en: 'Failed to update content. Please try again.',
    content_ar: 'فشل تحديث المحتوى. يرجى المحاولة مرة أخرى.',
    description: 'Content update error message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'message_save_failed',
    key: 'message_save_failed',
    section: CMS_SECTIONS.ERROR_MESSAGES,
    content_en: 'Failed to save. Please try again.',
    content_ar: 'فشل الحفظ. يرجى المحاولة مرة أخرى.',
    description: 'Generic save error message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'message_load_failed',
    key: 'message_load_failed',
    section: CMS_SECTIONS.ERROR_MESSAGES,
    content_en: 'Failed to load. Please try again.',
    content_ar: 'فشل التحميل. يرجى المحاولة مرة أخرى.',
    description: 'Generic load error message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // IMPORT PROGRAMS CONTENT
  {
    id: 'import_success_message',
    key: 'import_success_message',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Successfully imported {count} of {total} programs',
    content_ar: 'تم استيراد {count} من {total} برنامج بنجاح',
    description: 'Import success message with placeholders',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'import_failed_label',
    key: 'import_failed_label',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Failed:',
    content_ar: 'فشل:',
    description: 'Failed import label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'import_failed_to_import',
    key: 'import_failed_to_import',
    section: CMS_SECTIONS.ADMIN_DASHBOARD,
    content_en: 'Failed to import {count} programs:',
    content_ar: 'فشل استيراد {count} برنامج:',
    description: 'Failed import count message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // GENERAL INFO LABELS
  {
    id: 'label_info',
    key: 'label_info',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Info',
    content_ar: 'معلومات',
    description: 'Info label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_basic_info',
    key: 'label_basic_info',
    section: CMS_SECTIONS.FORM_LABELS,
    content_en: 'Basic Info',
    content_ar: 'معلومات أساسية',
    description: 'Basic info section label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_additional_info',
    key: 'label_additional_info',
    section: CMS_SECTIONS.FORM_LABELS,
    content_en: 'Additional Info',
    content_ar: 'معلومات إضافية',
    description: 'Additional info section label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_student',
    key: 'label_student',
    section: CMS_SECTIONS.FORM_LABELS,
    content_en: 'Student',
    content_ar: 'طالب',
    description: 'Student role label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'label_admin',
    key: 'label_admin',
    section: CMS_SECTIONS.FORM_LABELS,
    content_en: 'Admin',
    content_ar: 'مشرف',
    description: 'Admin role label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  }
];

// Function to get content by key
export function getContentByKey(key: string): CMSContent | undefined {
  return extractedContent.find(item => item.key === key);
}

// Function to get all content for a section
export function getContentBySection(section: string): CMSContent[] {
  return extractedContent.filter(item => item.section === section);
} 