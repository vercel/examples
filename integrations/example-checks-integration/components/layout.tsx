import Head from "next/head";

const Layout: React.FC<React.PropsWithChildren<{}>> = (props: any) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Checks Integration</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex-1 flex items-center justify-center">
        {props.children}
      </div>
      <footer className="mt-12 flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer>
    </div>
  );
};

export default Layout;
