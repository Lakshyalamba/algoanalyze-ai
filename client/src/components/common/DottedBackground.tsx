import type { ReactNode } from 'react';

type DottedBackgroundProps = {
  children: ReactNode;
  className?: string;
};

export function DottedBackground({ children, className = '' }: DottedBackgroundProps) {
  return <div className={`dotted-grid-bg ${className}`}>{children}</div>;
}
