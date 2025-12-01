'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/auth-context';
import { Settings, Save, AlertTriangle, Check, AlertCircle, Code2, FileText, Shield } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../src/firebase/firebase';

export default function AdminSEOPage() {
  const { currentUser, userRole, hasPermission, isLoading } = useAuth();
  const router = useRouter();

  const [robots, setRobots] = useState('');
  const [orgSchema, setOrgSchema] = useState('');
  const [faqSchema, setFaqSchema] = useState('');
  const [saving, setSaving] = useState<'idle'|'saving'|'success'|'error'>('idle');

  useEffect(() => {
    if (!isLoading && (!currentUser || (userRole !== 'admin' && !(hasPermission('seo') || hasPermission('settings'))))) {
      router.push('/admin/dashboard');
      return;
    }
    if (currentUser) {
      loadData();
    }
  }, [currentUser, userRole, isLoading, hasPermission]);

  const loadData = async () => {
    try {
      const robotsRef = doc(db, 'seo_settings', 'robots');
      const robotsSnap = await getDoc(robotsRef);
      if (robotsSnap.exists()) {
        setRobots((robotsSnap.data() as any).content || '');
      }

      const orgRef = doc(db, 'seo_settings', 'organization');
      const orgSnap = await getDoc(orgRef);
      if (orgSnap.exists()) {
        setOrgSchema(JSON.stringify((orgSnap.data() as any).schema || {}, null, 2));
      } else {
        setOrgSchema(JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Optimus Solutions',
          url: 'https://optimus-solutions.org',
          logo: 'https://optimus-solutions.org/Final%20Logo01-03.jpg'
        }, null, 2));
      }

      const faqRef = doc(db, 'seo_settings', 'faq');
      const faqSnap = await getDoc(faqRef);
      if (faqSnap.exists()) {
        setFaqSchema(JSON.stringify((faqSnap.data() as any).schema || {}, null, 2));
      } else {
        setFaqSchema(JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [] }, null, 2));
      }
    } catch (e) {
      console.error('Failed to load SEO data', e);
    }
  };

  const saveAll = async () => {
    try {
      setSaving('saving');
      const robotsRef = doc(db, 'seo_settings', 'robots');
      await setDoc(robotsRef, { content: robots }, { merge: true });

      const orgRef = doc(db, 'seo_settings', 'organization');
      let parsedOrg: any = {};
      try { parsedOrg = JSON.parse(orgSchema || '{}'); } catch { throw new Error('Invalid Organization JSON'); }
      await setDoc(orgRef, { schema: parsedOrg }, { merge: true });

      const faqRef = doc(db, 'seo_settings', 'faq');
      let parsedFaq: any = {};
      try { parsedFaq = JSON.parse(faqSchema || '{}'); } catch { throw new Error('Invalid FAQ JSON'); }
      await setDoc(faqRef, { schema: parsedFaq }, { merge: true });

      setSaving('success');
      setTimeout(() => setSaving('idle'), 2000);
    } catch (e) {
      console.error(e);
      setSaving('error');
      setTimeout(() => setSaving('idle'), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center"><Settings className="h-6 w-6 mr-2"/>SEO Manager</h1>
        <button onClick={saveAll} disabled={saving==='saving'} className={`inline-flex items-center px-4 py-2 rounded-md text-white ${saving==='saving'?'bg-gray-400':'bg-primary hover:bg-primary-dark'}`}>
          {saving==='saving' ? 'Saving...' : (<><Save className="h-4 w-4 mr-2"/>Save All</>)}
        </button>
      </div>

      {/* Robots.txt Editor */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center"><Shield className="h-5 w-5 mr-2"/>robots.txt</h2>
          <div className="flex items-center text-amber-700 text-sm"><AlertTriangle className="h-4 w-4 mr-1"/>Warning: Incorrect changes can prevent indexing.</div>
        </div>
        <div className="p-6">
          <textarea value={robots} onChange={(e)=>setRobots(e.target.value)} rows={10} className="w-full border border-gray-300 rounded-md p-3 font-mono text-sm" placeholder={`User-agent: *\nAllow: /\nDisallow: /admin/`} />
        </div>
      </div>

      {/* Organization Schema */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center"><Code2 className="h-5 w-5 mr-2"/>Global Organization Schema</h2>
          <p className="text-sm text-gray-600">Provide JSON-LD for Organization or LocalBusiness.</p>
        </div>
        <div className="p-6">
          <textarea value={orgSchema} onChange={(e)=>setOrgSchema(e.target.value)} rows={10} className="w-full border border-gray-300 rounded-md p-3 font-mono text-sm" />
        </div>
      </div>

      {/* FAQ Schema */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center"><FileText className="h-5 w-5 mr-2"/>FAQ Schema</h2>
          <p className="text-sm text-gray-600">Enter JSON-LD for FAQPage (question/answer pairs).</p>
        </div>
        <div className="p-6">
          <textarea value={faqSchema} onChange={(e)=>setFaqSchema(e.target.value)} rows={10} className="w-full border border-gray-300 rounded-md p-3 font-mono text-sm" />
        </div>
      </div>

      {saving==='success' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-800 inline-flex items-center"><Check className="h-4 w-4 mr-1"/>Saved.</div>
      )}
      {saving==='error' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 inline-flex items-center"><AlertCircle className="h-4 w-4 mr-1"/>Failed to save. Fix JSON and retry.</div>
      )}
    </div>
  );
}


