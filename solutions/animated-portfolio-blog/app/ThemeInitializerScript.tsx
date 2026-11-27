import Script from "next/script";

// The script must be defined as a string for use with next/script
const themeInitializerScript = `
  (function() {
    // This function must run immediately
    try {
      const theme = localStorage.getItem('theme');
      if (theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        }
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        localStorage.setItem('theme', 'dark');
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      // Catch potential security errors if cookies/storage are disabled
      console.error('Failed to initialize theme:', e);
    }
  })();
`;

const ThemeInitializerScript = () => {
  return (
    <Script
      id="theme-initializer" // Unique ID for the script
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: themeInitializerScript }}
    />
  );
};

export default ThemeInitializerScript;
