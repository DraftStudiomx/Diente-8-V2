// Updates the clinic's contact data in Sanity (WhatsApp, email, branch addresses, maps, hours) and adds any
// new "Textos del sitio" fields that don't exist yet. Only these fields are touched; everything else stays as
// edited in the Studio. Run: node --env-file=.env.local scripts/update-clinic-data.mts  (needs SANITY_API_WRITE_TOKEN)
import { createClient } from '@sanity/client';
import { localCopy } from '../src/content/copy.ts';
import { branches, settings } from '../src/content/local.ts';

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'l4rx459u',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-10-01',
  token,
  useCdn: false,
});

const tx = client.transaction();

tx.patch('siteSettings', (p) => p.set({ whatsapp: settings.whatsapp, email: settings.email }));

for (const b of branches) {
  tx.patch(`branch-${b.slug}`, (p) =>
    p.set({
      addressLines: b.addressLines,
      streetAddress: b.streetAddress,
      postalCode: b.postalCode,
      mapUrl: b.mapUrl,
      hours: b.hours.map((h, i) => ({ _key: `h${i}`, _type: 'hoursRow', ...h })),
      openingHours: b.openingHours,
    }),
  );
}

// New copy fields only: setIfMissing never overwrites text already edited in the Studio.
const strings = Object.fromEntries(Object.entries(localCopy).filter(([, v]) => typeof v === 'string'));
tx.patch('siteCopy', (p) => p.setIfMissing(strings));

const res = await tx.commit({ visibility: 'sync' });
console.log(`Updated ${res.results.length} documents (settings, ${branches.length} branches, site copy).`);
