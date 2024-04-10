'use client';

import { useRouter } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';

export default function Panel({
	authors,
	allAuthors
}: {
	authors: string[];
	allAuthors: string[];
}) {
	let router = useRouter();
	let [pending, startTransition] = useTransition();
	let [optimisticAuthors, setOptimisticAuthors] = useOptimistic(authors);

	return (
		<div>
			<div
				data-pending={pending ? '' : undefined}
				className="sm:w-60 bg-white/10 rounded-md shadow-md shadow-gray-950/30 h-[70vh] overflow-y-auto"
			>
				<div className="p-4">
					<h2 className="text-gray-100 tracking-tight font-semibold text-lg">Authors</h2>

					<div className="mt-4 -mx-4 px-4 sm:px-0 sm:mx-0 pb-3 sm:pb-0 flex overflow-x-scroll sm:overflow-auto sm:flex-wrap gap-y-2 gap-x-1">
						{allAuthors.map((author) => (
							<button
								onClick={() => {
									let newGenres = !optimisticAuthors.includes(author)
										? [...optimisticAuthors, author]
										: optimisticAuthors.filter((g) => g !== author);

									let newParams = new URLSearchParams(
										newGenres.sort().map((author) => ['author', author])
									);

									startTransition(() => {
										setOptimisticAuthors(newGenres.sort());

										router.push(`?${newParams}`);
									});
								}}
								key={author}
								className={`${
									optimisticAuthors.includes(author)
										? 'bg-accent text-white border-accent '
										: 'border-gray-500 hover:border-gray-400'
								} px-2 py-1 rounded-full whitespace-nowrap font-medium border text-xs`}
							>
								{author}
							</button>
						))}
					</div>
				</div>
			</div>

			{optimisticAuthors.length > 0 && (
				<div className="p-1 border-t border-black bg-white/10">
					<button
						className="text-sm py-2 rounded hover:bg-gray-600 font-medium w-full text-center"
						onClick={() => {
							startTransition(() => {
								setOptimisticAuthors([]);

								router.push(`?`);
							});
						}}
					>
						Clear authors
					</button>
				</div>
			)}
		</div>
	);
}
