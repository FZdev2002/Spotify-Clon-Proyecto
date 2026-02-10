import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api/axios";
import AdminHeader from "../../components/AdminHeader";
import "../../styles/AlbumsCrud.css";

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
    const [albumsData, artistsData] = await Promise.all([
      getAlbums(),
      getArtists(),
    ]);
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

      <div className="albums-page">
        <div className="albums-container">
          <div className="albums-top">
            <h2 className="albums-title">Albums</h2>
            <span className="albums-badge">{items.length} items</span>
          </div>

          <div className="card">
            <div className="card-title">
              {editId ? "Editar álbum" : "Crear álbum"}
            </div>

            <div className="form-grid">
              <div className="field">
                <label className="label" htmlFor="album-title">
                  Título
                </label>
                <input
                  id="album-title"
                  name="albumTitle"
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Greatest Hits..."
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="album-artist">
                  Artista
                </label>
                <select
                  id="album-artist"
                  name="albumArtist"
                  className="select"
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

              <div className="field">
                <label className="label" htmlFor="album-image">
                  Imagen
                </label>
                <input
                  id="album-image"
                  name="albumImage"
                  className="file"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <div className="actions-row">
                <button className="btn btn-primary" onClick={submit}>
                  {editId ? "Actualizar" : "Crear"}
                </button>

                {editId && (
                  <button className="btn btn-secondary" onClick={cancelEdit}>
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Listado</div>

            <div className="list">
              {items.map((a) => {
                const imgUrl = a.image ? resolveMediaUrl(a.image) : null;

                return (
                  <div key={a.id} className="item">
                    {imgUrl ? (
                      <img className="thumb" src={imgUrl} alt={a.title} />
                    ) : (
                      <div className="thumb-fallback">💿</div>
                    )}

                    <div style={{ flex: 1 }}>
                      <div className="item-name">{a.title}</div>
                      <div className="item-meta">
                        Artista: {getArtistName(a.artist)} · ID: {a.id}
                      </div>
                    </div>

                    <div className="item-actions">
                      <button className="btn btn-secondary" onClick={() => onEdit(a)}>
                        Editar
                      </button>
                      <button className="btn btn-danger" onClick={() => onDelete(a.id)}>
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
