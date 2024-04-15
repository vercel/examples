const { db } = require('@vercel/postgres')
const fs = require('fs')
const path = require('path')
const Papa = require('papaparse')

const parseCSV = async (filePath) => {
  const csvFile = fs.readFileSync(path.resolve(filePath), 'utf8')
  return new Promise((resolve) => {
    Papa.parse(csvFile, {
      header: true,
      complete: (results) => {
        resolve(results.data)
      },
    })
  })
}

async function seed(client) {
  // Creating the books table
  const createBooksTable = await client.sql`
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      isbn VARCHAR(255) UNIQUE NOT NULL,
      "title" VARCHAR(255) NOT NULL,
      "author" VARCHAR(255) NOT NULL,
      "year" INT,
      publisher VARCHAR(255),
      "image" VARCHAR(255),
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `
  console.log('Created "books" table')

  const bookData = await parseCSV('./books.csv')

  // Inserting book data into the books table
  const promises = bookData.map(
    (book) =>
      client.sql`
      INSERT INTO books (isbn, "title", "author", "year", publisher, "image")
      VALUES (${book.ISBN}, ${book['Book-Title']}, ${book['Book-Author']}, ${book['Year-Of-Publication']}, ${book.Publisher}, ${book['Image-URL-M']})
      ON CONFLICT (isbn) DO NOTHING;
    `,
  )

  const results = await Promise.all(promises)
  console.log(`Seeded ${results.length} books`)

  return {
    createBooksTable,
    seededBooks: results.length,
  }
}

async function main() {
  const client = await db.connect()
  await seed(client)
  await client.end()
}

main().catch((err) => {
  console.error('An error occurred while attempting to seed the database:', err)
})
