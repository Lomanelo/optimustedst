import { MetadataRoute } from 'next';
import { SITE_CONFIG } from './lib/seo-config';

/**
 * Robots.txt Generator
 * Provides crawling instructions for search engines
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/api-test/',
          '/_next/',
          '/private/',
          '/*.json$',
          '/enrollment/payment',
          '/enrollment/status',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/api-test/',
          '/enrollment/payment',
          '/enrollment/status',
        ],
      },
      {
        userAgent: 'bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/api/',
          '/api-test/',
          '/enrollment/payment',
          '/enrollment/status',
        ],
      },
    ],
    sitemap: `${SITE_CONFIG.domain}/sitemap.xml`,
    host: SITE_CONFIG.domain,
  };
}

