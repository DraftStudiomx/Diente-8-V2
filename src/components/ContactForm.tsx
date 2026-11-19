'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { sendContact, type ContactState } from '@/app/contacto/actions';
import type { SiteCopy } from '@/content/types';

type Props = {
  copy: Pick<
    SiteCopy,
    | 'formName'
    | 'formPhone'
    | 'formEmail'
    | 'formBranch'
    | 'formBranchAny'
    | 'formReason'
    | 'formReasonUnknown'
    | 'formMessage'
    | 'formPrivacy'
    | 'formButton'
    | 'formSending'
    | 'formSuccess'
    | 'formError'
  >;
  branches: string[];
  specialties: string[];
  whatsappHref: string;
};

// "*text*" in the privacy label becomes the link to the privacy notice.
function PrivacyLabel({ text }: { text: string }) {
  const parts = text.split('*');
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <Link key={i} href="/aviso-de-privacidad" target="_blank">
            {p}
          </Link>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function ContactForm({ copy, branches, specialties, whatsappHref }: Props) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, { status: 'idle' });
  const [startedAt] = useState(() => Date.now());
  const err = state.errors ?? {};
  const v = state.values ?? {};

  if (state.status === 'ok') {
    return (
      <div className="form" role="status">
        <p className="form-status ok full">{copy.formSuccess}</p>
      </div>
    );
  }

  return (
    <form action={action} className="form" noValidate>
      <input type="hidden" name="t" value={startedAt} />
      <div className="hp" aria-hidden="true">
        <label>
          No llenar
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="field">
        <label htmlFor="cf-name">{copy.formName}</label>
        <input id="cf-name" name="name" defaultValue={v.name} autoComplete="name" required aria-invalid={!!err.name} aria-describedby={err.name ? 'cf-name-e' : undefined} />
        {err.name && (
          <span id="cf-name-e" className="field-error">
            {err.name}
          </span>
        )}
      </div>
      <div className="field">
        <label htmlFor="cf-phone">{copy.formPhone}</label>
        <input
          id="cf-phone"
          name="phone"
          defaultValue={v.phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          aria-invalid={!!err.phone}
          aria-describedby={err.phone ? 'cf-phone-e' : undefined}
        />
        {err.phone && (
          <span id="cf-phone-e" className="field-error">
            {err.phone}
          </span>
        )}
      </div>
      <div className="field full">
        <label htmlFor="cf-email">{copy.formEmail}</label>
        <input id="cf-email" name="email" defaultValue={v.email} type="email" autoComplete="email" aria-invalid={!!err.email} aria-describedby={err.email ? 'cf-email-e' : undefined} />
        {err.email && (
          <span id="cf-email-e" className="field-error">
            {err.email}
          </span>
        )}
      </div>
      <div className="field">
        <label htmlFor="cf-branch">{copy.formBranch}</label>
        <select id="cf-branch" name="branch" defaultValue={v.branch ?? ''}>
          <option value="">{copy.formBranchAny}</option>
          {branches.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="cf-reason">{copy.formReason}</label>
        <select id="cf-reason" name="reason" defaultValue={v.reason ?? ''}>
          <option value="">{copy.formReasonUnknown}</option>
          {specialties.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="field full">
        <label htmlFor="cf-message">{copy.formMessage}</label>
        <textarea id="cf-message" name="message" defaultValue={v.message} maxLength={2000} />
      </div>

      <div className="full">
        <label className="check">
          <input type="checkbox" name="privacy" defaultChecked={v.privacy === 'on'} required aria-invalid={!!err.privacy} aria-describedby={err.privacy ? 'cf-privacy-e' : undefined} />
          <span>
            <PrivacyLabel text={copy.formPrivacy} />
          </span>
        </label>
        {err.privacy && (
          <span id="cf-privacy-e" className="field-error">
            {err.privacy}
          </span>
        )}
      </div>

      <div className="form-actions full">
        <button type="submit" className="btn btn-navy" disabled={pending}>
          {pending ? copy.formSending : copy.formButton}
        </button>
        {state.status === 'error' && !state.errors && (
          <p className="form-status err" role="alert">
            {copy.formError}{' '}
            {whatsappHref.startsWith('http') && (
              <a href={whatsappHref} target="_blank" rel="noopener">
                WhatsApp →
              </a>
            )}
          </p>
        )}
      </div>
    </form>
  );
}
