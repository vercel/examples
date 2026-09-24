import { getConfig } from "~lib/config";
import { getAllPosts } from "~utils/posts";

export async function GET() {
  const config = getConfig();
  const posts = getAllPosts();
  const siteUrl = config.url || "http://localhost:3000";

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.metadata.title}]]></title>
      <link>${siteUrl}/post/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/post/${post.slug}</guid>
      <description><![CDATA[${post.metadata.description}]]></description>
      <pubDate>${new Date(post.metadata.date).toUTCString()}</pubDate>
      <author>${post.metadata.author}</author>
    </item>`
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${config.title}]]></title>
    <link>${siteUrl}</link>
    <description><![CDATA[${config.description}]]></description>
    <language>${config.language || "en"}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
