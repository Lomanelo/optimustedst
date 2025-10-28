import type { Metadata } from 'next';
import { SITE_CONFIG } from '../../lib/seo-config';

type Params = { programId: string };

export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const { programId } = params;
  const title = `Program Details | OPTIMUS Education KSA`;
  const description = `Learn about this OPTIMUS Education KSA program. Accredited, industry-aligned, and designed for Saudi professionals.`;
  const canonical = `${SITE_CONFIG.domain}/programs/${programId}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_CONFIG.name,
      type: 'article',
    },
    robots: { index: true, follow: true },
  };
}


