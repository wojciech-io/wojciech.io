import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const insights = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    tldr: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    ogImage: z.string().optional(),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    cluster: z.enum(['ai-gtm', 'growth-architecture', 'products-shipped']),
    tags: z.array(z.string()).default([]),
    metrics: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).default([]),
    href: z.string().optional(),
    image: z.string().optional(),
    icon: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

export const collections = { insights, work };
