import { useEffect, useState } from "react";
import { X, Megaphone } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useStore } from "../../data/store";
import { useLang } from "../../i18n/i18n";

/** Section "Poster Informasi" — grid poster aktif, ditaruh di tengah alur halaman. */
export function PosterSection() {
  const { t } = useLang();
  const { posters } = useStore();
  const active = posters.filter((p) => p.active);
  if (active.length === 0) return null;

  return (
    <section id="poster-informasi" className="py-24 bg-[#F5F7FA]">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <Reveal>
          <SectionHeading eyebrow={t("poster.eyebrow")} title={t("poster.title")} desc={t("poster.desc")} />
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {active.map((p, i) => {
            const Wrapper = p.link ? "a" : "div";
            return (
              <Reveal key={p.id} delay={i * 0.06}>
                <Wrapper
                  {...(p.link ? { href: p.link, target: "_blank", rel: "noreferrer" } : {})}
                  className="block rounded-2xl overflow-hidden border border-black/5 bg-white group"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={p.imageUrl} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="p-3 text-sm text-[#0F4C81] truncate" style={{ fontWeight: 600 }}>{p.title}</p>
                </Wrapper>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Popup poster — muncul otomatis di beranda sebelum pengunjung sempat scroll. */
export function PosterPopup() {
  const { posters } = useStore();
  const [open, setOpen] = useState(false);
  const poster = posters.find((p) => p.active && p.showAsPopup);

  useEffect(() => {
    if (!poster) return;
    const seenKey = `rt02_poster_seen_${poster.id}`;
    if (sessionStorage.getItem(seenKey)) return;
    const t = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poster?.id]);

  const close = () => {
    setOpen(false);
    if (poster) sessionStorage.setItem(`rt02_poster_seen_${poster.id}`, "1");
  };

  if (!poster || !open) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4" onClick={close}>
      <div className="relative w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={close}
          className="absolute -top-3 -right-3 grid place-items-center size-9 rounded-full bg-white text-[#0F4C81] shadow-lg hover:bg-[#D32F2F] hover:text-white transition z-10"
        >
          <X className="size-5" />
        </button>
        <div className="rounded-2xl overflow-hidden bg-white shadow-2xl">
          {poster.link ? (
            <a href={poster.link} target="_blank" rel="noreferrer">
              <img src={poster.imageUrl} alt={poster.title} className="w-full max-h-[75vh] object-contain bg-black" />
            </a>
          ) : (
            <img src={poster.imageUrl} alt={poster.title} className="w-full max-h-[75vh] object-contain bg-black" />
          )}
          <div className="p-4 flex items-center gap-2">
            <Megaphone className="size-4 text-[#D32F2F] shrink-0" />
            <p className="text-sm truncate" style={{ fontWeight: 600 }}>{poster.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
