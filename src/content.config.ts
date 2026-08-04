import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const passages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/passages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    updatedDate: z.date().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = { passages };
