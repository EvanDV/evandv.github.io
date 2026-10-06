import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      titleAccent: z.string().optional(), // italic amber part of the title
      side: z.enum(['A', 'B']),           // A = research, B = for fun
      track: z.number().int().positive(),
      tag: z.string().optional(),
      kind: z.string().optional(),        // header label, e.g. "Master's thesis"; falls back to tag
      wip: z.boolean().default(false),    // shows a "Work in progress" pill
      summary: z.string(),
      pills: z.array(z.string()).default([]),
      hero: image().optional(),
      heroAlt: z.string().optional(),
      heroCaption: z.string().optional(),
      // Sidebar links. Leave out href for plain text ("Paper in preparation").
      links: z.array(z.object({ label: z.string(), href: z.string().optional() })).default([]),
      // Send the card somewhere other than a project page (e.g. "/reviews/").
      link: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reviews' }),
  schema: ({ image }) =>
    z.object({
      album: z.string(),
      artist: z.string(),
      released: z.number().int().optional(), // release year
      label: z.string().optional(),          // record label
      date: z.coerce.date(),                 // when the review was published
      rating: z.number().min(0).max(10).optional(),
      cover: image().optional(),
      summary: z.string().optional(),        // one line for the index
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects, reviews };
