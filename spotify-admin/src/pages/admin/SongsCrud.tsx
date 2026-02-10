import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../api/axios";
import AdminHeader from "../../components/AdminHeader";
import "../../styles/SongsCrud.css";

import { getAlbums, type Album } from "../../services/albumService";
import {
  createSong,
  deleteSong,
  getSongs,
  updateSong,
  type Song,
} from "../../services/songService";

export default function SongsCrud() {
  const [items, setItems] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);

  const [title, setTitle] = useState("");
  const [albumId, setAlbumId] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const resolveMediaUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/media/")) return `${API_BASE_URL}${path}`;
    if (path.startsWith("media/")) return `${API_BASE_URL}/${path}`;
    return `${API_BASE_URL}/media/${path.replace(/^\/+/, "")}`;
  };

  const albumNameById = useMemo(() => {
    const map = new Map<number, string>();
    albums.forEach((a) => map.set(a.id, a.title));
    return map;
  }, [albums]);

  const load = async () => {
    const [songsData, albumsData] = await Promise.all([getSongs(), getAlbums()]);
    setItems(songsData);
    setAlbums(albumsData);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setTitle("");
    setAlbumId("");
    setFile(null);
    setEditId(null);
  };

  const submit = async () => {
    if (!title.trim()) return alert("Título requerido");
    if (!albumId) return alert("Selecciona un álbum");

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("album", String(albumId));
    if (file) fd.append("audio", file);

    if (editId) await updateSong(editId, fd);
    else await createSong(fd);

    resetForm();
    await load();
  };

  const onEdit = (s: Song) => {
    setEditId(s.id);
    setTitle(s.title);
    setAlbumId(s.album);
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta canción?")) return;
    await deleteSong(id);
    await load();
  };

  return (
    <>
      <AdminHeader />

      <div className="songs-page">
        <div className="songs-container">
          <div className="songs-top">
            <h2 className="songs-title">Música</h2>
            <span className="songs-badge">{items.length} items</span>
          </div>

          <div className="card">
            <div className="card-title">
              {editId ? "Editar canción" : "Crear canción"}
            </div>

            <div className="form-grid">
              <div className="field">
                <label className="label" htmlFor="song-title">
                  Título
                </label>
                <input
                  id="song-title"
                  name="songTitle"
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Blinding Lights..."
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="song-album">
                  Álbum
                </label>
                <select
                  id="song-album"
                  name="songAlbum"
                  className="select"
                  value={albumId}
                  onChange={(e) =>
                    setAlbumId(e.target.value ? Number(e.target.value) : "")
                  }
                >
                  <option value="">Selecciona álbum...</option>
                  {albums.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="label" htmlFor="song-audio">
                  Audio (mp3)
                </label>
                <input
                  id="song-audio"
                  name="songAudio"
                  className="file"
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <div className="actions-row">
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

          <div className="card">
            <div className="card-title">Listado</div>

            <div className="list">
              {items.map((s) => {
                const audioUrl = s.audio ? resolveMediaUrl(s.audio) : "";

                return (
                  <div key={s.id} className="item">
                    <div className="thumb-fallback">🎵</div>

                    <div className="item-info">
                      <div className="item-name">{s.title}</div>
                      <div className="item-meta">
                        ID: {s.id} · Álbum: {albumNameById.get(s.album) ?? s.album}
                      </div>

                      {audioUrl && (
                        <audio controls preload="none" style={{ width: "100%", marginTop: 8 }}>
                          <source src={audioUrl} />
                        </audio>
                      )}
                    </div>

                    <div className="actions">
                      <button className="btn btn-secondary" onClick={() => onEdit(s)}>
                        Editar
                      </button>
                      <button className="btn btn-danger" onClick={() => onDelete(s.id)}>
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
