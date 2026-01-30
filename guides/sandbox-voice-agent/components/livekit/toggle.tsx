'use client';

import * as React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cn } from '@/lib/utils';

const toggleVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-full',
    'text-sm font-medium whitespace-nowrap',
    'cursor-pointer outline-none transition-[color,box-shadow,background-color]',
    'hover:bg-muted hover:text-muted-foreground',
    'disabled:pointer-events-none disabled:opacity-50',
    'data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
    'focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring',
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ',
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        primary:
          'bg-muted data-[state=on]:bg-muted hover:text-foreground text-destructive hover:text-foreground hover:bg-foreground/10 hover:data-[state=on]:bg-foreground/10',
        secondary:
          'bg-muted data-[state=on]:bg-muted hover:text-foreground hover:bg-foreground/10 hover:data-[state=on]:bg-foreground/10 data-[state=on]:bg-blue-500/20 data-[state=on]:hover:bg-blue-500/30 data-[state=on]:text-blue-700 dark:data-[state=on]:text-blue-300',
        outline:
          'border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
