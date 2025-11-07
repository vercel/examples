import { PortableText } from "@portabletext/react";
import { registerUrql } from "@urql/next/rsc";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { createGraphQLClient, graphql } from "@/lib/graphql";

const { getClient } = registerUrql(createGraphQLClient);

const GET_PAGE_BY_SLUG = graphql(`
  query GetPageBySlug($slug: String!) {
    allPage(where: { slug: { current: { eq: $slug } }, isPublished: { eq: true } }, limit: 1) {
      _id
      title
      excerpt
      contentRaw
      seo {
        metaTitle
        metaDescription
      }
      publishedAt
    }
  }
`);

// use React cache function to deduplicate requests
// deduplication is needed, because GraphQL is using a POST request and they are not deduplicate by the fetch API
const getPageData = cache((name: string) =>
  getClient().query(GET_PAGE_BY_SLUG, {
    slug: name,
  }),
);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { name } = await params;

  try {
    const { data } = await getPageData(name);
    const page = data?.allPage?.[0];

    if (!page) {
      return {
        title: "Page Not Found",
      };
    }

    return {
      title: page.seo?.metaTitle || page.title,
      description: page.seo?.metaDescription || page.excerpt,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Page Not Found",
    };
  }
}

export function generateStaticParams() {
  return [];
}

interface PageProps {
  params: Promise<{
    name: string;
  }>;
}

export default async function GeneralPage({ params }: PageProps) {
  const { name } = await params;

  const { data, error } = await getPageData(name);
  const page = data?.allPage?.[0];

  if (error) {
    throw new Error(error.message);
  }

  if (!page) {
    notFound();
  }

  const publishedAt = page.publishedAt;

  return (
    <article>
      <header className="mb-8">
        <Link
          href="/"
          className="inline-block mb-6 text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to home
        </Link>
        <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
        {publishedAt && (
          <time
            dateTime={publishedAt}
            className="text-gray-600 dark:text-gray-400"
          >
            {new Date(publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
      </header>

      {page.excerpt && (
        <div className="text-xl text-gray-600 dark:text-gray-400 mb-8 italic">
          {page.excerpt}
        </div>
      )}

      {page.contentRaw && (
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <PortableText value={page.contentRaw} />
        </div>
      )}
    </article>
  );
}
