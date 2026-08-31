import { useState } from "react";
import { toast } from "sonner";
import { MessageCircle, Send, User } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useStore } from "../../data/store";
import { useLang } from "../../i18n/i18n";

export function Comments() {
  const { t } = useLang();
  const { comments, addComment } = useStore();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return t("comments.justNow");
    if (min < 60) return `${min} ${t("comments.minAgo")}`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} ${t("comments.hrAgo")}`;
    const day = Math.floor(hr / 24);
    return `${day} ${t("comments.dayAgo")}`;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      toast.error(t("comments.errRequired"));
      return;
    }
    setSending(true);
    try {
      await addComment(name.trim(), message.trim());
      setMessage("");
      toast.success(t("comments.success"));
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
            eyebrow={t("comments.eyebrow")}
            title={t("comments.title")}
            desc={t("comments.desc")}
          />
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={submit} className="rounded-2xl border border-black/5 bg-[#F6F2EA] p-5 space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("comments.namePlaceholder")}
              maxLength={60}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-[#1C3A54]"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("comments.msgPlaceholder")}
              maxLength={500}
              rows={3}
              className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 outline-none focus:border-[#1C3A54] resize-none"
            />
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1C3A54] text-white hover:bg-[#122A3D] transition disabled:opacity-50"
              style={{ fontWeight: 600 }}
            >
              <Send className="size-4" /> {sending ? t("comments.sending") : t("comments.send")}
            </button>
          </form>
        </Reveal>

        <div className="mt-8 space-y-4">
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8 flex flex-col items-center gap-2">
              <MessageCircle className="size-6 opacity-40" />
              {t("comments.empty")}
            </p>
          ) : (
            comments.map((c, i) => (
              <Reveal key={c.id} delay={Math.min(i * 0.05, 0.3)}>
                <div className="flex gap-3 rounded-xl border border-black/5 bg-white p-4">
                  <span className="grid place-items-center size-9 shrink-0 rounded-full bg-[#1C3A54] text-white">
                    <User className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm text-[#1C3A54]" style={{ fontWeight: 600 }}>{c.name}</p>
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
