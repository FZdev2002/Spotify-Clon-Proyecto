import api from "../api/axios";

export type Artist = {
  id: number;
  name: string;
  image: string | null;
  genre: number;
};

export const getArtists = async (): Promise<Artist[]> => {
  const res = await api.get("/api/artists/");
  return res.data;
};

export const createArtist = async (fd: FormData): Promise<Artist> => {
  const res = await api.post("/api/artists/", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateArtist = async (id: number, fd: FormData): Promise<Artist> => {
  const res = await api.put(`/api/artists/${id}/`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteArtist = async (id: number): Promise<void> => {
  await api.delete(`/api/artists/${id}/`);
};
