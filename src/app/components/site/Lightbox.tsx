import { AnimatePresence, motion } from "motion/react";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useEffect } from "react";
import type { Photo } from "../../data/store";

export function Lightbox({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: Photo[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const open = index !== null;
  const current = open ? photos[index!] : null;

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index! + 1) % photos.length);
      if (e.key === "ArrowLeft") onIndex((index! - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, index, photos.length, onClose, onIndex]);

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X className="size-7" />
          </button>

          <button
            className="absolute left-3 md:left-8 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            onClick={(e) => {
              e.stopPropagation();
              onIndex((index! - 1 + photos.length) % photos.length);
            }}
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="size-9" />
          </button>

          <motion.div
            key={current.id}
            className="max-w-5xl w-full flex flex-col items-center"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={current.url}
              alt={current.title}
              className="max-h-[76vh] w-auto rounded-lg object-contain shadow-2xl"
            />
            <div className="mt-4 flex items-center justify-between w-full max-w-3xl text-white">
              <div>
                <p style={{ fontWeight: 600 }}>{current.title}</p>
                <p className="text-sm text-white/70">{current.caption}</p>
              </div>
              <a
                href={current.url}
                download
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm shrink-0"
              >
                <Download className="size-4" /> Unduh
              </a>
            </div>
          </motion.div>

          <button
            className="absolute right-3 md:right-8 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
            onClick={(e) => {
              e.stopPropagation();
              onIndex((index! + 1) % photos.length);
            }}
            aria-label="Berikutnya"
          >
            <ChevronRight className="size-9" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
