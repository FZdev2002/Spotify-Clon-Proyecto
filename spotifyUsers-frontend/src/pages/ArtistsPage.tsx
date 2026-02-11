import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArtistsByGenre } from "../services/musicService";
import type { Artist } from "../services/types";
import { resolveMediaUrl } from "../utils/media";
import "../styles/UserPages.css";

export default function ArtistsPage() {
  const nav = useNavigate();
  const { genreId } = useParams();
  const gid = Number(genreId);

  const [items, setItems] = useState<Artist[]>([]);

  useEffect(() => {
    if (!gid) return;
    getArtistsByGenre(gid).then(setItems);
  }, [gid]);

  return (
    <div className="page">
      <div className="container">
        <div className="top">
          <h2 className="title">Artistas</h2>
          <span className="badge">{items.length} items</span>
        </div>

        <div className="grid">
          {items.map((a) => {
            const img = resolveMediaUrl(a.image);
            return (
              <div key={a.id} className="card" onClick={() => nav(`/artists/${a.id}/albums`)}>
                <img className="thumb" src={img || "/placeholder.png"} alt={a.name} />
                <div className="card-name">{a.name}</div>
                <div className="muted">ID: {a.id}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
