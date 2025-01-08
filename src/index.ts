/// <reference types="mdast-util-directive" />

import type { Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { isText, isTextDirective } from "./utils.js";

const remarkRubyDirective: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, isTextDirective, (node) => {
      if (node.name !== "ruby") return;
      if (node.children.length === 0) return;
      if (!isText(node.children[0])) return;

      const textNode = node.children[0];
      let regex = new RegExp(/(\([^)]*\))|（[^）]*）/);
      if (!regex.test(textNode.value)) return;

      regex = new RegExp(/^([^\s(（]+)([（(])([^）)]+)([）)])$/);
      const matches = textNode.value.match(regex);
      if (!matches) return;

      const [_, value, open, ruby, close] = matches;

      node.data = {
        ...node.data,
        hName: node.name,
        hProperties: {
          ...node.attributes,
        },
        hChildren: [
          {
            type: "text",
            value: value,
          },
          {
            type: "element",
            tagName: "rp",
            properties: {},
            children: [
              {
                type: "text",
                value: open,
              },
            ],
          },
          {
            type: "element",
            tagName: "rt",
            properties: {},
            children: [
              {
                type: "text",
                value: ruby,
              },
            ],
          },
          {
            type: "element",
            tagName: "rp",
            properties: {},
            children: [
              {
                type: "text",
                value: close,
              },
            ],
          },
        ],
      };
    });
  };
};

export default remarkRubyDirective;
