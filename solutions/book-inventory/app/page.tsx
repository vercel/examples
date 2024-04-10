import { sql } from '@vercel/postgres';
import Grid from './grid';
import Panel from './panel';
import Search from './search';
import { Suspense } from 'react';

export default async function Page({
	searchParams
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const query = searchParams?.query || '';
	const authorsResult = await sql`SELECT DISTINCT "Book-Author" FROM books ORDER BY "Book-Author"`;
	const allAuthors = authorsResult.rows?.map((row) => row['Book-Author']);
	const selectedAuthors = !searchParams.author
		? []
		: typeof searchParams.author === 'string'
		? [searchParams.author]
		: searchParams.author;

	return (
		<main className="flex flex-col justify-between w-full">
			<Search placeholder="Search books..." />
			<div className="flex gap-6 py-6">
				<Panel authors={selectedAuthors} allAuthors={allAuthors} />
				<Suspense fallback={<div>Loading...</div>}>
					<Grid selectedAuthors={selectedAuthors} query={query} />
				</Suspense>
			</div>
		</main>
	);
}
