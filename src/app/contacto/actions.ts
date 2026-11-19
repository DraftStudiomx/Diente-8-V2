'use server';

import { stegaClean } from 'next-sanity';
import { z } from 'zod';
import { getContent } from '@/lib/content';

export type ContactState = {
  status: 'idle' | 'ok' | 'error';
  errors?: Partial<Record<'name' | 'phone' | 'email' | 'privacy', string>>;
  values?: Record<string, string>; // echoed back so a failed submit doesn't wipe what the person typed
};

const schema = z.object({
  name: z.string().trim().min(2, 'Escribe tu nombre.').max(120),
  phone: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, '').length >= 10, 'Escribe un teléfono de 10 dígitos.')
    .refine((v) => v.length <= 30, 'Revisa el teléfono.'),
  email: z.union([z.literal(''), z.email('Revisa el correo.').max(160)]),
  branch: z.string().trim().max(80),
  reason: z.string().trim().max(120),
  message: z.string().trim().max(2000),
  privacy: z.literal('on', 'Necesitamos tu aceptación para poder contactarte.'),
});

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Spam traps: a hidden field people never fill, and bots that submit within a couple of seconds.
  const startedAt = Number(formData.get('t'));
  if (formData.get('website') || !startedAt || Date.now() - startedAt < 2500) return { status: 'ok' };

  const get = (k: string) => String(formData.get(k) ?? '');
  const values = Object.fromEntries(['name', 'phone', 'email', 'branch', 'reason', 'message', 'privacy'].map((k) => [k, get(k)]));
  const parsed = schema.safeParse({
    name: get('name'),
    phone: get('phone'),
    email: get('email'),
    branch: get('branch'),
    reason: get('reason'),
    message: get('message'),
    privacy: get('privacy'),
  });
  if (!parsed.success) {
    const errors: ContactState['errors'] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ContactState['errors']>;
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return { status: 'error', errors, values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const { settings } = await getContent();
  const to = stegaClean(process.env.CONTACT_TO_EMAIL || settings.email);
  if (!apiKey || !to) {
    console.error('[contact] RESEND_API_KEY or recipient email missing; message not sent.');
    return { status: 'error', values };
  }

  const d = parsed.data;
  const rows: [string, string][] = [
    ['Nombre', d.name],
    ['Teléfono', d.phone],
    ['Correo', d.email || '—'],
    ['Sucursal', d.branch || '—'],
    ['Motivo', d.reason || '—'],
    ['Mensaje', d.message || '—'],
  ];
  const html = `<h2 style="font-family:Georgia,serif;color:#07215A">Nueva solicitud desde el sitio web</h2>
<table cellpadding="8" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:15px">
${rows.map(([k, v]) => `<tr><td style="color:#666;vertical-align:top"><b>${k}</b></td><td style="white-space:pre-wrap">${escape(v)}</td></tr>`).join('\n')}
</table>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'Sitio Diente8 <onboarding@resend.dev>',
        to: [to],
        ...(d.email ? { reply_to: d.email } : {}),
        subject: `Nueva cita: ${d.name}${d.reason ? ` · ${d.reason}` : ''}`,
        html,
        text,
      }),
    });
    if (!res.ok) {
      console.error('[contact] Resend error', res.status, await res.text());
      return { status: 'error', values };
    }
    return { status: 'ok' };
  } catch (err) {
    console.error('[contact] send failed', err);
    return { status: 'error', values };
  }
}
