import Parser from "rss-parser";
import mediumFeed from "./medium-feed.json";

// Undefined is treated the same as empty string — see the !MY_USERNAME
// guard in getMediumPosts. Trim in case the env var was pasted with
// surrounding whitespace (a padded settings UI or an org-level secret
// with stray characters); without this we'd silently build a malformed
// feed URL and get an empty 200 with no diagnostic.
const MY_USERNAME = process.env.MEDIUM_USERNAME?.trim();

export type MediumPost = Partial<{
  title: string;
  link: string;
  content: string; // full HTML content
  date: string;
  slug: string;
  summary: string;
  image: string;
}>;

export type MediumFeedItem = {
  title?: string;
  link?: string;
  content?: string;
  "content:encoded"?: string;
  isoDate?: string;
};

// No module-level cache: on Vercel serverless, in-memory state does not persist
// across invocations anyway, and ISR (`revalidate = 12 * 3600` on the routes)
// is the actual caching layer. See lib/revalidate.ts.
export async function getMediumPosts(): Promise<MediumPost[]> {
  if (!MY_USERNAME) {
    // Without a username, return the (placeholder) snapshot. Empty snapshots
    // are common in forks — the call site just renders an empty list.
    return parseMediumFeed(mediumFeed as unknown as Parser.Output<MediumFeedItem>);
  }

  const parser = new Parser();
  try {
    const feed = await parser.parseURL(`https://medium.com/feed/@${MY_USERNAME}`);
    return parseMediumFeed(feed);
  } catch (error) {
    console.error("Error fetching Medium posts:", error);
    return parseMediumFeed(mediumFeed as unknown as Parser.Output<MediumFeedItem>);
  }
}

export function parseMediumFeed(feed: Parser.Output<MediumFeedItem>): MediumPost[] {
  return feed.items.map((item) => {
    const content = item["content:encoded"] || item.content || ""; // full HTML
    const summary = content.replace(/<[^>]+>/g, " ").slice(0, 160) + "..."; // plain text summary
    const image = content.match(/<img[^>]+src="([^">]+)"/)?.[1];
    return {
      title: item.title,
      link: item.link,
      content,
      summary,
      image,
      date: item.isoDate,
      slug: item.link?.split("?")[0]?.split("/").pop(), // Medium uses GUID slugs
    };
  });
}

export async function getMediumPost(slug: string) {
  const posts = await getMediumPosts();
  return posts.find((p) => p.slug === slug);
}
