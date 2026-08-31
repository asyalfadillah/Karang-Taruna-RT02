import { MapPin, Mail } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useLang } from "../../i18n/i18n";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.6 5.82c-.7-.76-1.09-1.75-1.09-2.82h-3.02v13.44c0 1.5-1.22 2.71-2.71 2.71s-2.71-1.22-2.71-2.71 1.22-2.71 2.71-2.71c.28 0 .55.04.8.12v-3.07c-.27-.04-.53-.06-.8-.06-3.16 0-5.73 2.57-5.73 5.73s2.57 5.73 5.73 5.73 5.73-2.57 5.73-5.73V9.01c1.14.82 2.53 1.3 4.03 1.3V7.29c-1.13 0-2.13-.36-2.94-1.47Z" />
    </svg>
  );
}

const CONTACTS = [
  { icon: TikTokIcon, label: "TikTok", value: "@comdoea", href: "https://www.tiktok.com/@comdoea", color: "#010101" },
  { icon: Mail, label: "Email", value: "karangtarunakalibata02@gmail.com", href: "mailto:karangtarunakalibata02@gmail.com", color: "#1C3A54" },
];

export function Contact() {
  const { t } = useLang();
  return (
    <section id="kontak" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <SectionHeading eyebrow={t("contact.eyebrow")} title={t("contact.title")} desc={t("contact.desc")} />
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8">
          <Reveal>
            <div className="space-y-5">
              <div className="rounded-2xl border border-black/5 bg-[#F6F2EA] p-6">
                <div className="flex gap-4">
                  <span className="grid place-items-center size-12 rounded-xl bg-[#1C3A54] text-white shrink-0"><MapPin className="size-6" /></span>
                  <div>
                    <h3 className="text-[#1C3A54]" style={{ fontWeight: 600 }}>{t("contact.orgName")}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      Jl. Kalibata Tengah XVI, RT.02/RW.003,<br />
                      Kelurahan Kalibata, Kecamatan Pancoran,<br />
                      Jakarta Selatan, DKI Jakarta 12740
                    </p>
                  </div>
                </div>
              </div>

              {CONTACTS.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-5 hover:shadow-lg hover:-translate-y-0.5 transition"
                >
                  <span className="grid place-items-center size-12 rounded-xl text-white shrink-0" style={{ background: c.color }}>
                    <c.icon className="size-6" />
                  </span>
                  <div>
                    <p className="text-sm text-muted-foreground">{c.label}</p>
                    <p style={{ fontWeight: 600 }}>{c.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl overflow-hidden border border-black/5 shadow-lg h-full min-h-[420px]">
              <iframe
                title="Lokasi RT 02 Kalibata"
                src="https://www.google.com/maps?q=Kalibata,Pancoran,Jakarta+Selatan&output=embed"
                className="size-full min-h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
