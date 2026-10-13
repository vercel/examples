"use client";

import Link from "next/link";
import Image from "next/image";
import type { MediumPost } from "@/lib/medium";
import { playSound } from "@/lib/sound";

// Extracted from the /blog listing (app/blog/page.tsx) so the card can attach
// hover/click sound handlers as a client component while the page itself stays
// server-side (it owns the Medium fetch + revalidate + metadata).
export default function BlogCard({ post }: { post: MediumPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="
        group
        block
        rounded-xl
        overflow-hidden
        shadow-sm
        transition-all
        duration-300
        hover:shadow-xl
        hover:-translate-y-1
        hover:scale-[1.02]
        !no-underline
        blog-card
      "
      onMouseEnter={() => playSound("hover")}
      onClick={() => playSound("select")}
    >
      {post.image && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={post.image}
            alt={post.title ?? ""}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-80 transition-all duration-300 group-hover:opacity-100"
          />
        </div>
      )}
      <div className="p-5">
        <h2 className="text-xl font-semibold">{post.title}</h2>
        {post.date && (
          <p className="text-sm mt-1 italic">{new Date(post.date).toDateString()}</p>
        )}
        <p className="mt-3 line-clamp-3">{post.summary}</p>
      </div>
    </Link>
  );
}
