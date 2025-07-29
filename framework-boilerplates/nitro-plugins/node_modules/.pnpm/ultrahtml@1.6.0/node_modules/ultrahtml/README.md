# `ultrahtml`

A 1.75kB library for enhancing `html`. `ultrahtml` has zero dependencies and is compatible with any JavaScript runtime.

### Features

- Tiny, fault-tolerant and friendly HTML-like parser. Works with HTML, Astro, Vue, Svelte, and any other HTML-like syntax.
- Built-in AST `walk` utility
- Built-in `transform` utility for easy output manipulation
- Automatic but configurable sanitization, see [Sanitization](#sanitization)
- Handy `html` template utility
- `querySelector` and `querySelectorAll` support using `ultrahtml/selector`

#### `walk`

The `walk` function provides full control over the AST. It can be used to scan for text, elements, components, or any other validation you might want to do.

> **Note** > `walk` is `async` and **must** be `await`ed. Use `walkSync` if it is guaranteed there are no `async` components in the tree.

```js
import { parse, walk, ELEMENT_NODE } from "ultrahtml";

const ast = parse(`<h1>Hello world!</h1>`);
await walk(ast, async (node) => {
  if (node.type === ELEMENT_NODE && node.name === "script") {
    throw new Error("Found a script!");
  }
});
```

#### `walkSync`

The `walkSync` function is identical to the `walk` function, but is synchronous. This should only be used when it is guaranteed there are no `async` components in the tree.

```js
import { parse, walkSync, ELEMENT_NODE } from "ultrahtml";

const ast = parse(`<h1>Hello world!</h1>`);
walkSync(ast, (node) => {
  if (node.type === ELEMENT_NODE && node.name === "script") {
    throw new Error("Found a script!");
  }
});
```

#### `render`

The `render` function allows you to serialize an AST back into a string.

> **Note**
> By default, `render` will sanitize your markup, removing any `script` tags. Pass `{ sanitize: false }` to disable this behavior.

```js
import { parse, render } from "ultrahtml";

const ast = parse(`<h1>Hello world!</h1>`);
const output = await render(ast);
```

#### `transform`

The `transform` function provides a straight-forward way to modify any markup. Sanitize content, swap in-place elements/Components, and more using a set of built-in transformers, or write your own custom transformer.

```js
import { transform, html } from "ultrahtml";
import swap from "ultrahtml/transformers/swap";
import sanitize from "ultrahtml/transformers/sanitize";

const output = await transform(`<h1>Hello world!</h1>`, [
  swap({
    h1: "h2",
    h3: (props, children) => html`<h2 class="ultra">${children}</h2>`,
  }),
  sanitize({ allowElements: ["h1", "h2", "h3"] }),
]);

console.log(output); // <h2>Hello world!</h2>
```

#### `transformSync`

The `transformSync` function is identical to the `transform` function, but is synchronous. This should only be used when it is guaranteed there are no `async` functions in the transformers.

```js
import { transformSync, html } from "ultrahtml";
import swap from "ultrahtml/transformers/swap";
import sanitize from "ultrahtml/transformers/sanitize";

const output = transformSync(`<h1>Hello world!</h1>`, [
  swap({
    h1: "h2",
    h3: (props, children) => html`<h2 class="ultra">${children}</h2>`,
  }),
  sanitize({ allowElements: ["h1", "h2", "h3"] }),
]);

console.log(output); // <h2>Hello world!</h2>
```

#### Sanitization

`ultrahtml/transformers/sanitize` implements an extension of the [HTML Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/Sanitizer/Sanitizer).

| Option              | Type                       | Default      | Description                                                                                                                                                                                                                               |
| ------------------- | -------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| allowElements       | `string[]`                 | `undefined`  | An array of strings indicating elements that the sanitizer should not remove. All elements not in the array will be dropped.                                                                                                              |
| blockElements       | `string[]`                 | `undefined`  | An array of strings indicating elements that the sanitizer should remove, but keep their child elements.                                                                                                                                  |
| unblockElements     | `string[]`                 | `undefined`  | An array of strings indicating elements that the sanitizer should not remove. All elements not in the array will be removed, but keep their child content.                                                                                |
| dropElements        | `string[]`                 | `["script"]` | An array of strings indicating elements (including nested elements) that the sanitizer should remove.                                                                                                                                     |
| allowAttributes     | `Record<string, string[]>` | `undefined`  | An object where each key is the attribute name and the value is an Array of allowed tag names. Matching attributes will not be removed. All attributes that are not in the array will be dropped.                                         |
| dropAttributes      | `Record<string, string[]>` | `undefined`  | An object where each key is the attribute name and the value is an Array of dropped tag names. Matching attributes will be removed.                                                                                                       |
| allowComponents     | `boolean`                  | `false`      | A boolean value set to false (default) to remove components and their children. If set to true, components will be subject to built-in and custom configuration checks (and will be retained or dropped based on those checks).           |
| allowCustomElements | `boolean`                  | `false`      | A boolean value set to false (default) to remove custom elements and their children. If set to true, custom elements will be subject to built-in and custom configuration checks (and will be retained or dropped based on those checks). |
| allowComments       | `boolean`                  | `false`      | A boolean value set to false (default) to remove HTML comments. Set to true in order to keep comments.                                                                                                                                    |

## Acknowledgements

- [Jason Miller](https://twitter.com/_developit)'s [`htmlParser`](https://github.com/developit/htmlParser) provided a great, lightweight base for this parser
- [Titus Wormer](https://twitter.com/wooorm)'s [`mdx`](https://mdxjs.com) for inspiration
