import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { unified } from "@astrojs/markdown-remark";

// https://astro.build/config
export default defineConfig({
  site: "https://shucheng.github.io",
  base: "/",
  integrations: [
    mdx(),
    sitemap(),
    unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
  ],
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
  build: {
    format: "directory",
  },
  server: {
    port: 3000,
  },
});
