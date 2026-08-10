import { Reveal, SectionHeading } from "./Reveal";
import { Camera, Video, Archive, HeartHandshake } from "lucide-react";
import { useLang } from "../../i18n/i18n";

export function About() {
  const { t } = useLang();

  const FEATURES = [
    { icon: Camera, title: t("about.f1t"), desc: t("about.f1d") },
    { icon: Video, title: t("about.f2t"), desc: t("about.f2d") },
    { icon: Archive, title: t("about.f3t"), desc: t("about.f3d") },
    { icon: HeartHandshake, title: t("about.f4t"), desc: t("about.f4d") },
  ];

  return (
    <section id="tentang" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <SectionHeading eyebrow={t("about.eyebrow")} title={t("about.title")} desc={t("about.desc")} />
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-black/5 bg-[#F5F7FA] p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <span className="grid place-items-center size-14 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#D32F2F] text-white mb-5 shadow-lg">
                  <f.icon className="size-7" />
                </span>
                <h3 className="text-[#0F4C81]" style={{ fontWeight: 600 }}>{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
