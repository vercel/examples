import { sql } from '@vercel/postgres';
import { parseCSV } from './parseCSV';

export async function seed() {
	// Creating the books table
	const createBooksTable = await sql`
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      isbn VARCHAR(255) UNIQUE NOT NULL,
      "Book-Title" VARCHAR(255) NOT NULL,
      "Book-Author" VARCHAR(255) NOT NULL,
      "Year-Of-Publication" INT,
      Publisher VARCHAR(255),
      "Image-URL-S" VARCHAR(255),
      "Image-URL-M" VARCHAR(255),
      "Image-URL-L" VARCHAR(255),
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
	console.log('Created "books" table');

	const bookData = await parseCSV('./lib/books.csv');

	console.log(bookData);

	// Inserting book data into the books table
	const promises = bookData.map(
		(book) =>
			sql`
      INSERT INTO books (isbn, "Book-Title", "Book-Author", "Year-Of-Publication", Publisher, "Image-URL-S", "Image-URL-M", "Image-URL-L")
      VALUES (${book.ISBN}, ${book['Book-Title']}, ${book['Book-Author']}, ${book['Year-Of-Publication']}, ${book.Publisher}, ${book['Image-URL-S']}, ${book['Image-URL-M']}, ${book['Image-URL-L']})
      ON CONFLICT (isbn) DO NOTHING;
    `
	);

	const results = await Promise.all(promises);
	console.log(`Seeded ${results.length} books`);

	return {
		createBooksTable,
		seededBooks: results.length
	};
}
