import { Reveal, SectionHeading } from "./Reveal";
import { HeartHandshake } from "lucide-react";

// Ganti/tambah nama donatur di sini SAJA — otomatis kepakai di Beranda dan di halaman /donatur.
// name = nama donatur, note = keterangan opsional (mis. "Warga Blok C1")
export const DONORS: { name: string; note?: string }[] = [
  { name: "Bapak Ahmad Fauzi", note: "Warga Blok A" },
  { name: "Ibu Siti Rahayu", note: "Warga Blok B" },
  { name: "Keluarga Bapak Hendra", note: "Warga Blok C" },
  { name: "Ibu Dewi Lestari" },
  { name: "Bapak Joko Susanto" },
  { name: "Toko Sumber Rejeki" },
  { name: "Keluarga Bapak Rudi Hartono" },
  { name: "Ibu Ratna Sari" },
];

export function Donors() {
  return (
    <section id="donatur" className="py-24 bg-[#F5F7FA]">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Ucapan Terima Kasih"
            title="Terima Kasih Kepada Para Donatur"
            desc="Terselenggaranya rangkaian kegiatan HUT RI dan Panggung Kemerdekaan RT 02 tidak lepas dari dukungan serta kemurahan hati Bapak/Ibu warga sekalian. Atas nama Remaja Karang Taruna RT 02, kami mengucapkan terima kasih yang sebesar-besarnya atas segala bentuk sumbangan, baik materi, tenaga, maupun doa, yang telah diberikan. Semoga kebaikan Bapak/Ibu dibalas berlipat ganda oleh Allah SWT."
          />
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DONORS.map((d, i) => (
            <Reveal key={d.name} delay={i * 0.05}>
              <div className="h-full flex items-center gap-3 rounded-xl border border-black/5 bg-white p-4 hover:shadow-md transition-all duration-300">
                <span className="grid place-items-center size-10 shrink-0 rounded-lg bg-gradient-to-br from-[#0F4C81] to-[#D32F2F] text-white">
                  <HeartHandshake className="size-5" />
                </span>
                <div>
                  <p className="text-sm text-[#0F4C81]" style={{ fontWeight: 600 }}>{d.name}</p>
                  {d.note && <p className="text-xs text-muted-foreground">{d.note}</p>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="text-center text-sm text-muted-foreground mt-10">
            Mohon maaf apabila terdapat nama yang belum tercantum atau terjadi kekeliruan penulisan.
            Silakan hubungi pengurus RT 02 untuk konfirmasi dan perbaikan data.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
