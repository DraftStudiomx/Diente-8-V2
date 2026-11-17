import { cache } from 'react';
import { localContent } from '@/content/local';
import type { SiteContent, SiteSettings } from '@/content/types';

// Single entry point for page data. Today it serves the local content; when the Sanity project
// is connected this is the only place that changes (fetch from Sanity, fall back to local).
export const getContent = cache(async (): Promise<SiteContent> => localContent);

// Every "Agenda / WhatsApp" button goes through here, so adding the number switches them all.
export function whatsappHref(settings: SiteSettings): string {
  if (!settings.whatsapp) return '/contacto#valoracion';
  return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(settings.whatsappMessage)}`;
}
