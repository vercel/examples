import Head from 'next/head'
import Image from "next/image";
import { Layout, Text } from '@vercel/edge-functions-ui';

import Card from "../components/Card"

import styles from '../styles/Home.module.css'

const CARDS = [{
  "id": "617a8bb9637d9400182bd6fe",
  "title": "Next.js image example",
  "thumbnail": "/logo.jpg",
}, {
  "id": "617a8bb9637d9400182bd6f1",
  "title": "Next.js image example",
  "thumbnail": "/logo.jpg",
}, {
  "id": "617a8bb9637d9400182bd6f2",
  "title": "Next.js image example",
  "thumbnail": "/logo.jpg",
}]

function Home() {
  return (
    <main className="mt-4 text-center">
      <Head>
        <title>Reduce next/image bandwidth demo</title>
        <meta name="description" content="Reduce next/image bandwidth demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Text variant="h2">Using width and height</Text>
      <section className={styles.section}>
        {CARDS.map(card => (
          <Card key={card.id} title={card.title}>
            <Image width={320} height={240} src={card.thumbnail} alt={card.title} />
          </Card>
        ))}
      </section>

      <Text variant="h2">Using fill with sizes</Text>
      <section className={styles.section}>
        {CARDS.map(card => (
          <Card key={card.id} title={card.title}>
            <Image layout="fill" sizes="320px" src={card.thumbnail} alt={card.title} />
          </Card>
        ))}
      </section>

      <Text variant="h2">Using fill without sizes</Text>
      <section className={styles.section}>
        {CARDS.map(card => (
          <Card key={card.id} title={card.title}>
            <Image layout="fill" src={card.thumbnail} alt={card.title} />
          </Card>
        ))}
      </section>
    </main>
  )
}

Home.Layout = Layout

export default Home
