import type { Metadata, Viewport } from 'next';
import { VisualEditing } from 'next-sanity/visual-editing';
import { Fraunces, Inter } from 'next/font/google';
import { draftMode } from 'next/headers';
import { DraftModeBar } from '@/components/DraftModeBar';
import { Nav } from '@/components/Nav';
import { Reveal } from '@/components/Reveal';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { getContent, whatsappHref } from '@/lib/content';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-fraunces',
  display: 'swap',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getContent();
  return {
    metadataBase: new URL(settings.siteUrl),
    title: { default: 'Diente8 · Clínica dental en León, Guanajuato', template: '%s · Diente8 Clínica Dental' },
    description: settings.description,
    openGraph: {
      type: 'website',
      locale: 'es_MX',
      siteName: settings.name,
      images: [{ url: '/assets/content/panorama-fachada.jpg' }],
    },
    twitter: { card: 'summary_large_image' },
    icons: { icon: '/assets/logo-monogram.png', apple: '/assets/logo-monogram.png' },
  };
}

export const viewport: Viewport = { themeColor: '#07215A', width: 'device-width', initialScale: 1 };

// Runs before paint: content hidden for scroll reveals only when JS runs and motion is allowed,
// so nothing stays invisible if scripts fail.
const revealBoot = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window)document.documentElement.classList.add('d8-reveal')}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { settings, copy } = await getContent();
  const { isEnabled: isDraft } = await draftMode();
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBoot }} />
      </head>
      <body>
        <Nav ctaHref={whatsappHref(settings)} ctaLabel={copy.navCta} />
        <main>{children}</main>
        <Reveal />
        {settings.whatsapp && <WhatsAppButton href={whatsappHref(settings)} label={copy.floatingWhatsapp} />}
        {isDraft && (
          <>
            <VisualEditing />
            <DraftModeBar />
          </>
        )}
      </body>
    </html>
  );
}
