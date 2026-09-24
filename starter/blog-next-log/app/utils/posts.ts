import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post, PostMetadata } from "~types/post";

const postsDirectory = path.join(process.cwd(), "posts");

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory).filter((name) => {
    const fullPath = path.join(postsDirectory, name);
    return fs.statSync(fullPath).isDirectory();
  });
}

export function getPostBySlug(slug: string): Post | null {
  const mdxPath = path.join(postsDirectory, slug, "index.mdx");
  if (!fs.existsSync(mdxPath)) return null;
  const fileContents = fs.readFileSync(mdxPath, "utf8");
  const { data, content } = matter(fileContents);
  return { slug, metadata: data as PostMetadata, content };
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  return slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null && post.metadata.published !== false)
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime());
}
