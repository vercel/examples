import Script from "next/script";

// Mirrors ThemeInitializerScript: reads the persisted sound preference from
// localStorage and sets document.documentElement.dataset.sound BEFORE React
// hydrates, so useIsMuted returns the right value on first client render and
// playSound never fires for a returning-muted user before the toggle renders.
//
// Default is muted — a first-time visitor (no localStorage entry) gets no
// audio until they explicitly opt in via the radial Menu toggle.

const soundInitializerScript = `
  (function() {
    try {
      var muted = localStorage.getItem('sound-muted');
      document.documentElement.dataset.sound = (muted === 'false') ? 'unmuted' : 'muted';
    } catch (e) {
      // storage disabled (private mode / cookies off) — fall back to default muted
      document.documentElement.dataset.sound = 'muted';
    }
  })();
`;

const SoundInitializerScript = () => {
  return (
    <Script
      id="sound-initializer"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: soundInitializerScript }}
    />
  );
};

export default SoundInitializerScript;
