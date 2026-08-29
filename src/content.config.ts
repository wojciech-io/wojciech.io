import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { ALL_LOCALES } from './data/locale-codes';

const insights = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    // Short variant for the <title> tag and og:title; the long human title stays the H1.
    seoTitle: z.string().optional(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    // Q&A pairs emitted as FAQPage JSON-LD; keep in sync with the visible FAQ section.
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    tags: z.array(z.string()).default([]),
    tldr: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    ogImage: z.string().optional(),
    coverImage: z.string().optional(),
    coverType: z.enum(['terminal', 'builder', 'chart', 'product', 'system', 'launch', 'default']).default('default'),
    category: z.enum(['AI Systems', 'AI Marketing', 'GTM Architecture', 'Operator Playbooks', 'Products']).optional(),
    locale: z.enum(ALL_LOCALES).default('en'),
    translationOf: z.string().optional(),
    // External claims this article rests on, so scripts/check-sources.mjs can
    // re-read them on a schedule. A comparison post is true on the day it ships
    // and quietly stops being true when the other side edits their docs or
    // changes a price, with no commit here to mark the moment.
    //
    // `quote` must be copied verbatim from the source. The checker normalizes
    // whitespace before comparing, so a fragment wrapped across lines still
    // matches, but a paraphrase will not and should not.
    sources: z.array(z.object({
      url: z.string().url(),
      /** Exact fragment that must still be present. Omit to check reachability only. */
      quote: z.string().optional(),
      /** What this source is being cited for. Shown in the drift report. */
      claim: z.string().optional(),
      /** Date the quote was last confirmed by hand. */
      checkedAt: z.coerce.date(),
    })).optional(),
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
    hero: z.boolean().default(false),                // top-3 prominent cards
    order: z.number().default(99),                   // sort within featured subset
    date: z.coerce.date().optional(),                // when given
    voiceFit: z.enum(['high', 'medium', 'low']).default('medium'), // tone alignment
    claimTightness: z.enum(['specific-numbers', 'specific-outcome', 'generic']).default('generic'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(true),                // default true: explicit opt-in to surface
  }),
});

export const collections = { insights, work, testimonials };
