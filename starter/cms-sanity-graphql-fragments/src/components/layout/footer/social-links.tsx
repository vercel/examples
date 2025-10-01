import Link from "next/link";
import { type FragmentOf, graphql, readFragment } from "@/lib/graphql";
import { SocialIcon } from "./social-icon";

export const socialLinksFragment = graphql(
  `
  fragment SocialLinks on Footer {
    socialLinks {
      _key
      platform
      url
    }
  }
`,
);

interface SocialLinksProps {
  data: FragmentOf<typeof socialLinksFragment>;
}

export function SocialLinks({ data }: SocialLinksProps) {
  const { socialLinks: socialLink } = readFragment(socialLinksFragment, data);
  if (!socialLink || socialLink?.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        Follow Us
      </h4>
      <div className="flex space-x-4">
        {socialLink.map((socialLink) => {
          if (!socialLink?.url || !socialLink.platform) return null;
          return (
            <Link
              key={socialLink._key}
              href={socialLink.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow us on ${socialLink.platform}`}
            >
              <SocialIcon platform={socialLink.platform} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
