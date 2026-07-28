import { useState } from "react";
import { Link } from "react-router";
import { Plus, Pencil, Trash2, Image as ImageIcon, Film, Search } from "lucide-react";
import { toast } from "sonner";
import { useStore, formatDate, countMedia, type Album } from "../../data/store";
import { Modal, ConfirmDialog, Field, inputClass } from "./ui";

const empty = { name: "", description: "", date: new Date().toISOString().slice(0, 10), cover: "", status: "draft" as const, driveLink: "" };

export function AlbumsPage() {
  const { albums, photos, videos, addAlbum, updateAlbum, deleteAlbum } = useStore();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Album | null>(null);
  const [form, setForm] = useState<Omit<Album, "id">>(empty);
  const [del, setDel] = useState<Album | null>(null);
  const [q, setQ] = useState("");

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setModal(true);
  };
  const openEdit = (a: Album) => {
    setEditing(a);
    setForm({ name: a.name, description: a.description, date: a.date, cover: a.cover, status: a.status, driveLink: a.driveLink ?? "" });
    setModal(true);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, cover: form.cover || "https://images.unsplash.com/photo-1533805994737-558461dcb28e?w=800&q=80" };
    if (editing) {
      updateAlbum(editing.id, data);
      toast.success("Album berhasil diperbarui.");
    } else {
      addAlbum(data);
      toast.success("Album baru berhasil dibuat.");
    }
    setModal(false);
  };

  const onFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, cover: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const filtered = albums.filter((a) => a.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-[#0F4C81]" style={{ fontWeight: 700 }}>Album Dokumentasi</h1>
          <p className="text-muted-foreground text-sm">Kelola album kegiatan secara manual.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D32F2F] text-white hover:bg-[#b71c1c] transition shadow-lg" style={{ fontWeight: 600 }}>
          <Plus className="size-5" /> Tambah Album
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari album..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-black/5 outline-none focus:border-[#0F4C81]" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((a) => {
          const c = countMedia(a.id, photos, videos);
          return (
            <div key={a.id} className="bg-white rounded-2xl border border-black/5 overflow-hidden hover:shadow-lg transition">
              <div className="relative aspect-video">
                <img src={a.cover} alt={a.name} className="size-full object-cover" />
                <span className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full ${a.status === "publish" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{a.status}</span>
              </div>
              <div className="p-4">
                <h3 className="text-[#0F4C81] line-clamp-1" style={{ fontWeight: 600 }}>{a.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(a.date)}</p>
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><ImageIcon className="size-4" /> {c.photos}</span>
                  <span className="flex items-center gap-1"><Film className="size-4" /> {c.videos}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link to={`/album/${a.id}`} className="flex-1 text-center py-2 rounded-lg bg-[#F5F7FA] text-sm hover:bg-black/5 transition">Lihat</Link>
                  <button onClick={() => openEdit(a)} className="grid place-items-center size-9 rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white transition"><Pencil className="size-4" /></button>
                  <button onClick={() => setDel(a)} className="grid place-items-center size-9 rounded-lg bg-red-50 text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white transition"><Trash2 className="size-4" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && <p className="text-center text-muted-foreground py-10">Tidak ada album.</p>}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Album" : "Tambah Album"} wide>
        <form onSubmit={save} className="space-y-4">
          <Field label="Nama Album">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Contoh: HUT RI ke-81 Tahun 2026" />
          </Field>
          <Field label="Deskripsi">
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass} placeholder="Deskripsi singkat kegiatan" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Tanggal Kegiatan">
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Album["status"] })} className={inputClass}>
                <option value="draft">Draft</option>
                <option value="publish">Publish</option>
              </select>
            </Field>
          </div>
          <Field label="Link Semua Dokumentasi (Google Drive, dll — opsional)">
            <input value={form.driveLink} onChange={(e) => setForm({ ...form, driveLink: e.target.value })} className={inputClass} placeholder="https://drive.google.com/..." />
          </Field>
          <Field label="Foto Cover">
            <div className="flex items-center gap-4">
              {form.cover && <img src={form.cover} alt="cover" className="size-20 rounded-xl object-cover" />}
              <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} className="text-sm" />
            </div>
          </Field>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-black/5 transition" style={{ fontWeight: 600 }}>Batal</button>
            <button className="flex-1 py-2.5 rounded-xl bg-[#0F4C81] text-white hover:bg-[#D32F2F] transition" style={{ fontWeight: 600 }}>Simpan</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={() => { if (del) { deleteAlbum(del.id); toast.success("Album dihapus."); } }} message={`Hapus album "${del?.name}" beserta seluruh foto & videonya?`} />
    </div>
  );
}
