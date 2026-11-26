import type { Metadata } from 'next';
import { stegaClean } from 'next-sanity';
import { Footer } from '@/components/Footer';
import { fill } from '@/components/text';
import { getContent, whatsappHref } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Aviso de privacidad',
  description: 'Aviso de privacidad de Diente8 Clínica Dental: qué datos recabamos en este sitio, para qué los usamos y cómo ejercer tus derechos ARCO.',
  alternates: { canonical: '/aviso-de-privacidad' },
};

// Editor text: blank line = new paragraph, "## " = subheading.
function Body({ text }: { text: string }) {
  const blocks = text
    .split(/\n\s*\n|\n(?=## )/)
    .map((b) => b.trim())
    .filter(Boolean);
  return (
    <>
      {blocks.flatMap((block, i) => {
        if (!stegaClean(block).startsWith('## ')) return [<p key={i}>{block}</p>];
        const [heading, ...rest] = block.replace(/^## /, '').split('\n');
        return [<h2 key={`${i}h`}>{heading}</h2>, ...(rest.length ? [<p key={`${i}p`}>{rest.join(' ')}</p>] : [])];
      })}
    </>
  );
}

export default async function PrivacyPage() {
  const { settings, branches, copy } = await getContent();
  const addresses = branches.map((b) => b.addressLines.join(' ').replace(/,\s*$/, ''));
  const vars = {
    responsable: settings.legalName || settings.name,
    domicilio: settings.legalAddress || addresses.join(', y en '),
    correo: settings.email || 'el correo de contacto de la clínica',
  };
  return (
    <>
      <section className="sec sec-cream">
        <article className="legal">
          <h1>{copy.privacyTitle}</h1>
          <p className="updated">{copy.privacyUpdated}</p>
          <Body text={fill(copy.privacyText, vars)} />
        </article>
      </section>
      <Footer whatsapp={whatsappHref(settings)} copy={copy} />
    </>
  );
}
