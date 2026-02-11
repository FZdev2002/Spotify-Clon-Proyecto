import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserHeader from "./components/UserHeader";
import GenresPage from "./pages/GenresPage";
import ArtistsPage from "./pages/ArtistsPage";
import AlbumsPage from "./pages/AlbumsPage";
import SongsPage from "./pages/SongsPage";
import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <BrowserRouter>
      <UserHeader />

      <Routes>
        <Route path="/" element={<GenresPage />} />
        <Route path="/genres/:genreId/artists" element={<ArtistsPage />} />
        <Route path="/artists/:artistId/albums" element={<AlbumsPage />} />
        <Route path="/albums/:albumId/songs" element={<SongsPage />} />
        <Route path="/search" element={<SearchPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
