import { notFound } from "next/navigation";
import { formatDate } from "app/blog/utils";
import { baseUrl } from "app/sitemap";
import { getMediumPost, getMediumPosts } from "@/lib/medium";
import { sanitizeMediumHtml } from "@/lib/sanitize";
import Breadcrumb from "@/app/components/Breadcrumb/Breadcrumb";
import AboutWriter from "@/app/components/AboutWriter";
import CommonConfig from "@/app/config/CommonConfig";
import "./style.scss";

// 12h. Duplicated across sitemap.ts, blog/page.tsx, og/route.tsx —
// Next.js requires literals here; see lib/revalidate.ts for the source of truth.
export const revalidate = 43200;

export async function generateStaticParams() {
  const posts = await getMediumPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getMediumPost(slug);
  if (!post) {
    return;
  }

  // Derive commonly used metadata values from the fetched post
  const title = post.title ?? `Blog | ${CommonConfig.name}`;
  const description = post.summary;
  const publishedTime = post.date;

  const ogImage = post.image ?? `/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

async function Blog({ params }: Props) {
  const { slug } = await params;
  const post = await getMediumPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="blog-post-section">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            datePublished: post.date,
            dateModified: post.date,
            description: post.summary,
            image:
              post.image ??
              `${baseUrl}/og?title=${encodeURIComponent(post.title ?? `Blog | ${CommonConfig.name}`)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: CommonConfig.name,
            },
          }),
        }}
      />
      <div className="blog-post__shell max-w-3xl mx-auto py-12 px-4">
        <Breadcrumb />
        <div className="blog-post__surface">
          <h1 className="title font-bold text-4xl tracking-tighter">{post.title}</h1>
          <div className="flex justify-between items-center mt-2 mb-8 text-sm">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {formatDate(post.date, true)}
            </p>
          </div>
          <article
            className="medium-content prose max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeMediumHtml(post.content ?? "") }}
          />
          <AboutWriter link={post.link} />
        </div>
      </div>
    </section>
  );
}

export default Blog;
