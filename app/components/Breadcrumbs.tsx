'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useCMS } from '../contexts/cms-context';
import Script from 'next/script';
import { generateBreadcrumbSchema } from '../lib/schema-generators';
import { SITE_CONFIG } from '../lib/seo-config';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs Component with Schema Markup
 * Provides navigation trail and SEO-friendly structured data
 */
export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const { currentLanguage } = useCMS();
  const isRTL = currentLanguage === 'ar';

  // Prepare breadcrumb data for schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: isRTL ? 'الرئيسية' : 'Home', url: SITE_CONFIG.domain },
    ...items.map(item => ({
      name: item.label,
      url: item.href ? `${SITE_CONFIG.domain}${item.href}` : `${SITE_CONFIG.domain}`
    }))
  ]);

  return (
    <>
      {/* Schema Markup */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />

      {/* Visual Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className={`${className} ${isRTL ? 'rtl' : 'ltr'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <ol className={`flex items-center space-x-2 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''} text-sm`}>
          {/* Home Link */}
          <li>
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-primary transition-colors"
              aria-label={isRTL ? 'الرئيسية' : 'Home'}
            >
              <Home className="w-4 h-4" />
            </Link>
          </li>

          {/* Breadcrumb Items */}
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight 
                className={`w-4 h-4 text-gray-400 ${isRTL ? 'rotate-180' : ''} mx-2`}
              />
              {item.href && index < items.length - 1 ? (
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

