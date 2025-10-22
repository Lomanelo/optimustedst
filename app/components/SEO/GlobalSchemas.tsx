'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../src/firebase/firebase';
import { generateOrganizationSchema, generateWebsiteSchema } from '../../lib/schema-generators';

export default function GlobalSchemas() {
  const [customOrg, setCustomOrg] = useState<any | null>(null);
  const [customFaq, setCustomFaq] = useState<any | null>(null);

  // Default schemas
  const defaultOrgSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  useEffect(() => {
    // Listen for custom schemas from Firestore (if admin wants to override)
    const orgRef = doc(db, 'seo_settings', 'organization');
    const faqRef = doc(db, 'seo_settings', 'faq');

    const unsubOrg = onSnapshot(orgRef, (snap) => {
      if (snap.exists() && snap.data()?.schema) {
        setCustomOrg(snap.data().schema);
      }
    });
    
    const unsubFaq = onSnapshot(faqRef, (snap) => {
      if (snap.exists() && snap.data()?.schema) {
        setCustomFaq(snap.data().schema);
      }
    });

    return () => { 
      unsubOrg(); 
      unsubFaq(); 
    };
  }, []);

  // Use custom schema if available, otherwise use default
  const orgSchema = customOrg || defaultOrgSchema;

  return (
    <>
      {/* Organization Schema */}
      <Script 
        id="global-org-schema" 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} 
      />
      
      {/* Website Schema */}
      <Script 
        id="global-website-schema" 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} 
      />
      
      {/* Custom FAQ Schema if available */}
      {customFaq && (
        <Script 
          id="global-faq-schema" 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(customFaq) }} 
        />
      )}
    </>
  );
}


