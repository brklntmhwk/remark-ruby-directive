import type { Image, Link, Paragraph, Parent, Text } from "mdast";
import type { TextDirective } from "mdast-util-directive";
import type { Node } from "unist";

function isObject(target: unknown): target is { [k: string]: unknown } {
  return typeof target === "object" && target !== null;
}

function isNode(node: unknown): node is Node {
  return isObject(node) && "type" in node;
}

function is<T extends Node>(node: unknown, type: string): node is T {
  return isNode(node) && node.type === type;
}

export function isParent(node: unknown): node is Parent {
  return is(node, "node") && "children" in node;
}

export function isParagraph(node: unknown): node is Paragraph {
  return is(node, "paragraph");
}

export function isText(node: unknown): node is Text {
  return is(node, "text");
}

export function isTextDirective(node: unknown): node is TextDirective {
  return is(node, "textDirective");
}
