import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Alt Image Generator</title>
        <meta name="description" content="Alt image generator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.h1}> Alt Image Generator</h1>
      <p>
        Send a request to `/api/generate` with `imageUrl` as a query parameter:
      </p>
      <Link
        className={styles.highlight}
        href="/api/generate?imageUrl=https://dub.sh/confpic"
      >
        http://localhost:3000/api/generate?imageUrl=https://dub.sh/confpic
      </Link>
    </div>
  );
};

export default Home;
