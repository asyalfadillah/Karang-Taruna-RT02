import { Link } from "react-router";
import { Calendar, Image as ImageIcon, Film, ArrowRight } from "lucide-react";
import { useStore, formatDate, countMedia, type Album } from "../../data/store";
import { useLang } from "../../i18n/i18n";

export function AlbumCard({ album }: { album: Album }) {
  const { t } = useLang();
  const { photos, videos } = useStore();
  const c = countMedia(album.id, photos, videos);
  return (
    <div className="group rounded-2xl overflow-hidden bg-white border border-black/5 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={album.cover}
          alt={album.name}
          loading="lazy"
          className="size-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <span className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 text-xs text-[#1C3A54]">
          <Calendar className="size-3.5" /> {formatDate(album.date)}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-[#1C3A54] line-clamp-1" style={{ fontWeight: 600 }}>{album.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">{album.description}</p>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><ImageIcon className="size-4 text-[#9C2B2F]" /> {c.photos} {t("doc.photo")}</span>
          <span className="flex items-center gap-1"><Film className="size-4 text-[#9C2B2F]" /> {c.videos} {t("doc.video")}</span>
        </div>
        <Link
          to={`/album/${album.id}`}
          className="mt-5 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#1C3A54] text-white text-sm hover:bg-[#9C2B2F] transition"
          style={{ fontWeight: 600 }}
        >
          {t("doc.viewAlbum")} <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
