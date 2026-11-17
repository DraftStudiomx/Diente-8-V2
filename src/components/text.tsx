import { Fragment } from 'react';

export type CopyVars = Record<string, string | number>;

// Replaces {name} placeholders (e.g. {especialidades}) with live values; unknown ones are left as typed.
export function fill(text: string, vars: CopyVars = {}): string {
  return text.replace(/\{([\p{L}_]+)\}/gu, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

// Renders editor text where *words between asterisks* become <em> (styled as gold italic by each section).
export function Rich({ text, vars }: { text: string; vars?: CopyVars }) {
  const parts = fill(text, vars).split('*');
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <em key={i}>{p}</em> : <Fragment key={i}>{p}</Fragment>))}
    </>
  );
}
