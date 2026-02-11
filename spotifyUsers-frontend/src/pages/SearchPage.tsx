import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchAll } from "../services/musicService";
import type { SearchResponse } from "../services/types";
import "../styles/UserPages.css";

export default function SearchPage() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const q = (params.get("q") ?? "").trim();

  const [data, setData] = useState<SearchResponse>({ artists: [], albums: [], songs: [] });

  useEffect(() => {
    if (!q) return;
    searchAll(q).then(setData);
  }, [q]);

  return (
    <div className="page">
      <div className="container">
        <div className="top">
          <h2 className="title">Resultados</h2>
          <span className="badge">"{q}"</span>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <div>
            <div className="card-name">Artistas</div>
            <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
              {data.artists.map((a) => (
                <div key={a.id} className="card" onClick={() => nav(`/artists/${a.id}/albums`)}>
                  <div className="card-name">{a.name}</div>
                  <div className="muted">ID: {a.id}</div>
                </div>
              ))}
              {data.artists.length === 0 && <div className="muted">Sin resultados</div>}
            </div>
          </div>

          <div>
            <div className="card-name">Álbums</div>
            <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
              {data.albums.map((al) => (
                <div key={al.id} className="card" onClick={() => nav(`/albums/${al.id}/songs`)}>
                  <div className="card-name">{al.title}</div>
                  <div className="muted">ID: {al.id}</div>
                </div>
              ))}
              {data.albums.length === 0 && <div className="muted">Sin resultados</div>}
            </div>
          </div>

          <div>
            <div className="card-name">Canciones</div>
            <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
              {data.songs.map((s) => (
                <div key={s.id} className="card" style={{ cursor: "default" }}>
                  <div className="card-name">{s.title}</div>
                  <div className="muted">ID: {s.id}</div>
                </div>
              ))}
              {data.songs.length === 0 && <div className="muted">Sin resultados</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
