/**
 * Table of contents types
 */
export type TableOfContents = Section[];
export type SubSection = {
  slug: string;
  text: string;
};
export type Section = SubSection & {
  subSections: SubSection[];
};
