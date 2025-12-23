import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
}

export function ShimmerText({
  children,
  className,
  ref,
}: ShimmerTextProps & React.RefAttributes<HTMLSpanElement>) {
  return (
    <span
      ref={ref}
      className={cn('animate-text-shimmer inline-block !bg-clip-text text-transparent', className)}
    >
      {children}
    </span>
  );
}

export default ShimmerText;
