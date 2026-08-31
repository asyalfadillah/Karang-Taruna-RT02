import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { HERO_SLIDES } from "../../data/store";
import { useLang } from "../../i18n/i18n";

export function Hero() {
  const { t } = useLang();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % HERO_SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (hash: string) => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="beranda" className="relative min-h-[92vh] md:min-h-screen flex items-end md:items-center overflow-hidden">
      {/* slider */}
      <AnimatePresence>
        <motion.div
          key={idx}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          <img src={HERO_SLIDES[idx].image} alt={HERO_SLIDES[idx].title} className="size-full object-cover" fetchPriority="high" decoding="async" />
        </motion.div>
      </AnimatePresence>
      {/* Overlay lebih gelap di bawah (tempat teks), lebih terang di atas — bukan gradient penuh warna */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/10" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />

      {/* content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-16 pt-24 md:py-28 w-full">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-[#A8802F]" />
            <span className="text-xs tracking-[0.18em] uppercase text-[#d9bd7a]" style={{ fontWeight: 600 }}>
              {t("hero.badge")}
            </span>
          </div>
          <h1 className="text-white text-4xl md:text-6xl leading-[1.08]" style={{ fontWeight: 600 }}>
            {t("hero.titlePrefix")}{" "}
            <em className="text-[#c79a4b] not-italic md:italic">{t("hero.titleHighlight")}</em>
          </h1>
          <p className="mt-5 md:mt-6 text-white/80 text-base md:text-lg max-w-xl leading-relaxed">
            {t("hero.desc")}
          </p>

          <div className="mt-7 md:mt-9">
            <button
              onClick={() => scrollTo("#dokumentasi")}
              className="group flex items-center gap-2.5 text-white border-b border-white/40 pb-1.5 hover:border-[#A8802F] transition-colors"
              style={{ fontWeight: 500 }}
            >
              {t("hero.cta")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* slide indicator — angka, bukan dots generik */}
      <div className="absolute bottom-6 right-6 md:right-10 z-10 flex items-center gap-2 text-white/70 text-sm">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className="transition-colors"
            style={{ color: i === idx ? "#A8802F" : undefined, fontWeight: i === idx ? 700 : 400 }}
            aria-label={`Slide ${i + 1}`}
          >
            0{i + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
