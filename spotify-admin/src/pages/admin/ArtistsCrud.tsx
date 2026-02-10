import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../api/axios";
import AdminHeader from "../../components/AdminHeader";
import "../../styles/ArtistsCrud.css";

import { getGenres, type Genre } from "../../services/genreService";
import {
  createArtist,
  deleteArtist,
  getArtists,
  updateArtist,
  type Artist,
} from "../../services/artistService";

export default function ArtistsCrud() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  const [name, setName] = useState("");
  const [genreId, setGenreId] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const resolveMediaUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/media/")) return `${API_BASE_URL}${path}`;
    if (path.startsWith("media/")) return `${API_BASE_URL}/${path}`;
    return `${API_BASE_URL}/media/${path.replace(/^\/+/, "")}`;
  };

  const genreNameById = useMemo(() => {
    const map = new Map<number, string>();
    genres.forEach((g) => map.set(g.id, g.name));
    return map;
  }, [genres]);

  const load = async () => {
    const [g, a] = await Promise.all([getGenres(), getArtists()]);
    setGenres(g);
    setArtists(a);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setName("");
    setGenreId("");
    setFile(null);
    setEditId(null);
  };

  const submit = async () => {
    if (!name.trim()) return alert("Nombre requerido");
    if (!genreId) return alert("Selecciona un género");

    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("genre", String(genreId));
    if (file) fd.append("image", file);

    if (editId) await updateArtist(editId, fd);
    else await createArtist(fd);

    resetForm();
    await load();
  };

  const onEdit = (a: Artist) => {
    setEditId(a.id);
    setName(a.name);
    setGenreId(a.genre);
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id: number) => {
    if (!confirm("¿Eliminar este artista?")) return;
    await deleteArtist(id);
    await load();
  };

  return (
    <>
      <AdminHeader />

      <div className="artists-page">
        <div className="artists-container">
          <div className="artists-top">
            <h2 className="artists-title">Artistas</h2>
            <span className="artists-badge">{artists.length} items</span>
          </div>

          {/* FORM */}
          <div className="card">
            <div className="card-title">
              {editId ? "Editar artista" : "Crear artista"}
            </div>

            <div className="form-grid">
              <div className="field">
                <label className="label" htmlFor="artist-name">
                  Nombre
                </label>
                <input
                  id="artist-name"
                  name="artistName"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Bad Bunny, Queen..."
                  autoComplete="off"
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="artist-genre">
                  Género
                </label>
                <select
                  id="artist-genre"
                  name="artistGenre"
                  className="select"
                  value={genreId}
                  onChange={(e) =>
                    setGenreId(e.target.value ? Number(e.target.value) : "")
                  }
                >
                  <option value="">-- Selecciona --</option>
                  {genres.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="label" htmlFor="artist-image">
                  Imagen
                </label>
                <input
                  id="artist-image"
                  name="artistImage"
                  className="file"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <div className="form-actions">
                <button className="btn btn-primary" onClick={submit}>
                  {editId ? "Actualizar" : "Crear"}
                </button>

                {editId && (
                  <button className="btn btn-secondary" onClick={resetForm}>
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* LIST */}
          <div className="card">
            <div className="card-title">Listado</div>

            <div className="list">
              {artists.map((a) => {
                const imgUrl = a.image ? resolveMediaUrl(a.image) : "";

                return (
                  <div key={a.id} className="item">
                    {imgUrl ? (
                      <img className="thumb" src={imgUrl} alt={a.name} />
                    ) : (
                      <div className="thumb-fallback">👤</div>
                    )}

                    <div className="item-info">
                      <div className="item-name">{a.name}</div>
                      <div className="item-meta">
                        ID: {a.id} · Género:{" "}
                        {genreNameById.get(a.genre) ?? a.genre}
                      </div>
                    </div>

                    <div className="actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => onEdit(a)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => onDelete(a.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
