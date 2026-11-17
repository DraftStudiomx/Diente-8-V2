// Shapes shared by the local content fallback and the Sanity queries, so pages never care where data came from.

export type ImageRef = {
  src: string; // local /public path or a Sanity CDN URL
  alt: string;
  width: number;
  height: number;
};

export type SiteSettings = {
  name: string;
  siteUrl: string;
  description: string;
  whatsapp: string | null; // digits with country code, e.g. 524771234567
  whatsappMessage: string;
  phone: string | null;
  email: string | null;
  instagram: string;
  facebook: string;
  years: number;
  patients: number; // shown as "2,000+"
  patientsLabel: string;
};

export type Specialty = {
  slug: string;
  number: string; // "01".."11", display order
  name: string;
  category: string;
  teaser: string; // short line for the home preview cards
  summary: string;
  headline: string; // page H1, phrased for local search: "Endodoncia en León"
  whenToVisit: string[];
  treatments: string[];
  image: ImageRef;
  seoTitle: string;
  seoDescription: string;
};

export type Branch = {
  slug: 'panorama' | 'martinica';
  name: string; // "Panorama"
  fullName: string; // "Diente8 Panorama"
  addressLines: string[];
  streetAddress: string;
  mapUrl: string | null;
  phone: string | null;
  photo: ImageRef;
  note: string;
};

export type Doctor = {
  slug: string;
  title: 'Dr.' | 'Dra.';
  name: string; // full name
  shortName: string; // as printed on the official team template
  specialtyLabel: string;
  specialties: string[]; // specialty slugs
  branch: Branch['slug'] | null;
  photo: ImageRef;
  featured: boolean;
  bio: string | null;
  stripOrder: number; // position on the official team template (home page)
};

export type Insurer = { name: string; logo: ImageRef };

export type Faq = { question: string; answer: string };

export type SiteContent = {
  settings: SiteSettings;
  specialties: Specialty[];
  doctors: Doctor[];
  branches: Branch[];
  insurers: Insurer[];
  faqs: Faq[];
};
