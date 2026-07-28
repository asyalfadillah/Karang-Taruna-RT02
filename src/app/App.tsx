import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { StoreProvider } from "./data/store";
import { PublicLayout } from "./components/site/PublicLayout";
import { HomePage } from "./pages/HomePage";
import { AlbumDetailPage } from "./pages/AlbumDetailPage";
import { DonorsPage } from "./pages/DonorsPage";
import { LoginPage } from "./pages/admin/LoginPage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { AlbumsPage } from "./pages/admin/AlbumsPage";
import { PhotosPage } from "./pages/admin/PhotosPage";
import { VideosPage } from "./pages/admin/VideosPage";
import { GalleryPage } from "./pages/admin/GalleryPage";
import { EventsPage } from "./pages/admin/EventsPage";
import { SettingsPage } from "./pages/admin/SettingsPage";
import { ProfilePage } from "./pages/admin/ProfilePage";

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/album/:id" element={<AlbumDetailPage />} />
            <Route path="/donatur" element={<DonorsPage />} />
          </Route>

          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="albums" element={<AlbumsPage />} />
            <Route path="photos" element={<PhotosPage />} />
            <Route path="videos" element={<VideosPage />} />
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </StoreProvider>
  );
}
