import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchAll } from "../services/musicService";
import type { SearchResponse, Song, Artist, Album } from "../services/types";
import { resolveMediaUrl } from "../utils/media";
import "../styles/UserPages.css";

export default function SearchPage() {

  const [params] = useSearchParams();
  const nav = useNavigate();

  const query = (params.get("q") || "").trim();

  const [data, setData] = useState<SearchResponse>({
    artists: [],
    albums: [],
    songs: [],
  });

  const [loading, setLoading] = useState(false);
  const [activeSong, setActiveSong] = useState<Song | null>(null);

  useEffect(() => {

    if (!query) return;

    setLoading(true);

    searchAll(query)
      .then((res) => setData(res))
      .finally(() => setLoading(false));

  }, [query]);

  return (
    <div className="page">
      <div className="container">

        <div className="top">
          <h2 className="title">Resultados</h2>
          <span className="badge">{query}</span>
        </div>

        {loading && <div className="muted">Buscando...</div>}

        {data.artists.length > 0 && (
          <>
            <div className="card-name">Artistas</div>

            <div className="grid">
              {data.artists.map((a: Artist) => (
                <div
                  key={a.id}
                  className="card"
                  onClick={() => nav(`/artists/${a.id}/albums`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    className="thumb"
                    src={resolveMediaUrl(a.image) || "/placeholder.png"}
                  />
                  <div className="card-name">{a.name}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {data.albums.length > 0 && (
          <>
            <div className="card-name" style={{ marginTop: 20 }}>
              Albums
            </div>

            <div className="grid">
              {data.albums.map((al: Album) => (
                <div
                  key={al.id}
                  className="card"
                  onClick={() => nav(`/albums/${al.id}/songs`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    className="thumb"
                    src={resolveMediaUrl(al.image) || "/placeholder.png"}
                  />
                  <div className="card-name">{al.title}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {data.songs.length > 0 && (
          <>
            <div className="card-name" style={{ marginTop: 20 }}>
              Canciones
            </div>

            <div style={{ display: "grid", gap: 10 }}>

              {data.songs.map((s: Song) => {

                const isActive = activeSong?.id === s.id;

                return (
                  <div
                    key={s.id}
                    className="card"
                    onClick={() => setActiveSong(s)}
                    style={{
                      cursor: "pointer",
                      border: isActive
                        ? "1px solid rgba(255,255,255,0.3)"
                        : undefined
                    }}
                  >
                    <div className="card-name">{s.title}</div>
                    <div className="muted">
                      {data.albums.find(al => al.id === s.album)?.title ?? `Album #${s.album}`}
                    </div>

                    {isActive && (
                      <audio
                        controls
                        autoPlay
                        style={{ width: "100%", marginTop: 10 }}
                      >
                        <source src={resolveMediaUrl(s.audio)} />
                      </audio>
                    )}

                  </div>
                );
              })}

            </div>
          </>
        )}

      </div>
    </div>
  );
}
