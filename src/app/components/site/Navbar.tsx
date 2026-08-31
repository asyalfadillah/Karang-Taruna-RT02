import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Search, Menu, X, Globe } from "lucide-react";
import { useLang, LANGUAGES } from "../../i18n/i18n";

export function Navbar({ onSearch }: { onSearch: () => void }) {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const LINKS = [
    { label: t("nav.beranda"), to: "#beranda" },
    { label: t("nav.tentang"), to: "#tentang" },
    { label: t("nav.dokumentasi"), to: "#dokumentasi" },
    { label: t("nav.kalender"), to: "#kalender" },
    { label: t("nav.donatur"), to: "#donatur" },
    { label: t("nav.kontak"), to: "#kontak" },
  ];

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
            <span className={`block text-sm ${scrolled ? "text-[#1C3A54]" : "text-white"}`} style={{ fontWeight: 700, fontFamily: "var(--font-heading)" }}>
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
              className={`px-3 py-2 rounded-lg text-sm transition hover:text-[#9C2B2F] ${
                scrolled ? "text-foreground" : "text-white"
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 h-10 rounded-lg text-sm transition ${
                scrolled ? "hover:bg-[#1C3A54]/10 text-[#1C3A54]" : "hover:bg-white/20 text-white"
              }`}
              aria-label="Ganti bahasa"
            >
              <Globe className="size-5" />
              <span className="hidden sm:inline uppercase text-xs" style={{ fontWeight: 700 }}>{lang}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-black/5 overflow-hidden">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#F6F2EA] transition ${lang === l.code ? "text-[#9C2B2F]" : "text-foreground"}`}
                    style={{ fontWeight: lang === l.code ? 600 : 400 }}
                  >
                    {l.native}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onSearch}
            className={`grid place-items-center size-10 rounded-lg transition ${
              scrolled ? "hover:bg-[#1C3A54]/10 text-[#1C3A54]" : "hover:bg-white/20 text-white"
            }`}
            aria-label="Cari"
          >
            <Search className="size-5" />
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={`lg:hidden grid place-items-center size-10 rounded-lg ${scrolled ? "text-[#1C3A54]" : "text-white"}`}
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
              className="block w-full text-left px-5 py-3 border-b border-black/5 hover:bg-[#F6F2EA] transition"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
