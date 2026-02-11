import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/UserHeader.css";

export default function UserHeader() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return navigate("/");
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="user-header">
      <div className="user-header__left" onClick={() => navigate("/")}>
        <img className="user-header__logo" src="/Spotify_logo.png" alt="Spotify" />
        <div className="user-header__title">Spotify Users</div>
      </div>

      <form className="user-header__search" onSubmit={submit}>
        <input
          className="user-header__input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar artista, álbum o canción..."
          aria-label="Buscar"
        />
        <button className="user-header__btn" type="submit">
          Buscar
        </button>
      </form>
    </header>
  );
}
