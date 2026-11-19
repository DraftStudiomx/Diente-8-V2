// Client-safe link helpers (no data access), shared by server and client components.

export function specialtyHref(slug: string): string {
  return `/especialidades/${slug}`;
}

export const NAV_LINKS = [
  { href: '/especialidades', label: 'Especialidades' },
  { href: '/sucursales', label: 'Sucursales' },
  { href: '/equipo', label: 'Equipo' },
  { href: '/contacto', label: 'Contacto' },
];

// 524778820078 → "477 882 0078" (display) / "+52 477 882 0078" (structured data).
export function formatMxPhone(digits: string, { international = false } = {}): string {
  const local = digits.replace(/\D/g, '').replace(/^52/, '');
  const pretty = local.length === 10 ? `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}` : local;
  return international ? `+52 ${pretty}` : pretty;
}

// Embeddable Google Map for an address (no API key needed).
export function mapEmbedSrc(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;
}
