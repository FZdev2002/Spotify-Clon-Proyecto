import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGenres } from "../services/musicService";
import type { Genre } from "../services/types";
import { resolveMediaUrl } from "../utils/media";
import "../styles/UserPages.css";

export default function GenresPage() {
  const nav = useNavigate();
  const [items, setItems] = useState<Genre[]>([]);

  useEffect(() => {
    getGenres().then(setItems);
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="top">
          <h2 className="title">Géneros</h2>
          <span className="badge">{items.length} items</span>
        </div>

        <div className="grid">
          {items.map((g) => {
            const img = resolveMediaUrl(g.image);
            return (
              <div key={g.id} className="card" onClick={() => nav(`/genres/${g.id}/artists`)}>
                <img className="thumb" src={img || "/placeholder.png"} alt={g.name} />
                <div className="card-name">{g.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
