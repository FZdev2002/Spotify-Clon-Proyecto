import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../auth/AuthService";

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
    <div style={{ maxWidth: 420, margin: "60px auto" }}>
      <h2>Admin Login</h2>
      <form onSubmit={onSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 10 }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 10 }}
        />
        <button style={{ width: "100%", padding: 10, marginTop: 12 }}>
          Entrar
        </button>
        {err && <p style={{ color: "tomato" }}>{err}</p>}
      </form>
    </div>
  );
}
