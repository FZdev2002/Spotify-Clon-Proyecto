import { Navigate } from "react-router-dom";
import { isLoggedIn } from "./AuthService";
import type { JSX } from "react";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  return children;
}
