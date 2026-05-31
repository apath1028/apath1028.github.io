import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("blog");
  const publishedPosts = posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: "数字花园",
    description: "个人博客与数字花园 — 记录知识、思考与日常",
    site: context.site,
    items: publishedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.id.replace(/\.mdx?$/, "")}/`,
    })),
    customData: `<language>zh-CN</language>`,
  });
}
