// Radio appearances on CKUT 90.3 FM. Add a line per episode; the site works
// out which is "previous" and which is "next" (or on air) from the clock, so
// nothing needs rebuilding when a show ends.
//
// Times are Montréal local time (24h). `archive` is optional: CKUT names its
// archive MP3s after the air time, so it's derived from date/start/end.

export interface Episode {
  show: string;
  date: string;      // YYYY-MM-DD
  start: string;     // HH:MM, Montréal time
  end: string;       // HH:MM, Montréal time
  playlist?: string; // CKUT playlist page for this episode
  showPage?: string; // CKUT page for the show
  archive?: string;  // override the derived archive MP3 URL
}

export const RADIO = {
  name: 'On the',
  nameAccent: 'airwaves',
  station: 'CKUT 90.3 FM · Montréal',
  blurb: 'Freeform radio on CKUT 90.3 FM, Montréal’s campus and community station.',
  liveStream: 'https://delray.ckut.ca:8001/903fm-192-stereo',
  stationUrl: 'https://ckut.ca/listen-live/',
};

export const EPISODES: Episode[] = [
  {
    show: 'New Shit',
    date: '2026-09-11',
    start: '15:00',
    end: '17:00',
    playlist: 'https://ckut.ca/playlists/shows/31296',
    showPage: 'https://ckut.ca/playlists/NS2026',
  },
  {
    show: 'Jazz Euphorium',
    date: '2026-10-21',
    start: '20:00',
    end: '22:00',
    showPage: 'https://ckut.ca/playlists/JE',
  },
];
