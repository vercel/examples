import type { SiteConfig } from "./types/config";

const config = {
  title: "create-next-log",
  description: "A CLI scaffolder for personal developer blogs, powered by Next.js 15 and MDX",
  url: "https://create-next-log.vercel.app",
  language: "en",

  author: {
    name: "Geon",
  },

  social: {
    github: "https://github.com/geonsang-jo/create-next-log",
    linkedin: "https://www.linkedin.com/in/geonsang-jo-5a570612b",
  },

  theme: {
    primaryColor: "#2563eb",
  },

  googleVerification: "",
  googleAnalyticsId: "",
} satisfies SiteConfig;

export default config;
