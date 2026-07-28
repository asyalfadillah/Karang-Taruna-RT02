import { useState } from "react";
import { Trash2, LayoutGrid, List } from "lucide-react";
import { toast } from "sonner";
import { useStore, formatDate, type Photo } from "../../data/store";
import { ConfirmDialog } from "./ui";

export function GalleryPage() {
  const { albums, photos, deletePhoto } = useStore();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [del, setDel] = useState<Photo | null>(null);
  const albumName = (id: string) => albums.find((a) => a.id === id)?.name ?? "-";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-[#0F4C81]" style={{ fontWeight: 700 }}>Galeri Media</h1>
          <p className="text-muted-foreground text-sm">Seluruh foto dari semua album ({photos.length} foto).</p>
        </div>
        <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-black/5">
          <button onClick={() => setView("grid")} className={`p-2 rounded-md transition ${view === "grid" ? "bg-[#0F4C81] text-white" : "text-muted-foreground"}`}><LayoutGrid className="size-4" /></button>
          <button onClick={() => setView("list")} className={`p-2 rounded-md transition ${view === "list" ? "bg-[#0F4C81] text-white" : "text-muted-foreground"}`}><List className="size-4" /></button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {photos.map((p) => (
            <div key={p.id} className="group relative rounded-xl overflow-hidden">
              <img src={p.url} alt={p.title} loading="lazy" className="aspect-square w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-2">
                <p className="text-white text-xs truncate">{p.title}</p>
              </div>
              <button onClick={() => setDel(p)} className="absolute top-2 right-2 grid place-items-center size-8 rounded-lg bg-white/90 text-[#D32F2F] opacity-0 group-hover:opacity-100 hover:bg-[#D32F2F] hover:text-white transition"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden divide-y divide-black/5">
          {photos.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-3 hover:bg-[#F5F7FA] transition">
              <img src={p.url} alt={p.title} loading="lazy" className="size-14 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ fontWeight: 500 }}>{p.title}</p>
                <p className="text-sm text-muted-foreground">{albumName(p.albumId)} · {formatDate(p.date)}</p>
              </div>
              <button onClick={() => setDel(p)} className="grid place-items-center size-9 rounded-lg bg-red-50 text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white transition"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && <p className="text-center text-muted-foreground py-10">Galeri kosong.</p>}

      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={() => { if (del) { deletePhoto(del.id); toast.success("Foto dihapus."); } }} message={`Hapus foto "${del?.title}"?`} />
    </div>
  );
}
