import Image from 'next/image';
import Link from 'next/link';

export default function Card({ image, title }: { image: string; title: string }) {
	return (
		<div className="bg-white/10 h-full">
			{/* TODO: Fix the image rendering */}
			{/* <Image  src={image} alt={title} width={100} height={100} /> */}

			<img src={image} alt={title} width={150} height={150} />
		</div>
	);
}
