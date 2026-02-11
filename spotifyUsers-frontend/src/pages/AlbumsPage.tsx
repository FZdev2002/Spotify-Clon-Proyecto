import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAlbumsByArtist } from "../services/musicService";
import type { Album } from "../services/types";
import { resolveMediaUrl } from "../utils/media";
import "../styles/UserPages.css";

export default function AlbumsPage() {
  const nav = useNavigate();
  const { artistId } = useParams();
  const aid = Number(artistId);

  const [items, setItems] = useState<Album[]>([]);

  useEffect(() => {
    if (!aid) return;
    getAlbumsByArtist(aid).then(setItems);
  }, [aid]);

  return (
    <div className="page">
      <div className="container">
        <div className="top">
          <h2 className="title">Álbums</h2>
          <span className="badge">{items.length} items</span>
        </div>

        <div className="grid">
          {items.map((al) => {
            const img = resolveMediaUrl(al.image);
            return (
              <div key={al.id} className="card" onClick={() => nav(`/albums/${al.id}/songs`)}>
                <img className="thumb" src={img || "/placeholder.png"} alt={al.title} />
                <div className="card-name">{al.title}</div>
                <div className="muted">
                  {al.artist_name ?? `Artist #${al.artist}`}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
