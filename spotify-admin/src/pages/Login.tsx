import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../auth/AuthService";
import "../styles/Login.css";

export default function Login() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await login(username, password);
      nav("/admin/genres");
    } catch {
      setErr("Usuario o contraseña incorrectos.");
    }
  };

  return (
  <div className="login-page">
    <img
      className="login-logo"
      src="/Spotify_logo.png"
      alt="Spotify"
    />

    <div className="login-card">

      <h2 className="login-title">Admin Login</h2>
      <div className="login-subtitle">
        Accede al panel de administración
      </div>

      <form className="login-form" onSubmit={onSubmit}>
        <div>
          <label className="login-label">Username</label>
          <input
            className="login-input"
            placeholder="Tu usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="login-label">Password</label>
          <input
            className="login-input"
            placeholder="Tu contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" type="submit">
          Entrar
        </button>

        {err && <div className="login-error">{err}</div>}
      </form>

    </div>
  </div>
);
}