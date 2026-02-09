import api from "../api/axios";

export type Genre = { id: number; name: string; image: string | null };

export async function getGenres() {
  const res = await api.get<Genre[]>("/api/genres/");
  return res.data;
}

export async function createGenre(data: FormData) {
  const res = await api.post("/api/genres/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateGenre(id: number, data: FormData) {
  const res = await api.put(`/api/genres/${id}/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteGenre(id: number) {
  await api.delete(`/api/genres/${id}/`);
}
