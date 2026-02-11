import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api/axios";
import {createGenre, deleteGenre, getGenres, updateGenre, type Genre} from "../../services/genreService";
import AdminHeader from "../../components/AdminHeader";
import "../../styles/AdminPages.css";

export default function GenresCrud() {
  const [items, setItems] = useState<Genre[]>([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  const resolveMediaUrl = (path: string) => {
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/media/")) return `${API_BASE_URL}${path}`;
    if (path.startsWith("media/")) return `${API_BASE_URL}/${path}`;
    return `${API_BASE_URL}/media/${path.replace(/^\/+/, "")}`;
  };

  const load = async () => {
    const data = await getGenres();
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!name.trim()) return;

    const fd = new FormData();
    fd.append("name", name.trim());
    if (file) fd.append("image", file);

    if (editId) await updateGenre(editId, fd);
    else await createGenre(fd);

    setName("");
    setFile(null);
    setEditId(null);
    await load();
  };

  const cancelEdit = () => {
    setEditId(null);
    setName("");
    setFile(null);
  };

  const onEdit = (g: Genre) => {
    setName(g.name);
    setEditId(g.id);
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id: number) => {
    if (!confirm("¿Eliminar este género?")) return;
    await deleteGenre(id);
    await load();
  };

  return (
    <>
      <AdminHeader />

      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-top">
            <h2 className="admin-title">Géneros</h2>
            <span className="admin-badge">{items.length} items</span>
          </div>

          <div className="admin-card">
            <div className="admin-card-title">
              {editId ? "Editar género" : "Crear género"}
            </div>

            <div className="admin-form-row">
              <div className="admin-field">
                <label className="admin-label" htmlFor="genre-name">
                  Nombre
                </label>
                <input
                  id="genre-name"
                  name="genreName"
                  className="admin-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Rock, Pop, Reggaeton..."
                />
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor="genre-image">
                  Imagen
                </label>
                <input
                  id="genre-image"
                  name="genreImage"
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

          <div className="admin-card">
            <div className="admin-card-title">Listado</div>

            <div className="admin-list">
              {items.map((g) => {
                const imgUrl = g.image ? resolveMediaUrl(g.image) : null;

                return (
                  <div key={g.id} className="admin-item">
                    {imgUrl ? (
                      <img className="admin-thumb" src={imgUrl} alt={g.name} />
                    ) : (
                      <div className="admin-thumb-fallback">🎵</div>
                    )}

                    <div className="admin-item-info">
                      <div className="admin-item-name">{g.name}</div>
                      <div className="admin-item-meta">ID: {g.id}</div>
                    </div>

                    <div className="admin-item-actions">
                      <button
                        className="admin-btn admin-btn-secondary"
                        onClick={() => onEdit(g)}
                      >
                        Editar
                      </button>
                      <button
                        className="admin-btn admin-btn-danger"
                        onClick={() => onDelete(g.id)}
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
