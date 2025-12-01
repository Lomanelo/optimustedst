import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../src/firebase/firebase';

export async function GET() {
  try {
    const robotsRef = doc(db, 'seo_settings', 'robots');
    const snap = await getDoc(robotsRef);

    let content = '';
    if (snap.exists()) {
      const data = snap.data() as { content?: string };
      content = (data.content || '').trim();
    }

    if (!content) {
      // Default fallback similar to previous static robots.txt
      content = `User-agent: *\nAllow: /\n\n# Disallow sensitive or admin routes\nDisallow: /admin/\nDisallow: /dashboard/\nDisallow: /api/\n\n# Sitemap location\nSitemap: https://optimus-solutions.org/sitemap.xml`;
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  } catch (e) {
    const fallback = `User-agent: *\nAllow: /`;
    return new NextResponse(fallback, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}


