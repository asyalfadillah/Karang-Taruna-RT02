import { useRef, useState } from "react";
import { Upload, Pencil, Trash2, Star, Search } from "lucide-react";
import { toast } from "sonner";
import { useStore, formatDate, type Photo } from "../../data/store";
import { compressImage } from "../../data/imageCompress";
import { Modal, ConfirmDialog, Field, inputClass } from "./ui";

export function PhotosPage() {
  const { albums, photos, addPhoto, updatePhoto, deletePhoto, updateAlbum } = useStore();
  const [albumId, setAlbumId] = useState<string>(albums[0]?.id ?? "");
  const [q, setQ] = useState("");
  const [drag, setDrag] = useState(false);
  const [editing, setEditing] = useState<Photo | null>(null);
  const [del, setDel] = useState<Photo | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const list = photos.filter((p) => (albumId ? p.albumId === albumId : true) && (p.title.toLowerCase().includes(q.toLowerCase()) || p.tags.join(" ").toLowerCase().includes(q.toLowerCase())));

  const handleFiles = (files: FileList | null) => {
    if (!files || !albumId) {
      if (!albumId) toast.error("Pilih album terlebih dahulu.");
      return;
    }
    Array.from(files).forEach(async (file) => {
      try {
        const url = await compressImage(file);
        addPhoto({ albumId, url, title: file.name.replace(/\.[^.]+$/, ""), caption: "", tags: [], date: new Date().toISOString().slice(0, 10) });
      } catch {
        toast.error(`Gagal memproses foto ${file.name}.`);
      }
    });
    toast.success(`${files.length} foto berhasil diunggah.`);
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    updatePhoto(editing.id, editing);
    toast.success("Foto diperbarui.");
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-[#1C3A54]" style={{ fontWeight: 700 }}>Kelola Foto</h1>
        <p className="text-muted-foreground text-sm">Unggah dan kelola foto di dalam album.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={albumId} onChange={(e) => setAlbumId(e.target.value)} className={inputClass + " max-w-xs"}>
          <option value="">Semua Album</option>
          {albums.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari foto / tag..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-black/5 outline-none focus:border-[#1C3A54]" />
        </div>
      </div>

      {/* dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${drag ? "border-[#9C2B2F] bg-red-50" : "border-[#1C3A54]/30 bg-white hover:bg-[#F6F2EA]"}`}
      >
        <span className="grid place-items-center size-14 rounded-full bg-[#1C3A54]/10 text-[#1C3A54] mx-auto mb-3"><Upload className="size-7" /></span>
        <p style={{ fontWeight: 600 }}>Tarik & lepas foto di sini, atau klik untuk memilih</p>
        <p className="text-sm text-muted-foreground mt-1">Mendukung JPG, PNG, WEBP · Multiple Upload</p>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {list.map((p) => (
          <div key={p.id} className="group relative rounded-2xl overflow-hidden bg-white border border-black/5">
            <img src={p.url} alt={p.title} loading="lazy" className="aspect-square w-full object-cover" />
            <div className="p-3">
              <p className="text-sm truncate" style={{ fontWeight: 500 }}>{p.title}</p>
              <p className="text-xs text-muted-foreground">{formatDate(p.date)}</p>
              {p.tags.length > 0 && <p className="text-xs text-[#1C3A54] truncate mt-1">#{p.tags.join(" #")}</p>}
            </div>
            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
              <button title="Jadikan cover album" onClick={() => { updateAlbum(p.albumId, { cover: p.url }); toast.success("Foto dijadikan cover album."); }} className="grid place-items-center size-8 rounded-lg bg-white/90 text-[#A8802F] hover:bg-[#A8802F] hover:text-white transition"><Star className="size-4" /></button>
              <button onClick={() => setEditing(p)} className="grid place-items-center size-8 rounded-lg bg-white/90 text-[#1C3A54] hover:bg-[#1C3A54] hover:text-white transition"><Pencil className="size-4" /></button>
              <button onClick={() => setDel(p)} className="grid place-items-center size-8 rounded-lg bg-white/90 text-[#9C2B2F] hover:bg-[#9C2B2F] hover:text-white transition"><Trash2 className="size-4" /></button>
            </div>
          </div>
        ))}
      </div>
      {list.length === 0 && <p className="text-center text-muted-foreground py-10">Belum ada foto.</p>}

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Foto">
        {editing && (
          <form onSubmit={saveEdit} className="space-y-4">
            <img src={editing.url} alt={editing.title} className="w-full h-48 object-cover rounded-xl" />
            <Field label="Judul"><input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputClass} /></Field>
            <Field label="Caption"><textarea value={editing.caption} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} rows={2} className={inputClass} /></Field>
            <Field label="Keywords / Tags (pisahkan dengan koma)">
              <input value={editing.tags.join(", ")} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} className={inputClass} />
            </Field>
            <Field label="Album">
              <select value={editing.albumId} onChange={(e) => setEditing({ ...editing, albumId: e.target.value })} className={inputClass}>
                {albums.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </Field>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="flex-1 py-2.5 rounded-xl bg-[#F6F2EA] hover:bg-black/5 transition" style={{ fontWeight: 600 }}>Batal</button>
              <button className="flex-1 py-2.5 rounded-xl bg-[#1C3A54] text-white hover:bg-[#9C2B2F] transition" style={{ fontWeight: 600 }}>Simpan</button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={() => { if (del) { deletePhoto(del.id); toast.success("Foto dihapus."); } }} message={`Hapus foto "${del?.title}"?`} />
    </div>
  );
}
