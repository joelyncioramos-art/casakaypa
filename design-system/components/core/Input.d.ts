import * as React from 'react';

/** Understated text field with a hairline underline that warms to sage on focus. */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style'> {
  /** Overline label shown above the field. */
  label?: string;
  /** Helper text below. */
  hint?: string;
  /** Error message (overrides hint, turns the line terracotta). */
  error?: string;
  style?: React.CSSProperties;
}

export function Input(props: InputProps): JSX.Element;
