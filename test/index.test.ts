// https://bun.sh/docs/cli/test

import { describe, expect, mock, test } from "bun:test";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkRubyDirective from "../src/index.js";

const normalizeHtml = (html: string) => {
  return html.replace(/[\n\s]*(<)|>([\n\s]*)/g, (_match, p1, _p2) =>
    p1 ? "<" : ">"
  );
};

const parseMarkdown = mock(async (markdown: string, debug = false) => {
  const remarkProcessor = unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkRubyDirective)
    .use(remarkRehype)
    .use(rehypeStringify);

  if (debug) {
    const remarkOutput = await remarkProcessor.run(
      remarkProcessor.parse(markdown)
    );
    console.log("Remark output:", JSON.stringify(remarkOutput, null, 2));
  }

  const output = String(await remarkProcessor.process(markdown));

  if (debug) {
    console.log(
      `HTML output:
      ${normalizeHtml(output)}`
    );
  }

  return output;
});

describe("Test the basic usage", () => {
  test("Ruby with half-width parentheses", async () => {
    const input = ":ruby[とある科学の超電磁砲(レールガン)]";
    const output = `
    <ruby>
      とある科学の超電磁砲
      <rp>(</rp>
      <rt>レールガン</rt>
      <rp>)</rp>
    </ruby>
    `;

    const html = await parseMarkdown(input);

    expect(normalizeHtml(html)).toBe(normalizeHtml(output));
  });

  test("Ruby with multiple half-width parentheses", async () => {
    const input =
      ":ruby[とある科学の超電磁砲(レールガン)ととある魔術の禁書目録(インデックス)]";
    // The first regex does not match if multiple parentheses exist and thus it returns halfway through.
    const output = `
    <p>
      <div>とある科学の超電磁砲(レールガン)ととある魔術の禁書目録(インデックス)</div>
    </p>
    `;

    const html = await parseMarkdown(input);

    expect(normalizeHtml(html)).toBe(normalizeHtml(output));
  });

  test("Ruby with full-width parentheses", async () => {
    const input = ":ruby[とある科学の超電磁砲（レールガン）]";
    const output = `
    <ruby>
      とある科学の超電磁砲
      <rp>（</rp>
      <rt>レールガン</rt>
      <rp>）</rp>
    </ruby>
    `;

    const html = await parseMarkdown(input);

    expect(normalizeHtml(html)).toBe(normalizeHtml(output));
  });

  test("Ruby with multiple full-width parentheses", async () => {
    const input =
      ":ruby[とある科学の超電磁砲（レールガン）ととある魔術の禁書目録（インデックス）]";
    // The first regex does not match if multiple parentheses exist and thus it returns halfway through.
    const output = `
    <p>
      <div>とある科学の超電磁砲（レールガン）ととある魔術の禁書目録（インデックス）</div>
    </p>
    `;

    const html = await parseMarkdown(input);

    expect(normalizeHtml(html)).toBe(normalizeHtml(output));
  });
});
