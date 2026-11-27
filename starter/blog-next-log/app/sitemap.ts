import fs from "fs";
import path from "path";
import { MetadataRoute } from "next";
import { getConfig } from "~lib/config";
import { getAllPosts } from "~utils/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const config = getConfig();
  const siteUrl = config.url;
  const posts = getAllPosts();
  const entries: MetadataRoute.Sitemap = [];

  // Posts index
  entries.push({
    url: siteUrl,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  });

  // Resume (only if the page exists)
  const resumePath = path.join(process.cwd(), "app", "resume", "page.tsx");
  if (fs.existsSync(resumePath)) {
    entries.push({
      url: `${siteUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  // Individual posts
  for (const post of posts) {
    entries.push({
      url: `${siteUrl}/post/${post.slug}`,
      lastModified: new Date(post.metadata.date),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  return entries;
}
