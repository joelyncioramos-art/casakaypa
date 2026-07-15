import * as React from 'react';

/** The signature Casa Kaypa hairline rule. */
export interface DividerProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** `default` 1px ink · `soft` neutral hairline · `short` 48px terracotta accent. @default "default" */
  variant?: 'default' | 'soft' | 'short';
  /** Render vertically. @default false */
  vertical?: boolean;
}

export function Divider(props: DividerProps): JSX.Element;
