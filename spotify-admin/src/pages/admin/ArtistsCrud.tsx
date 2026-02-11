import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../api/axios";
import AdminHeader from "../../components/AdminHeader";
import "../../styles/AdminPages.css";
import { getGenres, type Genre } from "../../services/genreService";
import {createArtist, deleteArtist, getArtists, updateArtist, type Artist} from "../../services/artistService";

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

      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-top">
            <h2 className="admin-title">Artistas</h2>
            <span className="admin-badge">{artists.length} items</span>
          </div>

          <div className="admin-card">
            <div className="admin-card-title">
              {editId ? "Editar artista" : "Crear artista"}
            </div>

            <div className="admin-form-grid">
              <div className="admin-field">
                <label className="admin-label" htmlFor="artist-name">
                  Nombre
                </label>
                <input
                  id="artist-name"
                  name="artistName"
                  className="admin-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Bad Bunny, Queen..."
                  autoComplete="off"
                />
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="artist-genre">
                  Género
                </label>
                <select
                  id="artist-genre"
                  name="artistGenre"
                  className="admin-select"
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

              <div className="admin-field">
                <label className="admin-label" htmlFor="artist-image">
                  Imagen
                </label>
                <input
                  id="artist-image"
                  name="artistImage"
                  className="admin-file"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <div className="admin-actions">
                <button className="admin-btn admin-btn-primary" onClick={submit}>
                  {editId ? "Actualizar" : "Crear"}
                </button>

                {editId && (
                  <button
                    className="admin-btn admin-btn-secondary"
                    onClick={resetForm}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-title">Listado</div>

            <div className="admin-list">
              {artists.map((a) => {
                const imgUrl = a.image ? resolveMediaUrl(a.image) : "";

                return (
                  <div key={a.id} className="admin-item">
                    {imgUrl ? (
                      <img className="admin-thumb" src={imgUrl} alt={a.name} />
                    ) : (
                      <div className="admin-thumb-fallback">👤</div>
                    )}

                    <div className="admin-item-info">
                      <div className="admin-item-name">{a.name}</div>
                      <div className="admin-item-meta">
                        ID: {a.id} · Género: {genreNameById.get(a.genre) ?? a.genre}
                      </div>
                    </div>

                    <div className="admin-item-actions">
                      <button
                        className="admin-btn admin-btn-secondary"
                        onClick={() => onEdit(a)}
                      >
                        Editar
                      </button>
                      <button
                        className="admin-btn admin-btn-danger"
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
