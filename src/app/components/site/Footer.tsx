import { Link } from "react-router";
import { Flag, Instagram, Phone, Mail, MapPin } from "lucide-react";

const QUICK = [
  { label: "Beranda", hash: "#beranda" },
  { label: "Tentang", hash: "#tentang" },
  { label: "Dokumentasi", hash: "#dokumentasi" },
  { label: "Kalender", hash: "#kalender" },
  { label: "Galeri", hash: "#galeri" },
  { label: "Video", hash: "#video" },
  { label: "Kontak", hash: "#kontak" },
];

export function Footer() {
  const go = (hash: string) => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer className="bg-[#0F4C81] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="grid place-items-center size-11 rounded-xl bg-white/10"><Flag className="size-6 text-[#D4AF37]" /></span>
            <span style={{ fontWeight: 700, fontFamily: "var(--font-heading)" }}>Karang Taruna RT 02</span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">Bersama Remaja Karang Taruna 02, Warga 02. Arsip digital dokumentasi kegiatan HUT RI & Panggung Kemerdekaan.</p>
        </div>

        <div>
          <h4 className="mb-4 text-[#D4AF37]" style={{ fontWeight: 600 }}>Tautan Cepat</h4>
          <ul className="space-y-2 text-sm">
            {QUICK.map((q) => (
              <li key={q.hash}>
                <button onClick={() => go(q.hash)} className="text-white/70 hover:text-white transition">{q.label}</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-[#D4AF37]" style={{ fontWeight: 600 }}>Media Sosial</h4>
          <div className="flex gap-3">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="grid place-items-center size-10 rounded-lg bg-white/10 hover:bg-[#D32F2F] transition"><Instagram className="size-5" /></a>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="grid place-items-center size-10 rounded-lg bg-white/10 hover:bg-[#25D366] transition"><Phone className="size-5" /></a>
            <a href="mailto:karangtaruna.rt02@gmail.com" className="grid place-items-center size-10 rounded-lg bg-white/10 hover:bg-[#D4AF37] transition"><Mail className="size-5" /></a>
          </div>
          <Link to="/admin/login" className="inline-block mt-6 text-sm text-white/60 hover:text-white transition">Login Admin →</Link>
        </div>

        <div>
          <h4 className="mb-4 text-[#D4AF37]" style={{ fontWeight: 600 }}>Alamat</h4>
          <p className="flex gap-2 text-sm text-white/70 leading-relaxed">
            <MapPin className="size-5 shrink-0 text-[#D4AF37]" />
            Jl. Kalibata Tengah XVI, RT.02/RW.003, Kelurahan Kalibata, Kecamatan Pancoran, Jakarta Selatan, DKI Jakarta
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-6 border-t border-white/10 text-center text-sm text-white/60">
        © 2026 Remaja Karang Taruna RT 02. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
