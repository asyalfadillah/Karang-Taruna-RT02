import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Search, Menu, X, ShieldCheck, Flag } from "lucide-react";

const LINKS = [
  { label: "Beranda", to: "#beranda" },
  { label: "Tentang", to: "#tentang" },
  { label: "Dokumentasi", to: "#dokumentasi" },
  { label: "Kalender", to: "#kalender" },
  { label: "Galeri", to: "#galeri" },
  { label: "Video", to: "#video" },
  { label: "Donatur", to: "#donatur" },
  { label: "Kontak", to: "#kontak" },
];

export function Navbar({ onSearch }: { onSearch: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    h();
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const goHash = (hash: string) => {
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/" + hash);
      return;
    }
    const el = document.querySelector(hash);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="grid place-items-center size-11 rounded-xl overflow-hidden bg-white shadow-lg">
            <img src="/logo.png" alt="Logo Karang Taruna RT 02" className="size-full object-contain p-0.5" />
          </span>
          <span className="leading-tight">
            <span className={`block text-sm ${scrolled ? "text-[#0F4C81]" : "text-white"}`} style={{ fontWeight: 700, fontFamily: "var(--font-heading)" }}>
              Karang Taruna RT 02
            </span>
            <span className={`block text-xs ${scrolled ? "text-muted-foreground" : "text-white/70"}`}>Dokumentasi HUT RI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {LINKS.map((l) => (
            <button
              key={l.to}
              onClick={() => goHash(l.to)}
              className={`px-3 py-2 rounded-lg text-sm transition hover:text-[#D32F2F] ${
                scrolled ? "text-foreground" : "text-white"
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onSearch}
            className={`grid place-items-center size-10 rounded-lg transition ${
              scrolled ? "hover:bg-[#0F4C81]/10 text-[#0F4C81]" : "hover:bg-white/20 text-white"
            }`}
            aria-label="Cari"
          >
            <Search className="size-5" />
          </button>
          <Link
            to="/admin/login"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D32F2F] text-white text-sm hover:bg-[#b71c1c] transition shadow"
          >
            <ShieldCheck className="size-4" /> Login Admin
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={`lg:hidden grid place-items-center size-10 rounded-lg ${scrolled ? "text-[#0F4C81]" : "text-white"}`}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white shadow-lg mt-2 mx-4 rounded-xl overflow-hidden">
          {LINKS.map((l) => (
            <button
              key={l.to}
              onClick={() => goHash(l.to)}
              className="block w-full text-left px-5 py-3 border-b border-black/5 hover:bg-[#F5F7FA] transition"
            >
              {l.label}
            </button>
          ))}
          <Link to="/admin/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-5 py-3 text-[#D32F2F]">
            <ShieldCheck className="size-4" /> Login Admin
          </Link>
        </div>
      )}
    </header>
  );
}
