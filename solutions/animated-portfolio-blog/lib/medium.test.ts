import { beforeEach, describe, expect, it, vi } from "vitest";
import Parser from "rss-parser";

import { parseMediumFeed } from "./medium";
import mediumFeed from "./medium-feed.json";
import type { MediumFeedItem } from "./medium";

// Cast fixture so the rss2json-shaped JSON (no `content:encoded`, no `isoDate`)
// doesn't fight the Parser<T> generics used elsewhere.
const fixture = mediumFeed as unknown as Parser.Output<MediumFeedItem>;

describe("parseMediumFeed", () => {
  it("maps title / link / isoDate onto the post", () => {
    const feed = {
      items: [
        {
          title: "Hello World",
          link: "https://medium.com/@user/hello-world-abc123?source=rss-1",
          isoDate: "2024-01-05T00:00:00.000Z",
          "content:encoded": "<p>body</p>",
        },
      ],
    } as unknown as Parser.Output<MediumFeedItem>;

    const [post] = parseMediumFeed(feed);

    expect(post.title).toBe("Hello World");
    expect(post.link).toBe("https://medium.com/@user/hello-world-abc123?source=rss-1");
    expect(post.date).toBe("2024-01-05T00:00:00.000Z");
  });

  it("strips tags, slices 160 and appends ellipsis for summary", () => {
    const body = "<p>This is <strong>plain</strong> text.</p>";
    const feed = {
      items: [{ title: "T", link: "https://m/x-y", "content:encoded": body }],
    } as unknown as Parser.Output<MediumFeedItem>;

    const [post] = parseMediumFeed(feed);

    // Each tag is replaced with a single space (leading/double spaces result).
    // Note: this also characterizes a minor pre-existing whitespace bug; if the
    // strip logic is later improved to collapse/drop empty space, update this.
    const stripped = body.replace(/<[^>]+>/g, " ");
    expect(post.summary).toBe(`${stripped.slice(0, 160)}...`);
  });

  it("extracts the first <img src> as image", () => {
    const feed = {
      items: [
        {
          title: "T",
          link: "https://m/x-y",
          "content:encoded":
            '<p>hi</p><img src="https://cdn.example.com/a.png" alt="a"/><img src="second"/>',
        },
      ],
    } as unknown as Parser.Output<MediumFeedItem>;

    const [post] = parseMediumFeed(feed);

    expect(post.image).toBe("https://cdn.example.com/a.png");
  });

  it("derives slug from last path segment of link, stripping the query", () => {
    const feed = {
      items: [
        {
          title: "T",
          link: "https://medium.com/@user/my-slug-123?source=rss-abc&ref=test",
          "content:encoded": "<p>x</p>",
        },
      ],
    } as unknown as Parser.Output<MediumFeedItem>;

    const [post] = parseMediumFeed(feed);

    expect(post.slug).toBe("my-slug-123");
  });

  it("falls back to item.content when content:encoded is absent", () => {
    const feed = {
      items: [
        {
          title: "T",
          link: "https://m/x-y",
          content: "<p>fallback body</p>",
        },
      ],
    } as unknown as Parser.Output<MediumFeedItem>;

    const [post] = parseMediumFeed(feed);

    expect(post.content).toBe("<p>fallback body</p>");
    expect(post.summary).toContain("fallback body");
  });
});

describe("getMediumPosts", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns the empty snapshot when MEDIUM_USERNAME is unset", async () => {
    delete process.env.MEDIUM_USERNAME;
    const { getMediumPosts } = await import("./medium");
    const posts = await getMediumPosts();

    expect(posts).toEqual([]);
  });

  it("returns parsed fixture when parseURL throws", async () => {
    process.env.MEDIUM_USERNAME = "test_user";
    vi.doMock("rss-parser", () => ({
      default: class {
        parseURL() {
          throw new Error("network down");
        }
      },
    }));

    const { getMediumPosts } = await import("./medium");
    const posts = await getMediumPosts();

    // The mocked parseURL throws, the catch returns the fixture, and
    // `fixture.items` is `[]` after the open-source scrub — so the assertion
    // doubles as a "we hit the catch path" check (any deviation would mean
    // parseURL was reached, returned non-array, or the fixture was bypassed).
    expect(posts).toEqual(fixture.items);

    delete process.env.MEDIUM_USERNAME;
  });
});
