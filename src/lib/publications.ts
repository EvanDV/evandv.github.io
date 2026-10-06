import bib from '../data/publications.bib?raw';
import { latexToText, parseBibtex, parseNames, shortName } from './bibtex';

const ME = 'Davies-Velie';

const JOURNALS: Record<string, string> = {
  'The Astrophysical Journal': 'ApJ',
  'The Astrophysical Journal Letters': 'ApJL',
  'The Astrophysical Journal Supplement Series': 'ApJS',
  'The Astronomical Journal': 'AJ',
  'Physical Review D': 'Phys. Rev. D',
  'Monthly Notices of the Royal Astronomical Society': 'MNRAS',
  'Astronomy & Astrophysics': 'A&A',
  'Nature Astronomy': 'Nat. Astron.',
};

export type Credit =
  | { kind: 'name'; text: string; me: boolean }
  | { kind: 'text'; text: string };

export interface Publication {
  key: string;
  title: string;
  year: number;
  type: 'Journal' | 'Proceedings' | 'Preprint';
  venue: string;
  note?: string;
  url: string;
  doi?: string;
  arxiv?: string;
  authorCount: number;
  credits: Credit[];
}

/** Author line with Evan bolded, shortened for long author lists. */
function creditLine(names: ReturnType<typeof parseNames>, collaboration?: string): Credit[] {
  const n = names.length;
  const me = names.findIndex((a) => a.last === ME);
  const name = (i: number): Credit => ({ kind: 'name', text: shortName(names[i]), me: i === me });
  const all = (count: number) => Array.from({ length: count }, (_, i) => name(i));

  if (collaboration) {
    return [
      { kind: 'text', text: `${collaboration} (${n} authors, incl.` },
      ...(me >= 0 ? [name(me)] : []),
      { kind: 'text', text: ')' },
    ];
  }
  if (n <= 8) return all(n);
  if (me >= 0 && me < 8) return [...all(Math.max(3, me + 1)), { kind: 'text', text: `et al. (${n} authors)` }];
  return [
    ...all(3),
    { kind: 'text', text: '…' },
    ...(me >= 0 ? [name(me)] : []),
    { kind: 'text', text: `et al. (${n} authors)` },
  ];
}

export function getPublications(): Publication[] {
  return parseBibtex(bib)
    .map((e) => {
      const f = e.fields;
      const names = parseNames(f.author ?? '');
      const journal = f.journal ? latexToText(f.journal) : undefined;
      const arxiv = f.eprint;
      const doi = f.doi;

      let type: Publication['type'] = 'Preprint';
      let venue = arxiv ? `arXiv:${arxiv}` : '';
      if (journal) {
        type = 'Journal';
        venue = [JOURNALS[journal] ?? journal, [f.volume, f.pages].filter(Boolean).join(', ')]
          .filter(Boolean)
          .join(' ');
      } else if (e.type === 'inproceedings' && f.booktitle) {
        type = 'Proceedings';
        venue = [f.series, latexToText(f.booktitle)].filter(Boolean).join(' · ');
      }

      return {
        key: e.key,
        title: latexToText(f.title ?? ''),
        year: Number(f.year),
        type,
        venue,
        note: f.note ? latexToText(f.note) : undefined,
        doi,
        arxiv,
        url: doi ? `https://doi.org/${doi}` : arxiv ? `https://arxiv.org/abs/${arxiv}` : (f.url ?? '#'),
        authorCount: names.length,
        credits: creditLine(names, f.collaboration),
      };
    })
    .sort((a, b) => b.year - a.year); // stable: keeps file order within a year
}
