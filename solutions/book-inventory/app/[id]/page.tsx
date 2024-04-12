import { sql } from '@vercel/postgres';
import Link from 'next/link';

export default async function Page({ params }: { params: { id: string } }) {
	const bookId = params.id;
	const data = await sql`SELECT * FROM books WHERE id = ${bookId}`;
	const book = data.rows[0];
	return (
		<div className="flex flex-col items-center min-h-screen">
			<Link className="p-3 mr-auto text-white bg-black rounded dark:bg-white/10 hover:opacity-80" href="/">
				← Back to all books
			</Link>
			<div className="flex flex-col items-center justify-center p-6 mt-8 bg-white rounded shadow-md md:w-2/3 dark:bg-white/10">
				<div className="mb-4 text-3xl font-bold text-center">{book['Book-Title']}</div>
				<img src={book['Image-URL-L']} alt={book['Book-Title']} width={200} height={200} />
				<div className="pt-6">
					<div>Written By: {book['Book-Author']}</div>
					<div>Published In: {book['Year-Of-Publication']}</div>
					<div>Published By: {book.Publisher}</div>
				</div>
			</div>
		</div>
	);
}
