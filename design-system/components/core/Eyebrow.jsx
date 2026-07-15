import React from 'react';

/**
 * Casa Kaypa · Eyebrow
 * All-caps, wide-tracked overline that opens a section — echoes the
 * "SANTA EULALIA" lockup. Optional short rule before the text.
 */
export function Eyebrow({ children, rule = true, color = 'var(--text-brand)', style = {}, ...rest }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--fs-overline)',
        fontWeight: 'var(--fw-medium)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--ls-wider)',
        color,
        ...style,
      }}
      {...rest}
    >
      {rule && (
        <span style={{ width: '28px', height: '1px', background: 'currentColor', opacity: 0.6 }} />
      )}
      {children}
    </span>
  );
}
