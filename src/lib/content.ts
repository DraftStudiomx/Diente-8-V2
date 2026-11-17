import { createClient, defineQuery } from 'next-sanity';
import { cache } from 'react';
import { localContent } from '@/content/local';
import type { SiteContent, SiteSettings } from '@/content/types';
import { apiVersion, dataset, projectId } from '@/sanity/env';

const client = createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: 'published' });

// Pages are static and refresh from Sanity at most once a minute after an edit.
const REVALIDATE_SECONDS = 60;

const img = (field: string) =>
  `${field}{ "src": asset->url, "alt": coalesce(alt, ""), "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`;

const CONTENT_QUERY = defineQuery(`{
  "settings": *[_id == "siteSettings"][0]{
    name, description, whatsapp, whatsappMessage, phone, email, instagram, facebook, years, patients, patientsLabel,
    "homeSpecialties": homeSpecialties[]->slug.current
  },
  "specialties": *[_type == "specialty" && defined(slug.current)] | order(number asc){
    "slug": slug.current, number, name, category, teaser, summary, headline,
    "whenToVisit": coalesce(whenToVisit, []), "treatments": coalesce(treatments, []),
    ${img('image')}, seoTitle, seoDescription
  },
  "branches": *[_type == "branch"] | order(order asc){
    "slug": slug.current, name, fullName, "addressLines": coalesce(addressLines, []), streetAddress, mapUrl, phone, ${img('photo')}, note
  },
  "doctors": *[_type == "doctor"] | order(order asc){
    "slug": slug.current, title, name, shortName, specialtyLabel,
    "specialties": coalesce(specialties[]->slug.current, []), "branch": branch->slug.current,
    ${img('photo')}, "featured": coalesce(featured, false), bio, stripOrder
  },
  "insurers": *[_type == "insurer"] | order(order asc){ name, ${img('logo')} },
  "faqs": *[_type == "faq"] | order(order asc){ question, answer }
}`);

type SanityContent = Omit<SiteContent, 'settings' | 'homeSpecialties'> & {
  settings: (Omit<SiteSettings, 'siteUrl'> & { homeSpecialties: string[] | null }) | null;
};

const orNull = <T,>(v: T | undefined) => v ?? null;

async function fetchFromSanity(): Promise<SiteContent | null> {
  const data = await client.fetch<SanityContent>(CONTENT_QUERY, {}, { next: { revalidate: REVALIDATE_SECONDS, tags: ['sanity'] } });
  // An empty dataset (before the first content import) keeps the site on local content.
  if (!data?.settings || data.specialties.length === 0) return null;
  const { homeSpecialties, ...s } = data.settings;
  const local = localContent.settings;
  return {
    settings: {
      ...local,
      ...s,
      siteUrl: local.siteUrl, // the site URL is deployment config, not editorial content
      whatsapp: orNull(s.whatsapp),
      phone: orNull(s.phone),
      email: orNull(s.email),
      instagram: s.instagram ?? local.instagram,
      facebook: s.facebook ?? local.facebook,
    },
    specialties: data.specialties.map((x) => ({
      ...x,
      seoTitle: x.seoTitle || x.headline,
      seoDescription: x.seoDescription || x.summary,
    })),
    branches: data.branches.map((b) => ({ ...b, streetAddress: b.streetAddress ?? '', mapUrl: orNull(b.mapUrl), phone: orNull(b.phone), note: b.note ?? '' })),
    doctors: data.doctors.map((d) => ({ ...d, branch: orNull(d.branch), bio: orNull(d.bio) })),
    insurers: data.insurers,
    faqs: data.faqs,
    homeSpecialties: homeSpecialties?.filter(Boolean) ?? localContent.homeSpecialties,
  };
}

// Single entry point for page data: Sanity when it has content, otherwise (or on any error) the local copy,
// so a Sanity outage can never take the site down.
export const getContent = cache(async (): Promise<SiteContent> => {
  try {
    return (await fetchFromSanity()) ?? localContent;
  } catch (err) {
    console.warn('[content] Sanity unavailable, using local content:', err instanceof Error ? err.message : err);
    return localContent;
  }
});

// Every "Agenda / WhatsApp" button goes through here, so adding the number switches them all.
export function whatsappHref(settings: SiteSettings): string {
  if (!settings.whatsapp) return '/contacto#valoracion';
  return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(settings.whatsappMessage)}`;
}
