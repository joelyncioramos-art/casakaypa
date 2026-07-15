import React from 'react';

/**
 * Casa Kaypa · Input
 * Understated field with a hairline underline that warms to sage on focus.
 * Label sits above as a quiet overline.
 */
export function Input({
  label,
  hint,
  error,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const line = error
    ? 'var(--status-error)'
    : focus
    ? 'var(--accent-primary)'
    : 'var(--border-hairline)';

  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-body)', ...style }}>
      {label && (
        <span style={{
          fontSize: 'var(--fs-overline)', textTransform: 'uppercase',
          letterSpacing: 'var(--ls-wide)', fontWeight: 'var(--fw-medium)',
          color: 'var(--text-secondary)',
        }}>{label}</span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--fs-body)',
          color: 'var(--text-primary)',
          background: 'transparent',
          border: 'none',
          borderBottom: `1.5px solid ${line}`,
          padding: '8px 2px',
          outline: 'none',
          transition: 'var(--transition-color)',
          opacity: disabled ? 0.5 : 1,
        }}
        {...rest}
      />
      {(hint || error) && (
        <span style={{
          fontSize: 'var(--fs-caption)',
          color: error ? 'var(--status-error)' : 'var(--text-muted)',
        }}>{error || hint}</span>
      )}
    </label>
  );
}
