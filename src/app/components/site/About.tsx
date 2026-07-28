import { Reveal, SectionHeading } from "./Reveal";
import { Camera, Video, Archive, HeartHandshake } from "lucide-react";

const FEATURES = [
  { icon: Camera, title: "Arsip Foto", desc: "Kumpulan foto kegiatan yang tertata rapi per album." },
  { icon: Video, title: "Galeri Video", desc: "Rekaman momen penting dalam format video." },
  { icon: Archive, title: "Arsip Digital", desc: "Dokumentasi tersimpan aman dan mudah diakses." },
  { icon: HeartHandshake, title: "Kebersamaan", desc: "Menjaga semangat gotong royong warga RT 02." },
];

export function About() {
  return (
    <section id="tentang" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Tentang Dokumentasi"
            title="Mengabadikan Semangat Kemerdekaan RT 02"
            desc="Website ini berisi dokumentasi foto dan video kegiatan HUT RI serta Panggung Kemerdekaan yang diselenggarakan oleh Remaja Karang Taruna RT 02 sebagai arsip digital yang mudah diakses kapan saja."
          />
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
