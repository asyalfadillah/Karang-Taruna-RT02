import { useRef, useState } from "react";
import { FileSpreadsheet, FileText, File as FileIcon, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useStore, type ReportFileType } from "../../data/store";
import { Field, inputClass, ConfirmDialog } from "./ui";

const FILE_META: Record<ReportFileType, { label: string; icon: typeof FileText; color: string }> = {
  xlsx: { label: "Excel", icon: FileSpreadsheet, color: "#1D6F42" },
  pdf: { label: "PDF", icon: FileText, color: "#D32F2F" },
  docx: { label: "Word", icon: FileText, color: "#2B579A" },
  other: { label: "File", icon: FileIcon, color: "#0F4C81" },
};

const MAX_SIZE = 8 * 1024 * 1024; // 8MB — biar aman disimpan di database

function detectType(name: string): ReportFileType {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["xlsx", "xls", "csv"].includes(ext)) return "xlsx";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx"].includes(ext)) return "docx";
  return "other";
}

export function ReportsPage() {
  const { reports, addReport, deleteReport } = useStore();
  const [year, setYear] = useState(new Date().getFullYear());
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [del, setDel] = useState<{ id: string; title: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const years = [...new Set(reports.map((r) => r.year))].sort((a, b) => b - a);

  const handleUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!title.trim()) {
      toast.error("Isi dulu judul laporannya (mis. 'Laporan Kas Bulan Agustus').");
      return;
    }
    const file = files[0];
    if (file.size > MAX_SIZE) {
      toast.error("Ukuran file maksimal 8MB. Kompres dulu file-nya ya.");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      addReport({
        title: title.trim(),
        year,
        fileType: detectType(file.name),
        fileName: file.name,
        fileUrl: reader.result as string,
      });
      toast.success("Laporan berhasil diunggah.");
      setTitle("");
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    };
    reader.onerror = () => {
      toast.error("Gagal membaca file.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl text-[#0F4C81]" style={{ fontWeight: 700 }}>Laporan Keuangan</h1>
        <p className="text-muted-foreground text-sm">Unggah laporan keuangan (Excel, PDF, Word) yang akan tampil di halaman utama, dikelompokkan per tahun.</p>
      </div>

      <div className="rounded-2xl bg-white border border-black/5 p-5 space-y-4 max-w-xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Judul Laporan">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Laporan Kas Bulan Agustus" className={inputClass} />
          </Field>
          <Field label="Tahun">
            <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className={inputClass} />
          </Field>
        </div>
        <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#0F4C81]/30 bg-[#F5F7FA] p-6 cursor-pointer hover:border-[#0F4C81]/60 transition">
          <Upload className="size-6 text-[#0F4C81]" />
          <span className="text-sm text-muted-foreground">{uploading ? "Mengunggah..." : "Klik untuk pilih file (PDF, Excel, Word) — maks 8MB"}</span>
          <input ref={fileRef} type="file" accept=".pdf,.xlsx,.xls,.csv,.doc,.docx" className="hidden" onChange={(e) => handleUpload(e.target.files)} disabled={uploading} />
        </label>
      </div>

      {years.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#0F4C81]/20 bg-white p-10 text-center text-muted-foreground">
          Belum ada laporan yang diunggah.
        </div>
      ) : (
        years.map((y) => (
          <div key={y} className="space-y-3">
            <h2 className="text-[#0F4C81]" style={{ fontWeight: 700 }}>Tahun {y}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {reports.filter((r) => r.year === y).map((r) => {
                const meta = FILE_META[r.fileType] || FILE_META.other;
                const Icon = meta.icon;
                return (
                  <div key={r.id} className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-4">
                    <span className="grid place-items-center size-10 shrink-0 rounded-lg text-white" style={{ backgroundColor: meta.color }}>
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm truncate" style={{ fontWeight: 600 }}>{r.title}</p>
                      <p className="text-xs text-muted-foreground">{meta.label} &middot; {r.fileName}</p>
                    </div>
                    <button
                      onClick={() => setDel({ id: r.id, title: r.title })}
                      className="grid place-items-center size-9 shrink-0 rounded-lg bg-red-50 text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white transition"
                      title="Hapus laporan"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      <ConfirmDialog
        open={!!del}
        onClose={() => setDel(null)}
        onConfirm={() => {
          if (del) {
            deleteReport(del.id);
            toast.success("Laporan dihapus.");
          }
        }}
        title="Hapus Laporan"
        message={`Hapus laporan "${del?.title}"? Tindakan ini tidak bisa dibatalkan.`}
      />
    </div>
  );
}
