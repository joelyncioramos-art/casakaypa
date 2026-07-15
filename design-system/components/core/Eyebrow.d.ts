import * as React from 'react';

/** All-caps wide-tracked section overline that echoes the logo lockup. */
export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Show the short leading rule. @default true */
  rule?: boolean;
  /** Text color. @default brand sage ink */
  color?: string;
  children?: React.ReactNode;
}

export function Eyebrow(props: EyebrowProps): JSX.Element;
