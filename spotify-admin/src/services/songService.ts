import api from "../api/axios";

export type Song = {
  id: number;
  title: string;
  album: number;
  audio?: string | null;
};

export const getSongs = async (): Promise<Song[]> => {
  const res = await api.get("api/songs/");
  return res.data;
};

export const createSong = async (fd: FormData) => {
  const res = await api.post("api/songs/", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateSong = async (id: number, fd: FormData) => {
  const res = await api.patch(`api/songs/${id}/`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteSong = async (id: number) => {
  await api.delete(`api/songs/${id}/`);
};
