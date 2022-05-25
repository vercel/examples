// Avoid TS issues with CSS Modules
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}
