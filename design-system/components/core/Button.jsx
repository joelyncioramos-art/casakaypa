import React from 'react';

/**
 * Casa Kaypa · Button
 * Quiet, editorial buttons. Primary = sage fill; secondary = terracotta;
 * outline = ink hairline (the logo language); ghost = text-only; link = inline.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: '8px 16px', fontSize: '13px' },
    md: { padding: '12px 26px', fontSize: '15px' },
    lg: { padding: '16px 38px', fontSize: '17px' },
  };

  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 'var(--fw-medium)',
    textTransform: 'uppercase',
    letterSpacing: 'var(--ls-wide)',
    borderRadius: 'var(--radius-pill)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: fullWidth ? '100%' : 'auto',
    transition: 'var(--transition-soft)',
    opacity: disabled ? 0.45 : 1,
    lineHeight: 1,
    ...sizes[size],
  };

  const variants = {
    primary: {
      background: 'var(--accent-primary)',
      color: 'var(--text-on-accent)',
    },
    secondary: {
      background: 'var(--accent-secondary)',
      color: 'var(--text-on-accent)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-ink)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)',
      letterSpacing: 'var(--ls-wide)',
    },
    link: {
      background: 'transparent',
      color: 'var(--link)',
      textTransform: 'none',
      letterSpacing: 'var(--ls-normal)',
      borderRadius: 0,
      padding: 0,
      textUnderlineOffset: '4px',
      textDecoration: 'underline',
    },
  };

  const [hover, setHover] = React.useState(false);
  const hoverStyle = !disabled && hover ? {
    primary:   { background: 'var(--accent-primary-hover)' },
    secondary: { background: 'var(--accent-secondary-hover)' },
    outline:   { background: 'var(--ck-charcoal)', color: 'var(--text-on-dark)' },
    ghost:     { background: 'var(--ck-cream)' },
    link:      { color: 'var(--link-hover)' },
  }[variant] : {};

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant], ...hoverStyle, ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}
