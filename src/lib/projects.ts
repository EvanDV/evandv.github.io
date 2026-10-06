import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

/** Published projects, sorted by side then track (A1, A2, ..., B1, ...). */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', ({ data }) => !data.draft);
  return all.sort(
    (a, b) => a.data.side.localeCompare(b.data.side) || a.data.track - b.data.track,
  );
}

export const trackLabel = (p: Project) => `${p.data.side}${p.data.track}`;

export const fullTitle = (p: Project) =>
  p.data.titleAccent ? `${p.data.title} ${p.data.titleAccent}` : p.data.title;

export const projectUrl = (p: Project) => p.data.link ?? `/projects/${p.id}/`;
