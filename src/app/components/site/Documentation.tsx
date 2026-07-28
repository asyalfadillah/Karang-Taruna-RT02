import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { useStore, formatDate, countMedia } from "../../data/store";
import { Reveal, SectionHeading } from "./Reveal";
import { AlbumCard } from "./AlbumCard";
import { Link } from "react-router";

export function Documentation({ onSearch }: { onSearch: () => void }) {
  const { albums, photos, videos } = useStore();
  const published = albums.filter((a) => a.status === "publish");
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <section id="dokumentasi" className="py-24 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Dokumentasi"
            title="Album Kegiatan"
            desc="Jelajahi album dokumentasi kegiatan HUT RI dan Panggung Kemerdekaan yang telah kami arsipkan."
          />
        </Reveal>

        <div className="flex items-center justify-between mb-8">
          <button onClick={onSearch} className="text-sm text-[#0F4C81] hover:text-[#D32F2F] transition" style={{ fontWeight: 600 }}>
            🔍 Cari dokumentasi
          </button>
          <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-black/5">
            <button onClick={() => setView("grid")} className={`p-2 rounded-md transition ${view === "grid" ? "bg-[#0F4C81] text-white" : "text-muted-foreground"}`} aria-label="Grid">
              <LayoutGrid className="size-4" />
            </button>
            <button onClick={() => setView("list")} className={`p-2 rounded-md transition ${view === "list" ? "bg-[#0F4C81] text-white" : "text-muted-foreground"}`} aria-label="List">
              <List className="size-4" />
            </button>
          </div>
        </div>

        {published.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border-2 border-dashed border-[#0F4C81]/20 bg-white">
            <p className="text-lg text-[#0F4C81]" style={{ fontWeight: 600 }}>Belum ada album dokumentasi</p>
            <p className="text-muted-foreground mt-1">Album akan ditambahkan oleh admin melalui panel CMS.</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {published.map((a, i) => (
              <Reveal key={a.id} delay={(i % 3) * 0.1}>
                <AlbumCard album={a} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {published.map((a) => {
              const c = countMedia(a.id, photos, videos);
              return (
                <Link
                  key={a.id}
                  to={`/album/${a.id}`}
                  className="flex gap-5 bg-white rounded-2xl border border-black/5 p-4 hover:shadow-lg transition group"
                >
                  <img src={a.cover} alt={a.name} loading="lazy" className="size-28 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#0F4C81]" style={{ fontWeight: 600 }}>{a.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{a.description}</p>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>{formatDate(a.date)}</span>
                      <span>{c.photos} Foto</span>
                      <span>{c.videos} Video</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
