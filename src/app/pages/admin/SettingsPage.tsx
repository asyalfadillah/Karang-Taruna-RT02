import { useState } from "react";
import { toast } from "sonner";
import { Field, inputClass } from "./ui";

export function SettingsPage() {
  const [site, setSite] = useState({
    name: "Remaja Karang Taruna RT 02",
    tagline: "Bersama Berkarya, Bersatu Membangun Lingkungan",
    email: "karangtaruna.rt02@gmail.com",
    whatsapp: "+62 812-3456-7890",
    instagram: "@karangtaruna.rt02",
    address: "Jl. Kalibata Tengah XVI, RT.02/RW.003, Kelurahan Kalibata, Kecamatan Pancoran, Jakarta Selatan, DKI Jakarta 12740",
  });
  const [prefs, setPrefs] = useState({ autoIndex: true, lazyLoad: true, publicDownload: true });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl text-[#0F4C81]" style={{ fontWeight: 700 }}>Pengaturan</h1>
        <p className="text-muted-foreground text-sm">Kelola informasi umum website dan preferensi.</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); toast.success("Pengaturan berhasil disimpan."); }}
        className="bg-white rounded-2xl border border-black/5 p-6 space-y-4"
      >
        <h3 className="text-[#0F4C81]" style={{ fontWeight: 600 }}>Informasi Umum</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nama Organisasi"><input value={site.name} onChange={(e) => setSite({ ...site, name: e.target.value })} className={inputClass} /></Field>
          <Field label="Tagline"><input value={site.tagline} onChange={(e) => setSite({ ...site, tagline: e.target.value })} className={inputClass} /></Field>
          <Field label="Email"><input value={site.email} onChange={(e) => setSite({ ...site, email: e.target.value })} className={inputClass} /></Field>
          <Field label="WhatsApp"><input value={site.whatsapp} onChange={(e) => setSite({ ...site, whatsapp: e.target.value })} className={inputClass} /></Field>
          <Field label="Instagram"><input value={site.instagram} onChange={(e) => setSite({ ...site, instagram: e.target.value })} className={inputClass} /></Field>
        </div>
        <Field label="Alamat"><textarea value={site.address} onChange={(e) => setSite({ ...site, address: e.target.value })} rows={2} className={inputClass} /></Field>

        <h3 className="text-[#0F4C81] pt-2" style={{ fontWeight: 600 }}>Preferensi</h3>
        <div className="space-y-3">
          {([
            ["autoIndex", "Indeks otomatis media ke mesin pencari"],
            ["lazyLoad", "Aktifkan lazy loading gambar"],
            ["publicDownload", "Izinkan pengunjung mengunduh foto"],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between p-3 rounded-xl bg-[#F5F7FA]">
              <span className="text-sm">{label}</span>
              <input type="checkbox" checked={prefs[key]} onChange={(e) => setPrefs({ ...prefs, [key]: e.target.checked })} className="accent-[#0F4C81] size-5" />
            </label>
          ))}
        </div>

        <button className="px-6 py-2.5 rounded-xl bg-[#0F4C81] text-white hover:bg-[#D32F2F] transition" style={{ fontWeight: 600 }}>Simpan Pengaturan</button>
      </form>
    </div>
  );
}
