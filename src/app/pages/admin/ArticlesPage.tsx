import { useState } from "react";
import { Trash2, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useStore, type ArticleCategory } from "../../data/store";
import { Field, inputClass, ConfirmDialog } from "./ui";

const SOURCES = [
  "Dinas Kesehatan DKI Jakarta",
  "Dinas Lingkungan Hidup DKI Jakarta",
  "Kementerian Kesehatan RI",
  "Kementerian Lingkungan Hidup",
];

export function ArticlesPage() {
  const { articles, addArticle, deleteArticle } = useStore();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [source, setSource] = useState(SOURCES[0]);
  const [sourceUrl, setSourceUrl] = useState("");
  const [category, setCategory] = useState<ArticleCategory>("kesehatan");
  const [del, setDel] = useState<{ id: string; title: string } | null>(null);

  const submit = () => {
    if (!title.trim() || !summary.trim()) {
      toast.error("Judul dan ringkasan wajib diisi.");
      return;
    }
    if (sourceUrl.trim() && !/^https?:\/\//.test(sourceUrl.trim())) {
      toast.error("Link sumber harus diawali https://");
      return;
    }
    addArticle({ title: title.trim(), summary: summary.trim(), source: source.trim(), sourceUrl: sourceUrl.trim(), category });
    toast.success("Informasi ditambahkan.");
    setTitle("");
    setSummary("");
    setSourceUrl("");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl text-[#1C3A54]" style={{ fontWeight: 700 }}>Info Kesehatan & Lingkungan</h1>
        <p className="text-muted-foreground text-sm">
          Salin judul dan ringkas isi berita/imbauan dari situs resmi Dinkes, DLH, Kemenkes atau KLH, lalu tempel link aslinya. Tampil di section &quot;Informasi Lingkungan & Kesehatan&quot; di beranda.
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-black/5 p-5 space-y-4 max-w-xl">
        <Field label="Judul">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="Imbauan waspada DBD musim hujan" />
        </Field>
        <Field label="Ringkasan">
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={4} className={inputClass} placeholder="Ringkasan 2-3 kalimat dengan bahasa sendiri" />
        </Field>
        <Field label="Kategori">
          <select value={category} onChange={(e) => setCategory(e.target.value as ArticleCategory)} className={inputClass}>
            <option value="kesehatan">Kesehatan</option>
            <option value="lingkungan">Lingkungan</option>
          </select>
        </Field>
        <Field label="Sumber">
          <input value={source} onChange={(e) => setSource(e.target.value)} list="article-sources" className={inputClass} />
          <datalist id="article-sources">{SOURCES.map((s) => <option key={s} value={s} />)}</datalist>
        </Field>
        <Field label="Link sumber (opsional)">
          <input value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} className={inputClass} placeholder="https://..." />
        </Field>
        <button onClick={submit} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1C3A54] text-white text-sm hover:bg-[#122A3D] transition" style={{ fontWeight: 600 }}>
          <Plus className="size-4" /> Tambah
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#1C3A54]/20 bg-white p-10 text-center text-muted-foreground">Belum ada informasi.</div>
      ) : (
        <div className="space-y-3 max-w-3xl">
          {articles.map((a) => (
            <div key={a.id} className="rounded-2xl border border-black/5 bg-white p-4 flex gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#A8802F] uppercase" style={{ fontWeight: 600 }}>{a.category} · {a.source}</p>
                <p className="text-sm mt-1" style={{ fontWeight: 600 }}>{a.title}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{a.summary}</p>
                {a.sourceUrl && (
                  <a href={a.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#9C2B2F] inline-flex items-center gap-1 mt-1">
                    Buka sumber <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
              <button onClick={() => setDel({ id: a.id, title: a.title })} className="grid place-items-center size-8 shrink-0 rounded-lg bg-red-50 text-[#9C2B2F] hover:bg-[#9C2B2F] hover:text-white transition">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!del}
        onClose={() => setDel(null)}
        onConfirm={() => {
          if (del) {
            deleteArticle(del.id);
            toast.success("Informasi dihapus.");
          }
        }}
        title="Hapus Informasi"
        message={`Hapus "${del?.title}"? Tindakan ini tidak bisa dibatalkan.`}
      />
    </div>
  );
}
