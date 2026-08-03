import { useState } from "react";
import { Plus, Pencil, Trash2, Play } from "lucide-react";
import { toast } from "sonner";
import { useStore, formatDate, type Video } from "../../data/store";
import { compressImage } from "../../data/imageCompress";
import { Modal, ConfirmDialog, Field, inputClass } from "./ui";

const empty = (albumId: string): Omit<Video, "id"> => ({
  albumId,
  title: "",
  description: "",
  thumbnail: "",
  duration: "00:00",
  source: "youtube",
  url: "",
  tags: [],
  date: new Date().toISOString().slice(0, 10),
});

export function VideosPage() {
  const { albums, videos, addVideo, updateVideo, deleteVideo } = useStore();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [form, setForm] = useState<Omit<Video, "id">>(empty(albums[0]?.id ?? ""));
  const [del, setDel] = useState<Video | null>(null);

  const openNew = () => { setEditing(null); setForm(empty(albums[0]?.id ?? "")); setModal(true); };
  const openEdit = (v: Video) => { setEditing(v); setForm({ ...v }); setModal(true); };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, thumbnail: form.thumbnail || "https://images.unsplash.com/photo-1542897643-cfccd88c7127?w=800&q=80" };
    if (editing) { updateVideo(editing.id, data); toast.success("Video diperbarui."); }
    else { addVideo(data); toast.success("Video ditambahkan."); }
    setModal(false);
  };

  const onThumb = async (file?: File) => {
    if (!file) return;
    try {
      const url = await compressImage(file, 800, 0.78);
      setForm((f) => ({ ...f, thumbnail: url }));
    } catch {
      toast.error("Gagal memproses thumbnail.");
    }
  };

  const albumName = (id: string) => albums.find((a) => a.id === id)?.name ?? "-";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-[#0F4C81]" style={{ fontWeight: 700 }}>Kelola Video</h1>
          <p className="text-muted-foreground text-sm">Unggah video MP4 atau sematkan dari YouTube.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D32F2F] text-white hover:bg-[#b71c1c] transition shadow-lg" style={{ fontWeight: 600 }}>
          <Plus className="size-5" /> Upload Video
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((v) => (
          <div key={v.id} className="bg-white rounded-2xl border border-black/5 overflow-hidden hover:shadow-lg transition">
            <div className="relative aspect-video">
              <img src={v.thumbnail} alt={v.title} className="size-full object-cover" />
              <span className="absolute inset-0 grid place-items-center bg-black/25"><span className="grid place-items-center size-12 rounded-full bg-[#D32F2F] text-white"><Play className="size-5 ml-0.5" fill="currentColor" /></span></span>
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs">{v.duration}</span>
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/90 text-[#0F4C81] text-xs uppercase">{v.source}</span>
            </div>
            <div className="p-4">
              <h3 className="text-[#0F4C81] line-clamp-1" style={{ fontWeight: 600 }}>{v.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{albumName(v.albumId)} · {formatDate(v.date)}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => openEdit(v)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] text-sm hover:bg-[#0F4C81] hover:text-white transition"><Pencil className="size-4" /> Edit</button>
                <button onClick={() => setDel(v)} className="grid place-items-center size-9 rounded-lg bg-red-50 text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white transition"><Trash2 className="size-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {videos.length === 0 && <p className="text-center text-muted-foreground py-10">Belum ada video.</p>}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Video" : "Upload Video"} wide>
        <form onSubmit={save} className="space-y-4">
          <Field label="Judul Video"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} /></Field>
          <Field label="Deskripsi"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputClass} /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Sumber Video">
              <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as Video["source"] })} className={inputClass}>
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="drive">Google Drive</option>
                <option value="mp4">Upload MP4</option>
                <option value="link">Tautan Lainnya</option>
              </select>
            </Field>
            <Field label="Album">
              <select value={form.albumId} onChange={(e) => setForm({ ...form, albumId: e.target.value })} className={inputClass}>
                {albums.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </Field>
          </div>
          <Field label={
            form.source === "youtube" ? "Link YouTube" :
            form.source === "instagram" ? "Link Instagram" :
            form.source === "tiktok" ? "Link TikTok" :
            form.source === "drive" ? "Link Google Drive" :
            form.source === "mp4" ? "URL / File MP4" : "Tautan Video"
          }>
            <input required value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputClass} placeholder={
              form.source === "youtube" ? "https://youtu.be/xxxx atau https://youtube.com/watch?v=xxxx" :
              form.source === "instagram" ? "https://instagram.com/reel/xxxx" :
              form.source === "tiktok" ? "https://tiktok.com/@user/video/xxxx" :
              form.source === "drive" ? "https://drive.google.com/file/d/xxxx/view" :
              "https://.../video.mp4"
            } />
          </Field>
          {form.source === "mp4" && (
            <Field label="Atau unggah file MP4">
              <input type="file" accept="video/mp4" onChange={(e) => { const f = e.target.files?.[0]; if (f) setForm({ ...form, url: URL.createObjectURL(f) }); }} className="text-sm" />
            </Field>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Durasi"><input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className={inputClass} placeholder="04:30" /></Field>
            <Field label="Tanggal Upload"><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} /></Field>
          </div>
          <Field label="Tags (pisahkan dengan koma)"><input value={form.tags.join(", ")} onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} className={inputClass} /></Field>
          <Field label="Thumbnail">
            <div className="flex items-center gap-4">
              {form.thumbnail && <img src={form.thumbnail} alt="thumb" className="w-28 aspect-video rounded-lg object-cover" />}
              <input type="file" accept="image/*" onChange={(e) => onThumb(e.target.files?.[0])} className="text-sm" />
            </div>
          </Field>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-black/5 transition" style={{ fontWeight: 600 }}>Batal</button>
            <button className="flex-1 py-2.5 rounded-xl bg-[#0F4C81] text-white hover:bg-[#D32F2F] transition" style={{ fontWeight: 600 }}>Simpan</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={() => { if (del) { deleteVideo(del.id); toast.success("Video dihapus."); } }} message={`Hapus video "${del?.title}"?`} />
    </div>
  );
}
