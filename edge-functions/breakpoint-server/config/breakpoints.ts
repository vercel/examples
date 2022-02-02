export enum Breakpoint {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}

export const breakpoints = {
  xs: '22.5em',
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '80em',
}

export const serverBreakpoints: readonly BreakpointServer[] = [Breakpoint.sm, Breakpoint.md, Breakpoint.lg]  as const;

export type BreakpointServer = Breakpoint.sm | Breakpoint.md | Breakpoint.lg
