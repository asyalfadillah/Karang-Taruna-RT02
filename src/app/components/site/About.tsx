import { Reveal, SectionHeading } from "./Reveal";
import { useLang } from "../../i18n/i18n";

export function About() {
  const { t } = useLang();

  const FEATURES = [
    { n: "01", title: t("about.f1t"), desc: t("about.f1d") },
    { n: "02", title: t("about.f2t"), desc: t("about.f2d") },
    { n: "03", title: t("about.f3t"), desc: t("about.f3d") },
    { n: "04", title: t("about.f4t"), desc: t("about.f4d") },
  ];

  return (
    <section id="tentang" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <SectionHeading eyebrow={t("about.eyebrow")} title={t("about.title")} desc={t("about.desc")} />
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="h-full pt-5 border-t-2 border-[#211C17]/10">
                <span className="block text-3xl text-[#A8802F]/70" style={{ fontFamily: "var(--font-heading)", fontWeight: 500 }}>
                  {f.n}
                </span>
                <h3 className="mt-3 text-[#211C17]" style={{ fontWeight: 600 }}>{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
