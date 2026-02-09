import { useNavigate } from "react-router-dom";
import { logout } from "../auth/AuthService";

export default function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();           // borra tokens
    navigate("/login"); // redirige al login
  };

  return (
    <header
      style={{
        width: "100%",
        padding: "15px 25px",
        background: "#111",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      }}
    >
      <h3 style={{ margin: 0 }}>Spotify Admin</h3>

      <button
        onClick={handleLogout}
        style={{
          padding: "8px 14px",
          background: "#e11d48",
          border: "none",
          color: "white",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Log out
      </button>
    </header>
  );
}
