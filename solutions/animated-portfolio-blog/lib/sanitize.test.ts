import { describe, expect, it } from "vitest";
import { sanitizeMediumHtml } from "./sanitize";

describe("sanitizeMediumHtml — allowlist preservation", () => {
  it("keeps all 17 allowlisted tags", () => {
    const input =
      "<p>p</p><blockquote>q</blockquote><hr/><figure>f<figcaption>c</figcaption></figure>" +
      "<h2>h2</h2><h3>h3</h3><h4>h4</h4><ul><li>u</li></ul><ol><li>o</li></ol>" +
      "<em>e</em><strong>s</strong><code>c</code><pre><code>x=1</code></pre>" +
      '<a href="https://example.com">link</a><img src="https://example.com/i.png" alt="a" width="10" height="5"/>';

    const out = sanitizeMediumHtml(input);

    // Every allowlisted tag appears in the output.
    for (const tag of [
      "p",
      "blockquote",
      "hr",
      "figure",
      "figcaption",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "em",
      "strong",
      "code",
      "pre",
      "a",
      "img",
    ]) {
      expect(out).toContain(`<${tag}`);
    }
    // Text content survives.
    expect(out).toContain("p</p>");
    expect(out).toContain("h2</h2>");
    expect(out).toContain("link</a>");
  });

  it("preserves a[href] and img[src|alt|width|height]", () => {
    const out = sanitizeMediumHtml(
      '<a href="https://example.com/path?q=1" target="_blank">x</a>' +
        '<img src="https://cdn.example.com/i.png" alt="alt" width="100" height="50" title="t"/>',
    );

    expect(out).toContain('href="https://example.com/path?q=1"');
    expect(out).toContain('src="https://cdn.example.com/i.png"');
    expect(out).toContain('alt="alt"');
    expect(out).toContain('width="100"');
    expect(out).toContain('height="50"');

    // target / title are NOT in the allowlist → stripped.
    expect(out).not.toContain("target=");
    expect(out).not.toContain("title=");
  });

  it("round-trips a real excerpt from lib/medium-feed.json without dropping content", () => {
    // Representative slice of an actual Medium post: figure, em, blockquote,
    // h3, ol, li, strong, code-ish content, a, img.
    const realExcerpt =
      '<p><em>Short version:</em> I pulled my feed into Next.js.</p>' +
      "<blockquote>\n<strong><em>Important:</em></strong> Medium does not officially support this.\n</blockquote>" +
      "<h3>Why this helps SEO</h3>" +
      "<ol>\n<li><strong>Server-side HTML</strong>: crawlers love it.</li>" +
      '<li>See <a href="https://example.com/canonical">the docs</a>.</li>\n</ol>' +
      '<figure><img src="https://cdn-images-1.medium.com/x.png" alt="diagram"/><figcaption>Figure 1</figcaption></figure>';

    const out = sanitizeMediumHtml(realExcerpt);

    // Substantive content survives.
    expect(out).toContain("Short version:");
    expect(out).toContain("I pulled my feed into Next.js.");
    expect(out).toContain("Important:");
    expect(out).toContain("Why this helps SEO");
    expect(out).toContain("Server-side HTML");
    expect(out).toContain("the docs");
    expect(out).toContain('href="https://example.com/canonical"');
    expect(out).toContain('src="https://cdn-images-1.medium.com/x.png"');
    expect(out).toContain("Figure 1");
    // Structural tags preserved.
    expect(out).toContain("<figure>");
    expect(out).toContain("<figcaption>");
    expect(out).toContain("<blockquote>");
    expect(out).toContain("<ol>");
    expect(out).toContain("<h3>");
  });
});

