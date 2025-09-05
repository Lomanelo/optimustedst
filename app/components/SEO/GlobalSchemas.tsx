'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../src/firebase/firebase';

export default function GlobalSchemas() {
  const [org, setOrg] = useState<any | null>(null);
  const [faq, setFaq] = useState<any | null>(null);

  useEffect(() => {
    const orgRef = doc(db, 'seo_settings', 'organization');
    const faqRef = doc(db, 'seo_settings', 'faq');

    const unsubOrg = onSnapshot(orgRef, (snap) => {
      setOrg(snap.exists() ? (snap.data() as any).schema || null : null);
    });
    const unsubFaq = onSnapshot(faqRef, (snap) => {
      setFaq(snap.exists() ? (snap.data() as any).schema || null : null);
    });

    return () => { unsubOrg(); unsubFaq(); };
  }, []);

  return (
    <>
      {org && (
        <Script id="global-org-schema" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      )}
      {faq && (
        <Script id="global-faq-schema" type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      )}
    </>
  );
}


