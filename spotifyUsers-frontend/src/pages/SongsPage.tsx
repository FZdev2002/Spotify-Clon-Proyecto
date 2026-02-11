import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSongsByAlbum } from "../services/musicService";
import type { Song } from "../services/types";
import { resolveMediaUrl } from "../utils/media";
import "../styles/UserPages.css";

export default function SongsPage() {
  const { albumId } = useParams();
  const aid = Number(albumId);

  const [items, setItems] = useState<Song[]>([]);

  useEffect(() => {
    if (!aid) return;
    getSongsByAlbum(aid).then(setItems);
  }, [aid]);

  return (
    <div className="page">
      <div className="container">
        <div className="top">
          <h2 className="title">Canciones</h2>
          <span className="badge">{items.length} items</span>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {items.map((s) => {
            const audioUrl = resolveMediaUrl(s.audio);
            return (
              <div key={s.id} className="card" style={{ cursor: "default" }}>
                <div className="card-name">{s.title}</div>
                <div className="muted">ID: {s.id}</div>

                {audioUrl ? (
                  <audio controls style={{ width: "100%", marginTop: 10 }}>
                    <source src={audioUrl} />
                  </audio>
                ) : (
                  <div className="muted" style={{ marginTop: 8 }}>
                    (Sin audio)
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
