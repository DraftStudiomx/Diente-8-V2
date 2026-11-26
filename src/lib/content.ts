import { createClient, defineQuery, type FilterDefault } from 'next-sanity';
import { draftMode } from 'next/headers';
import { cache } from 'react';
import { localCopy } from '@/content/copy';
import { localContent } from '@/content/local';
import type { SiteContent, SiteCopy, SiteSettings } from '@/content/types';
import { apiVersion, dataset, projectId } from '@/sanity/env';

export const client = createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: 'published' });

// Draft preview (Presentation tool): reads unpublished drafts and tags visible text so clicking it in the
// preview opens the field in the Studio. Only display copy is tagged; slugs, URLs, numbers, alt text and
// SEO fields stay clean because the site compares, links or puts them in <head>.
const CLICKABLE: Record<string, string[]> = {
  specialty: ['name', 'category', 'headline', 'teaser', 'summary', 'whenToVisit', 'treatments'],
  doctor: ['name', 'shortName', 'specialtyLabel', 'bio'],
  branch: ['name', 'fullName', 'addressLines', 'note', 'hours'],
  faq: ['question', 'answer'],
  siteSettings: ['patientsLabel'],
};
const stegaFilter: FilterDefault = ({ sourcePath, sourceDocument }) => {
  if (sourceDocument._type === 'siteCopy') return true; // all of it is display copy
  const field = sourcePath.find((p) => typeof p === 'string');
  return typeof field === 'string' && (CLICKABLE[sourceDocument._type] ?? []).includes(field);
};
export const previewClient = client.withConfig({
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
  perspective: 'drafts',
  stega: { enabled: true, studioUrl: '/studio', filter: stegaFilter },
});

async function isDraftMode(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false; // outside a request (generateStaticParams, sitemap at build time)
  }
}

// Pages are static and refresh from Sanity at most once a minute after an edit.
const REVALIDATE_SECONDS = 60;

const img = (field: string) =>
  `${field}{ "src": asset->url, "alt": coalesce(alt, ""), "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`;

const CONTENT_QUERY = defineQuery(`{
  "settings": *[_id == "siteSettings"][0]{
    name, description, whatsapp, whatsappMessage, phone, email, instagram, facebook, years, patients, patientsLabel, legalName, legalAddress, sanitaryName, sanitaryLicense, sanitaryInstitution, cofeprisCode,
    "homeSpecialties": homeSpecialties[]->slug.current
  },
  "specialties": *[_type == "specialty" && defined(slug.current)] | order(number asc){
    "slug": slug.current, number, name, category, teaser, summary, headline,
    "whenToVisit": coalesce(whenToVisit, []), "treatments": coalesce(treatments, []),
    ${img('image')}, seoTitle, seoDescription
  },
  "branches": *[_type == "branch"] | order(order asc){
    "slug": slug.current, name, fullName, "addressLines": coalesce(addressLines, []), streetAddress, postalCode, mapUrl, mapName, phone,
    "hours": coalesce(hours[]{ days, time }, []), "openingHours": coalesce(openingHours, []), ${img('photo')}, note
  },
  "doctors": *[_type == "doctor"] | order(order asc){
    "slug": slug.current, title, name, shortName, specialtyLabel,
    "specialties": coalesce(specialties[]->slug.current, []), "branch": branch->slug.current,
    ${img('photo')}, "featured": coalesce(featured, false), bio, stripOrder
  },
  "insurers": *[_type == "insurer"] | order(order asc){ name, ${img('logo')} },
  "faqs": *[_type == "faq"] | order(order asc){ question, answer },
  "copy": *[_id == "siteCopy"][0]{
    ...,
    "toothLayers": toothLayers[]{ layer, name, description, short, "specialty": specialty->slug.current }
  }
}`);

type SanityContent = Omit<SiteContent, 'settings' | 'homeSpecialties' | 'copy'> & {
  settings: (Omit<SiteSettings, 'siteUrl'> & { homeSpecialties: string[] | null }) | null;
  copy: Partial<Record<keyof SiteCopy, unknown>> | null;
};

// Published copy wins field by field; anything empty (or the whole document, before it is published) falls back
// to the defaults, so a half-filled document never leaves holes on the page.
function mergeCopy(remote: SanityContent['copy']): SiteCopy {
  const out = { ...localCopy } as Record<keyof SiteCopy, unknown>;
  if (!remote) return localCopy;
  for (const key of Object.keys(localCopy) as (keyof SiteCopy)[]) {
    const v = remote[key];
    const fallback = localCopy[key];
    if (Array.isArray(fallback)) {
      if (Array.isArray(v) && v.length === fallback.length && v.every(Boolean)) out[key] = v;
    } else if (typeof v === 'string' && v.trim()) {
      out[key] = v;
    }
  }
  return out as SiteCopy;
}

const orNull = <T,>(v: T | undefined) => v ?? null;

// Drafts can be half-filled; anything without an image would crash next/image, so it is skipped.
const hasImage = (i: { src: string | null } | null | undefined) => Boolean(i?.src);

async function fetchFromSanity(): Promise<SiteContent | null> {
  const preview = (await isDraftMode()) && Boolean(process.env.SANITY_API_READ_TOKEN);
  const data = preview
    ? await previewClient.fetch<SanityContent>(CONTENT_QUERY, {}, { cache: 'no-store' })
    : await client.fetch<SanityContent>(CONTENT_QUERY, {}, { next: { revalidate: REVALIDATE_SECONDS, tags: ['sanity'] } });
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
      legalName: orNull(s.legalName),
      legalAddress: orNull(s.legalAddress),
      sanitaryName: orNull(s.sanitaryName),
      sanitaryLicense: orNull(s.sanitaryLicense),
      sanitaryInstitution: orNull(s.sanitaryInstitution),
      cofeprisCode: orNull(s.cofeprisCode),
    },
    specialties: data.specialties
      .filter((x) => hasImage(x.image))
      .map((x) => ({
        ...x,
        seoTitle: x.seoTitle || x.headline,
        seoDescription: x.seoDescription || x.summary,
      })),
    branches: data.branches
      .filter((b) => b.slug && hasImage(b.photo))
      .map((b) => ({ ...b, streetAddress: b.streetAddress ?? '', postalCode: b.postalCode ?? '', mapUrl: orNull(b.mapUrl), mapName: b.mapName ?? '', phone: orNull(b.phone), note: b.note ?? '' })),
    doctors: data.doctors.filter((d) => d.slug && hasImage(d.photo)).map((d) => ({ ...d, branch: orNull(d.branch), bio: orNull(d.bio) })),
    insurers: data.insurers.filter((i) => hasImage(i.logo)),
    faqs: data.faqs,
    homeSpecialties: homeSpecialties?.filter(Boolean) ?? localContent.homeSpecialties,
    copy: mergeCopy(data.copy),
  };
}

// Single entry point for page data: Sanity when it has content, otherwise (or on any error) the local copy,
// so a Sanity outage can never take the site down.
export const getContent = cache(async (): Promise<SiteContent> => {
  if (process.env.CONTENT_SOURCE === 'local') return localContent; // development: skip Sanity entirely
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