describe("sanitizeMediumHtml — strips dangerous content", () => {
  it("removes <script> tags and their contents", () => {
    const out = sanitizeMediumHtml('<p>ok</p><script>alert(1)</script><p>after</p>');
    expect(out).not.toContain("<script");
    expect(out).not.toContain("alert(1)");
    expect(out).toContain("<p>ok</p>");
    expect(out).toContain("<p>after</p>");
  });

  it("removes <iframe>, <object>, <embed>, <form>", () => {
    const out = sanitizeMediumHtml(
      '<iframe src="https://evil.example.com"></iframe>' +
        '<object data="https://evil.example.com/x.swf"></object>' +
        '<embed src="https://evil.example.com/x.swf"/>' +
        '<form action="https://evil.example.com"><input name="x"/></form>' +
        "<p>safe</p>",
    );
    expect(out).not.toContain("<iframe");
    expect(out).not.toContain("<object");
    expect(out).not.toContain("<embed");
    expect(out).not.toContain("<form");
    expect(out).not.toContain("<input");
    expect(out).toContain("<p>safe</p>");
  });

  it("strips on* event handler attributes", () => {
    const out = sanitizeMediumHtml(
      '<p onclick="alert(1)" onmouseover="alert(2)">click me</p><img src="https://x/y.png" onerror="alert(3)"/>',
    );
    expect(out).not.toContain("onclick");
    expect(out).not.toContain("onmouseover");
    expect(out).not.toContain("onerror");
    expect(out).toContain("click me");
  });

  it("blocks javascript: URLs in href and src", () => {
    const out = sanitizeMediumHtml(
      '<a href="javascript:alert(1)">xss</a><img src="javascript:alert(2)"/>',
    );
    expect(out).not.toContain("javascript:");
    // No executable payload survives.
    expect(out).not.toContain("alert(1)");
    expect(out).not.toContain("alert(2)");
  });

  it("blocks data: URLs (including SVG-with-script payloads)", () => {
    const out = sanitizeMediumHtml(
      '<a href="data:text/html,<script>alert(1)</script>">x</a>' +
        '<img src="data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=" alt="y"/>',
    );
    expect(out).not.toContain("data:text/html");
    expect(out).not.toContain("data:image/svg+xml");
  });

  it("strips inline style attributes", () => {
    const out = sanitizeMediumHtml('<p style="color:red;background:url(javascript:alert(1))">x</p>');
    expect(out).not.toContain("style=");
    expect(out).not.toContain("javascript:");
    expect(out).toContain("<p>x</p>");
  });
});

describe("sanitizeMediumHtml — merges consecutive <pre> blocks", () => {
  it("merges two <pre> siblings separated only by whitespace", () => {
    const out = sanitizeMediumHtml("<pre>line 1</pre>\n<pre>line 2</pre>");
    expect(out).toBe("<pre>line 1\nline 2</pre>");
  });

  it("merges a run of multiple consecutive <pre> blocks", () => {
    const out = sanitizeMediumHtml("<pre>a</pre><pre>b</pre><pre>c</pre><pre>d</pre>");
    expect(out).toBe("<pre>a\nb\nc\nd</pre>");
  });

  it("does NOT merge <pre> blocks separated by other elements", () => {
    const out = sanitizeMediumHtml(
      "<pre>first</pre><p>prose between</p><pre>second</pre>",
    );
    expect(out).toContain("<pre>first</pre>");
    expect(out).toContain("<p>prose between</p>");
    expect(out).toContain("<pre>second</pre>");
  });

  it("merges the issue #81 ASCII flowchart into a single <pre>", () => {
    // Real-world input from the Medium feed — five <pre> fragments that
    // should render as one continuous flowchart.
    const input =
      "<p>The flow&nbsp;becomes:</p>" +
      "<pre>Incoming Message\n        |\n        v</pre>" +
      "<pre>Check Agent Connection</pre>" +
      "<pre>        |\n        +---- Healthy\n        |\n        +---- Broken\n                 |\n                 v</pre>" +
      "<pre>          Reconnect Agent</pre>" +
      "<pre>                 |\n                 v</pre>" +
      "<pre>          Continue Conversation</pre>" +
      "<p>The user experience stays consistent.</p>";

    const out = sanitizeMediumHtml(input);

    // Exactly one <pre>...</pre> pair in the output.
    expect(out.match(/<pre/g)?.length).toBe(1);
    expect(out.match(/<\/pre>/g)?.length).toBe(1);

    // Every fragment's content survives in the merged block.
    expect(out).toContain("Incoming Message");
    expect(out).toContain("Check Agent Connection");
    expect(out).toContain("+---- Healthy");
    expect(out).toContain("Reconnect Agent");
    expect(out).toContain("Continue Conversation");

    // The surrounding <p> tags are untouched.
    expect(out).toContain("<p>The flow&nbsp;becomes:</p>");
    expect(out).toContain("<p>The user experience stays consistent.</p>");
  });

  it("preserves the existing <br>-to-newline conversion inside <pre> (no regression)", () => {
    // Pre-existing behavior: <br> inside a single <pre> becomes \n.
    const out = sanitizeMediumHtml("<pre>line 1<br>line 2</pre>");
    expect(out).toBe("<pre>line 1\nline 2</pre>");
  });
});
