import api from "../api/axios";

export type Album = {
  id: number;
  title: string;
  image: string | null;
  artist: number;
};

export const getAlbums = async (): Promise<Album[]> => {
  const res = await api.get("/api/albums/");
  return res.data;
};

export const createAlbum = async (data: FormData) => {
  const res = await api.post("/api/albums/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateAlbum = async (id: number, data: FormData) => {
  const res = await api.put(`/api/albums/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteAlbum = async (id: number) => {
  await api.delete(`/api/albums/${id}/`);
};
