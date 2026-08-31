import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeCodeTitles from "rehype-code-titles";
import rehypePrism from "rehype-prism-plus";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "./index";

interface MdxRendererProps {
  source: string;
}

export function MdxRenderer({ source }: MdxRendererProps) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            rehypeCodeTitles,
            [rehypePrism, { ignoreMissing: true }] as any,
            [
              rehypeExternalLinks,
              { target: "_blank", rel: ["noopener", "noreferrer"] },
            ],
          ],
        },
      }}
    />
  );
}
