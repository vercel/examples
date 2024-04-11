import { sql } from '@vercel/postgres';
import { seed } from '../lib/seed';
import Link from 'next/link';

async function ensureTableExists() {
	try {
			await sql`SELECT 1 FROM books LIMIT 1`;
	} catch (e: any) {
			if (e.message.includes('relation "books" does not exist')) {
					console.log('Table does not exist, creating and seeding it with dummy data now...');
					await seed();
			} else {
					throw e;
			}
	}
}

async function fetchFilteredBooks(selectedAuthors: string[], query: string) {
	await ensureTableExists();
	if (selectedAuthors.length > 0) {
		try {
			const books = await sql`
      SELECT
      id,
      isbn,
      "Book-Title",
      "Book-Author",
      "Year-Of-Publication",
      Publisher,
      "Image-URL-S",
      "Image-URL-M",
      "Image-URL-L",
      "createdAt"
    FROM books
    WHERE
      "Book-Author" = ANY(${selectedAuthors}) AND (
      isbn ILIKE ${`%${query}%`} OR
      "Book-Title" ILIKE ${`%${query}%`} OR
      "Book-Author" ILIKE ${`%${query}%`} OR
      "Year-Of-Publication"::text ILIKE ${`%${query}%`} OR
      Publisher ILIKE ${`%${query}%`}
      )
    ORDER BY "createdAt" DESC
    `;
			return books.rows;
		} catch (error) {
			console.error('Database Error:', error);
			throw new Error('Failed to fetch books.');
		}
	}

	try {
		const books = await sql`
	      SELECT
	        id,
	        isbn,
	        "Book-Title",
	        "Book-Author",
	        "Year-Of-Publication",
	        Publisher,
	        "Image-URL-S",
	        "Image-URL-M",
	        "Image-URL-L",
	        "createdAt"
	      FROM books
	      WHERE
	        isbn ILIKE ${`%${query}%`} OR
	        "Book-Title" ILIKE ${`%${query}%`} OR
	        "Book-Author" ILIKE ${`%${query}%`} OR
	        "Year-Of-Publication"::text ILIKE ${`%${query}%`} OR
	        Publisher ILIKE ${`%${query}%`}
	      ORDER BY "createdAt" DESC
	    `;
		return books.rows;
	} catch (error) {
		console.error('Database Error:', error);
		throw new Error('Failed to fetch books.');
	}
}

export default async function Grid({
	selectedAuthors,
	query
}: {
	selectedAuthors: string[];
	query: string;
}) {
	const data = await fetchFilteredBooks(selectedAuthors, query);
	return (
		<>
			<div className="grid w-full grid-cols-2 gap-6 mt-6 sm:grid-cols-3 lg:grid-cols-5">
				{data.length === 0 ? (
					<p className="text-center text-gray-400 col-span-full">No books found.</p>
				) : (
					data.map((book) => (
						<Link
							href={`/${book.id}`}
							key={book.id}
							prefetch={true}
							className="mb-auto transition ease-in-out hover:scale-110 bg-white/10"
						>
							<div className="relative w-full aspect-[2/3]">
								{/* TODO: Use Image component */}
								{/* <Image
								alt={book.title}
								sizes="300px"
								fill
								className="absolute inset-0 object-cover rounded-lg shadow-sm shadow-black"
								src={`http://images.amazon.com/images/P/${book.isbn}.01.LZZZZZZZ.jpg`}
							/> */}
								<img
									alt={book.title}
									width="150"
									height="150"
									className="absolute inset-0 object-cover w-full h-full rounded-lg shadow-sm shadow-black"
									src={`http://images.amazon.com/images/P/${book.isbn}.01.LZZZZZZZ.jpg`}
								/>
							</div>
						</Link>
					))
				)}
			</div>
		</>
		// <div className="flex flex-wrap w-full">
		// 	{data &&
		// 		data.map((book) => {
		// 			return (
		// 				<Link
		// 					href={`/${book.id}`}
		// 					key={book.id}
		// 					className="px-2 pb-4 transition ease-in-out hover:scale-110"
		// 				>
		// 					<Card image={book['Image-URL-L']} title={book['Book-Title']} />
		// 				</Link>
		// 			);
		// 		})}
		// </div>
	);
}
