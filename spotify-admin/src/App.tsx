import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import RequireAuth from "./auth/RequireAuth";
import { isLoggedIn } from "./auth/AuthService";
import ArtistsCrud from "./pages/admin/ArtistsCrud";
import GenresCrud from "./pages/admin/GenresCrud";
import AlbumsCrud from "./pages/admin/AlbumsCrud";
import SongsCrud from "./pages/admin/SongsCrud";

<Route
  path="/admin/albums"
  element={
    <RequireAuth>
      <AlbumsCrud />
    </RequireAuth>
  }
/>

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn() ? (
              <Navigate to="/admin/genres" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/genres"
          element={
            <RequireAuth>
              <GenresCrud />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/artists"
          element={
            <RequireAuth>
              <ArtistsCrud />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/albums"
          element={
            <RequireAuth>
              <AlbumsCrud />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/songs"
          element={
            <RequireAuth>
              <SongsCrud />
            </RequireAuth>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
