// Minimal BibTeX reader: enough for entries exported from ADS, arXiv or
// doi.org. Skips @string/@preamble/@comment and handles nested braces.

export interface BibEntry {
  type: string;
  key: string;
  fields: Record<string, string>;
}

export function parseBibtex(src: string): BibEntry[] {
  const entries: BibEntry[] = [];
  let i = 0;

  const skipWs = () => {
    while (i < src.length && /\s/.test(src[i])) i++;
  };

  // Reads {...} (nested) or "..." and returns the inside.
  const readDelimited = (): string => {
    const open = src[i];
    if (open === '"') {
      const end = src.indexOf('"', i + 1);
      const out = src.slice(i + 1, end);
      i = end + 1;
      return out;
    }
    let depth = 0;
    const start = i + 1;
    for (; i < src.length; i++) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}' && --depth === 0) break;
    }
    return src.slice(start, i++);
  };

  while ((i = src.indexOf('@', i)) !== -1) {
    i++;
    const typeMatch = /^(\w+)\s*[{(]/.exec(src.slice(i));
    if (!typeMatch) continue;
    const type = typeMatch[1].toLowerCase();
    i += typeMatch[0].length;
    if (['string', 'preamble', 'comment'].includes(type)) {
      // skip to the matching close
      let depth = 1;
      for (; i < src.length && depth; i++) {
        if (src[i] === '{' || src[i] === '(') depth++;
        else if (src[i] === '}' || src[i] === ')') depth--;
      }
      continue;
    }

    const keyEnd = src.indexOf(',', i);
    const key = src.slice(i, keyEnd).trim();
    i = keyEnd + 1;
    const fields: Record<string, string> = {};

    for (;;) {
      skipWs();
      if (src[i] === '}' || src[i] === ')' || i >= src.length) {
        i++;
        break;
      }
      const nameMatch = /^([\w-]+)\s*=\s*/.exec(src.slice(i));
      if (!nameMatch) break;
      i += nameMatch[0].length;
      let value: string;
      if (src[i] === '{' || src[i] === '"') {
        value = readDelimited();
      } else {
        const m = /^[^,}\s]+/.exec(src.slice(i))!;
        value = m[0];
        i += value.length;
      }
      fields[nameMatch[1].toLowerCase()] = value;
      skipWs();
      if (src[i] === ',') i++;
    }
    entries.push({ type, key, fields });
  }
  return entries;
}

const ACCENTS: Record<string, Record<string, string>> = {
  "'": { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', y: 'ý', c: 'ć', n: 'ń', s: 'ś', z: 'ź', A: 'Á', E: 'É', I: 'Í', O: 'Ó', U: 'Ú' },
  '`': { a: 'à', e: 'è', i: 'ì', o: 'ò', u: 'ù', A: 'À', E: 'È' },
  '^': { a: 'â', e: 'ê', i: 'î', o: 'ô', u: 'û', A: 'Â', E: 'Ê' },
  '"': { a: 'ä', e: 'ë', i: 'ï', o: 'ö', u: 'ü', A: 'Ä', O: 'Ö', U: 'Ü' },
  '~': { a: 'ã', n: 'ñ', o: 'õ', N: 'Ñ' },
  c: { c: 'ç', C: 'Ç' },
  v: { c: 'č', s: 'š', z: 'ž', r: 'ř', e: 'ě', C: 'Č', S: 'Š', Z: 'Ž' },
};

/** Turns common LaTeX into plain text: accents, dashes, braces, \& and $...$. */
export function latexToText(s: string): string {
  return s
    .replace(/\\([`'^"~cv])\s*\{?\\?([a-zA-Z])\}?/g, (m, acc: string, ch: string) => ACCENTS[acc]?.[ch] ?? ch)
    .replace(/\\ss\b/g, 'ß')
    .replace(/\\o\b/g, 'ø')
    .replace(/\\&/g, '&')
    .replace(/---/g, '—')
    .replace(/--/g, '–')
    .replace(/\$([^$]*)\$/g, '$1')
    .replace(/\\[a-zA-Z]+\s*/g, '')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface Name {
  first: string;
  last: string;
}

/** Splits an author field on top-level " and ". */
export function parseNames(field: string): Name[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < field.length; i++) {
    if (field[i] === '{') depth++;
    else if (field[i] === '}') depth--;
    else if (depth === 0 && /^\s+and\s+/i.test(field.slice(i))) {
      parts.push(field.slice(start, i));
      i += /^\s+and\s+/i.exec(field.slice(i))![0].length - 1;
      start = i + 1;
    }
  }
  parts.push(field.slice(start));

  return parts
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      if (p.includes(',')) {
        const [last, ...rest] = p.split(',');
        return { last: latexToText(last), first: latexToText(rest.join(',')) };
      }
      const words = latexToText(p).split(' ');
      return { last: words.pop() ?? '', first: words.join(' ') };
    });
}

/** "Mawson W." + "Sammons" -> "M. W. Sammons"; "Jean-Francois" -> "J.-F." */
export function shortName({ first, last }: Name): string {
  const initials = first
    .split(/\s+/)
    .filter(Boolean)
    .map((w) =>
      w
        .split('-')
        .map((part) => (part.endsWith('.') && part.length <= 3 ? part : `${part[0]}.`))
        .join('-'),
    )
    .join(' ');
  return initials ? `${initials} ${last}` : last;
}
