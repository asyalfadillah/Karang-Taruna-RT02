import { useState } from "react";
import { Trash2, MessageCircle, User } from "lucide-react";
import { toast } from "sonner";
import { useStore, type Comment } from "../../data/store";
import { ConfirmDialog } from "./ui";

function formatDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export function CommentsPage() {
  const { comments, deleteComment } = useStore();
  const [del, setDel] = useState<Comment | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl text-[#0F4C81]" style={{ fontWeight: 700 }}>Komentar Warga</h1>
        <p className="text-muted-foreground text-sm">Kelola komentar yang dikirim warga melalui halaman utama.</p>
      </div>

      {comments.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-[#0F4C81]/20 bg-white p-10 text-center text-muted-foreground flex flex-col items-center gap-2">
          <MessageCircle className="size-8 opacity-40" />
          Belum ada komentar masuk.
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-3 rounded-2xl bg-white border border-black/5 p-4">
              <span className="grid place-items-center size-10 shrink-0 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#D32F2F] text-white">
                <User className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[#0F4C81]" style={{ fontWeight: 600 }}>{c.name}</p>
                  <span className="text-xs text-muted-foreground">{formatDateTime(c.createdAt)}</span>
                </div>
                <p className="mt-1 text-sm text-foreground/80 break-words">{c.message}</p>
              </div>
              <button
                onClick={() => setDel(c)}
                className="grid place-items-center size-9 shrink-0 rounded-lg bg-red-50 text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white transition"
                title="Hapus komentar"
              >
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
            deleteComment(del.id);
            toast.success("Komentar dihapus.");
          }
        }}
        title="Hapus Komentar"
        message={`Hapus komentar dari "${del?.name}"? Tindakan ini tidak bisa dibatalkan.`}
      />
    </div>
  );
}
