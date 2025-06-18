export interface CMSContent {
  id: string;
  key: string; // Unique identifier for each text element
  section: string; // Page or component section
  subsection?: string; // Optional subsection for better organization
  content_en: string; // English content
  content_ar: string; // Arabic content
  description?: string; // Description for SEO team
  lastUpdated: string;
  updatedBy: string;
}

export interface CMSSection {
  name: string;
  description: string;
  items: CMSContent[];
}

// Define all website sections
export const CMS_SECTIONS = {
  NAVBAR: 'navbar',
  HERO: 'hero',
  PROGRAMS_OVERVIEW: 'programs_overview',
  HOW_IT_WORKS: 'how_it_works',
  BLOG_PREVIEW: 'blog_preview',
  ACCREDITATIONS: 'accreditations',
  FOOTER: 'footer',
  ABOUT_PAGE: 'about_page',
  CONTACT_PAGE: 'contact_page',
  PROGRAMS_PAGE: 'programs_page',
  LOGIN_PAGE: 'login_page',
  REGISTER_PAGE: 'register_page',
  DASHBOARD: 'dashboard',
  ADMIN_DASHBOARD: 'admin_dashboard',
  BLOG_PAGE: 'blog_page',
  PROFILE_PAGE: 'profile_page',
  SOCIAL_MEDIA_SETTINGS: 'social_media_settings',
  COOKIE_CONSENT: 'cookie_consent',
  ERROR_MESSAGES: 'error_messages',
  SUCCESS_MESSAGES: 'success_messages',
  FORM_LABELS: 'form_labels',
  BUTTONS: 'buttons',
  METADATA: 'metadata'
} as const;

export type CMSSectionKey = typeof CMS_SECTIONS[keyof typeof CMS_SECTIONS]; 