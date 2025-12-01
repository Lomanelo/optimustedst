'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

interface BreadcrumbProps {
  customItems?: Array<{ label: string; path: string }>;
}

export default function Breadcrumb({ customItems }: BreadcrumbProps) {
  const pathname = usePathname();
  
  // Generate breadcrumb items based on the current path
  const generateBreadcrumbItems = () => {
    if (customItems) {
      return customItems;
    }
    
    const pathSegments = pathname.split('/').filter(segment => segment);
    let currentPath = '';
    
    const breadcrumbItems = [
      { label: 'Home', path: '/' }
    ];
    
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`;
      const formattedLabel = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbItems.push({ label: formattedLabel, path: currentPath });
    });
    
    return breadcrumbItems;
  };
  
  const breadcrumbItems = generateBreadcrumbItems();
  
  // Prepare JSON-LD data for breadcrumbs
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `https://optimus-solutions.org${item.path}`
    }))
  };
  
  return (
    <>
      {/* Structured Data for Breadcrumbs */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd)
        }}
      />
      
      {/* Breadcrumb UI */}
      <nav className="flex items-center py-4 px-4 text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-1 md:space-x-2">
          {breadcrumbItems.map((item, index) => (
            <li key={item.path} className="flex items-center">
              {index > 0 && (
                <span className="mx-1 md:mx-2 text-gray-400">/</span>
              )}
              
              {index === breadcrumbItems.length - 1 ? (
                <span className="font-medium text-primary" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link 
                  href={item.path}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
} 