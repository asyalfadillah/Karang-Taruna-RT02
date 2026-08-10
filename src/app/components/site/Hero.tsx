import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Images } from "lucide-react";
import { HERO_SLIDES } from "../../data/store";
import { useLang } from "../../i18n/i18n";

export function Hero() {
  const { t } = useLang();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

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
          <img src={HERO_SLIDES[idx].image} alt={HERO_SLIDES[idx].title} className="size-full object-cover" fetchPriority="high" decoding="async" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F4C81]/85 via-[#0F4C81]/70 to-[#0b3660]/90" />

      {/* content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-28 w-full">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#f4d97a] text-sm mb-4 md:mb-6">
            {t("hero.badge")}
          </span>
          <h1 className="text-white text-3xl md:text-6xl leading-tight" style={{ fontWeight: 800 }}>
            {t("hero.titlePrefix")} <span className="text-[#D4AF37]">{t("hero.titleHighlight")}</span>
          </h1>
          <p className="mt-4 md:mt-6 text-white/85 text-base md:text-lg max-w-2xl leading-relaxed">
            {t("hero.desc")}
          </p>

          <div className="mt-6 md:mt-8 flex flex-wrap gap-3 md:gap-4">
            <button
              onClick={() => scrollTo("#dokumentasi")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D32F2F] text-white hover:bg-[#b71c1c] transition shadow-lg"
              style={{ fontWeight: 600 }}
            >
              <Images className="size-5" /> {t("hero.cta")}
            </button>
          </div>
        </motion.div>
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
