/**
 * SEO Configuration for Optimus KSA
 * Centralized SEO metadata management aligned with Saudi Vision 2030
 */

export const SITE_CONFIG = {
  name: 'Optimus Solutions KSA',
  domain: 'https://optimus-solutions.org',
  defaultLocale: 'en',
  supportedLocales: ['en', 'ar'],
  description: {
    en: 'Transform your career with internationally accredited MBA and DBA programs designed for Saudi Arabia\'s future leaders. Aligned with Vision 2030, offering flexible online learning with global recognition.',
    ar: 'حوّل مسيرتك المهنية مع برامج ماجستير إدارة الأعمال والدكتوراه المعتمدة دولياً المصممة لقادة المستقبل في المملكة العربية السعودية. متوافقة مع رؤية 2030، توفر تعليماً مرناً عبر الإنترنت مع اعتراف عالمي.'
  },
  keywords: 'MBA Saudi Arabia, DBA programs KSA, online education Saudi, Vision 2030 education, accredited MBA KSA, business administration Saudi Arabia, executive education KSA, ماجستير إدارة أعمال السعودية, دكتوراه إدارة أعمال, تعليم عن بعد السعودية, رؤية 2030',
  contact: {
    phone: '+966 50 123 4567',
    email: 'info@optimus-solutions.org',
    whatsapp: '+966501234567'
  },
  social: {
    facebook: 'https://www.facebook.com/optimusksa',
    linkedin: 'https://www.linkedin.com/company/optimusksa',
    twitter: 'https://twitter.com/optimusksa',
    instagram: 'https://www.instagram.com/optimusksa'
  },
  address: {
    country: 'Saudi Arabia',
    city: 'Riyadh',
    region: 'Riyadh Region'
  }
};

export const PAGE_METADATA = {
  home: {
    title: {
      en: 'Optimus-Solutions',
      ar: 'Optimus-Solutions'
    },
    description: {
      en: 'Transform your career with internationally accredited MBA and DBA programs designed for Saudi Arabia\'s future leaders. Aligned with Vision 2030, offering flexible online learning with global recognition and expert faculty.',
      ar: 'حوّل مسيرتك المهنية مع برامج ماجستير إدارة الأعمال والدكتوراه المعتمدة دولياً المصممة لقادة المستقبل في المملكة العربية السعودية. متوافقة مع رؤية 2030.'
    }
  },
  programs: {
    title: {
      en: 'Optimus-Solutions',
      ar: 'Optimus-Solutions'
    },
    description: {
      en: 'Explore our comprehensive range of MBA and DBA programs with specializations in Digital Transformation, Healthcare Management, Finance, and more. IACBE accredited programs designed for Saudi professionals.',
      ar: 'استكشف مجموعتنا الشاملة من برامج الماجستير والدكتوراه مع تخصصات في التحول الرقمي وإدارة الرعاية الصحية والمالية وغيرها. برامج معتمدة من IACBE مصممة للمحترفين السعوديين.'
    }
  },
  about: {
    title: {
      en: 'Optimus-Solutions',
      ar: 'Optimus-Solutions'
    },
    description: {
      en: 'Learn about Optimus Solutions\' mission to empower Saudi professionals through internationally accredited business education programs. Partnered with world-class universities and aligned with Vision 2030 objectives.',
      ar: 'تعرف على مهمة أوبتيموس التعليمية في تمكين المهنيين السعوديين من خلال برامج التعليم التجاري المعتمدة دولياً. شريك مع جامعات عالمية ومتوافق مع أهداف رؤية 2030.'
    }
  },
  contact: {
    title: {
      en: 'Optimus-Solutions',
      ar: 'Optimus-Solutions'
    },
    description: {
      en: 'Get in touch with Optimus Solutions for program inquiries, admissions information, and enrollment assistance. Our team is ready to help you start your educational journey in Saudi Arabia.',
      ar: 'تواصل مع أوبتيموس التعليمية لاستفسارات البرامج ومعلومات القبول والمساعدة في التسجيل. فريقنا جاهز لمساعدتك في بدء رحلتك التعليمية في المملكة العربية السعودية.'
    }
  },
  blog: {
    title: {
      en: 'Optimus-Solutions',
      ar: 'Optimus-Solutions'
    },
    description: {
      en: 'Stay updated with the latest insights on business education, leadership development, industry trends, and career advancement strategies for Saudi professionals.',
      ar: 'ابق على اطلاع بأحدث الرؤى حول التعليم التجاري وتطوير القيادة واتجاهات الصناعة واستراتيجيات التقدم الوظيفي للمحترفين السعوديين.'
    }
  },
  faculty: {
    title: {
      en: 'Optimus-Solutions',
      ar: 'Optimus-Solutions'
    },
    description: {
      en: 'Meet our distinguished faculty of international business experts, industry leaders, and academic scholars bringing decades of experience to Optimus Solutions programs in Saudi Arabia.',
      ar: 'تعرف على هيئة التدريس المتميزة لدينا من خبراء الأعمال الدوليين وقادة الصناعة والباحثين الأكاديميين الذين يجلبون عقوداً من الخبرة لبرامج أوبتيموس التعليمية في المملكة.'
    }
  },
  testimonials: {
    title: {
      en: 'Optimus-Solutions',
      ar: 'Optimus-Solutions'
    },
    description: {
      en: 'Discover how Optimus Solutions has transformed careers across Saudi Arabia. Read authentic testimonials from our MBA and DBA graduates about their learning experience and career advancement.',
      ar: 'اكتشف كيف غيرت أوبتيموس التعليمية المسيرات المهنية في جميع أنحاء المملكة العربية السعودية. اقرأ شهادات حقيقية من خريجي برامجنا حول تجربتهم التعليمية وتقدمهم الوظيفي.'
    }
  }
};

