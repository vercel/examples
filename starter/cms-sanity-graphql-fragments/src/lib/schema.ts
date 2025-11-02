import { defineType } from "sanity";

const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    },
    {
      name: "bio",
      title: "Bio",
      type: "text",
      description: "Short biography of the author",
      rows: 3,
    },
    {
      name: "image",
      title: "Profile Image",
      type: "image",
      options: {
        hotspot: true,
      },
    },
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});

const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    },
    {
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (rule) => rule.required(),
    },
    {
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    },
  ],
});

const navigationItem = defineType({
  name: "navigationItem",
  title: "Navigation Item",
  type: "object",
  fields: [
    {
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    },
    {
      name: "href",
      title: "URL/Path",
      type: "string",
      validation: (rule) => rule.required(),
    },
    {
      name: "isExternal",
      title: "External Link",
      type: "boolean",
      initialValue: false,
    },
  ],
});

const navigation = defineType({
  name: "navigation",
  title: "Navigation Settings",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Site Title",
      type: "string",
      description: "The main title/brand name displayed in the navigation",
      validation: (rule) => rule.required(),
    },
    {
      name: "items",
      title: "Navigation Items",
      type: "array",
      of: [{ type: "navigationItem" }],
      validation: (rule) => rule.required().min(1),
    },
  ],
  preview: {
    select: {
      title: "title",
      items: "items",
    },
    prepare({ title, items }) {
      return {
        title: "Navigation Settings",
        subtitle: `${title} (${items?.length || 0} items)`,
      };
    },
  },
});

const footerLink = defineType({
  name: "footerLink",
  title: "Footer Link",
  type: "object",
  fields: [
    {
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    },
    {
      name: "href",
      title: "URL/Path",
      type: "string",
      validation: (rule) => rule.required(),
    },
    {
      name: "isExternal",
      title: "External Link",
      type: "boolean",
      initialValue: false,
    },
  ],
});

const socialLink = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "object",
  fields: [
    {
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "Twitter", value: "twitter" },
          { title: "GitHub", value: "github" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "Instagram", value: "instagram" },
          { title: "Facebook", value: "facebook" },
          { title: "YouTube", value: "youtube" },
        ],
      },
      validation: (rule) => rule.required(),
    },
    {
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required(),
    },
  ],
});

const seo = defineType({
  name: "seo",
  title: "SEO Settings",
  type: "object",
  fields: [
    {
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Override the page title for SEO (optional)",
    },
    {
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      description: "Description for search engines",
      rows: 2,
    },
  ],
});

const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    },
    {
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      description: "Brief description for SEO and previews",
      rows: 3,
    },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    },
    {
      name: "isPublished",
      title: "Published",
      type: "boolean",
      initialValue: true,
      description: "Uncheck to hide this page from the website",
    },
    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    },
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      isPublished: "isPublished",
    },
    prepare({ title, slug, isPublished }) {
      return {
        title: title,
        subtitle: `/${slug}${!isPublished ? " (Draft)" : ""}`,
      };
    },
  },
});

const footer = defineType({
  name: "footer",
  title: "Footer Settings",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Footer Title",
      type: "string",
      description: "Main heading in the footer",
      validation: (rule) => rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      description: "Brief description or tagline for the footer",
      rows: 3,
    },
    {
      name: "links",
      title: "Footer Links",
      type: "array",
      of: [{ type: "footerLink" }],
      description: "Navigation links in the footer",
    },
    {
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [{ type: "socialLink" }],
      description: "Social media links",
    },
    {
      name: "copyright",
      title: "Copyright Text",
      type: "string",
      description: "Copyright notice (year will be automatically added)",
      placeholder: "© Your Company Name. All rights reserved.",
    },
  ],
  preview: {
    select: {
      title: "title",
      links: "links",
      socialLinks: "socialLinks",
    },
    prepare({ title, links, socialLinks }) {
      const linkCount = (links?.length || 0) + (socialLinks?.length || 0);
      return {
        title: "Footer Settings",
        subtitle: `${title} (${linkCount} links)`,
      };
    },
  },
});

export const schema = {
  types: [
    seo,
    author,
    post,
    page,
    navigationItem,
    navigation,
    footerLink,
    socialLink,
    footer,
  ],
};
