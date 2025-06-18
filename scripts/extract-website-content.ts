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
    content_ar: 'ماجستير إدارة الأعمال . دكتوراه',
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
    content_ar: 'تعليم الأعمال الأساسي مع التخصصات في الإدارة والمالية والتسويق والأعمال الدولية.',
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
    content_ar: 'إدارة الأعمال المتقدمة مع أشكال مرنة تشمل التنفيذي والإنترنت والمسارات الصناعية المتخصصة.',
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
    content_ar: 'دكتوراه تركز على البحث لتطوير قادة الفكر الذين يقودون الابتكار في ممارسة الأعمال والنظرية.',
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
    content_en: '© 2024 OPTIMUS Education. All rights reserved.',
    content_ar: '© 2024 أوبتيموس للتعليم. جميع الحقوق محفوظة.',
    description: 'Footer copyright text',
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
    id: 'footer_contact_address',
    key: 'footer_contact_address',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Riyadh, Saudi Arabia',
    content_ar: 'الرياض، المملكة العربية السعودية',
    description: 'Footer contact address',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_contact_phone',
    key: 'footer_contact_phone',
    section: CMS_SECTIONS.FOOTER,
    content_en: '+966 11 123 4567',
    content_ar: '+966 11 123 4567',
    description: 'Footer contact phone',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'footer_contact_email',
    key: 'footer_contact_email',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'info@optimus.edu.sa',
    content_ar: 'info@optimus.edu.sa',
    description: 'Footer contact email',
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
    id: 'footer_terms_of_service',
    key: 'footer_terms_of_service',
    section: CMS_SECTIONS.FOOTER,
    content_en: 'Terms of Service',
    content_ar: 'شروط الخدمة',
    description: 'Footer terms of service link',
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
    id: 'dashboard_enrolled_courses',
    key: 'dashboard_enrolled_courses',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'You are enrolled in {count} courses.',
    content_ar: 'أنت مسجل في {count} دورات.',
    description: 'Dashboard enrolled courses text (use {count} as placeholder)',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_get_started',
    key: 'dashboard_get_started',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Get Started',
    content_ar: 'ابدأ الآن',
    description: 'Dashboard get started button',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_progress_title',
    key: 'dashboard_progress_title',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Progress',
    content_ar: 'التقدم',
    description: 'Dashboard progress card title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_deadlines_title',
    key: 'dashboard_deadlines_title',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Upcoming Deadlines',
    content_ar: 'المواعيد النهائية القادمة',
    description: 'Dashboard deadlines card title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_certificates_title',
    key: 'dashboard_certificates_title',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Certificates',
    content_ar: 'الشهادات',
    description: 'Dashboard certificates card title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_recent_courses',
    key: 'dashboard_recent_courses',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Recent Courses',
    content_ar: 'الدورات الأخيرة',
    description: 'Dashboard recent courses section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_no_courses',
    key: 'dashboard_no_courses',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'No courses enrolled yet',
    content_ar: 'لم يتم التسجيل في أي دورات بعد',
    description: 'Dashboard no courses message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'dashboard_browse_programs',
    key: 'dashboard_browse_programs',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Browse Programs',
    content_ar: 'تصفح البرامج',
    description: 'Dashboard browse programs button',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // METADATA AND SEO
  {
    id: 'meta_title',
    key: 'meta_title',
    section: CMS_SECTIONS.METADATA,
    content_en: "OPTIMUS Education - Shaping Tomorrow's Leaders",
    content_ar: 'أوبتيموس للتعليم - تشكيل قادة الغد',
    description: 'Main website title for SEO',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'meta_description',
    key: 'meta_description',
    section: CMS_SECTIONS.METADATA,
    content_en: "Discover our online MBA and PHD programs designed for future leaders in KSA",
    content_ar: 'اكتشف برامج البكالوريوس وماجستير إدارة الأعمال ودكتوراه إدارة الأعمال المصممة لقادة المستقبل في المملكة العربية السعودية .',
    description: 'Main website description for SEO',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'meta_keywords',
    key: 'meta_keywords',
    section: CMS_SECTIONS.METADATA,
    content_en: 'education, UAE education, MBA, DBA, bachelor degree, Middle East, online courses, leadership',
    content_ar: 'التعليم، التعليم في الإمارات، ماجستير إدارة الأعمال، دكتوراه إدارة الأعمال، درجة البكالوريوس، الشرق الأوسط، الدورات عبر الإنترنت، القيادة',
    description: 'SEO keywords',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // BLOG PREVIEW CONTENT
  {
    id: 'blog_preview_title',
    key: 'blog_preview_title',
    section: CMS_SECTIONS.BLOG_PREVIEW,
    content_en: 'Latest Insights',
    content_ar: 'أحدث الرؤى',
    description: 'Blog preview section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'blog_preview_subtitle',
    key: 'blog_preview_subtitle',
    section: CMS_SECTIONS.BLOG_PREVIEW,
    content_en: 'Stay informed with our latest articles on education, business trends, and industry insights.',
    content_ar: 'ابق على اطلاع بأحدث مقالاتنا حول التعليم واتجاهات الأعمال ورؤى الصناعة.',
    description: 'Blog preview section subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'blog_post1_title',
    key: 'blog_post1_title',
    section: CMS_SECTIONS.BLOG_PREVIEW,
    content_en: 'The Future of Business Education',
    content_ar: 'مستقبل تعليم الأعمال',
    description: 'Blog post 1 title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'blog_post1_excerpt',
    key: 'blog_post1_excerpt',
    section: CMS_SECTIONS.BLOG_PREVIEW,
    content_en: 'Discover how business education is evolving to meet the demands of the modern economy.',
    content_ar: 'اكتشف كيف يتطور تعليم الأعمال لتلبية متطلبات الاقتصاد الحديث.',
    description: 'Blog post 1 excerpt',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'blog_post2_title',
    key: 'blog_post2_title',
    section: CMS_SECTIONS.BLOG_PREVIEW,
    content_en: 'Leadership in the Digital Age',
    content_ar: 'القيادة في العصر الرقمي',
    description: 'Blog post 2 title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'blog_post2_excerpt',
    key: 'blog_post2_excerpt',
    section: CMS_SECTIONS.BLOG_PREVIEW,
    content_en: 'Learn about the essential leadership skills needed to thrive in our digital world.',
    content_ar: 'تعرف على مهارات القيادة الأساسية اللازمة للازدهار في عالمنا الرقمي.',
    description: 'Blog post 2 excerpt',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'blog_post3_title',
    key: 'blog_post3_title',
    section: CMS_SECTIONS.BLOG_PREVIEW,
    content_en: 'Building Tomorrow\'s Workforce',
    content_ar: 'بناء قوة العمل للغد',
    description: 'Blog post 3 title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'blog_post3_excerpt',
    key: 'blog_post3_excerpt',
    section: CMS_SECTIONS.BLOG_PREVIEW,
    content_en: 'Exploring the skills and knowledge required for the workforce of tomorrow.',
    content_ar: 'استكشاف المهارات والمعرفة المطلوبة لقوة العمل في المستقبل.',
    description: 'Blog post 3 excerpt',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'blog_read_more',
    key: 'blog_read_more',
    section: CMS_SECTIONS.BLOG_PREVIEW,
    content_en: 'Read More',
    content_ar: 'اقرأ المزيد',
    description: 'Blog read more link text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'blog_view_all',
    key: 'blog_view_all',
    section: CMS_SECTIONS.BLOG_PREVIEW,
    content_en: 'View All Articles',
    content_ar: 'عرض جميع المقالات',
    description: 'Blog view all articles button',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // ACCREDITATIONS CONTENT
  {
    id: 'accreditations_title',
    key: 'accreditations_title',
    section: CMS_SECTIONS.ACCREDITATIONS,
    content_en: 'Accreditations & Partnerships',
    content_ar: 'الاعتمادات والشراكات',
    description: 'Accreditations section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'accreditations_subtitle',
    key: 'accreditations_subtitle',
    section: CMS_SECTIONS.ACCREDITATIONS,
    content_en: 'Our programs are recognized by leading educational institutions and industry bodies worldwide.',
    content_ar: 'برامجنا معترف بها من قبل المؤسسات التعليمية الرائدة والهيئات الصناعية في جميع أنحاء العالم.',
    description: 'Accreditations section subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // WHATSAPP BUTTON CONTENT
  {
    id: 'whatsapp_button_text',
    key: 'whatsapp_button_text',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Chat with us',
    content_ar: 'تحدث معنا',
    description: 'WhatsApp button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // COOKIE CONSENT CONTENT
  {
    id: 'cookie_consent_message',
    key: 'cookie_consent_message',
    section: CMS_SECTIONS.COOKIE_CONSENT,
    content_en: 'We use cookies to enhance your browsing experience and provide personalized content.',
    content_ar: 'نحن نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتقديم محتوى مخصص.',
    description: 'Cookie consent message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'cookie_consent_accept',
    key: 'cookie_consent_accept',
    section: CMS_SECTIONS.COOKIE_CONSENT,
    content_en: 'Accept',
    content_ar: 'موافق',
    description: 'Cookie consent accept button',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'cookie_consent_decline',
    key: 'cookie_consent_decline',
    section: CMS_SECTIONS.COOKIE_CONSENT,
    content_en: 'Decline',
    content_ar: 'رفض',
    description: 'Cookie consent decline button',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // CONTACT FORM CONTENT
  {
    id: 'contact_form_title',
    key: 'contact_form_title',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Get in Touch',
    content_ar: 'تواصل معنا',
    description: 'Contact form title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_name_label',
    key: 'contact_form_name_label',
    section: CMS_SECTIONS.FORM_LABELS,
    content_en: 'Full Name',
    content_ar: 'الاسم الكامل',
    description: 'Contact form name field label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_email_label',
    key: 'contact_form_email_label',
    section: CMS_SECTIONS.FORM_LABELS,
    content_en: 'Email Address',
    content_ar: 'عنوان البريد الإلكتروني',
    description: 'Contact form email field label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_phone_label',
    key: 'contact_form_phone_label',
    section: CMS_SECTIONS.FORM_LABELS,
    content_en: 'Phone Number',
    content_ar: 'رقم الهاتف',
    description: 'Contact form phone field label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_subject_label',
    key: 'contact_form_subject_label',
    section: CMS_SECTIONS.FORM_LABELS,
    content_en: 'Subject',
    content_ar: 'الموضوع',
    description: 'Contact form subject field label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_message_label',
    key: 'contact_form_message_label',
    section: CMS_SECTIONS.FORM_LABELS,
    content_en: 'Message',
    content_ar: 'الرسالة',
    description: 'Contact form message field label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_form_submit_button',
    key: 'contact_form_submit_button',
    section: CMS_SECTIONS.BUTTONS,
    content_en: 'Send Message',
    content_ar: 'إرسال الرسالة',
    description: 'Contact form submit button',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // NETWORK STATUS CONTENT
  {
    id: 'network_status_offline',
    key: 'network_status_offline',
    section: CMS_SECTIONS.ERROR_MESSAGES,
    content_en: 'You are currently offline. Some features may be unavailable.',
    content_ar: 'أنت غير متصل حالياً. قد تكون بعض الميزات غير متاحة.',
    description: 'Network status offline message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'network_status_online',
    key: 'network_status_online',
    section: CMS_SECTIONS.SUCCESS_MESSAGES,
    content_en: 'Connection restored',
    content_ar: 'تم استعادة الاتصال',
    description: 'Network status online message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // LOGIN PAGE CONTENT
  {
    id: 'login_page_title',
    key: 'login_page_title',
    section: CMS_SECTIONS.LOGIN_PAGE,
    content_en: 'Sign in to your account',
    content_ar: 'تسجيل الدخول إلى حسابك',
    description: 'Login page main title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'login_email_placeholder',
    key: 'login_email_placeholder',
    section: CMS_SECTIONS.LOGIN_PAGE,
    content_en: 'Email address',
    content_ar: 'عنوان البريد الإلكتروني',
    description: 'Login email field placeholder',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'login_password_placeholder',
    key: 'login_password_placeholder',
    section: CMS_SECTIONS.LOGIN_PAGE,
    content_en: 'Password',
    content_ar: 'كلمة المرور',
    description: 'Login password field placeholder',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'login_forgot_password',
    key: 'login_forgot_password',
    section: CMS_SECTIONS.LOGIN_PAGE,
    content_en: 'Forgot your password?',
    content_ar: 'نسيت كلمة المرور؟',
    description: 'Forgot password link text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'login_signin_email_link',
    key: 'login_signin_email_link',
    section: CMS_SECTIONS.LOGIN_PAGE,
    content_en: 'Sign in with email link',
    content_ar: 'تسجيل الدخول برابط البريد الإلكتروني',
    description: 'Sign in with email link text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'login_button',
    key: 'login_button',
    section: CMS_SECTIONS.LOGIN_PAGE,
    content_en: 'Sign in',
    content_ar: 'تسجيل الدخول',
    description: 'Login button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'login_signing_in',
    key: 'login_signing_in',
    section: CMS_SECTIONS.LOGIN_PAGE,
    content_en: 'Signing in...',
    content_ar: 'جاري تسجيل الدخول...',
    description: 'Login loading state',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'login_no_account',
    key: 'login_no_account',
    section: CMS_SECTIONS.LOGIN_PAGE,
    content_en: "Don't have an account?",
    content_ar: 'ليس لديك حساب؟',
    description: 'No account text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'login_sign_up',
    key: 'login_sign_up',
    section: CMS_SECTIONS.LOGIN_PAGE,
    content_en: 'Sign up',
    content_ar: 'إنشاء حساب',
    description: 'Sign up link text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'login_error',
    key: 'login_error',
    section: CMS_SECTIONS.LOGIN_PAGE,
    content_en: 'Failed to sign in. Please check your credentials.',
    content_ar: 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.',
    description: 'Login error message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // REGISTER PAGE CONTENT
  {
    id: 'register_page_title',
    key: 'register_page_title',
    section: CMS_SECTIONS.REGISTER_PAGE,
    content_en: 'Create your account',
    content_ar: 'إنشاء حسابك',
    description: 'Register page main title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'register_page_subtitle',
    key: 'register_page_subtitle',
    section: CMS_SECTIONS.REGISTER_PAGE,
    content_en: 'Join Optimus Education to start your learning journey',
    content_ar: 'انضم إلى أوبتيموس للتعليم لبدء رحلتك التعليمية',
    description: 'Register page subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'register_name_placeholder',
    key: 'register_name_placeholder',
    section: CMS_SECTIONS.REGISTER_PAGE,
    content_en: 'Full Name',
    content_ar: 'الاسم الكامل',
    description: 'Register name field placeholder',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'register_email_placeholder',
    key: 'register_email_placeholder',
    section: CMS_SECTIONS.REGISTER_PAGE,
    content_en: 'Email address',
    content_ar: 'عنوان البريد الإلكتروني',
    description: 'Register email field placeholder',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'register_password_placeholder',
    key: 'register_password_placeholder',
    section: CMS_SECTIONS.REGISTER_PAGE,
    content_en: 'Password',
    content_ar: 'كلمة المرور',
    description: 'Register password field placeholder',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'register_confirm_password_placeholder',
    key: 'register_confirm_password_placeholder',
    section: CMS_SECTIONS.REGISTER_PAGE,
    content_en: 'Confirm Password',
    content_ar: 'تأكيد كلمة المرور',
    description: 'Register confirm password field placeholder',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'register_button',
    key: 'register_button',
    section: CMS_SECTIONS.REGISTER_PAGE,
    content_en: 'Create Account & Continue',
    content_ar: 'إنشاء حساب والمتابعة',
    description: 'Register button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'register_creating_account',
    key: 'register_creating_account',
    section: CMS_SECTIONS.REGISTER_PAGE,
    content_en: 'Creating Account...',
    content_ar: 'جاري إنشاء الحساب...',
    description: 'Register loading state',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'register_have_account',
    key: 'register_have_account',
    section: CMS_SECTIONS.REGISTER_PAGE,
    content_en: 'Already have an account?',
    content_ar: 'لديك حساب بالفعل؟',
    description: 'Already have account text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'register_sign_in',
    key: 'register_sign_in',
    section: CMS_SECTIONS.REGISTER_PAGE,
    content_en: 'Sign in',
    content_ar: 'تسجيل الدخول',
    description: 'Sign in link text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'register_password_mismatch',
    key: 'register_password_mismatch',
    section: CMS_SECTIONS.REGISTER_PAGE,
    content_en: 'Passwords do not match',
    content_ar: 'كلمات المرور غير متطابقة',
    description: 'Password mismatch error',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'register_error',
    key: 'register_error',
    section: CMS_SECTIONS.REGISTER_PAGE,
    content_en: 'Failed to create an account. Email may already be in use.',
    content_ar: 'فشل إنشاء الحساب. قد يكون البريد الإلكتروني مستخدمًا بالفعل.',
    description: 'Register error message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // PROGRAMS PAGE CONTENT
  {
    id: 'programs_page_title',
    key: 'programs_page_title',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Our Programs',
    content_ar: 'برامجنا',
    description: 'Programs page main title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_page_subtitle',
    key: 'programs_page_subtitle',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Discover our internationally accredited programs designed to advance your career',
    content_ar: 'اكتشف برامجنا المعتمدة دوليًا والمصممة لتطوير مسارك المهني',
    description: 'Programs page subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_live_enrollment',
    key: 'programs_live_enrollment',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: '🔥 Live enrollment for Spring 2024 - Apply now!',
    content_ar: '🔥 التسجيل مفتوح لربيع 2024 - قدم الآن!',
    description: 'Programs enrollment banner',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_filters_title',
    key: 'programs_filters_title',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Filters',
    content_ar: 'التصفية',
    description: 'Programs filters section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_clear_filters',
    key: 'programs_clear_filters',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Clear all',
    content_ar: 'مسح الكل',
    description: 'Clear filters button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_program_type',
    key: 'programs_program_type',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Program Type',
    content_ar: 'نوع البرنامج',
    description: 'Program type filter label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_speciality',
    key: 'programs_speciality',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Speciality',
    content_ar: 'التخصص',
    description: 'Speciality filter label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_study_time',
    key: 'programs_study_time',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Study Time',
    content_ar: 'وقت الدراسة',
    description: 'Study time filter label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_showing_count',
    key: 'programs_showing_count',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Showing {count} programs',
    content_ar: 'عرض {count} برنامج',
    description: 'Programs count display',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_no_results',
    key: 'programs_no_results',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'No programs match your current filters.',
    content_ar: 'لا توجد برامج تطابق معايير البحث الحالية.',
    description: 'No programs found message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_reset_filters',
    key: 'programs_reset_filters',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Reset Filters',
    content_ar: 'إعادة تعيين التصفية',
    description: 'Reset filters button',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_accredited_by',
    key: 'programs_accredited_by',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Accredited by:',
    content_ar: 'معتمد من:',
    description: 'Accreditation label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_enroll_now',
    key: 'programs_enroll_now',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Enroll Now',
    content_ar: 'سجل الآن',
    description: 'Enroll button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'programs_loading',
    key: 'programs_loading',
    section: CMS_SECTIONS.PROGRAMS_PAGE,
    content_en: 'Loading programs...',
    content_ar: 'جاري تحميل البرامج...',
    description: 'Programs loading message',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // ABOUT US PAGE CONTENT
  {
    id: 'about_mission_title',
    key: 'about_mission_title',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Our Mission',
    content_ar: 'مهمتنا',
    description: 'About page mission title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_mission_description',
    key: 'about_mission_description',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'OPTIMUS Education is dedicated to providing world-class business education that empowers professionals to achieve their full potential. We bridge the gap between academic excellence and practical business applications.',
    content_ar: 'تلتزم أوبتيموس للتعليم بتقديم تعليم أعمال عالمي المستوى يمكّن المحترفين من تحقيق إمكاناتهم الكاملة. نحن نسد الفجوة بين التميز الأكاديمي والتطبيقات العملية للأعمال.',
    description: 'About page mission description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_stats_students',
    key: 'about_stats_students',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Happy Students',
    content_ar: 'طلاب سعداء',
    description: 'Happy students stat label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_stats_programs',
    key: 'about_stats_programs',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Programs',
    content_ar: 'البرامج',
    description: 'Programs stat label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_stats_satisfaction',
    key: 'about_stats_satisfaction',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Satisfaction',
    content_ar: 'رضا العملاء',
    description: 'Satisfaction stat label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_stats_support',
    key: 'about_stats_support',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Support',
    content_ar: 'الدعم',
    description: 'Support stat label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_why_choose_title',
    key: 'about_why_choose_title',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Why Choose Optimus',
    content_ar: 'لماذا تختار أوبتيموس',
    description: 'Why choose section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_why_choose_subtitle',
    key: 'about_why_choose_subtitle',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'We provide more than just education - we provide a pathway to success',
    content_ar: 'نحن نقدم أكثر من مجرد تعليم - نحن نقدم طريقًا للنجاح',
    description: 'Why choose section subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_accredited_title',
    key: 'about_accredited_title',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Accredited Programs',
    content_ar: 'برامج معتمدة',
    description: 'Accredited programs feature title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_accredited_desc',
    key: 'about_accredited_desc',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'All our programs are internationally recognized and accredited by leading educational bodies.',
    content_ar: 'جميع برامجنا معترف بها دوليًا ومعتمدة من قبل الهيئات التعليمية الرائدة.',
    description: 'Accredited programs feature description',
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
    content_en: 'Study at your own pace with our online and blended learning options designed for working professionals.',
    content_ar: 'ادرس بالسرعة التي تناسبك مع خيارات التعلم عبر الإنترنت والمدمجة المصممة للمحترفين العاملين.',
    description: 'Flexible learning feature description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_career_title',
    key: 'about_career_title',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Career Support',
    content_ar: 'دعم مهني',
    description: 'Career support feature title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_career_desc',
    key: 'about_career_desc',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Get personalized career guidance and connect with our extensive network of industry partners.',
    content_ar: 'احصل على توجيه مهني شخصي واتصل بشبكتنا الواسعة من شركاء الصناعة.',
    description: 'Career support feature description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_accreditations_title',
    key: 'about_accreditations_title',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Accreditations & Partnerships',
    content_ar: 'الاعتمادات والشراكات',
    description: 'Accreditations section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_accreditations_subtitle',
    key: 'about_accreditations_subtitle',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Our programs are recognized by leading institutions worldwide',
    content_ar: 'برامجنا معترف بها من قبل المؤسسات الرائدة في جميع أنحاء العالم',
    description: 'Accreditations section subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_faculty_title',
    key: 'about_faculty_title',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Our Faculty',
    content_ar: 'هيئة التدريس',
    description: 'Faculty section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'about_faculty_subtitle',
    key: 'about_faculty_subtitle',
    section: CMS_SECTIONS.ABOUT_PAGE,
    content_en: 'Learn from experienced professionals and industry experts',
    content_ar: 'تعلم من المحترفين ذوي الخبرة وخبراء الصناعة',
    description: 'Faculty section subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // CONTACT FORM ADDITIONAL CONTENT
  {
    id: 'contact_form_alert',
    key: 'contact_form_alert',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Thank you for your interest! We will contact you shortly.',
    content_ar: 'شكرًا لاهتمامك! سنتواصل معك قريبًا.',
    description: 'Contact form success alert',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_select_program',
    key: 'contact_select_program',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Select Program',
    content_ar: 'اختر البرنامج',
    description: 'Select program label',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'contact_program_other',
    key: 'contact_program_other',
    section: CMS_SECTIONS.CONTACT_PAGE,
    content_en: 'Other',
    content_ar: 'أخرى',
    description: 'Other program option',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // PROGRAM OVERVIEW COMPONENT CONTENT
  {
    id: 'program_overview_title',
    key: 'program_overview_title',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Choose Your Path',
    content_ar: 'اختر مسارك',
    description: 'Program overview section title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_overview_subtitle',
    key: 'program_overview_subtitle',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Select the program that aligns with your career goals and aspirations',
    content_ar: 'اختر البرنامج الذي يتماشى مع أهدافك المهنية وطموحاتك',
    description: 'Program overview section subtitle',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_overview_live_enrollment',
    key: 'program_overview_live_enrollment',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: '🔥 Live enrollment for Spring 2024 - Apply now!',
    content_ar: '🔥 التسجيل مفتوح لربيع 2024 - قدم الآن!',
    description: 'Live enrollment banner',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_mba_executive_focus',
    key: 'program_mba_executive_focus',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Executive Leadership Focus',
    content_ar: 'التركيز على القيادة التنفيذية',
    description: 'MBA executive focus feature',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_mba_international',
    key: 'program_mba_international',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Internationally Recognized',
    content_ar: 'معترف به دوليًا',
    description: 'MBA international recognition feature',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_mba_flexible',
    key: 'program_mba_flexible',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Flexible Online Learning',
    content_ar: 'تعلم مرن عبر الإنترنت',
    description: 'MBA flexible learning feature',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_phd_research',
    key: 'program_phd_research',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Research Excellence',
    content_ar: 'التميز البحثي',
    description: 'PhD research feature',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_phd_academic',
    key: 'program_phd_academic',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Academic Recognition',
    content_ar: 'الاعتراف الأكاديمي',
    description: 'PhD academic recognition feature',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_phd_supervision',
    key: 'program_phd_supervision',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Expert Supervision',
    content_ar: 'إشراف خبير',
    description: 'PhD supervision feature',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_why_optimus_title',
    key: 'program_why_optimus_title',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Why Choose Optimus Education?',
    content_ar: 'لماذا تختار أوبتيموس للتعليم؟',
    description: 'Why choose Optimus title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_accredited_programs',
    key: 'program_accredited_programs',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Accredited Programs',
    content_ar: 'برامج معتمدة',
    description: 'Accredited programs feature title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_accredited_desc',
    key: 'program_accredited_desc',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Internationally recognized qualifications',
    content_ar: 'مؤهلات معترف بها دوليًا',
    description: 'Accredited programs description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_flexible_learning',
    key: 'program_flexible_learning',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Flexible Learning',
    content_ar: 'تعلم مرن',
    description: 'Flexible learning feature title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_flexible_desc',
    key: 'program_flexible_desc',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Study at your own pace, anywhere',
    content_ar: 'ادرس بالسرعة التي تناسبك، في أي مكان',
    description: 'Flexible learning description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_expert_faculty',
    key: 'program_expert_faculty',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Expert Faculty',
    content_ar: 'أساتذة خبراء',
    description: 'Expert faculty feature title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_expert_desc',
    key: 'program_expert_desc',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Learn from industry professionals',
    content_ar: 'تعلم من محترفي الصناعة',
    description: 'Expert faculty description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_view_details',
    key: 'program_view_details',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'View Details',
    content_ar: 'عرض التفاصيل',
    description: 'View details button text',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_mba_title',
    key: 'program_mba_title',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'MBA Programs',
    content_ar: 'برامج ماجستير إدارة الأعمال',
    description: 'MBA programs title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_mba_desc',
    key: 'program_mba_desc',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Transform your career with our Executive MBA designed for ambitious professionals ready to lead in the modern business world.',
    content_ar: 'غيّر مسارك المهني مع ماجستير إدارة الأعمال التنفيذي المصمم للمحترفين الطموحين المستعدين للقيادة في عالم الأعمال الحديث.',
    description: 'MBA programs description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_phd_title',
    key: 'program_phd_title',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'PHD Programs',
    content_ar: 'برامج الدكتوراه',
    description: 'PhD programs title',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },
  {
    id: 'program_phd_desc',
    key: 'program_phd_desc',
    section: CMS_SECTIONS.PROGRAMS_OVERVIEW,
    content_en: 'Join the ranks of thought leaders with our doctoral programs designed for those who seek to make groundbreaking contributions to business knowledge.',
    content_ar: 'انضم إلى صفوف قادة الفكر مع برامج الدكتوراه المصممة لأولئك الذين يسعون لتقديم مساهمات رائدة في المعرفة التجارية.',
    description: 'PhD programs description',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system'
  },

  // STUDENT DASHBOARD CONTENT
  {
    id: 'dashboard_student_title',
    key: 'dashboard_student_title',
    section: CMS_SECTIONS.DASHBOARD,
    content_en: 'Student Dashboard',
    content_ar: 'لوحة تحكم الطالب',
    description: 'Student dashboard page title',
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