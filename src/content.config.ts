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
    coverImage: z.string().optional(),
    coverType: z.enum(['terminal', 'builder', 'chart', 'product', 'system', 'default']).default('default'),
    coverImage: z.string().optional(),
    category: z.enum(['AI Systems', 'GTM Architecture', 'Operator Playbooks', 'Products']).optional(),
    locale: z.enum(['en', 'de', 'dk', 'no', 'jp', 'it', 'es', 'pl']).default('en'),
    translationOf: z.string().optional(),
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
    problem: z.string().optional(),
    system: z.string().optional(),
    artifact: z.string().optional(),
    outcome: z.string().optional(),
    icon: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

// Testimonials collection.
// Featured subset criteria: tight claims, voice fit, recognizable public source.
// Use `featured: true` for homepage subset (3-5 entries), `draft: true` while curating.
const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/testimonials' }),
  schema: z.object({
    // Author identity
    author: z.string(),                              // full name
    role: z.string(),                                // job title at the time of quote
    company: z.string(),                             // company at the time of quote
    avatar: z.string().optional(),                   // /images/testimonials/<slug>.jpg
    href: z.string().url().optional(),               // link to LinkedIn post / source
    // Quote
    quote: z.string(),                               // the actual testimonial body
    // Curation metadata
    featured: z.boolean().default(false),            // surface on homepage
    order: z.number().default(99),                   // sort within featured subset
    date: z.coerce.date().optional(),                // when given
    voiceFit: z.enum(['high', 'medium', 'low']).default('medium'), // tone alignment
    claimTightness: z.enum(['specific-numbers', 'specific-outcome', 'generic']).default('generic'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(true),                // default true: explicit opt-in to surface
  }),
});

export const collections = { insights, work, testimonials };
