import { AnimatePresence, motion } from "motion/react";
import { Search, X, Mic, Image as ImageIcon, Film, FolderOpen, Clock, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useStore, formatDate } from "../../data/store";
import { useLang } from "../../i18n/i18n";

type Filter = "semua" | "album" | "foto" | "video";
type Sort = "terbaru" | "terlama" | "az" | "za";

interface Result {
  id: string;
  type: "album" | "foto" | "video";
  title: string;
  albumName: string;
  date: string;
  thumb: string;
  albumId: string;
}

const POPULAR = ["Panggung Kemerdekaan", "Lomba 17an"];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  const { albums, photos, videos } = useStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("semua");
  const [sort, setSort] = useState<Sort>("terbaru");
  const [recent, setRecent] = useState<string[]>([]);
  const navigate = useNavigate();

  const albumName = (id: string) => albums.find((a) => a.id === id)?.name ?? "-";

  const allResults: Result[] = useMemo(() => {
    const r: Result[] = [];
    albums.forEach((a) =>
      r.push({ id: a.id, type: "album", title: a.name, albumName: a.name, date: a.date, thumb: a.cover, albumId: a.id })
    );
    photos.forEach((p) =>
      r.push({ id: p.id, type: "foto", title: p.title, albumName: albumName(p.albumId), date: p.date, thumb: p.url, albumId: p.albumId })
    );
    videos.forEach((v) =>
      r.push({ id: v.id, type: "video", title: v.title, albumName: albumName(v.albumId), date: v.date, thumb: v.thumbnail, albumId: v.albumId })
    );
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albums, photos, videos]);

  const searchable = (item: Result, text: string) => {
    const q = text.toLowerCase();
    const extra =
      item.type === "foto"
        ? photos.find((p) => p.id === item.id)
        : item.type === "video"
        ? videos.find((v) => v.id === item.id)
        : albums.find((a) => a.id === item.id);
    const blob = [
      item.title,
      item.albumName,
      item.date.slice(0, 4),
      (extra as any)?.caption ?? "",
      (extra as any)?.description ?? "",
      ((extra as any)?.tags ?? []).join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return blob.includes(q);
  };

  const results = useMemo(() => {
    let list = allResults;
    if (filter !== "semua") list = list.filter((r) => r.type === filter);
    if (query.trim()) list = list.filter((r) => searchable(r, query.trim()));
    list = [...list].sort((a, b) => {
      if (sort === "terbaru") return b.date.localeCompare(a.date);
      if (sort === "terlama") return a.date.localeCompare(b.date);
      if (sort === "az") return a.title.localeCompare(b.title);
      return b.title.localeCompare(a.title);
    });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allResults, filter, query, sort]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    return Array.from(new Set(allResults.map((r) => r.title)))
      .filter((t) => t.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }, [query, allResults]);

  const runSearch = (term: string) => {
    setQuery(term);
    if (term.trim()) setRecent((p) => [term, ...p.filter((x) => x !== term)].slice(0, 5));
  };

  const go = (r: Result) => {
    onClose();
    navigate(`/album/${r.albumId}`);
  };

  const typeIcon = (t: Result["type"]) =>
    t === "album" ? <FolderOpen className="size-4" /> : t === "foto" ? <ImageIcon className="size-4" /> : <Film className="size-4" />;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[8vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5">
              <Search className="size-5 text-[#0F4C81]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className="flex-1 bg-transparent outline-none text-base"
              />
              <button className="text-muted-foreground hover:text-[#D32F2F] transition" aria-label="Pencarian suara">
                <Mic className="size-5" />
              </button>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition" aria-label="Tutup">
                <X className="size-5" />
              </button>
            </div>

            {/* filters + sort */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-black/5 bg-[#F5F7FA]">
              <div className="flex flex-wrap gap-2">
                {(["semua", "album", "foto", "video"] as Filter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1 rounded-full text-sm capitalize transition ${
                      filter === f ? "bg-[#0F4C81] text-white" : "bg-white text-muted-foreground hover:bg-[#0F4C81]/10"
                    }`}
                  >
                    {t(`search.filters.${f}`)}
                  </button>
                ))}
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="text-sm bg-white rounded-lg px-3 py-1 border border-black/10 outline-none"
              >
                <option value="terbaru">{t("search.sortLatest")}</option>
                <option value="terlama">{t("search.sortOldest")}</option>
                <option value="az">{t("search.sortAz")}</option>
                <option value="za">{t("search.sortZa")}</option>
              </select>
            </div>

            <div className="max-h-[52vh] overflow-y-auto">
              {/* suggestions */}
              {suggestions.length > 0 && (
                <div className="px-5 pt-3 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => runSearch(s)}
                      className="text-sm px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#8a6d13] hover:bg-[#D4AF37]/30 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* empty state helpers */}
              {!query.trim() && (
                <div className="p-5 grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Clock className="size-4" /> {t("search.recent")}
                    </p>
                    {recent.length === 0 ? (
                      <p className="text-sm text-muted-foreground/60">{t("search.noRecent")}</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {recent.map((r) => (
                          <button key={r} onClick={() => setQuery(r)} className="text-sm px-3 py-1 rounded-full bg-[#F5F7FA] hover:bg-[#0F4C81]/10 transition">
                            {r}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <TrendingUp className="size-4" /> {t("search.popular")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR.map((r) => (
                        <button key={r} onClick={() => runSearch(r)} className="text-sm px-3 py-1 rounded-full bg-[#F5F7FA] hover:bg-[#0F4C81]/10 transition">
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* results */}
              {query.trim() && results.length === 0 && (
                <div className="p-10 text-center text-muted-foreground">{t("search.notFound")}</div>
              )}

              {query.trim() &&
                results.map((r) => (
                  <button
                    key={r.type + r.id}
                    onClick={() => go(r)}
                    className="w-full flex items-center gap-4 px-5 py-3 hover:bg-[#F5F7FA] transition text-left"
                  >
                    <img src={r.thumb} alt={r.title} loading="lazy" className="size-14 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate" style={{ fontWeight: 500 }}>{r.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{r.albumName}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] capitalize">
                      {typeIcon(r.type)} {r.type}
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:block">{formatDate(r.date)}</span>
                  </button>
                ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
