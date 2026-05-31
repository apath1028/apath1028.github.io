/** Shared tag color mappings — single source of truth for tag styling. */

export const tagClassMap: Record<string, string> = {
  python: "tag-purple",
  matlab: "tag-warm",
  "性能优化": "tag-sky",
  "数值分析": "tag-purple",
  教程: "tag-teal",
  随笔: "tag-purple",
  开篇: "tag-teal",
  杂谈: "tag-rose",
};

/** Map a tag name to its CSS color class. Falls back to tag-purple. */
export function getTagClass(tag: string): string {
  return tagClassMap[tag] || tagClassMap[tag.toLowerCase()] || "tag-purple";
}

/**
 * Map a tag name to a timeline dot color modifier.
 * Returns "" (default accent-purple), "teal", "warm", "sky", or "rose".
 */
export function getTagDotColor(tag: string): string {
  const cls = getTagClass(tag);
  switch (cls) {
    case "tag-purple":
      return "";
    case "tag-teal":
      return "teal";
    case "tag-warm":
      return "warm";
    case "tag-sky":
      return "sky";
    case "tag-rose":
      return "rose";
    default:
      return "";
  }
}
