export default function rehypeArticleImages() {
  return function transform(tree) {
    visit(tree);
  };

  function visit(node) {
    if (node?.type === "element" && node.tagName === "img") {
      node.properties ||= {};
      node.properties.loading ||= "lazy";
      node.properties.decoding ||= "async";
      node.properties.referrerPolicy ||= "no-referrer";
    }

    if (Array.isArray(node?.children)) {
      node.children.forEach(visit);
    }
  }
}
