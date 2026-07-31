import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Flag, Sparkles, Moon } from "lucide-react";
import { useStore, formatDate, type AgendaEvent } from "../../data/store";
import { Reveal, SectionHeading } from "./Reveal";
import { Countdown } from "./Countdown";

const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const DOW = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const EventIcon = ({ type, className }: { type: AgendaEvent["type"]; className?: string }) =>
  type === "national" ? <Flag className={className} /> : type === "islamic" ? <Moon className={className} /> : <Sparkles className={className} />;

const eventBg = (type: AgendaEvent["type"]) => (type === "national" ? "#D32F2F" : type === "islamic" ? "#2e7d32" : "#D4AF37");

export function Kalender() {
  const { events } = useStore();
  const today = new Date();
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });

  const eventsByDay = useMemo(() => {
    const map: Record<string, AgendaEvent[]> = {};
    events.forEach((e) => {
      (map[e.date] ??= []).push(e);
    });
    return map;
  }, [events]);

  const upcoming = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return events.filter((e) => e.date >= todayStr).slice(0, 4);
  }, [events]);

  const countdowns = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return events.filter((e) => e.date >= todayStr && e.showCountdown).slice(0, 3);
  }, [events]);

  const first = new Date(cursor.y, cursor.m, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(startPad).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const dateStr = (d: number) => `${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const isToday = (d: number) => today.getFullYear() === cursor.y && today.getMonth() === cursor.m && today.getDate() === d;

  const move = (dir: number) => {
    setCursor((c) => {
      const m = c.m + dir;
      if (m < 0) return { y: c.y - 1, m: 11 };
      if (m > 11) return { y: c.y + 1, m: 0 };
      return { ...c, m };
    });
  };

  return (
    <section id="kalender" className="py-24 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Agenda"
            title="Kalender Kegiatan"
            desc="Jadwal kegiatan Karang Taruna RT 02, hari besar nasional & Islam, dan hitung mundur menuju acara mendatang."
          />
        </Reveal>

        {/* countdown cards */}
        {countdowns.length > 0 && (
          <div className="grid md:grid-cols-3 gap-3 mb-8">
            {countdowns.map((e, i) => (
              <Reveal key={e.id} delay={i * 0.1}>
                <div className="rounded-xl p-4 bg-gradient-to-br from-[#0F4C81] to-[#0b3660] text-white shadow-lg h-full">
                  <div className="flex items-center gap-2 mb-1">
                    <EventIcon type={e.type} className="size-3.5 text-[#D4AF37]" />
                    <span className="text-[11px] text-white/70">{formatDate(e.date)}</span>
                  </div>
                  <h3 className="mb-3 text-sm line-clamp-1" style={{ fontWeight: 700 }}>{e.title}</h3>
                  <Countdown date={e.date} />
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* calendar */}
          <Reveal className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-black/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#0F4C81] flex items-center gap-2" style={{ fontWeight: 600 }}>
                  <CalendarDays className="size-5" /> {MONTHS[cursor.m]} {cursor.y}
                </h3>
                <div className="flex gap-1">
                  <button onClick={() => move(-1)} className="grid place-items-center size-9 rounded-lg bg-[#F5F7FA] hover:bg-[#0F4C81] hover:text-white transition"><ChevronLeft className="size-5" /></button>
                  <button onClick={() => move(1)} className="grid place-items-center size-9 rounded-lg bg-[#F5F7FA] hover:bg-[#0F4C81] hover:text-white transition"><ChevronRight className="size-5" /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-1">
                {DOW.map((d) => <div key={d} className="py-1">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells.map((d, i) => {
                  if (d === null) return <div key={i} />;
                  const evs = eventsByDay[dateStr(d)] ?? [];
                  return (
                    <div
                      key={i}
                      className={`min-h-16 rounded-lg p-1.5 text-left border transition ${
                        isToday(d) ? "border-[#D32F2F] bg-red-50" : evs.length ? "border-[#0F4C81]/20 bg-[#0F4C81]/5" : "border-transparent hover:bg-[#F5F7FA]"
                      }`}
                    >
                      <span className={`text-xs ${isToday(d) ? "text-[#D32F2F]" : "text-foreground"}`} style={{ fontWeight: isToday(d) ? 700 : 400 }}>{d}</span>
                      {evs.slice(0, 2).map((e) => (
                        <div key={e.id} title={e.title} className={`mt-0.5 truncate text-[10px] px-1 rounded ${e.type === "national" ? "bg-[#D32F2F]/15 text-[#D32F2F]" : e.type === "islamic" ? "bg-green-100 text-green-700" : "bg-[#D4AF37]/20 text-[#8a6d13]"}`}>
                          {e.title}
                        </div>
                      ))}
                      {evs.length > 2 && <div className="text-[10px] text-muted-foreground">+{evs.length - 2}</div>}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="size-3 rounded bg-[#D32F2F]/40" /> Hari Nasional</span>
                <span className="flex items-center gap-1"><span className="size-3 rounded bg-green-300" /> Hari Besar Islam</span>
                <span className="flex items-center gap-1"><span className="size-3 rounded bg-[#D4AF37]/50" /> Kegiatan RT 02</span>
              </div>
            </div>
          </Reveal>

          {/* upcoming list */}
          <Reveal delay={0.1}>
            <div className="bg-white rounded-2xl border border-black/5 p-6 h-full">
              <h3 className="text-[#0F4C81] mb-4" style={{ fontWeight: 600 }}>Agenda Mendatang</h3>
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada agenda mendatang.</p>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((e) => (
                    <div key={e.id} className="flex gap-3 p-3 rounded-xl bg-[#F5F7FA]">
                      <div className="grid place-items-center size-12 rounded-lg text-white shrink-0" style={{ background: eventBg(e.type) }}>
                        <EventIcon type={e.type} className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm truncate" style={{ fontWeight: 600 }}>{e.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(e.date)}</p>
                        {e.showCountdown && <div className="mt-0.5"><Countdown date={e.date} compact /></div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
