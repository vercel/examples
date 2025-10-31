declare module 'navigation/header' {
  export function bootstrap(): Promise<void>;
  export function mount(): Promise<void>;
  export function unmount(): Promise<void>;
}

declare module 'navigation/footer' {
  export function bootstrap(): Promise<void>;
  export function mount(): Promise<void>;
  export function unmount(): Promise<void>;
}

declare module 'content/landing' {
  export function bootstrap(): Promise<void>;
  export function mount(): Promise<void>;
  export function unmount(): Promise<void>;
}
