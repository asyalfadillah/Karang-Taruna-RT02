import { useState } from "react";
import { NavLink, Outlet, useNavigate, Navigate, Link } from "react-router";
import { LayoutDashboard, FolderOpen, Image as ImageIcon, Film, GalleryHorizontal, Settings, UserCog, LogOut, Menu, X, ExternalLink, Flag, CalendarDays, MessageCircle, Wallet, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../../data/store";

const NAV = [
  { to: "/adminrt02", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/adminrt02/albums", label: "Album Dokumentasi", icon: FolderOpen },
  { to: "/adminrt02/photos", label: "Foto", icon: ImageIcon },
  { to: "/adminrt02/videos", label: "Video", icon: Film },
  { to: "/adminrt02/gallery", label: "Galeri", icon: GalleryHorizontal },
  { to: "/adminrt02/events", label: "Kalender Kegiatan", icon: CalendarDays },
  { to: "/adminrt02/comments", label: "Komentar Warga", icon: MessageCircle },
  { to: "/adminrt02/reports", label: "Laporan Keuangan", icon: Wallet },
  { to: "/adminrt02/posters", label: "Poster Informasi", icon: Megaphone },
  { to: "/adminrt02/settings", label: "Pengaturan", icon: Settings },
  { to: "/adminrt02/profile", label: "Profil Admin", icon: UserCog },
];

export function AdminLayout() {
  const { isAuthed, logout, admin } = useStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!isAuthed) return <Navigate to="/adminrt02/login" replace />;

  const doLogout = () => {
    logout();
    toast.success("Anda telah keluar.");
    navigate("/");
  };

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-6 border-b border-white/10">
        <span className="grid place-items-center size-10 rounded-xl bg-white/10"><Flag className="size-5 text-[#D4AF37]" /></span>
        <div className="leading-tight">
          <p className="text-white text-sm" style={{ fontWeight: 700, fontFamily: "var(--font-heading)" }}>Admin RT 02</p>
          <p className="text-white/50 text-xs">Panel Dokumentasi</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition ${
                isActive ? "bg-[#D32F2F] text-white shadow-lg" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <n.icon className="size-5" /> {n.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition">
          <ExternalLink className="size-5" /> Lihat Website
        </Link>
        <button onClick={doLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition">
          <LogOut className="size-5" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex">
      {/* desktop sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 bg-gradient-to-b from-[#0F4C81] to-[#0b3660] fixed inset-y-0 left-0">{SidebarContent}</aside>

      {/* mobile sidebar */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-gradient-to-b from-[#0F4C81] to-[#0b3660]">{SidebarContent}</div>
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
        </div>
      )}

      <div className="flex-1 lg:ml-72 min-w-0">
        {/* topbar */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-black/5 px-4 md:px-8 py-3 flex items-center justify-between">
          <button className="lg:hidden p-2 text-[#0F4C81]" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu className="size-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm" style={{ fontWeight: 600 }}>{admin.name}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <span className="grid place-items-center size-10 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#D32F2F] text-white" style={{ fontWeight: 700 }}>
              DF
            </span>
          </div>
        </header>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      <button className="lg:hidden fixed top-3 right-4 z-[60]" style={{ display: open ? "block" : "none" }} onClick={() => setOpen(false)} aria-label="Tutup">
        <X className="size-6 text-white" />
      </button>
    </div>
  );
}
