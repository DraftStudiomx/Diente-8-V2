import type { MetadataRoute } from 'next';
import { getContent } from '@/lib/content';
import { specialtyHref } from '@/lib/links';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { settings, specialties } = await getContent();
  const url = (path: string) => settings.siteUrl + path;
  const lastModified = new Date();

  return [
    { url: url('/'), lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: url('/especialidades'), lastModified, changeFrequency: 'monthly', priority: 0.9 },
    ...specialties.map((s) => ({
      url: url(specialtyHref(s.slug)),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: url('/sucursales'), lastModified, changeFrequency: 'yearly', priority: 0.7 },
    { url: url('/equipo'), lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/contacto'), lastModified, changeFrequency: 'yearly', priority: 0.7 },
  ];
}
