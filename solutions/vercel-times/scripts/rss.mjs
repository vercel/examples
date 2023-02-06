import fs from "fs";
import path from "path";
import { allBlogPosts } from "../.contentlayer/generated/index.mjs";

const config = {
  title: "Bel Curcio's Site - belcurcio.com",
  description: "Blog",
  baseUrl: "https://belcurcio.com",
};

function generateEntry({ path, title, description, publishedAt }) {
  const url = `${config.baseUrl}/${path}`;

  return `
  <item>
    <title>${title}</title>
    <link>${url}</link>
    <guid>${url}</guid>
    <description>
      ${description}
    </description>
    <pubDate>${new Date(publishedAt).toUTCString()}</pubDate>
    <author>curciobel@gmail.com (Bel Curcio)</author>
  </item>`;
}

function generateRSS(posts) {
  const { title, description, baseUrl } = config;
  const today = new Date();

  let output = `
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss" rel="self" type="application/rss+xml" />
    <description>${description}</description>
    <language>en-us</language>
    <pubDate>${today.toUTCString()}</pubDate>
    <lastBuildDate>${today.toUTCString()}</lastBuildDate>
    <docs>${`${baseUrl}/rss`}</docs>
    <generator>Node belcurcio.com</generator>
    <managingEditor>curciobel@gmail.com (Bel Curcio)</managingEditor>
    <webMaster>curciobel@gmail.com (Bel Curcio)</webMaster>
  `;

  posts.map(
    ({ path, long: description, title, publishedAt }) =>
      (output = output.concat(
        generateEntry({ path, description, title, publishedAt })
      ))
  );

  output = output.concat("</channel></rss>");
  output.replace(/\n/g, "").replace(/>\s+</g, "><").trim();
  return output;
}

async function main() {
  const src = path.join(process.cwd(), "/public/rss.xml");
  // Creating RSS
  await fs.writeFileSync(src, generateRSS(allBlogPosts));
  console.log(`Atom feed file generated at \`${src}\``);
}

main();
