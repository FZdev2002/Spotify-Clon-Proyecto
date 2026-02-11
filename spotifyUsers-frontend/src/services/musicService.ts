import api from "../api/axios";
import type { Album, Artist, Genre, Song, SearchResponse } from "./types";

export async function getGenres(): Promise<Genre[]> {
  const { data } = await api.get("genres/");
  return data;
}

export async function getArtistsByGenre(genreId: number): Promise<Artist[]> {
  const { data } = await api.get("artists/", { params: { genre: genreId } });
  return data;
}

export async function getAlbumsByArtist(artistId: number): Promise<Album[]> {
  const { data } = await api.get("albums/", { params: { artist: artistId } });
  return data;
}

export async function getSongsByAlbum(albumId: number): Promise<Song[]> {
  const { data } = await api.get("songs/", { params: { album: albumId } });
  return data;
}

export async function searchAll(query: string): Promise<SearchResponse> {
  const { data } = await api.get("search/", { params: { query } });
  return data;
}
