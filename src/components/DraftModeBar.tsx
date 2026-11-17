'use client';

import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';

const noSubscribe = () => () => {};

// Shown only when someone opens the draft preview outside the Studio, so they don't mistake drafts for the live site.
export function DraftModeBar() {
  const pathname = usePathname();
  // Inside the Studio the preview runs in an iframe; on the server assume so, to avoid a flash.
  const inStudio = useSyncExternalStore(noSubscribe, () => window.self !== window.top, () => true);
  if (inStudio || pathname.startsWith('/studio')) return null;
  return (
    <div
      role="status"
      style={{
        position: 'fixed',
        left: 16,
        bottom: 16,
        zIndex: 100,
        display: 'flex',
        gap: 14,
        alignItems: 'center',
        padding: '12px 16px',
        background: '#16232A',
        color: '#FAF7F1',
        fontSize: 13,
        borderRadius: 4,
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      }}
    >
      Vista previa con borradores
      <a href={`/api/draft-mode/disable?to=${encodeURIComponent(pathname)}`} style={{ color: '#C9A24C', fontWeight: 500 }}>
        Salir
      </a>
    </div>
  );
}
