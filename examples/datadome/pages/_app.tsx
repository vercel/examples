import type { AppProps } from 'next/app';
import Script from 'next/script';
import '../styles.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main>
      <Component {...pageProps} />

      {/* datadome bot protection */}
      <Script strategy="lazyOnload">
        {`
          window.ddjskey = "${process.env.NEXT_PUBLIC_DATADOME_CLIENT_KEY}";
          window.ddoptions = { ajaxListenerPath: true };
        `}
      </Script>
      <Script src="https://js.datadome.co/tags.js" strategy="lazyOnload" />
    </main>
  );
}

export default MyApp;
