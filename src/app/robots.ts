import type { MetadataRoute } from 'next';
import { getContent } from '@/lib/content';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { settings } = await getContent();
  // Vercel preview deploys (and local builds) must never be indexed; only production is.
  const isProduction = process.env.VERCEL_ENV === 'production';
  if (!isProduction) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${settings.siteUrl}/sitemap.xml`,
    host: settings.siteUrl,
  };
}
