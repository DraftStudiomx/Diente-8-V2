import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  // The previous static site used .html URLs; keep their search ranking by redirecting permanently.
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/especialidades.html', destination: '/especialidades', permanent: true },
      { source: '/sucursales.html', destination: '/sucursales', permanent: true },
      { source: '/equipo.html', destination: '/equipo', permanent: true },
      { source: '/contacto.html', destination: '/contacto', permanent: true },
    ];
  },
};

export default nextConfig;
