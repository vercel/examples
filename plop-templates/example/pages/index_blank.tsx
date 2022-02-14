import Head from 'next/head'

function Home() {
  return (
    <main>
      <Head>
        <title>-- PLOP TITLE HERE -- - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example how to use -- PLOP TITLE HERE --"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <h1>-- PLOP TITLE HERE -- usage example</h1>
        <p>
          This example shows how to Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Voluptas eligendi aliquam officiis aliquid neque
          consequuntur ipsam iste, id, minima sit nulla quidem numquam, vitae
          hic quae sapiente nostrum vel ut.
        </p>
      </section>
    </main>
  )
}

export default Home
