import React from 'react';

/**
 * Casa Kaypa · Card
 * Content container for rooms, experiences and stories. Variants:
 * `raised` (white + soft shadow), `outline` (ink hairline frame),
 * `sunken` (cream well). Optional image header via `media`.
 */
export function Card({
  children,
  variant = 'raised',
  media,
  mediaHeight = 200,
  padding = 'var(--pad-card)',
  hoverLift = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const variants = {
    raised:  { background: 'var(--surface-raised)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-default)' },
    outline: { background: 'var(--surface-page)', border: '1px solid var(--border-ink)' },
    sunken:  { background: 'var(--surface-sunken)', border: '1px solid transparent' },
  };
  const lift = hoverLift && hover
    ? { transform: 'translateY(-4px)', boxShadow: 'var(--shadow-md)' }
    : {};

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
        color: 'var(--text-primary)',
        transition: 'var(--transition-soft)',
        ...variants[variant],
        ...lift,
        ...style,
      }}
      {...rest}
    >
      {media && (
        <div style={{ height: mediaHeight, overflow: 'hidden' }}>
          {typeof media === 'string'
            ? <img src={media} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            : media}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}
