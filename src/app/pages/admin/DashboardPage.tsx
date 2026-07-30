import { FolderOpen, Image as ImageIcon, Film, Users, TrendingUp, Plus } from "lucide-react";
import { Link } from "react-router";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { useStore, formatDate, countMedia } from "../../data/store";

export function DashboardPage() {
  const { albums, photos, videos, visitors } = useStore();

  const stats = [
    { label: "Total Album", value: albums.length, icon: FolderOpen, color: "#0F4C81" },
    { label: "Total Foto", value: photos.length, icon: ImageIcon, color: "#D32F2F" },
    { label: "Total Video", value: videos.length, icon: Film, color: "#D4AF37" },
    { label: "Total Pengunjung", value: visitors, icon: Users, color: "#2e7d32" },
  ];

  const seenNames: Record<string, number> = {};
  const chartData = albums.slice(0, 6).map((a) => {
    const c = countMedia(a.id, photos, videos);
    let name = a.name.split(" ").slice(0, 2).join(" ");
    // Pastikan label unik agar recharts tidak mengeluarkan peringatan duplicate key
    if (seenNames[name] !== undefined) {
      seenNames[name] += 1;
      name = `${name} (${seenNames[name]})`;
    } else {
      seenNames[name] = 1;
    }
    return { name, Foto: c.photos, Video: c.videos };
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-[#0F4C81]" style={{ fontWeight: 700 }}>Dashboard</h1>
          <p className="text-muted-foreground text-sm">Selamat datang kembali, Diki Fadillah 👋</p>
        </div>
        <Link to="/adminrt02/albums" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D32F2F] text-white hover:bg-[#b71c1c] transition shadow-lg" style={{ fontWeight: 600 }}>
          <Plus className="size-5" /> Tambah Album
        </Link>
      </div>

      {/* stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-black/5 p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <span className="grid place-items-center size-12 rounded-xl text-white" style={{ background: s.color }}><s.icon className="size-6" /></span>
              <TrendingUp className="size-5 text-green-500" />
            </div>
            <p className="mt-4 text-3xl text-[#0F4C81]" style={{ fontWeight: 800 }}>{s.value.toLocaleString("id-ID")}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-black/5 p-6">
          <h3 className="text-[#0F4C81] mb-4" style={{ fontWeight: 600 }}>Media per Album</h3>
          {chartData.length === 0 ? (
            <div className="h-[300px] grid place-items-center text-center text-muted-foreground rounded-xl border-2 border-dashed border-[#0F4C81]/15">
              <div>
                <FolderOpen className="size-10 mx-auto mb-2 text-[#0F4C81]/40" />
                <p className="text-sm">Belum ada album. Tambahkan album untuk melihat grafik.</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="Foto" fill="#0F4C81" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Video" fill="#D32F2F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* recent albums */}
        <div className="bg-white rounded-2xl border border-black/5 p-6">
          <h3 className="text-[#0F4C81] mb-4" style={{ fontWeight: 600 }}>Album Terbaru</h3>
          <div className="space-y-3">
            {albums.slice(0, 5).map((a) => (
              <Link key={a.id} to="/adminrt02/albums" className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F5F7FA] transition">
                <img src={a.cover} alt={a.name} className="size-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm truncate" style={{ fontWeight: 500 }}>{a.name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(a.date)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${a.status === "publish" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{a.status}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
