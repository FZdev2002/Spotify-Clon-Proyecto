import api from "../api/axios";

type TokenResponse = { access: string; refresh: string };

export async function login(username: string, password: string) {
  const res = await api.post<TokenResponse>("/api/token/", { username, password });
  localStorage.setItem("access_token", res.data.access);
  localStorage.setItem("refresh_token", res.data.refresh);
  return res.data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem("access_token"));
}
