export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  language: string;
  author: {
    name: string;
  };
  social: {
    github: string;
    linkedin: string;
  };
  theme: {
    primaryColor: string;
  };
  googleVerification: string;
  googleAnalyticsId: string;
}
