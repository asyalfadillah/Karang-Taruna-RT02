import { useState } from "react";
import { Plus, Pencil, Trash2, Flag, Sparkles, Eye, EyeOff, Moon } from "lucide-react";
import { toast } from "sonner";
import { useStore, formatDate, type AgendaEvent } from "../../data/store";
import { Modal, ConfirmDialog, Field, inputClass } from "./ui";

const empty = { title: "", date: new Date().toISOString().slice(0, 10), description: "", showCountdown: true };

export function EventsPage() {
  const { events, customEvents, addEvent, updateEvent, deleteEvent } = useStore();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<AgendaEvent | null>(null);
  const [form, setForm] = useState(empty);
  const [del, setDel] = useState<AgendaEvent | null>(null);

  const openNew = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (e: AgendaEvent) => { setEditing(e); setForm({ title: e.title, date: e.date, description: e.description, showCountdown: e.showCountdown }); setModal(true); };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) { updateEvent(editing.id, form); toast.success("Kegiatan diperbarui."); }
    else { addEvent(form); toast.success("Kegiatan ditambahkan ke kalender."); }
    setModal(false);
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const autoEvents = events.filter((e) => e.type !== "custom" && e.date >= todayStr);

  const toggleCountdown = (e: AgendaEvent) => {
    updateEvent(e.id, { showCountdown: !e.showCountdown });
    toast.success(e.showCountdown ? "Hitung mundur disembunyikan." : "Hitung mundur ditampilkan.");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-[#0F4C81]" style={{ fontWeight: 700 }}>Kalender Kegiatan</h1>
          <p className="text-muted-foreground text-sm">Tambahkan kegiatan sendiri. Hari besar nasional & Islam muncul otomatis.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D32F2F] text-white hover:bg-[#b71c1c] transition shadow-lg" style={{ fontWeight: 600 }}>
          <Plus className="size-5" /> Tambah Kegiatan
        </button>
      </div>

      {/* custom events */}
      <div>
        <h3 className="text-[#0F4C81] mb-3 flex items-center gap-2" style={{ fontWeight: 600 }}><Sparkles className="size-5 text-[#D4AF37]" /> Kegiatan RT 02</h3>
        {customEvents.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-[#0F4C81]/20 bg-white p-10 text-center text-muted-foreground">Belum ada kegiatan. Klik "Tambah Kegiatan".</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...customEvents].sort((a, b) => a.date.localeCompare(b.date)).map((e) => (
              <div key={e.id} className="bg-white rounded-2xl border border-black/5 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[#0F4C81] line-clamp-1" style={{ fontWeight: 600 }}>{e.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(e.date)}</p>
                  </div>
                  <span title={e.showCountdown ? "Hitung mundur tampil" : "Hitung mundur disembunyikan"} className={`grid place-items-center size-8 rounded-lg shrink-0 ${e.showCountdown ? "bg-green-100 text-green-600" : "bg-black/5 text-muted-foreground"}`}>
                    {e.showCountdown ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  </span>
                </div>
                {e.description && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{e.description}</p>}
                <div className="mt-4 flex gap-2">
                  <button onClick={() => openEdit(e)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] text-sm hover:bg-[#0F4C81] hover:text-white transition"><Pencil className="size-4" /> Edit</button>
                  <button onClick={() => setDel(e)} className="grid place-items-center size-9 rounded-lg bg-red-50 text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white transition"><Trash2 className="size-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* hari nasional & Islam (otomatis, hitung mundur bisa diatur) */}
      <div>
        <h3 className="text-[#0F4C81] mb-1 flex items-center gap-2" style={{ fontWeight: 600 }}>
          <Flag className="size-5 text-[#D32F2F]" /> Hari Besar Nasional & Islam (Otomatis)
        </h3>
        <p className="text-sm text-muted-foreground mb-3">Tanggal terisi otomatis. Atur apakah hitung mundur ditampilkan di kalender.</p>
        <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5">
          {autoEvents.map((e) => (
            <div key={e.id} className="flex items-center gap-3 p-3">
              <span className={`grid place-items-center size-9 rounded-lg shrink-0 ${e.type === "islamic" ? "bg-green-100 text-green-600" : "bg-[#D32F2F]/10 text-[#D32F2F]"}`}>
                {e.type === "islamic" ? <Moon className="size-4" /> : <Flag className="size-4" />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ fontWeight: 500 }}>{e.title}</p>
                <p className="text-xs text-muted-foreground">{formatDate(e.date)}</p>
              </div>
              <button
                onClick={() => toggleCountdown(e)}
                title={e.showCountdown ? "Hitung mundur tampil — klik untuk sembunyikan" : "Hitung mundur tersembunyi — klik untuk tampilkan"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition ${e.showCountdown ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-black/5 text-muted-foreground hover:bg-black/10"}`}
              >
                {e.showCountdown ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                <span className="hidden sm:inline">Hitung mundur</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Kegiatan" : "Tambah Kegiatan"}>
        <form onSubmit={save} className="space-y-4">
          <Field label="Nama Kegiatan"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} placeholder="Contoh: Rapat Persiapan HUT RI" /></Field>
          <Field label="Tanggal"><input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} /></Field>
          <Field label="Deskripsi"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass} /></Field>
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#F5F7FA]">
            <span className="text-sm">Tampilkan hitung mundur di kalender</span>
            <input type="checkbox" checked={form.showCountdown} onChange={(e) => setForm({ ...form, showCountdown: e.target.checked })} className="accent-[#0F4C81] size-5" />
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl bg-[#F5F7FA] hover:bg-black/5 transition" style={{ fontWeight: 600 }}>Batal</button>
            <button className="flex-1 py-2.5 rounded-xl bg-[#0F4C81] text-white hover:bg-[#D32F2F] transition" style={{ fontWeight: 600 }}>Simpan</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={() => { if (del) { deleteEvent(del.id); toast.success("Kegiatan dihapus."); } }} message={`Hapus kegiatan "${del?.title}"?`} />
    </div>
  );
}
