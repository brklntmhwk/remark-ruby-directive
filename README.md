# remark-ruby-directive

A remark plugin to add ruby (furigana) to Markdown text content.

## Features

- Compatible with [the proposed generic syntax](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444/1) for custom directives/plugins in Markdown
- Written in TypeScript
- ESM only

## How to Use

### Installation

To install the plugin:

With `npm`:

```bash
npm install remark-ruby-directive
```

With `yarn`:

```bash
yarn add remark-ruby-directive
```

With `pnpm`:

```bash
pnpm add remark-ruby-directive
```

With `bun`:

```bash
bun install remark-ruby-directive
```

### Usage

General usage:

```js
import rehypeStringify from "rehype-stringify";
import remarkRubyDirective from "remark-ruby-directive";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const normalizeHtml = (html: string) => {
  return html.replace(/[\n\s]*(<)|>([\n\s]*)/g, (_match, p1, _p2) =>
    p1 ? "<" : ">"
  );
};

const parseMarkdown = async (markdown: string) => {
  const remarkProcessor = unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkRubyDirective)
    .use(remarkRehype)
    .use(rehypeStringify);

  const output = String(await remarkProcessor.process(markdown));

  return output;
}

const input = ":ruby[とある科学の超電磁砲(レールガン)]";

const html = await parseMarkdown(input);

console.log(normalizeHtml(html));
```

Yields:

```html
<ruby data-ruby="レールガン">
  とある科学の超電磁砲
  <rp>(</rp>
  <rt>レールガン</rt>
  <rp>)</rp>
</ruby>
```

> [!NOTE]
> Why don't you use the existing Markdown ruby syntax? `{超電磁砲}^(レールガン)`
> \- Since [MDX 2](https://mdxjs.com/blog/v2/), the compiler has come to throw an error "Could not parse expression with acorn: $error" whenever there are unescaped curly braces and the expression inside them is invalid. This breaking change leads the existing one to cause the error.

For more possible patterns and in-depths explanations on the generic syntax(e.g., `:::something[...]{...}`), see `./test/index.test.ts` and [this page](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444/1), respectively.

### Syntax

Here are some takeaways:

- Supports both full and half-width parentheses
- Does not support multiple parentheses in one directive node

With the above-mentioned points considered, some examples are as follows:

#### Half-width parentheses

```markdown
:ruby[とある科学の超電磁砲(レールガン)]
```

Yields:

```html
<ruby data-ruby="レールガン">
  とある科学の超電磁砲
  <rp>(</rp>
  <rt>レールガン</rt>
  <rp>)</rp>
</ruby>
```

#### Full-width parentheses

```markdown
:ruby[とある科学の超電磁砲（レールガン）]
```

Yields:

```html
<ruby data-ruby="レールガン">
  とある科学の超電磁砲
  <rp>（</rp>
  <rt>レールガン</rt>
  <rp>）</rp>
</ruby>
```

#### Multiple parentheses

If you add multiple parentheses to one directive node, the plugin does nothing just returning it as a paragraph.

```markdown
:ruby[とある科学の超電磁砲(レールガン)ととある魔術の禁書目録(インデックス)]
```

Yields:

```html
<p>
  <div>とある科学の超電磁砲(レールガン)ととある魔術の禁書目録(インデックス)</div>
</p>
```

### Astro

If you want to use this in your [Astro](https://astro.build/) project, note that you need to install `remark-directive` and add it to the `astro.config.{js,mjs,ts}` file simultaneously.

```ts title="astro.config.ts"
import { defineConfig } from 'astro/config';
import remarkRubyDirective from "remark-ruby-directive";
import remarkDirective from "remark-directive";
// ...

export default defineConfig({
  // ...
  markdown: {
    // ...
    remarkPlugins: [
      // ...
      remarkDirective,
      remarkRubyDirective,
      // ...
    ]
    // ...
  }
  // ...
})
```

## Feature(s) pending to be added

- Nothing special

## TODO(s)

- Nothing special

## License

This project is licensed under the MIT License, see the LICENSE file for more details.
