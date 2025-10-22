/**
 * Schema.org Structured Data Generators
 * Generate JSON-LD schemas for better SEO and rich snippets
 */

import { SITE_CONFIG } from './seo-config';

/**
 * Generate Organization Schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${SITE_CONFIG.domain}/#organization`,
    name: SITE_CONFIG.name,
    alternateName: 'OPTIMUS KSA',
    url: SITE_CONFIG.domain,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_CONFIG.domain}/OptimusLogoOnPurple.png`,
      width: 800,
      height: 600
    },
    description: SITE_CONFIG.description.en,
    address: {
      '@type': 'PostalAddress',
      addressCountry: SITE_CONFIG.address.country,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.region
    },
    contactPoint: [{
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.contact.phone,
      contactType: 'customer service',
      email: SITE_CONFIG.contact.email,
      areaServed: 'SA',
      availableLanguage: ['English', 'Arabic']
    }, {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.contact.phone,
      contactType: 'admissions',
      email: SITE_CONFIG.contact.email,
      areaServed: 'SA',
      availableLanguage: ['English', 'Arabic']
    }],
    sameAs: Object.values(SITE_CONFIG.social),
    areaServed: {
      '@type': 'Country',
      name: 'Saudi Arabia'
    },
    knowsAbout: [
      'Business Administration',
      'Executive Education',
      'MBA Programs',
      'DBA Programs',
      'Online Education',
      'Professional Development'
    ]
  };
}

/**
 * Generate Website Schema
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.domain}/#website`,
    url: SITE_CONFIG.domain,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description.en,
    publisher: {
      '@id': `${SITE_CONFIG.domain}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.domain}/programs?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: ['en', 'ar']
  };
}

/**
 * Generate Course Schema for a specific program
 */
export function generateCourseSchema(program: {
  id: string;
  title: string;
  description: string;
  programType: string;
  specialization: string;
  duration: string;
  price?: number;
  accreditations?: string[];
  url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${SITE_CONFIG.domain}/programs/${program.id}`,
    name: program.title,
    description: program.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: SITE_CONFIG.name,
      sameAs: SITE_CONFIG.domain
    },
    educationalLevel: program.programType,
    about: {
      '@type': 'Thing',
      name: program.specialization
    },
    timeRequired: program.duration,
    ...(program.price && {
      offers: {
        '@type': 'Offer',
        price: program.price,
        priceCurrency: 'SAR',
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString()
      }
    }),
    ...(program.accreditations && program.accreditations.length > 0 && {
      accreditationOrLicensing: program.accreditations.map(acc => ({
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Accreditation',
        recognizedBy: {
          '@type': 'Organization',
          name: acc
        }
      }))
    }),
    inLanguage: ['en', 'ar'],
    availableLanguage: ['English', 'Arabic'],
    courseMode: 'online',
    educationalCredentialAwarded: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: program.programType,
      name: program.title
    }
  };
}

/**
 * Generate ItemList Schema for programs page
 */
export function generateProgramsListSchema(programs: Array<{
  id: string;
  title: string;
  description: string;
  programType: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_CONFIG.domain}/programs/#itemlist`,
    numberOfItems: programs.length,
    itemListElement: programs.map((program, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Course',
        '@id': `${SITE_CONFIG.domain}/programs/${program.id}`,
        name: program.title,
        description: program.description,
        provider: {
          '@type': 'EducationalOrganization',
          name: SITE_CONFIG.name
        }
      }
    }))
  };
}

/**
 * Generate BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
}

/**
 * Generate Article Schema for blog posts
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  content: string;
  publishDate: string;
  modifiedDate?: string;
  author?: string;
  image?: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${SITE_CONFIG.domain}/blog/${article.slug}`,
    headline: article.title,
    description: article.description,
    image: article.image || `${SITE_CONFIG.domain}/OptimusLogoOnPurple.png`,
    datePublished: article.publishDate,
    dateModified: article.modifiedDate || article.publishDate,
    author: {
      '@type': 'Organization',
      name: article.author || SITE_CONFIG.name,
      url: SITE_CONFIG.domain
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.domain}/OptimusLogoOnPurple.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.domain}/blog/${article.slug}`
    },
    articleBody: article.content,
    inLanguage: 'en'
  };
}

/**
 * Generate FAQ Schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Generate Review/Rating Schema
 */
export function generateReviewSchema(reviews: Array<{
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
}>) {
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.domain}/#organization`,
    name: SITE_CONFIG.name,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1
    },
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author
      },
      datePublished: review.datePublished,
      reviewBody: review.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      }
    }))
  };
}

/**
 * Generate Person Schema for faculty members
 */
export function generatePersonSchema(person: {
  name: string;
  jobTitle: string;
  description: string;
  image?: string;
  email?: string;
  qualifications: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.jobTitle,
    description: person.description,
    ...(person.image && { image: person.image }),
    ...(person.email && { email: person.email }),
    worksFor: {
      '@type': 'EducationalOrganization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.domain
    },
    hasCredential: person.qualifications.map(qual => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'degree',
      name: qual
    })),
    alumniOf: person.qualifications.map(qual => ({
      '@type': 'EducationalOrganization',
      name: qual
    }))
  };
}

