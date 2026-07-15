/* @ds-bundle: {"format":4,"namespace":"CasaKaypaDesignSystem_5938b5","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Divider","sourcePath":"components/core/Divider.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"}],"sourceHashes":{"components/core/Button.jsx":"85c92ea1e24c","components/core/Card.jsx":"a3e765b3ee1c","components/core/Divider.jsx":"db9055c65a05","components/core/Eyebrow.jsx":"1aa0c5ce3250","components/core/Input.jsx":"4f6059ef8976","components/core/Tag.jsx":"2a9958bafd94"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CasaKaypaDesignSystem_5938b5 = window.CasaKaypaDesignSystem_5938b5 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Casa Kaypa · Button
 * Quiet, editorial buttons. Primary = sage fill; secondary = terracotta;
 * outline = ink hairline (the logo language); ghost = text-only; link = inline.
 */
function Button({
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
    sm: {
      padding: '8px 16px',
      fontSize: '13px'
    },
    md: {
      padding: '12px 26px',
      fontSize: '15px'
    },
    lg: {
      padding: '16px 38px',
      fontSize: '17px'
    }
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
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: 'var(--accent-primary)',
      color: 'var(--text-on-accent)'
    },
    secondary: {
      background: 'var(--accent-secondary)',
      color: 'var(--text-on-accent)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-primary)',
      borderColor: 'var(--border-ink)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)',
      letterSpacing: 'var(--ls-wide)'
    },
    link: {
      background: 'transparent',
      color: 'var(--link)',
      textTransform: 'none',
      letterSpacing: 'var(--ls-normal)',
      borderRadius: 0,
      padding: 0,
      textUnderlineOffset: '4px',
      textDecoration: 'underline'
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyle = !disabled && hover ? {
    primary: {
      background: 'var(--accent-primary-hover)'
    },
    secondary: {
      background: 'var(--accent-secondary-hover)'
    },
    outline: {
      background: 'var(--ck-charcoal)',
      color: 'var(--text-on-dark)'
    },
    ghost: {
      background: 'var(--ck-cream)'
    },
    link: {
      color: 'var(--link-hover)'
    }
  }[variant] : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...variants[variant],
      ...hoverStyle,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Casa Kaypa · Card
 * Content container for rooms, experiences and stories. Variants:
 * `raised` (white + soft shadow), `outline` (ink hairline frame),
 * `sunken` (cream well). Optional image header via `media`.
 */
function Card({
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
    raised: {
      background: 'var(--surface-raised)',
      boxShadow: 'var(--shadow-sm)',
      border: '1px solid var(--border-default)'
    },
    outline: {
      background: 'var(--surface-page)',
      border: '1px solid var(--border-ink)'
    },
    sunken: {
      background: 'var(--surface-sunken)',
      border: '1px solid transparent'
    }
  };
  const lift = hoverLift && hover ? {
    transform: 'translateY(-4px)',
    boxShadow: 'var(--shadow-md)'
  } : {};
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      fontFamily: 'var(--font-body)',
      color: 'var(--text-primary)',
      transition: 'var(--transition-soft)',
      ...variants[variant],
      ...lift,
      ...style
    }
  }, rest), media && /*#__PURE__*/React.createElement("div", {
    style: {
      height: mediaHeight,
      overflow: 'hidden'
    }
  }, typeof media === 'string' ? /*#__PURE__*/React.createElement("img", {
    src: media,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }) : media), /*#__PURE__*/React.createElement("div", {
    style: {
      padding
    }
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Divider.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Casa Kaypa · Divider
 * The signature 1px ink rule. `short` renders a 48px terracotta accent;
 * `soft` uses the hairline neutral.
 */
function Divider({
  variant = 'default',
  vertical = false,
  style = {},
  ...rest
}) {
  const variants = {
    default: {
      background: 'var(--border-ink)'
    },
    soft: {
      background: 'var(--border-hairline)'
    },
    short: {
      background: 'var(--ck-terracotta-500)'
    }
  };
  const isShort = variant === 'short';
  const dims = vertical ? {
    width: variant === 'default' ? '1px' : '2px',
    height: isShort ? '48px' : '100%',
    alignSelf: 'stretch'
  } : {
    height: isShort ? '2px' : '1px',
    width: isShort ? '48px' : '100%'
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    role: "separator",
    style: {
      display: 'block',
      border: 0,
      ...dims,
      ...variants[variant],
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Divider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Divider.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Casa Kaypa · Eyebrow
 * All-caps, wide-tracked overline that opens a section — echoes the
 * "SANTA EULALIA" lockup. Optional short rule before the text.
 */
function Eyebrow({
  children,
  rule = true,
  color = 'var(--text-brand)',
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-overline)',
      fontWeight: 'var(--fw-medium)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-wider)',
      color,
      ...style
    }
  }, rest), rule && /*#__PURE__*/React.createElement("span", {
    style: {
      width: '28px',
      height: '1px',
      background: 'currentColor',
      opacity: 0.6
    }
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Casa Kaypa · Input
 * Understated field with a hairline underline that warms to sage on focus.
 * Label sits above as a quiet overline.
 */
function Input({
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
  const line = error ? 'var(--status-error)' : focus ? 'var(--accent-primary)' : 'var(--border-hairline)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-overline)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-wide)',
      fontWeight: 'var(--fw-medium)',
      color: 'var(--text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 'var(--fs-body)',
      color: 'var(--text-primary)',
      background: 'transparent',
      border: 'none',
      borderBottom: `1.5px solid ${line}`,
      padding: '8px 2px',
      outline: 'none',
      transition: 'var(--transition-color)',
      opacity: disabled ? 0.5 : 1
    }
  }, rest)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-caption)',
      color: error ? 'var(--status-error)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Casa Kaypa · Tag
 * Small pill label for amenities, seasons, categories. Soft tinted fills.
 */
function Tag({
  children,
  tone = 'sage',
  size = 'md',
  style = {},
  ...rest
}) {
  const tones = {
    sage: {
      background: 'var(--ck-sage-100)',
      color: 'var(--ck-sage-700)'
    },
    seafoam: {
      background: 'var(--ck-seafoam-100)',
      color: 'var(--ck-seafoam-700)'
    },
    terracotta: {
      background: 'var(--ck-terracotta-100)',
      color: 'var(--ck-terracotta-700)'
    },
    rose: {
      background: 'var(--ck-rose-100)',
      color: 'var(--ck-terracotta-700)'
    },
    neutral: {
      background: 'var(--ck-neutral-200)',
      color: 'var(--ck-neutral-700)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-ink)'
    }
  };
  const sizes = {
    sm: {
      padding: '3px 10px',
      fontSize: '11px'
    },
    md: {
      padding: '5px 14px',
      fontSize: '12px'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Divider = __ds_scope.Divider;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Tag = __ds_scope.Tag;

})();
