import { Flag, Mail, MapPin } from "lucide-react";
import { useLang } from "../../i18n/i18n";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.6 5.82c-.7-.76-1.09-1.75-1.09-2.82h-3.02v13.44c0 1.5-1.22 2.71-2.71 2.71s-2.71-1.22-2.71-2.71 1.22-2.71 2.71-2.71c.28 0 .55.04.8.12v-3.07c-.27-.04-.53-.06-.8-.06-3.16 0-5.73 2.57-5.73 5.73s2.57 5.73 5.73 5.73 5.73-2.57 5.73-5.73V9.01c1.14.82 2.53 1.3 4.03 1.3V7.29c-1.13 0-2.13-.36-2.94-1.47Z" />
    </svg>
  );
}

export function Footer() {
  const { t } = useLang();
  const QUICK = [
    { label: t("nav.beranda"), hash: "#beranda" },
    { label: t("nav.tentang"), hash: "#tentang" },
    { label: t("nav.dokumentasi"), hash: "#dokumentasi" },
    { label: t("nav.kalender"), hash: "#kalender" },
    { label: t("nav.kontak"), hash: "#kontak" },
  ];
  const go = (hash: string) => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer className="bg-[#1C3A54] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="grid place-items-center size-11 rounded-xl bg-white/10"><Flag className="size-6 text-[#A8802F]" /></span>
            <span style={{ fontWeight: 700, fontFamily: "var(--font-heading)" }}>Karang Taruna RT 02</span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">{t("footer.tagline")}</p>
        </div>

        <div>
          <h4 className="mb-4 text-[#A8802F]" style={{ fontWeight: 600 }}>{t("footer.quickLinks")}</h4>
          <ul className="space-y-2 text-sm">
            {QUICK.map((q) => (
              <li key={q.hash}>
                <button onClick={() => go(q.hash)} className="text-white/70 hover:text-white transition">{q.label}</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-[#A8802F]" style={{ fontWeight: 600 }}>{t("footer.social")}</h4>
          <div className="flex gap-3">
            <a href="https://www.tiktok.com/@comdoea" target="_blank" rel="noreferrer" className="grid place-items-center size-10 rounded-lg bg-white/10 hover:bg-[#010101] transition"><TikTokIcon className="size-5" /></a>
            <a href="mailto:karangtaruna.rt02@gmail.com" className="grid place-items-center size-10 rounded-lg bg-white/10 hover:bg-[#A8802F] transition"><Mail className="size-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-[#A8802F]" style={{ fontWeight: 600 }}>{t("footer.address")}</h4>
          <p className="flex gap-2 text-sm text-white/70 leading-relaxed">
            <MapPin className="size-5 shrink-0 text-[#A8802F]" />
            Jl. Kalibata Tengah XVI, RT.02/RW.003, Kelurahan Kalibata, Kecamatan Pancoran, Jakarta Selatan, DKI Jakarta
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-6 border-t border-white/10 text-center text-sm text-white/60">
        {t("footer.copyright")}
      </div>
    </footer>
  );
}
