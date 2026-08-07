import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import { StoreProvider } from "./data/store";
import { PublicLayout } from "./components/site/PublicLayout";
import { HomePage } from "./pages/HomePage";

// Halaman non-utama & seluruh area admin di-load "on demand" (code splitting).
// Ini bikin pengunjung biasa yang cuma buka Beranda gak perlu download kode
// admin (form CRUD, Firebase, chart, dll) yang gak mereka butuhkan sama sekali.
const AlbumDetailPage = lazy(() => import("./pages/AlbumDetailPage").then((m) => ({ default: m.AlbumDetailPage })));
const DonorsPage = lazy(() => import("./pages/DonorsPage").then((m) => ({ default: m.DonorsPage })));
const LoginPage = lazy(() => import("./pages/admin/LoginPage").then((m) => ({ default: m.LoginPage })));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout").then((m) => ({ default: m.AdminLayout })));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const AlbumsPage = lazy(() => import("./pages/admin/AlbumsPage").then((m) => ({ default: m.AlbumsPage })));
const PhotosPage = lazy(() => import("./pages/admin/PhotosPage").then((m) => ({ default: m.PhotosPage })));
const VideosPage = lazy(() => import("./pages/admin/VideosPage").then((m) => ({ default: m.VideosPage })));
const GalleryPage = lazy(() => import("./pages/admin/GalleryPage").then((m) => ({ default: m.GalleryPage })));
const EventsPage = lazy(() => import("./pages/admin/EventsPage").then((m) => ({ default: m.EventsPage })));
const CommentsPage = lazy(() => import("./pages/admin/CommentsPage").then((m) => ({ default: m.CommentsPage })));
const ReportsPage = lazy(() => import("./pages/admin/ReportsPage").then((m) => ({ default: m.ReportsPage })));
const PostersPage = lazy(() => import("./pages/admin/PostersPage").then((m) => ({ default: m.PostersPage })));
const SettingsPage = lazy(() => import("./pages/admin/SettingsPage").then((m) => ({ default: m.SettingsPage })));
const ProfilePage = lazy(() => import("./pages/admin/ProfilePage").then((m) => ({ default: m.ProfilePage })));

function PageLoader() {
  return (
    <div className="min-h-[50vh] grid place-items-center">
      <div className="size-8 rounded-full border-2 border-[#0F4C81]/20 border-t-[#0F4C81] animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/album/:id" element={<AlbumDetailPage />} />
              <Route path="/donatur" element={<DonorsPage />} />
            </Route>

            <Route path="/adminrt02/login" element={<LoginPage />} />
            <Route path="/adminrt02" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="albums" element={<AlbumsPage />} />
              <Route path="photos" element={<PhotosPage />} />
              <Route path="videos" element={<VideosPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="comments" element={<CommentsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="posters" element={<PostersPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </Suspense>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </StoreProvider>
  );
}
