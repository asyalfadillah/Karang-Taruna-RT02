import { useMemo, useState } from "react";
import { FileSpreadsheet, FileText, File as FileIcon, Download, ChevronDown, Wallet, X, Eye } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { useStore, type Report, type ReportFileType } from "../../data/store";
import { useLang } from "../../i18n/i18n";

const FILE_META: Record<ReportFileType, { label: string; icon: typeof FileText; color: string }> = {
  xlsx: { label: "Excel", icon: FileSpreadsheet, color: "#1D6F42" },
  pdf: { label: "PDF", icon: FileText, color: "#9C2B2F" },
  docx: { label: "Word", icon: FileText, color: "#2B579A" },
  other: { label: "File", icon: FileIcon, color: "#1C3A54" },
};

function PreviewModal({ report, onClose }: { report: Report; onClose: () => void }) {
  const { t } = useLang();
  const meta = FILE_META[report.fileType] || FILE_META.other;
  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 p-4 border-b border-black/5">
          <div className="min-w-0">
            <p className="truncate" style={{ fontWeight: 700 }}>{report.title}</p>
            <p className="text-xs text-muted-foreground">{t("reports.format")} {meta.label} &middot; {t("reports.year")} {report.year}</p>
          </div>
          <button onClick={onClose} className="grid place-items-center size-9 shrink-0 rounded-lg hover:bg-black/5 transition">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-[#F6F2EA]">
          {report.fileType === "pdf" ? (
            <iframe src={report.fileUrl} title={report.title} className="w-full h-full min-h-[65vh]" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 h-full min-h-[40vh] p-8 text-center">
              <span className="grid place-items-center size-16 rounded-2xl text-white" style={{ backgroundColor: meta.color }}>
                <FileText className="size-8" />
              </span>
              <p className="text-muted-foreground text-sm max-w-sm">
                {t("reports.noPreview")} {meta.label}. {t("reports.downloadInstead")}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-black/5">
          <a
            href={report.fileUrl}
            download={report.fileName}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#1C3A54] text-white hover:bg-[#122A3D] transition"
            style={{ fontWeight: 600 }}
          >
            <Download className="size-4" /> {t("reports.download")} {meta.label}
          </a>
        </div>
      </div>
    </div>
  );
}

function ReportRow({ r, onOpen }: { r: Report; onOpen: () => void }) {
  const { t } = useLang();
  const meta = FILE_META[r.fileType] || FILE_META.other;
  const Icon = meta.icon;
  return (
    <button
      onClick={onOpen}
      className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-4 hover:shadow-md hover:border-[#1C3A54]/20 transition group text-left"
    >
      <span className="grid place-items-center size-11 shrink-0 rounded-lg text-white" style={{ backgroundColor: meta.color }}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-[#1C3A54] truncate" style={{ fontWeight: 600 }}>{r.title}</p>
        <p className="text-xs text-muted-foreground">{t("reports.format")} {meta.label}</p>
      </div>
      <Eye className="size-4 text-muted-foreground shrink-0 group-hover:text-[#1C3A54] transition" />
    </button>
  );
}

export function FinancialReports() {
  const { t } = useLang();
  const { reports } = useStore();
  const byYear = useMemo(() => {
    const map = new Map<number, Report[]>();
    for (const r of reports) {
      if (!map.has(r.year)) map.set(r.year, []);
      map.get(r.year)!.push(r);
    }
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }, [reports]);

  const [openYear, setOpenYear] = useState<number | null>(byYear[0]?.[0] ?? null);
  const [preview, setPreview] = useState<Report | null>(null);

  if (reports.length === 0) return null;

  return (
    <section id="laporan-keuangan" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={t("reports.eyebrow")}
            title={t("reports.title")}
            desc={t("reports.desc")}
          />
        </Reveal>

        <div className="space-y-4">
          {byYear.map(([year, list], i) => {
            const open = openYear === year;
            return (
              <Reveal key={year} delay={i * 0.05}>
                <div className="rounded-2xl border border-black/5 overflow-hidden bg-[#F6F2EA]">
                  <button
                    onClick={() => setOpenYear(open ? null : year)}
                    className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid place-items-center size-10 rounded-lg bg-[#1C3A54] text-white">
                        <Wallet className="size-5" />
                      </span>
                      <span>
                        <span className="block text-[#1C3A54]" style={{ fontWeight: 700 }}>{t("reports.year")} {year}</span>
                        <span className="block text-xs text-muted-foreground">{list.length} {t("reports.docs")}</span>
                      </span>
                    </span>
                    <ChevronDown className={`size-5 text-[#1C3A54] transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && (
                    <div className="px-4 md:px-5 pb-5 grid sm:grid-cols-2 gap-3">
                      {list.map((r) => (
                        <ReportRow key={r.id} r={r} onOpen={() => setPreview(r)} />
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
      {preview && <PreviewModal report={preview} onClose={() => setPreview(null)} />}
    </section>
  );
}
