import { useState } from "react";
import { toast } from "sonner";
import { MessageCircle, Send, User } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useStore } from "../../data/store";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Baru saja";
  if (min < 60) return `${min} menit lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  const day = Math.floor(hr / 24);
  return `${day} hari lalu`;
}

export function Comments() {
  const { comments, addComment } = useStore();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error("Nama dan komentar wajib diisi.");
      return;
    }
    setSending(true);
    try {
      await addComment(name.trim(), message.trim());
      setMessage("");
      toast.success("Komentar terkirim, terima kasih!");
    } catch {
      // error sudah ditampilkan di store
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="komentar" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Kolom Komentar"
            title="Tinggalkan Pesan atau Kesan"
            desc="Sampaikan komentar, saran, atau kesan kamu tentang kegiatan RT 02 di sini."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={submit} className="rounded-2xl border border-black/5 bg-[#F5F7FA] p-5 space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kamu"
              maxLength={60}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-[#0F4C81]"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis komentar kamu..."
              maxLength={500}
              rows={3}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-[#0F4C81] resize-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F4C81] text-white hover:bg-[#0b3660] transition disabled:opacity-50"
              style={{ fontWeight: 600 }}
            >
              <Send className="size-4" /> {sending ? "Mengirim..." : "Kirim Komentar"}
            </button>
          </form>
        </Reveal>

        <div className="mt-8 space-y-4">
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8 flex flex-col items-center gap-2">
              <MessageCircle className="size-6 opacity-40" />
              Belum ada komentar. Jadilah yang pertama!
            </p>
          ) : (
            comments.map((c, i) => (
              <Reveal key={c.id} delay={Math.min(i * 0.05, 0.3)}>
                <div className="flex gap-3 rounded-xl border border-black/5 bg-white p-4">
                  <span className="grid place-items-center size-9 shrink-0 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#D32F2F] text-white">
                    <User className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm text-[#0F4C81]" style={{ fontWeight: 600 }}>{c.name}</p>
                      <span className="text-xs text-muted-foreground">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm text-foreground/80 break-words">{c.message}</p>
                  </div>
                </div>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
