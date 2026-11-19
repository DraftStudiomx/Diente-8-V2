// One-time import of the site's current content (src/content/local.ts) into Sanity, images included.
// Run: npm run sanity:seed   (needs SANITY_API_WRITE_TOKEN in .env.local)
// Safe to re-run: documents use fixed IDs and are only created if missing, so edits made in the Studio are never
// overwritten. Images are deduplicated by Sanity.
import { createClient, type SanityClient } from '@sanity/client';
import { createReadStream } from 'node:fs';
import { basename, join } from 'node:path';
import { localContent } from '../src/content/local.ts';
import type { ImageRef } from '../src/content/types.ts';

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN in .env.local');
  process.exit(1);
}

const client: SanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'l4rx459u',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-10-01',
  token,
  useCdn: false,
});

const uploaded = new Map<string, string>();
async function image(ref: ImageRef) {
  let assetId = uploaded.get(ref.src);
  if (!assetId) {
    const file = join(process.cwd(), 'public', ref.src);
    const asset = await client.assets.upload('image', createReadStream(file), { filename: basename(file) });
    assetId = asset._id;
    uploaded.set(ref.src, assetId);
    console.log('  image', ref.src);
  }
  return { _type: 'image', alt: ref.alt, asset: { _type: 'reference', _ref: assetId } };
}

const ref = (id: string, key?: string) => ({ _type: 'reference', _ref: id, ...(key ? { _key: key } : {}) });
const slug = (current: string) => ({ _type: 'slug', current });
const specialtyId = (s: string) => `specialty-${s}`;
const branchId = (s: string) => `branch-${s}`;

async function main() {
  const { settings, specialties, branches, doctors, insurers, faqs, homeSpecialties } = localContent;
  const tx = client.transaction();

  console.log('Specialties');
  for (const s of specialties) {
    tx.createIfNotExists({
      _id: specialtyId(s.slug),
      _type: 'specialty',
      name: s.name,
      slug: slug(s.slug),
      number: s.number,
      category: s.category,
      headline: s.headline,
      teaser: s.teaser,
      summary: s.summary,
      whenToVisit: s.whenToVisit,
      treatments: s.treatments,
      image: await image(s.image),
      seoTitle: s.seoTitle,
      seoDescription: s.seoDescription,
    });
  }

  console.log('Branches');
  for (const [i, b] of branches.entries()) {
    tx.createIfNotExists({
      _id: branchId(b.slug),
      _type: 'branch',
      name: b.name,
      fullName: b.fullName,
      slug: slug(b.slug),
      addressLines: b.addressLines,
      streetAddress: b.streetAddress || undefined,
      postalCode: b.postalCode || undefined,
      mapUrl: b.mapUrl ?? undefined,
      phone: b.phone ?? undefined,
      hours: b.hours.map((h, i) => ({ _key: `h${i}`, _type: 'hoursRow', ...h })),
      openingHours: b.openingHours,
      photo: await image(b.photo),
      note: b.note,
      order: i + 1,
    });
  }

  console.log('Doctors');
  for (const [i, d] of doctors.entries()) {
    tx.createIfNotExists({
      _id: `doctor-${d.slug}`,
      _type: 'doctor',
      title: d.title,
      name: d.name,
      shortName: d.shortName,
      slug: slug(d.slug),
      specialtyLabel: d.specialtyLabel,
      specialties: d.specialties.map((s) => ref(specialtyId(s), s)),
      branch: d.branch ? ref(branchId(d.branch)) : undefined,
      photo: await image(d.photo),
      featured: d.featured,
      bio: d.bio ?? undefined,
      order: i + 1,
      stripOrder: d.stripOrder,
    });
  }

  console.log('Insurers');
  for (const [i, ins] of insurers.entries()) {
    tx.createIfNotExists({ _id: `insurer-${i + 1}`, _type: 'insurer', name: ins.name, logo: await image(ins.logo), order: i + 1 });
  }

  for (const [i, f] of faqs.entries()) {
    tx.createIfNotExists({ _id: `faq-${i + 1}`, _type: 'faq', question: f.question, answer: f.answer, order: i + 1 });
  }

  tx.createIfNotExists({
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: settings.name,
    description: settings.description,
    whatsapp: settings.whatsapp ?? undefined,
    whatsappMessage: settings.whatsappMessage,
    phone: settings.phone ?? undefined,
    email: settings.email ?? undefined,
    instagram: settings.instagram,
    facebook: settings.facebook,
    years: settings.years,
    patients: settings.patients,
    patientsLabel: settings.patientsLabel,
    homeSpecialties: homeSpecialties.map((s) => ref(specialtyId(s), s)),
  });

  const { copy } = localContent;
  tx.createIfNotExists({
    _id: 'siteCopy',
    _type: 'siteCopy',
    ...Object.fromEntries(Object.entries(copy).filter(([, v]) => typeof v === 'string')),
    pillars: copy.pillars,
    aboutItems: copy.aboutItems.map((a, i) => ({ _key: `about-${i}`, _type: 'aboutItem', ...a })),
    toothLayers: copy.toothLayers.map(({ specialty: s, ...l }, i) => ({ _key: `layer-${i}`, _type: 'toothLayer', ...l, specialty: ref(specialtyId(s)) })),
  });

  console.log('Writing documents…');
  const res = await tx.commit();
  console.log(`Done: ${res.results.length} documents checked (existing ones left untouched), ${uploaded.size} images.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
