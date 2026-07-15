import * as React from 'react';

/** Small pill label for amenities, seasons and categories. */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color tone. @default "sage" */
  tone?: 'sage' | 'seafoam' | 'terracotta' | 'rose' | 'neutral' | 'outline';
  /** @default "md" */
  size?: 'sm' | 'md';
  children?: React.ReactNode;
}

export function Tag(props: TagProps): JSX.Element;
