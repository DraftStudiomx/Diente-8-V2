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