/**
 * Generate page metadata with proper SEO attributes
 */
export function generatePageMetadata(pageKey: keyof typeof PAGE_METADATA, locale: 'en' | 'ar' = 'en') {
  const pageData = PAGE_METADATA[pageKey];
  
  return {
    title: pageData.title[locale],
    description: pageData.description[locale],
    keywords: SITE_CONFIG.keywords,
    alternates: {
      canonical: `${SITE_CONFIG.domain}/${pageKey === 'home' ? '' : pageKey}`,
      languages: {
        en: `${SITE_CONFIG.domain}/en/${pageKey === 'home' ? '' : pageKey}`,
        ar: `${SITE_CONFIG.domain}/ar/${pageKey === 'home' ? '' : pageKey}`,
      }
    },
    openGraph: {
      title: pageData.title[locale],
      description: pageData.description[locale],
      url: `${SITE_CONFIG.domain}/${pageKey === 'home' ? '' : pageKey}`,
      siteName: SITE_CONFIG.name,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
      images: [{
        url: `${SITE_CONFIG.domain}/Final%20Logo01-03.jpg`,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData.title[locale],
      description: pageData.description[locale],
      images: [`${SITE_CONFIG.domain}/Final%20Logo01-03.jpg`]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-video-preview': -1,
        'max-snippet': -1
      }
    }
  };
}

/**
 * Generate program-specific metadata
 */
export function generateProgramMetadata(
  programTitle: string,
  programDescription: string,
  programType: string,
  specialization: string,
  locale: 'en' | 'ar' = 'en'
) {
  const title = `${programTitle} - ${programType} | Optimus Solutions KSA`;
  const description = programDescription.length >= 150 
    ? programDescription.substring(0, 157) + '...'
    : `${programDescription} Internationally accredited ${programType} program in ${specialization} designed for Saudi professionals.`;
  
  return {
    title,
    description,
    keywords: `${programTitle}, ${programType} ${specialization}, ${SITE_CONFIG.keywords}`,
    alternates: {
      canonical: `${SITE_CONFIG.domain}/programs/${programTitle.toLowerCase().replace(/\s+/g, '-')}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

/**
 * Generate blog post metadata
 */
export function generateBlogMetadata(
  postTitle: string,
  postExcerpt: string,
  postImage?: string,
  publishDate?: string,
  author?: string
) {
  const description = postExcerpt.length >= 150 
    ? postExcerpt.substring(0, 157) + '...'
    : postExcerpt;
  
  return {
    title: `${postTitle} | OPTIMUS Education Blog`,
    description,
    keywords: SITE_CONFIG.keywords,
    openGraph: {
      title: postTitle,
      description,
      type: 'article',
      publishedTime: publishDate,
      authors: author ? [author] : undefined,
      images: postImage ? [{
        url: postImage,
        width: 1200,
        height: 630,
        alt: postTitle
      }] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: postTitle,
      description,
      images: postImage ? [postImage] : undefined
    }
  };
}

