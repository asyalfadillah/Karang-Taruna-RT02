import { useRef, useState } from "react";
import { Upload, Trash2, Megaphone, Eye, EyeOff, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { useStore, type Poster } from "../../data/store";
import { compressImage } from "../../data/imageCompress";
import { Field, inputClass, ConfirmDialog } from "./ui";

export function PostersPage() {
  const { posters, addPoster, updatePoster, deletePoster } = useStore();
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [del, setDel] = useState<{ id: string; title: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!title.trim()) {
      toast.error("Isi dulu judul posternya (mis. 'Jadwal Ronda Agustus').");
      return;
    }
    setUploading(true);
    try {
      const url = await compressImage(files[0], 1200, 0.82);
      addPoster({
        title: title.trim(),
        imageUrl: url,
        link: link.trim() || undefined,
        active: true,
        showAsPopup: posters.every((p) => !p.showAsPopup), // otomatis jadi popup kalau belum ada poster popup lain
      });
      toast.success("Poster berhasil diunggah.");
      setTitle("");
      setLink("");
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      toast.error("Gagal memproses gambar poster.");
    } finally {
      setUploading(false);
    }
  };

  const setAsPopup = (id: string) => {
    // Cuma boleh 1 poster yang jadi popup dalam satu waktu.
    posters.forEach((p) => {
      if (p.showAsPopup && p.id !== id) updatePoster(p.id, { showAsPopup: false });
    });
    updatePoster(id, { showAsPopup: true, active: true });
    toast.success("Poster ini sekarang jadi popup di beranda.");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl text-[#0F4C81]" style={{ fontWeight: 700 }}>Poster Informasi</h1>
        <p className="text-muted-foreground text-sm">
          Kelola poster/pengumuman. Satu poster bisa ditandai muncul sebagai <b>popup</b> di beranda (sebelum pengunjung scroll), dan semua poster aktif tampil di section &quot;Poster Informasi&quot;.
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-black/5 p-5 space-y-4 max-w-xl">
        <Field label="Judul Poster">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Jadwal Ronda Agustus 2026" className={inputClass} />
        </Field>
        <Field label="Link tujuan (opsional)">
          <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://... (kosongkan kalau tidak ada)" className={inputClass} />
        </Field>
        <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#0F4C81]/30 bg-[#F5F7FA] p-6 cursor-pointer hover:border-[#0F4C81]/60 transition">
          <Upload className="size-6 text-[#0F4C81]" />
          <span className="text-sm text-muted-foreground">{uploading ? "Mengunggah..." : "Klik untuk pilih gambar poster"}</span>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files)} disabled={uploading} />
        </label>
      </div>

      {posters.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#0F4C81]/20 bg-white p-10 text-center text-muted-foreground">
          Belum ada poster yang diunggah.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posters.map((p) => (
            <div key={p.id} className="rounded-2xl border border-black/5 bg-white overflow-hidden">
              <div className="aspect-[3/4] bg-[#F5F7FA]">
                <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 space-y-2">
                <p className="text-sm truncate" style={{ fontWeight: 600 }}>{p.title}</p>
                {p.link && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                    <LinkIcon className="size-3 shrink-0" /> {p.link}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => updatePoster(p.id, { active: !p.active })}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition ${p.active ? "bg-green-50 text-green-700" : "bg-black/5 text-muted-foreground"}`}
                  >
                    {p.active ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />} {p.active ? "Aktif" : "Nonaktif"}
                  </button>
                  <button
                    onClick={() => setAsPopup(p.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition ${p.showAsPopup ? "bg-[#D32F2F] text-white" : "bg-black/5 text-muted-foreground hover:bg-black/10"}`}
                  >
                    <Megaphone className="size-3.5" /> {p.showAsPopup ? "Popup Aktif" : "Jadikan Popup"}
                  </button>
                  <button
                    onClick={() => setDel({ id: p.id, title: p.title })}
                    className="ml-auto grid place-items-center size-8 rounded-lg bg-red-50 text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white transition"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!del}
        onClose={() => setDel(null)}
        onConfirm={() => {
          if (del) {
            deletePoster(del.id);
            toast.success("Poster dihapus.");
          }
        }}
        title="Hapus Poster"
        message={`Hapus poster "${del?.title}"? Tindakan ini tidak bisa dibatalkan.`}
      />
    </div>
  );
}
