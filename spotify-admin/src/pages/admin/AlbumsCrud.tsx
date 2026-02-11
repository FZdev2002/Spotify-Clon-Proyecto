import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api/axios";
import AdminHeader from "../../components/AdminHeader";
import "../../styles/AdminPages.css";

import {
  createAlbum,
  deleteAlbum,
  getAlbums,
  updateAlbum,
  type Album,
} from "../../services/albumService";

import { getArtists, type Artist } from "../../services/artistService";

export default function AlbumsCrud() {
  const [items, setItems] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);

  const [title, setTitle] = useState("");
  const [artistId, setArtistId] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const resolveMediaUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/media/")) return `${API_BASE_URL}${path}`;
    if (path.startsWith("media/")) return `${API_BASE_URL}/${path}`;
    return `${API_BASE_URL}/media/${path.replace(/^\/+/, "")}`;
  };

  const load = async () => {
    const [albumsData, artistsData] = await Promise.all([getAlbums(), getArtists()]);
    setItems(albumsData);
    setArtists(artistsData);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!title.trim()) return;
    if (artistId === "") return;

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("artist", String(artistId));
    if (file) fd.append("image", file);

    if (editId) await updateAlbum(editId, fd);
    else await createAlbum(fd);

    setTitle("");
    setArtistId("");
    setFile(null);
    setEditId(null);
    await load();
  };

  const onEdit = (a: Album) => {
    setEditId(a.id);
    setTitle(a.title);
    setArtistId(a.artist);
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setTitle("");
    setArtistId("");
    setFile(null);
  };

  const onDelete = async (id: number) => {
    if (!confirm("¿Eliminar este álbum?")) return;
    await deleteAlbum(id);
    await load();
  };

  const getArtistName = (id: number) =>
    artists.find((x) => x.id === id)?.name ?? `Artist #${id}`;

  return (
    <>
      <AdminHeader />

      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-top">
            <h2 className="admin-title">Albums</h2>
            <span className="admin-badge">{items.length} items</span>
          </div>

          {/* FORM */}
          <div className="admin-card">
            <div className="admin-card-title">
              {editId ? "Editar álbum" : "Crear álbum"}
            </div>

            <div className="admin-form-grid">
              <div className="admin-field">
                <label className="admin-label" htmlFor="album-title">
                  Título
                </label>
                <input
                  id="album-title"
                  name="albumTitle"
                  className="admin-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Greatest Hits..."
                />
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="album-artist">
                  Artista
                </label>
                <select
                  id="album-artist"
                  name="albumArtist"
                  className="admin-select"
                  value={artistId}
                  onChange={(e) =>
                    setArtistId(e.target.value ? Number(e.target.value) : "")
                  }
                >
                  <option value="">Selecciona artista...</option>
                  {artists.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="album-image">
                  Imagen
                </label>
                <input
                  id="album-image"
                  name="albumImage"
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
                    onClick={cancelEdit}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* LIST */}
          <div className="admin-card">
            <div className="admin-card-title">Listado</div>

            <div className="admin-list">
              {items.map((a) => {
                const imgUrl = a.image ? resolveMediaUrl(a.image) : null;

                return (
                  <div key={a.id} className="admin-item">
                    {imgUrl ? (
                      <img className="admin-thumb" src={imgUrl} alt={a.title} />
                    ) : (
                      <div className="admin-thumb-fallback">💿</div>
                    )}

                    <div className="admin-item-info">
                      <div className="admin-item-name">{a.title}</div>
                      <div className="admin-item-meta">
                        Artista: {getArtistName(a.artist)} · ID: {a.id}
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
