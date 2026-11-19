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
  postalCode: string;
  mapUrl: string | null;
  phone: string | null;
  hours: OpeningHours[]; // shown on the site
  openingHours: string[]; // schema.org format for Google, e.g. "Mo-Fr 10:00-14:00"
  photo: ImageRef;
  note: string;
};

export type OpeningHours = { days: string; time: string };

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
  homeSpecialties: string[]; // slugs previewed on the home page, in order
  copy: SiteCopy;
};

// Editable site copy ("Textos del sitio"). `*text*` renders as gold italic; {especialidades}, {especialistas}
// and {años} are replaced with live numbers.
export type ToothLayer = { layer: string; name: string; description: string; short: string; specialty: string };
export type TitledText = { title: string; text: string };

export type SiteCopy = {
  navCta: string;
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  footerTitle: string;
  footerButton: string;

  heroEyebrow: string;
  heroTitle1: string;
  heroTitle2: string;
  heroText: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  toothLayers: ToothLayer[];
  finaleLine: string;
  statYearsLabel: string;
  statSpecialtiesLabel: string;
  painText: string;
  pillars: string[];
  homeSpecialtiesTitle: string;
  homeSpecialtiesMeta: string;
  homeSpecialtiesLink: string;
  homeBranchesTitle: string;
  homeBranchesMeta: string;
  homeBranchesLink: string;
  homeTeamTitle: string;
  homeTeamMeta: string;
  homeTeamLink: string;
  aboutTitle: string;
  aboutItems: TitledText[];
  faqTitle: string;
  videoLabel: string;

  specialtiesTitle: string;
  specialtiesMeta: string;
  cardMore: string;
  spCtaPrimary: string;
  spTeamButtonOne: string;
  spTeamButtonMany: string;
  spWhenTitle: string;
  spTreatTitle: string;
  spWhereOne: string;
  spWhereAll: string;
  spTeamTitleOne: string;
  spTeamTitleMany: string;
  spFeaturedLabel: string;
  spMoreTitle: string;
  spMoreMeta: string;

  branchesTitle: string;
  branchesMeta: string;
  branchesMapLink: string;

  teamTitle: string;
  teamMeta: string;
  teamIntro: string;

  contactEyebrow: string;
  contactTitle: string;
  contactLead: string;
  contactSocialLabel: string;
  contactAgendaLabel: string;
  contactAgendaText: string;
  contactAgendaButton: string;
  companiesEyebrow: string;
  companiesTitle: string;
  companiesText: string;
  insurersLabel: string;
  insurersButton: string;

  hoursLabel: string;
  contactWhatsappLabel: string;
  floatingWhatsapp: string;
  formEyebrow: string;
  formTitle: string;
  formText: string;
  formName: string;
  formPhone: string;
  formEmail: string;
  formBranch: string;
  formBranchAny: string;
  formReason: string;
  formReasonUnknown: string;
  formMessage: string;
  formPrivacy: string;
  formButton: string;
  formSending: string;
  formSuccess: string;
  formError: string;

  privacyTitle: string;
  privacyUpdated: string;
  privacyBody: string;
};
