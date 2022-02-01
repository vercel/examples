export enum Breakpoint {
  xs = '22.5em',
  sm = '30em',
  md = '48em',
  lg = '62em',
  xl = '80em',
}

export const breakpoints = {
  xs: '22.5em',
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '80em',
}

export type BreakpointServer = Breakpoint.sm | Breakpoint.md | Breakpoint.lg
