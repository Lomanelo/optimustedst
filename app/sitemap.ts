import { MetadataRoute } from 'next';
import { SITE_CONFIG } from './lib/seo-config';

/**
 * Dynamic Sitemap Generation
 * Automatically generates sitemap.xml with all canonical URLs
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.domain;
  const currentDate = new Date();

  // Static pages with their priorities and change frequencies
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/programs`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faculty`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // In a production environment, you would fetch dynamic pages from your database
  // For example: programs, blog posts, etc.
  // Example:
  // const programs = await fetchProgramsFromFirestore();
  // const programPages = programs.map(program => ({
  //   url: `${baseUrl}/programs/${program.id}`,
  //   lastModified: program.updatedAt || currentDate,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.8,
  // }));

  // Exclude non-canonical URLs (keep only https non-www domain)
  const deduped = new Map<string, MetadataRoute.Sitemap[number]>();
  [...staticPages].forEach((entry) => {
    const url = entry.url.replace('http://', 'https://').replace('https://www.', 'https://');
    deduped.set(url, { ...entry, url });
  });

  return Array.from(deduped.values());
}

