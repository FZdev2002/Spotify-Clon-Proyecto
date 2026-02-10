import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api/axios";
import {
  createGenre,
  deleteGenre,
  getGenres,
  updateGenre,
  type Genre,
} from "../../services/genreService";
import AdminHeader from "../../components/AdminHeader";
import "../../styles/GenresCrud.css";

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

      <div className="genres-page">
        <div className="genres-container">
          <div className="genres-top">
            <h2 className="genres-title">Géneros</h2>
            <span className="genres-badge">{items.length} items</span>
          </div>

          <div className="card">
            <div className="card-title">
              {editId ? "Editar género" : "Crear género"}
            </div>

            <div className="form-row">
              <div className="field">
                <label className="label" htmlFor="genre-name">
                  Nombre
                </label>
                <input
                  id="genre-name"
                  name="genreName"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Rock, Pop, Reggaeton..."
                />
              </div>

              <div className="field">
                <label className="label" htmlFor="genre-image">
                  Imagen
                </label>
                <input
                  id="genre-image"
                  name="genreImage"
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
              {items.map((g) => {
                const imgUrl = g.image ? resolveMediaUrl(g.image) : null;

                return (
                  <div key={g.id} className="item">
                    {imgUrl ? (
                      <img className="thumb" src={imgUrl} alt={g.name} />
                    ) : (
                      <div className="thumb-fallback">🎵</div>
                    )}

                    <div className="item-info">
                      <div className="item-name">{g.name}</div>
                      <div className="item-meta">ID: {g.id}</div>
                    </div>

                    <div className="actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => onEdit(g)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
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
