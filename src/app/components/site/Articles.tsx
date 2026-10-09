import { useState } from "react";
import { ExternalLink, Leaf, HeartPulse } from "lucide-react";
import { useStore, formatDate, type ArticleCategory } from "../../data/store";
import { Reveal, SectionHeading } from "./Reveal";
import { useLang } from "../../i18n/i18n";

const PORTALS = [
  { name: "Dinas Kesehatan DKI Jakarta", url: "https://dinkes.jakarta.go.id" },
  { name: "Dinas Lingkungan Hidup DKI Jakarta", url: "https://lingkunganhidup.jakarta.go.id" },
  { name: "Kementerian Kesehatan RI", url: "https://www.kemkes.go.id" },
  { name: "Kementerian Lingkungan Hidup", url: "https://www.klh.go.id" },
];

export function Articles() {
  const { td } = useLang();
  const i = (td as any).info;
  const { articles } = useStore();
  const [cat, setCat] = useState<"all" | ArticleCategory>("all");
  const list = articles.filter((a) => cat === "all" || a.category === cat);
  const tabs: { k: "all" | ArticleCategory; l: string }[] = [
    { k: "all", l: i.all },
    { k: "lingkungan", l: i.lingkungan },
    { k: "kesehatan", l: i.kesehatan },
  ];

  return (
    <section id="info" className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionHeading eyebrow={i.eyebrow} title={i.title} desc={i.desc} />

        <div className="flex justify-center gap-2 mb-10">
          {tabs.map((x) => (
            <button
              key={x.k}
              onClick={() => setCat(x.k)}
              className={`px-4 py-2 rounded-full text-sm transition ${cat === x.k ? "bg-[#1C3A54] text-white" : "bg-[#F6F2EA] text-[#211C17] hover:bg-[#ebe4d6]"}`}
              style={{ fontWeight: 500 }}
            >
              {x.l}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="text-center text-muted-foreground">{i.empty}</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((a, idx) => (
              <Reveal key={a.id} delay={idx * 0.04}>
                <article className="h-full flex flex-col rounded-2xl bg-[#F6F2EA] p-6">
                  <div className="flex items-center gap-2 text-xs text-[#A8802F]" style={{ fontWeight: 600 }}>
                    {a.category === "kesehatan" ? <HeartPulse className="size-4" /> : <Leaf className="size-4" />}
                    {a.category === "kesehatan" ? i.kesehatan : i.lingkungan}
                  </div>
                  <h3 className="mt-3 text-lg text-[#211C17] leading-snug" style={{ fontWeight: 600 }}>{a.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{a.summary}</p>
                  <div className="mt-4 text-xs text-muted-foreground">{a.source} · {formatDate(a.createdAt.slice(0, 10))}</div>
                  {a.sourceUrl && (
                    <a href={a.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#9C2B2F] hover:underline" style={{ fontWeight: 500 }}>
                      {i.read} <ExternalLink className="size-3.5" />
                    </a>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="text-xs tracking-[0.18em] uppercase text-muted-foreground mb-3" style={{ fontWeight: 600 }}>{i.portals}</div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {PORTALS.map((p) => (
              <a key={p.url} href={p.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#1C3A54] hover:text-[#9C2B2F] inline-flex items-center gap-1.5">
                {p.name} <ExternalLink className="size-3" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
