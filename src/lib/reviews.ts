import { getCollection, type CollectionEntry } from 'astro:content';

export type Review = CollectionEntry<'reviews'>;

/** Published reviews, newest first. */
export async function getReviews(): Promise<Review[]> {
  const all = await getCollection('reviews', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const reviewUrl = (r: Review) => `/reviews/${r.id}/`;

/** "8/10", "7.5/10" */
export const formatRating = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1)}/10`;

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
