import { type FragmentOf, graphql, readFragment } from "@/lib/graphql";
import { FooterLink, footerLinkFragment } from "./footer-link";
import { SocialLinks, socialLinksFragment } from "./social-links";

export const footerFragment = graphql(
  `
  fragment Footer on Footer {
    title
    description
    links {
      _key
      ...FooterLink
    }
    ...SocialLinks
    copyright
  }
`,
  [footerLinkFragment, socialLinksFragment],
);

interface FooterProps {
  data: FragmentOf<typeof footerFragment>;
}

export function Footer({ data }: FooterProps) {
  const footerData = readFragment(footerFragment, data);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-8 sm:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {footerData.title}
            </h3>
            {footerData.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {footerData.description}
              </p>
            )}

            {/* Footer links */}
            {footerData.links && footerData.links.length > 0 && (
              <div className="flex flex-wrap gap-6">
                {footerData.links.map((link) => {
                  if (!link) return null;
                  return <FooterLink key={link._key} data={link} />;
                })}
              </div>
            )}
          </div>

          <SocialLinks data={footerData} />
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {footerData.copyright
              ? footerData.copyright.replace(/©?\s*\d{4}/, `© ${currentYear}`)
              : `© ${currentYear} All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
