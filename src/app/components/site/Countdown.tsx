import { useEffect, useState } from "react";

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  return {
    done: ms === 0,
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000),
  };
}

export function Countdown({ date, compact }: { date: string; compact?: boolean }) {
  const target = new Date(date + "T00:00:00");
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  if (t.done) {
    return <span className="text-sm text-[#A8802F]" style={{ fontWeight: 600 }}>🎉 Hari ini!</span>;
  }

  const items = [
    { v: t.days, l: "Hari" },
    { v: t.hours, l: "Jam" },
    { v: t.minutes, l: "Menit" },
    { v: t.seconds, l: "Detik" },
  ];

  if (compact) {
    return (
      <span className="text-sm text-[#1C3A54]" style={{ fontWeight: 600 }}>
        {t.days}h : {String(t.hours).padStart(2, "0")}j : {String(t.minutes).padStart(2, "0")}m : {String(t.seconds).padStart(2, "0")}d
      </span>
    );
  }

  return (
    <div className="flex gap-1.5">
      {items.map((i) => (
        <div key={i.l} className="flex-1 rounded-lg bg-white/10 border border-white/20 backdrop-blur px-1.5 py-1.5 text-center">
          <div className="text-base text-white" style={{ fontWeight: 800 }}>{String(i.v).padStart(2, "0")}</div>
          <div className="text-[9px] text-white/70 uppercase tracking-wide">{i.l}</div>
        </div>
      ))}
    </div>
  );
}
