import DOMPurify from "isomorphic-dompurify";

// Allowlist derived from the actual content of lib/medium-feed.json
// (13 tags observed: em, strong, blockquote, h3, h4, p, figcaption, figure,
// img, li, ol, ul, a) plus tags the issue anticipates for future posts
// (h2, pre, code, hr). See lib/sanitize.test.ts for the contract.
const ALLOWED_TAGS = [
  // Structural
  "p",
  "blockquote",
  "hr",
  "figure",
  "figcaption",
  // Headings
  "h2",
  "h3",
  "h4",
  // Lists
  "ul",
  "ol",
  "li",
  // Inline formatting
  "em",
  "strong",
  "code",
  // Code blocks
  "pre",
  // Links + media
  "a",
  "img",
];

// Array form (not the per-tag object form) — DOMPurify's TS types only accept
// this. Functionally equivalent for us since <img> is the only allowlisted tag
// that takes width/height.
const ALLOWED_ATTR = ["href", "src", "alt", "width", "height"];

// Negative lookahead: allow anything EXCEPT dangerous schemes. DOMPurify v3
// applies ALLOWED_URI_REGEXP to ALL attribute values (not just href/src), so
// a positive pattern like `^https?:` would also strip width/height/title text.
// Negative lookahead lets non-URI attrs through while blocking javascript:,
// data:, vbscript:, file:.
const ALLOWED_URI_REGEXP = /^(?!(?:javascript|data|vbscript|file):)/i;

// DOMPurify v3 special-cases data:image/* (including data:image/svg+xml) and
// re-adds it even when ALLOWED_URI_REGEXP would reject. Close that hole with
// an explicit hook. Registered once at module load.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node && node.nodeType === 1 && (node as Element).tagName === "IMG") {
    const el = node as Element;
    const src = el.getAttribute("src");
    if (src && /^data:/i.test(src)) {
      el.removeAttribute("src");
    }
  }
});

// Convert Medium's <br> tags within <pre> into newlines so code blocks render properly.
// Without this, DOMPurify strips the <br>s entirely (because we did not add them to
// ALLOWED_TAGS) causing all code inside block elements to collapse onto a single line.
DOMPurify.addHook("beforeSanitizeElements", (node) => {
  // nodeType === 1 ensures the node is an Element. We use this instead of `instanceof Element`
  // because DOMPurify runs server-side in Node where the global `Element` constructor is undefined,
  // causing ReferenceErrors.
  if (node && node.nodeType === 1 && (node as Element).tagName === "PRE") {
    // Assert to Element to satisfy TypeScript and allow accessing .querySelectorAll
    const el = node as Element;
    const brs = el.querySelectorAll("br");
    brs.forEach((br) => {
      br.replaceWith(el.ownerDocument.createTextNode("\n"));
    });
  }
});

// DOMPurify v3 keeps these in the default attribute allowlist; we want them
// gone. `style` is the dangerous one (CSS-based XSS via url(javascript:...)).
const FORBID_ATTR = ["style", "class", "title"];

export function sanitizeMediumHtml(html: string): string {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP,
    FORBID_ATTR,
  });

  // Merge consecutive <pre> siblings. Medium's RSS feed sometimes splits a
  // single code block into multiple <pre> siblings separated only by
  // whitespace (see issue #81). Each would otherwise render as its own boxed
  // fragment where Medium shows one continuous block.
  //
  // Runs AFTER sanitize so we match what actually renders: by this point
  // DOMPurify has stripped all attributes from <pre> (we forbid class/style/
  // title), so the tag pair is always a bare </pre>...<pre>. The leading
  // \s* eats trailing whitespace inside the first <pre> to avoid a blank
  // line at the join; \s* between the tags swallows whitespace text nodes
  // (newlines, indentation) from the source HTML. The /g flag collapses
  // runs of any length in one pass.
  return sanitized.replace(/\s*<\/pre>\s*<pre[^>]*>/g, "\n");
}
