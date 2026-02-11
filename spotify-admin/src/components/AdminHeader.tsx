import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../auth/AuthService";
import "../styles/AdminHeader.css";

export default function AdminHeader() {

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const go = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (

    <header className="admin-header">

      <div className="admin-header-left">

        <img
          className="admin-header-logo"
          src="/Spotify_logo.png"
          alt="Spotify"
        />

        <div className="admin-header-titles">
          <div className="admin-header-title">Admin</div>
          <div className="admin-header-subtitle">
            Panel de gestión
          </div>
        </div>

        <nav className="admin-nav">

          <button
            className={`admin-nav-link ${isActive("/admin/genres") ? "active" : ""}`}
            onClick={() => go("/admin/genres")}
          >
            Géneros
          </button>

          <button
            className={`admin-nav-link ${isActive("/admin/artists") ? "active" : ""}`}
            onClick={() => go("/admin/artists")}
          >
            Artistas
          </button>

          <button
            className={`admin-nav-link ${isActive("/admin/albums") ? "active" : ""}`}
            onClick={() => go("/admin/albums")}
          >
            Albums
          </button>

          <button
            className={`admin-nav-link ${isActive("/admin/songs") ? "active" : ""}`}
            onClick={() => go("/admin/songs")}
          >
            Canciones
          </button>

        </nav>

      </div>

      <button
        className="admin-header-logout"
        onClick={handleLogout}
      >
        Log out
      </button>

    </header>
  );
}
