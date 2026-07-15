import React from 'react';

/**
 * Casa Kaypa · Divider
 * The signature 1px ink rule. `short` renders a 48px terracotta accent;
 * `soft` uses the hairline neutral.
 */
export function Divider({ variant = 'default', vertical = false, style = {}, ...rest }) {
  const variants = {
    default: { background: 'var(--border-ink)' },
    soft:    { background: 'var(--border-hairline)' },
    short:   { background: 'var(--ck-terracotta-500)' },
  };
  const isShort = variant === 'short';
  const dims = vertical
    ? { width: variant === 'default' ? '1px' : '2px', height: isShort ? '48px' : '100%', alignSelf: 'stretch' }
    : { height: isShort ? '2px' : '1px', width: isShort ? '48px' : '100%' };
  return (
    <span
      role="separator"
      style={{ display: 'block', border: 0, ...dims, ...variants[variant], ...style }}
      {...rest}
    />
  );
}
