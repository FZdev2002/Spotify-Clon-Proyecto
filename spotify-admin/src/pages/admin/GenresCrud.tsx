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


export default function GenresCrud() {
  const [items, setItems] = useState<Genre[]>([]);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [editId, setEditId] = useState<number | null>(null);

  const load = async () => setItems(await getGenres());

  useEffect(() => { load(); }, []);

  const submit = async () => {
    const fd = new FormData();
    fd.append("name", name);
    if (file) fd.append("image", file);

    if (editId) await updateGenre(editId, fd);
    else await createGenre(fd);

    setName("");
    setFile(null);
    setEditId(null);
    await load();
  };

  const onEdit = (g: Genre) => {
    setName(g.name);
    setEditId(g.id);
    setFile(null);
  };

  const onDelete = async (id: number) => {
    await deleteGenre(id);
    await load();
  };

  return (
  <>
    <AdminHeader />

    <div style={{ maxWidth: 900, margin: "30px auto" }}>
      <h2>Admin - Géneros</h2>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del género"
          style={{ flex: 1, padding: 10 }}
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button onClick={submit} style={{ padding: "10px 16px" }}>
          {editId ? "Actualizar" : "Crear"}
        </button>
      </div>

      <ul style={{ marginTop: 20 }}>
        {items.map((g) => (
          <li
            key={g.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: 10,
            }}
          >
            {g.image && (
              <img
                src={`${API_BASE_URL}${g.image}`}
                alt={g.name}
                style={{
                  width: 50,
                  height: 50,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            )}
            <strong style={{ flex: 1 }}>{g.name}</strong>
            <button onClick={() => onEdit(g)}>Editar</button>
            <button onClick={() => onDelete(g.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  </>
);
}
