import * as React from 'react';

/**
 * Content container for rooms, experiences and stories.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default "raised" */
  variant?: 'raised' | 'outline' | 'sunken';
  /** Image URL or a React node rendered as the media header. */
  media?: string | React.ReactNode;
  /** Media header height in px. @default 200 */
  mediaHeight?: number;
  /** Body padding (any CSS length or token). */
  padding?: string;
  /** Lift + deepen shadow on hover. @default false */
  hoverLift?: boolean;
  children?: React.ReactNode;
}

export function Card(props: CardProps): JSX.Element;
