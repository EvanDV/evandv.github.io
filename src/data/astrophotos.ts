// Astrophotography gallery. Newest first: the first photo is also the
// cover of the Side B card on the home page.
import type { ImageMetadata } from 'astro';
import m27 from '../assets/astro/m27-dumbbell.png';
import m31 from '../assets/astro/m31-andromeda.png';

export interface AstroPhoto {
  image: ImageMetadata;
  catalog: string;   // "M27"
  name: string;      // "Dumbbell Nebula"
  type: string;      // what it is, where it is
  alt: string;
  note?: string;     // optional caption line (gear, exposure, date...)
}

export const PHOTOS: AstroPhoto[] = [
  {
    image: m27,
    catalog: 'M27',
    name: 'Dumbbell Nebula',
    type: 'Planetary nebula · Vulpecula',
    alt: 'The Dumbbell Nebula, a glowing teal and red hourglass-shaped cloud in a dense star field',
  },
  {
    image: m31,
    catalog: 'M31',
    name: 'Andromeda Galaxy',
    type: 'Spiral galaxy · Andromeda',
    alt: 'The Andromeda Galaxy, a large tilted spiral with dark dust lanes, with two small companion galaxies',
    note: 'With its satellite galaxies M32 (right) and M110 (top left).',
  },
];
