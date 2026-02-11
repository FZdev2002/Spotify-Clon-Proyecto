import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSongsByAlbum, getAlbum } from "../services/musicService";
import type { Song, Album } from "../services/types";
import { resolveMediaUrl } from "../utils/media";
import "../styles/UserPages.css";

export default function SongsPage() {

  const { albumId } = useParams();
  const aid = Number(albumId);

  const [songs, setSongs] = useState<Song[]>([]);
  const [album, setAlbum] = useState<Album | null>(null);
  const [activeSong, setActiveSong] = useState<Song | null>(null);

  useEffect(() => {

    if (!aid) return;

    getSongsByAlbum(aid).then(setSongs);
    getAlbum(aid).then(setAlbum);

  }, [aid]);

  return (
    <div className="page">
      <div className="container">

        {album && (
          <div className="album-header card">

            <img
              src={resolveMediaUrl(album.image)}
              className="album-cover"
            />

            <div className="album-info">

              <h2 className="title">{album.title}</h2>

              {album.artist_name && (
                <div className="artist-row">

                  {album.artist_image && (
                    <img
                      src={resolveMediaUrl(album.artist_image)}
                      className="artist-thumb"
                    />
                  )}

                  <div className="muted">
                    Artista: {album.artist_name}
                  </div>

                </div>
              )}

              <div className="badge">
                {songs.length} canciones
              </div>

            </div>


          </div>
        )}

        <div className="songs-list">

          {songs.map((s) => {

            const isActive = activeSong?.id === s.id;

            return (
              <div
                key={s.id}
                className={`card song-card ${isActive ? "active-song" : ""}`}
                onClick={() => setActiveSong(s)}
              >

                <div className="card-name">{s.title}</div>

                {isActive && (
                  <audio
                    controls
                    autoPlay
                    className="song-player"
                  >
                    <source src={resolveMediaUrl(s.audio)} />
                  </audio>
                )}

              </div>
            );
          })}

        </div>

      </div>
    </div>
  );
}
