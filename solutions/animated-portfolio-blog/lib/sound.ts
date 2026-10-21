// Site-wide procedural interface sounds. Mirrors the theme system's pattern:
// mute state lives on document.documentElement.dataset.sound ("muted"|"unmuted")
// so playSound() can read it without prop-drilling or a React context. The
// SoundInitializerScript sets the attribute pre-hydration from localStorage;
// the radial Menu toggle flips it via setMuted().

export type SoundType = "hover" | "select" | "toggle";

// The AudioContext MUST be created inside a user-gesture handler (click,
// pointerdown, keydown) — not just resumed there. Creating it from a
// mouseenter handler (what playSound callers use) triggers Chrome's:
//   "The AudioContext was not allowed to start."
// So the context is only created by ensureCtx(), which is called exclusively
// from gesture-safe call sites: the pointerdown/keydown unlock listeners and
// setMuted(false). playSound never creates it — it only plays if the context
// already exists, and otherwise quietly installs the gesture listeners that
// will create it on the next click/keydown.
let ctx: AudioContext | null = null;
let gestureUnlockInstalled = false;

// Debounce window for hover ticks. Sweeping across several CircleButtons in
// quick succession would otherwise fire one tick per icon; this collapses
// repeated hovers within the window into a single sound. Only "hover" is
// gated — "select" and "toggle" should always fire on explicit intent.
const HOVER_DEBOUNCE_MS = 150;
let lastHoverTime = 0;

// Attaches one-shot listeners for the user-activation events Chrome's autoplay
// policy accepts. On the first pointerdown/keydown anywhere on the page, the
// callback creates the AudioContext inside the gesture (allowed) and resumes
// it. After that, all subsequent playSound calls find a running context.
function installGestureUnlock(): void {
  if (gestureUnlockInstalled || typeof window === "undefined") return;
  gestureUnlockInstalled = true;
  const unlock = () => {
    const c = ensureCtx();
    if (c && c.state === "suspended") c.resume().catch(() => {});
  };
  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("keydown", unlock, { passive: true });
}

// Lazily creates the singleton AudioContext. Callers MUST be inside a
// user-gesture handler (click/pointerdown/keydown) — Chrome will otherwise
// block the context and log an autoplay-policy warning.
function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

export function isMuted(): boolean {
  if (typeof window === "undefined") return true;
  return document.documentElement.dataset.sound !== "unmuted";
}

export function setMuted(next: boolean): void {
  if (typeof window === "undefined") return;
  document.documentElement.dataset.sound = next ? "muted" : "unmuted";
  try {
    localStorage.setItem("sound-muted", String(next));
  } catch {
    // storage disabled (private mode / cookies off) — DOM attribute still works in-session
  }
  // Create + resume on unmute. setMuted is called from the radial Menu toggle
  // click, which IS a user gesture, so creating the context here is allowed.
  if (!next) {
    const c = ensureCtx();
    if (c && c.state === "suspended") c.resume().catch(() => {});
  }
}

export function toggleSound(): void {
  // willUnmute is true when currently muted → toggling toward unmuted.
  const willUnmute = isMuted();
  setMuted(!willUnmute);
  // Confirmation beep only on unmute — when muting, no sound should play.
  // After setMuted(false), the DOM reads "unmuted" and ctx is created, so
  // playSound passes both the mute gate and the ctx-exists check.
  if (willUnmute) playSound("toggle");
}

// Oscillator configs preserved verbatim from the former ProjectSection inline
// helper — same waveforms, frequency sweeps, gain envelopes, and bandpass filter.
export function playSound(type: SoundType): void {
  if (isMuted()) return;
  if (type === "hover") {
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    if (now - lastHoverTime < HOVER_DEBOUNCE_MS) return;
    lastHoverTime = now;
  }
  // Do NOT create the context here. playSound callers use mouseenter, which is
  // not a user-activation event — creating the context would trigger Chrome's
  // "AudioContext was not allowed to start" warning. Instead, install gesture
  // listeners (if not already) that will create it on the next click/keydown,
  // then bail out. The first hover after a gesture finds ctx already running.
  if (!ctx) {
    installGestureUnlock();
    return;
  }
  const c = ctx;
  // After the page has sticky activation, a suspended ctx (e.g. after tab
  // switch) can be resumed even from a non-gesture handler.
  if (c.state === "suspended") c.resume().catch(() => {});
  try {
    const osc = c.createOscillator();
    const gain = c.createGain();

    osc.connect(gain);
    gain.connect(c.destination);

    if (type === "hover") {
      // Futuristic click/tick
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, c.currentTime + 0.08);
      gain.gain.setValueAtTime(0.03, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, c.currentTime + 0.08);
      osc.start();
      osc.stop(c.currentTime + 0.08);
    } else if (type === "select") {
      // Sci-fi energy sweep
      osc.type = "triangle";
      osc.frequency.setValueAtTime(150, c.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, c.currentTime + 0.25);

      const filter = c.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 6;
      filter.frequency.setValueAtTime(180, c.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1800, c.currentTime + 0.25);

      osc.disconnect(gain);
      osc.connect(filter);
      filter.connect(gain);

      gain.gain.setValueAtTime(0.05, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);

      osc.start();
      osc.stop(c.currentTime + 0.25);
    } else if (type === "toggle") {
      // Futuristic slide toggle beep
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, c.currentTime);
      osc.frequency.setValueAtTime(780, c.currentTime + 0.06);
      gain.gain.setValueAtTime(0.02, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.002, c.currentTime + 0.15);
      osc.start();
      osc.stop(c.currentTime + 0.15);
    }
  } catch (e) {
    console.warn("AudioContext playback interrupted:", e);
  }
}
