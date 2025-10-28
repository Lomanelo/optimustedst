import type { Metadata } from 'next';
import { SITE_CONFIG } from '../../lib/seo-config';

type Params = { slug: string };

export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const { slug } = params;
  const readableTitle = slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');

  const title = `${readableTitle} | OPTIMUS Education Blog`;
  const description = `Explore insights on ${readableTitle} from OPTIMUS Education KSA. Learn, grow, and stay updated with expert perspectives aligned with Vision 2030.`;
  const canonical = `${SITE_CONFIG.domain}/blog/${slug}`;

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
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}


