# ultrahtml

## 1.6.0

### Minor Changes

- 124e573: Adds a new `transformSync` function, a synchronous alternative to the `transform` function. This can be used when there are no `async` transformer functions.

  ```js
  import { transformSync, html } from "ultrahtml";
  import swap from "ultrahtml/transformers/swap";

  const output = transformSync(`<h1>Hello world!</h1>`, [
    swap({
      h1: "h2",
    }),
  ]);

  console.log(output); // <h2>Hello world!</h2>
  ```

- f0a1da3: Adds a new `unblockElements` option to the `sanitize` transformer. This option makes it easier to remove all or most HTML from a string without dropping child content.

### Patch Changes

- f0a1da3: Fixes sanitization of nested elements.

  For example, the following code:

  ```js
  const output = await transform("<h1>Hello <strong>world!</strong></h1>", [
    sanitize({ blockElements: ["h1", "strong"] }),
  ]);
  ```

  produced the following output before this fix:

  ```html
  Hello <strong>world!</strong>
  ```

  and now correctly produces:

  ```html
  Hello world!
  ```

- e8aee16: Improve parser performance for attributes
- 8388fe7: Updates internal dependency on `esbuild`

## 1.5.3

### Patch Changes

- ebc97e0: upgrades `dts-bundle-generator` to `9.2.1`, fixing an issue with `.d.ts`
  generation which led methods prefixed with two underscores to be
  incorrectly made private in the generated declaration file.

## 1.5.2

### Patch Changes

- 244be0a: Update `parsel-js` to latest

## 1.5.1

### Patch Changes

- a989b5a: Bundle type definitions in `.d.ts` files

## 1.5.0

### Minor Changes

- 7c93190: Add support for static media queries to `ultrahtml/transformers/inline`.

  You may now pass an `env` value to the transformer, for example:

  ```js
  import { transform } from "ultrahtml";
  import inline from "ultrahtml/transformers/inline";

  const output = await transform(input, [
    // Acts as if the screen is 960px wide and 1280px tall
    inline({ env: { width: 960, height: 1280 } }),
  ]);
  ```

## 1.4.0

### Minor Changes

- 8bbaeef: Allow elements inside of `<svg>` to be self-closing for compactness

### Patch Changes

- 5715bc3: Fix `sanitize` transformer behavior when only using `allowElements`

## 1.3.0

### Minor Changes

- 0556b19: Add `renderSync` export

### Patch Changes

- 3362aa2: Add `main` entrypoint

## 1.2.0

### Minor Changes

- 7792f5d: Add `useObjectSyntax` option to inline transformer. Note that this option is currently not compatible with `transform`

## 1.1.0

### Minor Changes

- d910619: Remove `resolveAsset` option from `inline` transformer, making it synchronous again.

## 1.0.4

### Patch Changes

- c5799aa: Update attribute handling to account for attributes with newlines

## 1.0.3

### Patch Changes

- d7cb17d: Fix another edge case with text inside script/styles

## 1.0.2

### Patch Changes

- c7a1ef6: Fix edge case with `<script>` parsing

## 1.0.1

### Patch Changes

- b136e51: Fix unhandled edge case with `sanitize` transformer
- dce0b68: Fix style and script elements having their contents parsed as HTML

## 1.0.0

### Major Changes

- 95c0f73: `ultrahtml` is a complete markup toolkit with a tiny footprint. Parse, transform, and render HTML on the server, in the browser, with or without a build step.

  ## Breaking Changes

  The signature of `transform` has been updated. Rather than applying sanitization and component swapping by default, these have been split out to individual `ultrahtml/transformers` that can be applied modularly.

  In `ultrahtml@0.x`, `transform` accepted an options object with `sanitize` and `components`. Other transformations would need to be applied outside of this flow.

  ```js
  import { transform } from "ultrahtml";

  await transform(markup, {
    components: { h1: "h2" },
    sanitize: { allowElements: ["h1", "h2", "h3"] },
  });
  ```

  In `ultrahtml@1.x`, `transform` accepts an array of transformers to apply. The `sanitize` and `components` options can be handled with the built-in transformers named `sanitize` and `swap`.

  ```js
  import { transform } from "ultrahtml";
  import swap from "ultrahtml/transformers/swap";
  import sanitize from "ultrahtml/transformers/sanitize";

  await transform(markup, [
    swap({ h1: "h2" }),
    sanitize({ allowElements: ["h1", "h2", "h3"] }),
  ]);
  ```

  ## New Features

  ### JSX Runtime

  `ultrahtml` now comes with `h` and `Fragment` functions for JSX, as well as a `jsx-runtime` export.

  ### Tranformers

  Transformers are AST transformations that can be applied to any `ultrahtml` Node. Usually these are applied to entire documents.

  **New** `inline` transformer inlines CSS from `<style>` blocks directly to matching elements.

  **New** `scope` transformer scopes CSS from `<style>` blocks to the elements in a given document or component.

