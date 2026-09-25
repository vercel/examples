import { IconKey } from "../components/icons/Icons";

export type AboutStat = { label: string; value: string };

export type AboutConfigType = {
  /** One-paragraph bio shown in the large bento card. */
  bio: string;
  /** Curated stats for the small bento card. Not live-fetched. */
  stats: AboutStat[];
  /** Tech shown in the top marquee (scrolls left → right). */
  programming: IconKey[];
  /** Tech shown in the bottom marquee (scrolls right → left). */
  tools: IconKey[];
};

const AboutConfig: AboutConfigType = {
  bio: "Replace this with a short bio about who you are and what you build. Edit app/config/AboutConfig.ts.",
  stats: [
    { label: "Years Experience", value: "0+" },
    { label: "Projects Shipped", value: "0+" },
    { label: "Tech Stack", value: "0" },
    { label: "Blog Posts", value: "0+" },
  ],
  // Pick from the IconKey union in app/components/icons/Icons.tsx. Common
  // picks: typescript, javascript, react, nodejs, python, java, cpp, go, rust.
  programming: ["typescript", "javascript", "react", "nodejs"],
  tools: ["postgresql", "graphql", "kubernetes", "terraform"],
};

export default AboutConfig;
