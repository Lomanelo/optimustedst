import type { Metadata } from 'next';
import { generatePageMetadata } from '../../lib/seo-config';

type Params = { locale: 'en' | 'ar' };

export function generateMetadata({ params }: { params: Params }): Metadata {
  const locale = params.locale ?? 'en';
  return generatePageMetadata('blog', locale);
}


