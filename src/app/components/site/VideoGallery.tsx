import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Play, Clock, Calendar, X, ExternalLink } from "lucide-react";
import { useStore, formatDate, VIDEO_SOURCE_LABEL, type Video } from "../../data/store";
import { Reveal, SectionHeading } from "./Reveal";
import { isEmbeddable, toEmbedUrl } from "./videoUtils";
import { useLang } from "../../i18n/i18n";

export function VideoGallery() {
  const { t } = useLang();
  const { videos } = useStore();
  const [active, setActive] = useState<Video | null>(null);

  const openVideo = (v: Video) => {
    if (isEmbeddable(v)) setActive(v);
    else window.open(v.url, "_blank", "noopener");
  };

  return (
    <section id="video" className="py-24 bg-[#122A3D] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="inline-block mb-3 px-4 py-1 rounded-full bg-white/10 text-[#A8802F] text-sm uppercase tracking-wide">{t("video.badge")}</span>
            <h2 className="text-3xl md:text-4xl" style={{ fontWeight: 700 }}>{t("video.title")}</h2>
            <p className="mt-4 text-white/70">{t("video.desc")}</p>
          </div>
        </Reveal>

        {videos.length === 0 && (
          <div className="text-center py-16 rounded-2xl border-2 border-dashed border-white/20">
            <p className="text-lg text-[#A8802F]" style={{ fontWeight: 600 }}>{t("video.empty")}</p>
            <p className="text-white/60 mt-1">{t("video.emptySub")}</p>
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v, i) => (
            <Reveal key={v.id} delay={(i % 3) * 0.1}>
              <div className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#A8802F]/50 transition">
                <button onClick={() => openVideo(v)} className="relative block w-full aspect-video overflow-hidden">
                  <img src={v.thumbnail} alt={v.title} loading="lazy" className="size-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <span className="absolute inset-0 bg-black/30 grid place-items-center">
                    <span className="grid place-items-center size-16 rounded-full bg-[#9C2B2F] text-white group-hover:scale-110 transition shadow-xl">
                      <Play className="size-7 ml-1" fill="currentColor" />
                    </span>
                  </span>
                  <span className="absolute top-3 left-3 px-2 py-1 rounded bg-white/90 text-[#1C3A54] text-xs">{VIDEO_SOURCE_LABEL[v.source]}</span>
                  <span className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded bg-black/70 text-xs">
                    <Clock className="size-3" /> {v.duration}
                  </span>
                </button>
                <div className="p-5">
                  <h3 className="line-clamp-1" style={{ fontWeight: 600 }}>{v.title}</h3>
                  <p className="mt-2 text-sm text-white/60 line-clamp-2">{v.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs text-white/50"><Calendar className="size-3.5" /> {formatDate(v.date)}</span>
                    <button onClick={() => openVideo(v)} className="flex items-center gap-1 text-sm text-[#A8802F] hover:underline" style={{ fontWeight: 600 }}>
                      {t("video.watch")} {isEmbeddable(v) ? "→" : <ExternalLink className="size-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/90 grid place-items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <button className="absolute top-5 right-5 text-white/80 hover:text-white p-2" onClick={() => setActive(null)} aria-label="Tutup">
              <X className="size-7" />
            </button>
            <motion.div className="w-full max-w-4xl" initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()}>
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                {active.source === "mp4" ? (
                  <video src={active.url} controls className="size-full" />
                ) : (
                  <iframe src={toEmbedUrl(active)} title={active.title} className="size-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                )}
              </div>
              <div className="mt-4 text-white">
                <h3 style={{ fontWeight: 600 }}>{active.title}</h3>
                <p className="text-sm text-white/60 mt-1">{active.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
