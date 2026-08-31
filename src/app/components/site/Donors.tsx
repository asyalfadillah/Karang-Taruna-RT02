import { Reveal, SectionHeading } from "./Reveal";
import { HeartHandshake } from "lucide-react";
import { useLang } from "../../i18n/i18n";

// Ganti/tambah nama donatur di sini SAJA — otomatis kepakai di Beranda dan di halaman /donatur.
// name = nama donatur, note = keterangan opsional (mis. "Warga Blok C1")
export const DONORS: { name: string; note?: string }[] = [
  { name: "Warga RT.02/003" },
  { name: "Warga RT.02/003", note: "Memiliki Usaha di lingkungan RT.02" },
];

export function Donors() {
  const { t } = useLang();
  return (
    <section id="donatur" className="py-24 bg-[#F6F2EA]">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={t("donors.eyebrow")}
            title={t("donors.title")}
            desc={t("donors.desc")}
          />
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DONORS.map((d, i) => (
            <Reveal key={d.name} delay={i * 0.05}>
              <div className="h-full flex items-center gap-3 rounded-xl border border-black/5 bg-white p-4 hover:shadow-md transition-all duration-300">
                <span className="grid place-items-center size-10 shrink-0 rounded-lg bg-[#9C2B2F] text-white">
                  <HeartHandshake className="size-5" />
                </span>
                <div>
                  <p className="text-sm text-[#1C3A54]" style={{ fontWeight: 600 }}>{d.name}</p>
                  {d.note && <p className="text-xs text-muted-foreground">{d.note}</p>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="text-center text-sm text-muted-foreground mt-10">
            {t("donors.note")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
