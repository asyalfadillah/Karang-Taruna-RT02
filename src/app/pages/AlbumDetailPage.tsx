import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Calendar, Image as ImageIcon, Film, Play, Download, ZoomIn, X, FolderOpen, ExternalLink } from "lucide-react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { AnimatePresence, motion } from "motion/react";
import { useStore, formatDate, VIDEO_SOURCE_LABEL, type Video } from "../data/store";
import { Lightbox } from "../components/site/Lightbox";
import { isEmbeddable, toEmbedUrl } from "../components/site/videoUtils";
import { useLang } from "../i18n/i18n";

export function AlbumDetailPage() {
  const { t } = useLang();
  const { id } = useParams();
  const { albums, photos, videos } = useStore();
  const album = albums.find((a) => a.id === id);
  const albumPhotos = photos.filter((p) => p.albumId === id);
  const albumVideos = videos.filter((v) => v.albumId === id);
  const [tab, setTab] = useState<"foto" | "video">("foto");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [visiblePhotos, setVisiblePhotos] = useState(3);

  if (!album) {
    return (
      <div className="min-h-screen grid place-items-center pt-20">
        <div className="text-center">
          <p className="text-muted-foreground">{t("album.notFound")}</p>
          <Link to="/" className="mt-4 inline-block text-[#0F4C81] hover:underline">← {t("album.backHome")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* header */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={album.cover} alt={album.name} className="size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b3660] via-[#0F4C81]/60 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 md:px-8 pb-8 w-full text-white">
            <Link to="/#dokumentasi" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm">
              <ArrowLeft className="size-4" /> {t("album.backToDocs")}
            </Link>
            <h1 className="text-3xl md:text-5xl" style={{ fontWeight: 800 }}>{album.name}</h1>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/85">
              <span className="flex items-center gap-1"><Calendar className="size-4" /> {formatDate(album.date)}</span>
              <span className="flex items-center gap-1"><ImageIcon className="size-4" /> {albumPhotos.length} {t("doc.photo")}</span>
              <span className="flex items-center gap-1"><Film className="size-4" /> {albumVideos.length} {t("doc.video")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <p className="text-muted-foreground max-w-3xl leading-relaxed">{album.description}</p>

        {album.driveLink && (
          <a
            href={album.driveLink}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] text-white hover:bg-[#b8942c] transition shadow-lg"
            style={{ fontWeight: 600 }}
          >
            <FolderOpen className="size-5" /> {t("album.viewAllDocs")} <ExternalLink className="size-4" />
          </a>
        )}

        {/* tabs */}
        <div className="flex gap-2 mt-8 mb-8 border-b border-black/10">
          {(["foto", "video"] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              className={`px-5 py-3 capitalize transition border-b-2 -mb-px ${
                tab === tabKey ? "border-[#D32F2F] text-[#D32F2F]" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontWeight: 600 }}
            >
              {tabKey === "foto" ? t("doc.photo") : t("doc.video")} ({tabKey === "foto" ? albumPhotos.length : albumVideos.length})
            </button>
          ))}
        </div>

        {tab === "foto" &&
          (albumPhotos.length === 0 ? (
            <p className="text-muted-foreground py-10 text-center">{t("album.noPhotos")}</p>
          ) : (
            <>
              <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 640: 2, 1024: 3 }}>
                <Masonry gutter="20px">
                  {albumPhotos.slice(0, visiblePhotos).map((p, i) => (
                    <div key={p.id} className="relative group rounded-2xl overflow-hidden cursor-pointer" onClick={() => setLightbox(i)}>
                      <img src={p.url} alt={p.title} loading="lazy" className="w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                        <p className="text-white text-sm" style={{ fontWeight: 600 }}>{p.title}</p>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                        <span className="grid place-items-center size-9 rounded-full bg-white/90 text-[#0F4C81]"><ZoomIn className="size-4" /></span>
                        <a href={p.url} download target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="grid place-items-center size-9 rounded-full bg-white/90 text-[#0F4C81] hover:bg-[#D4AF37] hover:text-white transition"><Download className="size-4" /></a>
                      </div>
                    </div>
                  ))}
                </Masonry>
              </ResponsiveMasonry>
              {visiblePhotos < albumPhotos.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setVisiblePhotos((v) => v + 3)}
                    className="px-8 py-3 rounded-xl bg-[#0F4C81] text-white hover:bg-[#D32F2F] transition shadow-lg"
                    style={{ fontWeight: 600 }}
                  >
                    {t("album.loadMore")} ({albumPhotos.length - visiblePhotos} {t("album.more")})
                  </button>
                </div>
              )}
            </>
          ))}

        {tab === "video" &&
          (albumVideos.length === 0 ? (
            <p className="text-muted-foreground py-10 text-center">{t("album.noVideos")}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albumVideos.map((v) => (
                <div key={v.id} className="group rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition">
                  <button onClick={() => (isEmbeddable(v) ? setActiveVideo(v) : window.open(v.url, "_blank", "noopener"))} className="relative block w-full aspect-video overflow-hidden">
                    <img src={v.thumbnail} alt={v.title} loading="lazy" className="size-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <span className="absolute inset-0 bg-black/30 grid place-items-center">
                      <span className="grid place-items-center size-14 rounded-full bg-[#D32F2F] text-white group-hover:scale-110 transition"><Play className="size-6 ml-1" fill="currentColor" /></span>
                    </span>
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/90 text-[#0F4C81] text-xs">{VIDEO_SOURCE_LABEL[v.source]}</span>
                    <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-xs">{v.duration}</span>
                  </button>
                  <div className="p-4">
                    <h3 className="line-clamp-1 text-[#0F4C81]" style={{ fontWeight: 600 }}>{v.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{v.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>

      <Lightbox photos={albumPhotos} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />

      <AnimatePresence>
        {activeVideo && (
          <motion.div className="fixed inset-0 z-[100] bg-black/90 grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveVideo(null)}>
            <button className="absolute top-5 right-5 text-white/80 hover:text-white p-2" onClick={() => setActiveVideo(null)} aria-label="Tutup"><X className="size-7" /></button>
            <motion.div className="w-full max-w-4xl" initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()}>
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                {activeVideo.source === "mp4" ? (
                  <video src={activeVideo.url} controls className="size-full" />
                ) : (
                  <iframe src={toEmbedUrl(activeVideo)} title={activeVideo.title} className="size-full" allowFullScreen />
                )}
              </div>
              <h3 className="mt-4 text-white" style={{ fontWeight: 600 }}>{activeVideo.title}</h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
