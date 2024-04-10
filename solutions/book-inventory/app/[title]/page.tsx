import { sql } from '@vercel/postgres';
import Link from 'next/link';

export default async function Page({ params }: { params: { title: string } }) {
	const bookId = params.title;
	const data = await sql`SELECT * FROM books WHERE id = ${bookId}`;
	const book = data.rows[0];
	return (
		<div>
			<Link className="hover:opacity-70" href="/">
				Back to Books
			</Link>
			<div className="py-10 flex">
				<img src={book['Image-URL-L']} alt={book['Book-Title']} width={300} height={300} />
				<div className="ml-10">
					<div className="font-bold text-3xl">{book['Book-Title']}</div>
					<div className="text-lg text-gray-500">{book['Book-Author']}</div>
					<div className="text-lg text-gray-500">{book['Year-Of-Publication']}</div>
					<div className="text-lg text-gray-500">{book.Publisher}</div>
				</div>
			</div>
		</div>
	);
}