### Patch Changes

- 4699020: Update JSX runtime child handling
- da119c1: Fix transformer definitions
- d29a0e2: Add `resolveAsset` option to the `inline` transformer
- 401b13a: Fix JSX runtime types
- 44a771e: Update list of void HTML tags

## 1.0.0-next.4

### Patch Changes

- d29a0e2: Add `resolveAsset` option to the `inline` transformer

## 1.0.0-next.3

### Patch Changes

- 4699020: Update JSX runtime child handling

## 1.0.0-next.2

### Patch Changes

- 401b13a: Fix JSX runtime types

## 1.0.0-next.1

### Patch Changes

- da119c1: Fix transformer definitions

## 1.0.0-next.0

### Major Changes

- 95c0f73: `ultrahtml` is a complete markup toolkit with a tiny footprint. Parse, transform, and render HTML on the server, in the browser, with or without a build step.

  ## Breaking Changes

  The signature of `transform` has been updated. Rather than applying sanitization and component swapping by default, these have been split out to individual `ultrahtml/transformers` that can be applied modularly.

  In `ultrahtml@0.x`, `transform` accepted an options object with `sanitize` and `components`. Other transformations would need to be applied outside of this flow.

  ```js
  import { transform } from "ultrahtml";

  await transform(markup, {
    components: { h1: "h2" },
    sanitize: { allowElements: ["h1", "h2", "h3"] },
  });
  ```

  In `ultrahtml@1.x`, `transform` accepts an array of transformers to apply. The `sanitize` and `components` options can be handled with the built-in transformers named `sanitize` and `swap`.

  ```js
  import { transform } from "ultrahtml";
  import swap from "ultrahtml/transformers/swap";
  import sanitize from "ultrahtml/transformers/sanitize";

  await transform(markup, [
    swap({ h1: "h2" }),
    sanitize({ allowElements: ["h1", "h2", "h3"] }),
  ]);
  ```

  ## New Features

  ### JSX Runtime

  `ultrahtml` now comes with `h` and `Fragment` functions for JSX, as well as a `jsx-runtime` export.

  ### Tranformers

  Transformers are AST transformations that can be applied to any `ultrahtml` Node. Usually these are applied to entire documents.

  **New** `inline` transformer inlines CSS from `<style>` blocks directly to matching elements.

  **New** `scope` transformer scopes CSS from `<style>` blocks to the elements in a given document or component.

## 0.4.0

### Minor Changes

- 83c2e35: Improve declarations for node types

## 0.3.3

### Patch Changes

- 3b8fb6e: Remove bundledDependencies field

## 0.3.2

### Patch Changes

- 74010dd: Bundle parsel-js to avoid ESM/CJS issues
- d7b514d: Fix CJS compat issue (again)

## 0.3.1

### Patch Changes

- a105c5e: Fix CJS compat issue

## 0.3.0

### Minor Changes

- 2de70f3: Add `ultrahtml/selector` module which exports `querySelector`, `querySelectorAll`, and `matches` functions.

  To use `querySelectorAll`, pass the root `Node` as the first argument and any valid CSS selector as the second argument. Note that if a CSS selector you need is not yet implemented, you are invited to [open an issue](https://github.com/natemoo-re/ultrahtml/issues).

  ```js
  import { parse } from "ultrahtml";
  import { querySelectorAll, matches } from "ultrahtml/selector";

  const doc = parse(`
  <html>
      <head>
          <title>Demo</title>
      /head>
      <body>
          <h1>Hello world!</h1>
      </body>
  </html>
  `);
  const h1 = querySelector(doc, "h1");
  const match = matches(h1, "h1");
  ```

## 0.2.1

### Patch Changes

- 037711f: Update types

## 0.2.0

### Minor Changes

- 97b297f: Add `walkSync` export

## 0.1.3

### Patch Changes

- 123f7ea: Fix custom elements transform.

## 0.1.2

### Patch Changes

- 758bbba: Improve documentation

## 0.1.1

### Patch Changes

- 2f92e93: Export node types

## 0.1.0

### Minor Changes

- 517e24d: Fix edge cases with text node detection, refactor for compactness

## 0.0.5

### Patch Changes

- 23771a3: Fix `walk` function definition

## 0.0.4

### Patch Changes

- 4d082b3: Ensure types are included

## 0.0.3

### Patch Changes

- e0e8a2b: Add `__unsafeHTML` export

## 0.0.2

### Patch Changes

- f6e3a71: Support async components
