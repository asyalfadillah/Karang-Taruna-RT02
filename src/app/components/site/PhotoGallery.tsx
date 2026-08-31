import { useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { ZoomIn, Download } from "lucide-react";
import { useStore } from "../../data/store";
import { Reveal, SectionHeading } from "./Reveal";
import { Lightbox } from "./Lightbox";
import { useLang } from "../../i18n/i18n";

export function PhotoGallery() {
  const { t } = useLang();
  const { photos } = useStore();
  const [visible, setVisible] = useState(8);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const shown = photos.slice(0, visible);

  return (
    <section id="galeri" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <SectionHeading eyebrow={t("gallery.eyebrow")} title={t("gallery.title")} desc={t("gallery.desc")} />
        </Reveal>

        {photos.length === 0 && (
          <div className="text-center py-16 rounded-2xl border-2 border-dashed border-[#1C3A54]/20 bg-[#F6F2EA]">
            <p className="text-lg text-[#1C3A54]" style={{ fontWeight: 600 }}>{t("gallery.empty")}</p>
            <p className="text-muted-foreground mt-1">{t("gallery.emptySub")}</p>
          </div>
        )}
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 640: 2, 1024: 3 }}>
          <Masonry gutter="20px">
            {shown.map((p) => {
              const realIndex = photos.findIndex((x) => x.id === p.id);
              return (
                <div key={p.id} className="relative group rounded-2xl overflow-hidden cursor-pointer" onClick={() => setLightbox(realIndex)}>
                  <img src={p.url} alt={p.title} loading="lazy" className="w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-end p-4">
                    <p className="text-white text-sm" style={{ fontWeight: 600 }}>{p.title}</p>
                    <p className="text-white/70 text-xs line-clamp-1">{p.caption}</p>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <span className="grid place-items-center size-9 rounded-full bg-white/90 text-[#1C3A54]"><ZoomIn className="size-4" /></span>
                    <a href={p.url} download target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="grid place-items-center size-9 rounded-full bg-white/90 text-[#1C3A54] hover:bg-[#A8802F] hover:text-white transition">
                      <Download className="size-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </Masonry>
        </ResponsiveMasonry>

        {visible < photos.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisible((v) => v + 8)}
              className="px-8 py-3 rounded-xl bg-[#1C3A54] text-white hover:bg-[#9C2B2F] transition shadow-lg"
              style={{ fontWeight: 600 }}
            >
              {t("gallery.loadMore")}
            </button>
          </div>
        )}
      </div>

      <Lightbox photos={photos} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />
    </section>
  );
}
