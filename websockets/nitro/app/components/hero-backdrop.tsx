/**
 * Subtle animated glow behind the hero. Pure CSS — two slowly drifting radial
 * gradients tinted with the brand accent and masked to fade downward. No
 * dependencies, and it respects `prefers-reduced-motion` (see `index.css`).
 */
export function HeroBackdrop() {
  return (
    <div className="hero-backdrop pointer-events-none absolute inset-x-0 top-0 h-[400px] overflow-hidden">
      <div className="hero-backdrop__layer hero-backdrop__layer--a" />
      <div className="hero-backdrop__layer hero-backdrop__layer--b" />
    </div>
  )
}
