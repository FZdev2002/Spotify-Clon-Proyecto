import { useNavigate } from "react-router-dom";
import { logout } from "../auth/AuthService";
import "../styles/AdminHeader.css";

export default function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <img className="admin-header__logo" src="/Spotify_logo.png" alt="Spotify" />
        <div>
          <div className="admin-header__title">Admin</div>
          <div className="admin-header__subtitle">Panel de gestión</div>
        </div>
      </div>

      <button className="admin-header__logout" onClick={handleLogout}>
        Log out
      </button>
    </header>
  );
}
