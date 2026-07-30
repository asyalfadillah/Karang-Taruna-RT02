import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Search, Images, PlayCircle } from "lucide-react";
import { HERO_SLIDES, useStore } from "../../data/store";
import { Counter } from "./Counter";

export function Hero({ onSearch }: { onSearch: () => void }) {
  const { albums, photos, videos } = useStore();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const stats = [
    { label: "Total Album", value: albums.length },
    { label: "Total Foto", value: photos.length },
    { label: "Total Video", value: videos.length },
    { label: "Tahun Kegiatan", value: new Set([...albums].map((a) => a.date.slice(0, 4))).size },
  ];

  const scrollTo = (hash: string) => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="beranda" className="relative min-h-[92vh] md:min-h-screen flex items-center overflow-hidden">
      {/* slider */}
      <AnimatePresence>
        <motion.div
          key={idx}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          <img src={HERO_SLIDES[idx].image} alt={HERO_SLIDES[idx].title} className="size-full object-cover" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F4C81]/85 via-[#0F4C81]/70 to-[#0b3660]/90" />

      {/* content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-28 w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#f4d97a] text-sm mb-4 md:mb-6">
            Bersama Remaja Karang Taruna 02, Warga 02
          </span>
          <h1 className="text-white text-3xl md:text-6xl leading-tight" style={{ fontWeight: 800 }}>
            Dokumentasi <span className="text-[#D4AF37]">KEGIATAN HUT RI RT 02</span>
          </h1>
          <p className="mt-4 md:mt-6 text-white/85 text-base md:text-lg max-w-2xl leading-relaxed">
            Mengabadikan setiap momen kegiatan HUT RI dan Panggung Kemerdekaan yang diselenggarakan oleh Remaja Karang Taruna RT 02.
          </p>

          {/* search bar */}
          <button
            onClick={onSearch}
            className="mt-6 md:mt-8 w-full max-w-xl flex items-center gap-3 bg-white rounded-full pl-5 pr-2 py-2 shadow-2xl text-left group"
          >
            <Search className="size-5 text-[#0F4C81]" />
            <span className="flex-1 text-muted-foreground">Cari foto, video, atau album dokumentasi...</span>
            <span className="px-4 py-2 rounded-full bg-[#0F4C81] text-white text-sm group-hover:bg-[#D32F2F] transition">Cari</span>
          </button>

          <div className="mt-6 md:mt-8 flex flex-wrap gap-3 md:gap-4">
            <button
              onClick={() => scrollTo("#dokumentasi")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D32F2F] text-white hover:bg-[#b71c1c] transition shadow-lg"
              style={{ fontWeight: 600 }}
            >
              <Images className="size-5" /> Lihat Dokumentasi
            </button>
            <button
              onClick={() => scrollTo("#video")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/30 text-white hover:bg-white/20 transition backdrop-blur"
              style={{ fontWeight: 600 }}
            >
              <PlayCircle className="size-5" /> Tonton Video
            </button>
          </div>
        </motion.div>

        {/* stats */}
        <div className="mt-8 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur px-5 py-6 text-center"
            >
              <div className="text-3xl md:text-4xl text-[#D4AF37]" style={{ fontWeight: 800 }}>
                <Counter to={s.value} />+
              </div>
              <div className="mt-1 text-sm text-white/80">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* slide dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-[#D4AF37]" : "w-2 bg-white/50"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
