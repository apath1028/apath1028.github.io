import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeArticleImages from "./src/lib/rehype-article-images.mjs";
import { unified } from "@astrojs/markdown-remark";

// https://astro.build/config
export default defineConfig({
  site: "https://shucheng.github.io",
  base: "/",
  integrations: [
    mdx(), 
    sitemap(),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex, rehypeArticleImages],
    }),
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "github-dark-default",
      wrap: false,
    },
  },
  build: {
    format: "directory",
  },
  server: {
    port: 3000,
  },
});
