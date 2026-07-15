import React from 'react';

/**
 * Casa Kaypa · Tag
 * Small pill label for amenities, seasons, categories. Soft tinted fills.
 */
export function Tag({ children, tone = 'sage', size = 'md', style = {}, ...rest }) {
  const tones = {
    sage:       { background: 'var(--ck-sage-100)',       color: 'var(--ck-sage-700)' },
    seafoam:    { background: 'var(--ck-seafoam-100)',    color: 'var(--ck-seafoam-700)' },
    terracotta: { background: 'var(--ck-terracotta-100)', color: 'var(--ck-terracotta-700)' },
    rose:       { background: 'var(--ck-rose-100)',       color: 'var(--ck-terracotta-700)' },
    neutral:    { background: 'var(--ck-neutral-200)',    color: 'var(--ck-neutral-700)' },
    outline:    { background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-ink)' },
  };
  const sizes = {
    sm: { padding: '3px 10px', fontSize: '11px' },
    md: { padding: '5px 14px', fontSize: '12px' },
  };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'var(--font-body)',
        fontWeight: 'var(--fw-medium)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--ls-wide)',
        borderRadius: 'var(--radius-pill)',
        lineHeight: 1.4,
        ...sizes[size],
        ...tones[tone],
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
