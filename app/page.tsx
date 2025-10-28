'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/auth-context';
import ClientLayout from './components/ClientLayout';
import Hero from './components/Hero';
import ProgramsOverview from './components/ProgramOverview';
import Script from 'next/script';

// Lazy load the components from src to avoid hydration issues
import dynamic from 'next/dynamic';

const HowItWorks = dynamic(() => import('../src/components/HowItWorks'), { 
  ssr: true,
  loading: () => <div className="py-16 md:py-24 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div>
});
const BlogPreview = dynamic(() => import('../src/components/BlogPreview'), { 
  ssr: true,
  loading: () => <div className="py-16 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div>
});
const Accreditations = dynamic(() => import('../src/components/Accreditations'), { 
  ssr: true,
  loading: () => <div className="py-16 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div></div>
});


export default function HomePage() {
  const { currentUser, userRole, isLoading } = useAuth();
  const router = useRouter();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <ClientLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      </ClientLayout>
    );
  }

  // Show homepage for both logged-in and non-logged-in users
  return (
    <ClientLayout>
      <h1 className="sr-only">Internationally Accredited MBA & DBA Programs in KSA | OPTIMUS Education</h1>
      {/* Global Organization Schema from Firestore (if available) */}
      <Script id="org-schema-dynamic" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{"@context":"https://schema.org","@type":"WebSite"}`
        }}
      />

      {/* Structured Data - Organization */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationalOrganization',
            name: 'OPTIMUS Education KSA',
            url: 'https://optimusksa.com',
            logo: 'https://optimusksa.com/OptimusLogoOnPurple.png',
            sameAs: [
              'https://www.facebook.com/optimuseducation',
              'https://www.linkedin.com/company/optimuseducation',
              'https://twitter.com/optimuseducation'
            ],
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'Saudi Arabia',
              addressRegion: 'Riyadh Region',
              addressLocality: 'Riyadh'
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+966501234567',
              contactType: 'customer service'
            }
          })
        }}
      />

      {/* Structured Data - Educational Courses */}
      <Script
        id="courses-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                item: {
                  '@type': 'Course',
                  name: 'Bachelor\'s Degree Programs',
                  description: 'Undergraduate programs designed for future leaders',
                  provider: {
                    '@type': 'Organization',
                    name: 'OPTIMUS Education'
                  }
                }
              },
              {
                '@type': 'ListItem',
                position: 2,
                item: {
                  '@type': 'Course',
                  name: 'MBA Programs',
                  description: 'Master of Business Administration programs',
                  provider: {
                    '@type': 'Organization',
                    name: 'OPTIMUS Education'
                  }
                }
              },
              {
                '@type': 'ListItem',
                position: 3,
                item: {
                  '@type': 'Course',
                  name: 'DBA Programs',
                  description: 'Doctorate of Business Administration programs',
                  provider: {
                    '@type': 'Organization',
                    name: 'OPTIMUS Education'
                  }
                }
              }
            ]
          })
        }}
      />

      {/* Structured Data - FAQ */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What programs does OPTIMUS Education offer?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'OPTIMUS Education offers Bachelor\'s degree programs, MBA programs, and DBA programs designed for future leaders in the UAE and Middle East.'
                }
              },
              {
                '@type': 'Question',
                name: 'Are OPTIMUS Education programs accredited?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, all OPTIMUS Education programs are fully accredited by recognized educational authorities in the UAE and internationally.'
                }
              },
              {
                '@type': 'Question',
                name: 'How can I enroll in an OPTIMUS Education program?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'You can enroll through our website by visiting the program page of your choice and clicking the "Enroll Now" button, or by contacting our admissions team directly.'
                }
              }
            ]
          })
        }}
      />
      
      <Hero />
      <ProgramsOverview />
      <Accreditations />
      <HowItWorks />
      <BlogPreview />
    </ClientLayout>
  );
} 