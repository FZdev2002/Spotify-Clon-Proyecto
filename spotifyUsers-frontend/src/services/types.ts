export type Genre = { id: number; name: string; image?: string | null };
export type Artist = { id: number; name: string; image?: string | null; genre: number };
export type Album = { id: number; title: string; image?: string | null; artist: number, artist_name?: string; artist_image?: string | null; };
export type Song = { id: number; title: string; audio?: string | null; album: number, album_title?: string; };

export type SearchResponse = {
  artists: Artist[];
  albums: Album[];
  songs: Song[];
};
