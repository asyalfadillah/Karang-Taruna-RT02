import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "/utils/supabase/info";

/* ------------------------------------------------------------------ */
/* API client (Supabase Edge Function)                                 */
/* ------------------------------------------------------------------ */

const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-35d97b10`;

async function api(
  path: string,
  opts: { method?: string; body?: unknown; secret?: string } = {}
): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${publicAnonKey}`,
  };
  if (opts.secret) headers["x-admin-secret"] = opts.secret;
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || `Permintaan gagal (${res.status})`;
    console.log(`API error ${opts.method || "GET"} ${path}: ${msg}`);
    throw new Error(msg);
  }
  return data;
}

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type MediaStatus = "publish" | "draft";

export type VideoSource = "youtube" | "instagram" | "tiktok" | "drive" | "mp4" | "link";

export interface Photo {
  id: string;
  albumId: string;
  url: string;
  title: string;
  caption: string;
  tags: string[];
  date: string; // ISO
}

export interface Video {
  id: string;
  albumId: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  source: VideoSource;
  url: string;
  tags: string[];
  date: string; // ISO
}

export interface Album {
  id: string;
  name: string;
  description: string;
  date: string; // ISO activity date
  cover: string;
  status: MediaStatus;
  driveLink?: string; // link untuk melihat semua dokumentasi (mis. Google Drive)
}

export type EventType = "national" | "islamic" | "custom"; // national/islamic = otomatis

export interface AgendaEvent {
  id: string;
  title: string;
  date: string; // ISO date
  description: string;
  type: EventType;
  showCountdown: boolean;
}

export const isAutoEvent = (e: AgendaEvent) => e.type !== "custom";

export interface Comment {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export type ReportFileType = "pdf" | "xlsx" | "docx" | "other";

export interface Report {
  id: string;
  title: string;
  year: number;
  fileType: ReportFileType;
  fileName: string;
  fileUrl: string; // data URL (base64) atau link eksternal (Google Drive, dll)
  createdAt: string;
}

interface Store {
  albums: Album[];
  photos: Photo[];
  videos: Video[];
  customEvents: AgendaEvent[];
  events: AgendaEvent[]; // gabungan custom + hari nasional
  comments: Comment[];
  reports: Report[];
  visitors: number;
  loading: boolean;
  isAuthed: boolean;
  admin: { name: string; username: string };
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (newPassword: string) => Promise<boolean>;
  refresh: () => Promise<void>;
  addAlbum: (a: Omit<Album, "id">) => void;
  updateAlbum: (id: string, a: Partial<Album>) => void;
  deleteAlbum: (id: string) => void;
  addPhoto: (p: Omit<Photo, "id">) => void;
  updatePhoto: (id: string, p: Partial<Photo>) => void;
  deletePhoto: (id: string) => void;
  addVideo: (v: Omit<Video, "id">) => void;
  updateVideo: (id: string, v: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  addEvent: (e: Omit<AgendaEvent, "id" | "type">) => void;
  updateEvent: (id: string, e: Partial<AgendaEvent>) => void;
  deleteEvent: (id: string) => void;
  addComment: (name: string, message: string) => Promise<void>;
  deleteComment: (id: string) => void;
  addReport: (r: Omit<Report, "id" | "createdAt">) => void;
  deleteReport: (id: string) => void;
}

/* ------------------------------------------------------------------ */
/* Hero decorative slides                                              */
/* ------------------------------------------------------------------ */

const IMG = {
  crowd: "https://images.unsplash.com/photo-1566409031818-9508be68fc74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
  village1: "https://images.unsplash.com/photo-1542897643-cfccd88c7127?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
  parade: "https://images.unsplash.com/photo-1701590219284-c3cce0148be1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
};

export const HERO_SLIDES = [
  { image: IMG.crowd, title: "Perlombaan 17 Agustus", caption: "Semarak lomba warga RT 02" },
  { image: IMG.village1, title: "Panggung Kemerdekaan", caption: "Malam puncak perayaan HUT RI" },
  { image: IMG.parade, title: "Pembagian Hadiah", caption: "Apresiasi untuk para juara" },
];

/* ------------------------------------------------------------------ */
/* Hari besar nasional (otomatis, berulang tiap tahun)                 */
/* ------------------------------------------------------------------ */

const NATIONAL: { month: number; day: number; title: string; description: string }[] = [
  { month: 1, day: 1, title: "Tahun Baru Masehi", description: "Perayaan pergantian tahun." },
  { month: 4, day: 21, title: "Hari Kartini", description: "Memperingati perjuangan R.A. Kartini." },
  { month: 5, day: 1, title: "Hari Buruh Internasional", description: "Peringatan hari buruh." },
  { month: 5, day: 2, title: "Hari Pendidikan Nasional", description: "Memperingati jasa Ki Hajar Dewantara." },
  { month: 5, day: 20, title: "Hari Kebangkitan Nasional", description: "Peringatan kebangkitan bangsa Indonesia." },
  { month: 6, day: 1, title: "Hari Lahir Pancasila", description: "Memperingati lahirnya dasar negara Pancasila." },
  { month: 8, day: 17, title: "HUT Kemerdekaan RI", description: "Peringatan Proklamasi Kemerdekaan Republik Indonesia." },
  { month: 10, day: 1, title: "Hari Kesaktian Pancasila", description: "Memperingati Kesaktian Pancasila." },
  { month: 10, day: 28, title: "Hari Sumpah Pemuda", description: "Memperingati ikrar Sumpah Pemuda." },
  { month: 11, day: 10, title: "Hari Pahlawan", description: "Mengenang jasa para pahlawan." },
  { month: 12, day: 22, title: "Hari Ibu", description: "Peringatan Hari Ibu Nasional." },
  { month: 12, day: 25, title: "Hari Natal", description: "Perayaan Hari Raya Natal." },
];

export function nationalHolidays(year: number): AgendaEvent[] {
  return NATIONAL.map((h) => ({
    id: `nat-${year}-${h.month}-${h.day}`,
    title: h.title,
    date: `${year}-${String(h.month).padStart(2, "0")}-${String(h.day).padStart(2, "0")}`,
    description: h.description,
    type: "national" as const,
    showCountdown: true,
  }));
}

/* ------------------------------------------------------------------ */
/* Hari besar Islam (tanggal mengikuti kalender Hijriah — perkiraan)   */
/* ------------------------------------------------------------------ */

const ISLAMIC_BY_YEAR: Record<number, { date: string; title: string; description: string }[]> = {
  2025: [
    { date: "2025-01-27", title: "Isra Mikraj Nabi Muhammad SAW", description: "Peringatan perjalanan Isra dan Mikraj." },
    { date: "2025-03-31", title: "Hari Raya Idul Fitri", description: "Perayaan Idul Fitri 1446 H." },
    { date: "2025-06-06", title: "Hari Raya Idul Adha", description: "Perayaan Idul Adha 1446 H." },
    { date: "2025-06-26", title: "Tahun Baru Islam 1447 H", description: "Peringatan 1 Muharram." },
    { date: "2025-09-04", title: "Maulid Nabi Muhammad SAW", description: "Peringatan kelahiran Nabi Muhammad SAW." },
  ],
  2026: [
    { date: "2026-01-16", title: "Isra Mikraj Nabi Muhammad SAW", description: "Peringatan perjalanan Isra dan Mikraj." },
    { date: "2026-03-20", title: "Hari Raya Idul Fitri", description: "Perayaan Idul Fitri 1447 H." },
    { date: "2026-05-27", title: "Hari Raya Idul Adha", description: "Perayaan Idul Adha 1447 H." },
    { date: "2026-06-16", title: "Tahun Baru Islam 1448 H", description: "Peringatan 1 Muharram." },
    { date: "2026-08-25", title: "Maulid Nabi Muhammad SAW", description: "Peringatan kelahiran Nabi Muhammad SAW." },
  ],
  2027: [
    { date: "2027-01-05", title: "Isra Mikraj Nabi Muhammad SAW", description: "Peringatan perjalanan Isra dan Mikraj." },
    { date: "2027-03-10", title: "Hari Raya Idul Fitri", description: "Perayaan Idul Fitri 1448 H." },
    { date: "2027-05-17", title: "Hari Raya Idul Adha", description: "Perayaan Idul Adha 1448 H." },
    { date: "2027-06-06", title: "Tahun Baru Islam 1449 H", description: "Peringatan 1 Muharram." },
    { date: "2027-08-15", title: "Maulid Nabi Muhammad SAW", description: "Peringatan kelahiran Nabi Muhammad SAW." },
  ],
  2028: [
    { date: "2028-01-25", title: "Isra Mikraj Nabi Muhammad SAW", description: "Peringatan perjalanan Isra dan Mikraj." },
    { date: "2028-02-27", title: "Hari Raya Idul Fitri", description: "Perayaan Idul Fitri 1449 H." },
    { date: "2028-05-05", title: "Hari Raya Idul Adha", description: "Perayaan Idul Adha 1449 H." },
    { date: "2028-05-25", title: "Tahun Baru Islam 1450 H", description: "Peringatan 1 Muharram." },
    { date: "2028-08-03", title: "Maulid Nabi Muhammad SAW", description: "Peringatan kelahiran Nabi Muhammad SAW." },
  ],
};

export function islamicHolidays(year: number): AgendaEvent[] {
  return (ISLAMIC_BY_YEAR[year] ?? []).map((h, i) => ({
    id: `isl-${year}-${i}`,
    title: h.title,
    date: h.date,
    description: h.description,
    type: "islamic" as const,
    showCountdown: true,
  }));
}

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

const StoreContext = createContext<Store | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

function usePersisted<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [key, state]);
  return [state, setState];
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Cache lokal untuk paint instan; sumber kebenaran adalah server.
  const [albums, setAlbums] = usePersisted<Album[]>("rt02_albums_v2", []);
  const [photos, setPhotos] = usePersisted<Photo[]>("rt02_photos_v2", []);
  const [videos, setVideos] = usePersisted<Video[]>("rt02_videos_v2", []);
  const [customEvents, setCustomEvents] = usePersisted<AgendaEvent[]>("rt02_events_v2", []);
  const [comments, setComments] = usePersisted<Comment[]>("rt02_comments_v2", []);
  const [reports, setReports] = usePersisted<Report[]>("rt02_reports_v1", []);
  const [autoPrefs, setAutoPrefs] = usePersisted<Record<string, boolean>>("rt02_auto_prefs_v2", {});
  const [visitors, setVisitors] = usePersisted<number>("rt02_visitors_v2", 0);
  const [isAuthed, setIsAuthed] = usePersisted<boolean>("rt02_auth_v2", false);
  // Secret admin (didapat dari server saat login) untuk operasi tulis.
  const [secret, setSecret] = usePersisted<string>("rt02_secret_v2", "");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const d = await api("/data");
      setAlbums(d.albums || []);
      setPhotos(d.photos || []);
      setVideos(d.videos || []);
      setCustomEvents(d.customEvents || []);
      setComments(d.comments || []);
      setReports(d.reports || []);
      setAutoPrefs(d.autoPrefs || {});
      setVisitors(d.visitors || 0);
    } catch (err) {
      console.log(`Gagal memuat data dari server: ${err}`);
    } finally {
      setLoading(false);
    }
  }, [setAlbums, setPhotos, setVideos, setCustomEvents, setComments, setReports, setAutoPrefs, setVisitors]);

  // Muat data + hitung kunjungan sekali per sesi.
  useEffect(() => {
    (async () => {
      await refresh();
      if (!sessionStorage.getItem("rt02_counted")) {
        sessionStorage.setItem("rt02_counted", "1");
        try {
          const r = await api("/visit", { method: "POST" });
          if (typeof r.visitors === "number") setVisitors(r.visitors);
        } catch (err) {
          console.log(`Gagal mencatat kunjungan: ${err}`);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-sync berkala: biar upload foto/video/komentar baru muncul sendiri tanpa perlu refresh manual.
  // Cuma jalan saat tab sedang aktif dilihat (hemat kuota & baterai HP).
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper: jalankan mutasi server, tampilkan error & sinkron ulang jika gagal.
  const withServer = useCallback(
    async (fn: () => Promise<void>, errMsg: string) => {
      try {
        await fn();
      } catch (err) {
        toast.error(`${errMsg}: ${err instanceof Error ? err.message : err}`);
        refresh();
      }
    },
    [refresh]
  );

  const events = useMemo(() => {
    const now = new Date();
    const years = [now.getFullYear(), now.getFullYear() + 1];
    const auto = years.flatMap((y) => [...nationalHolidays(y), ...islamicHolidays(y)]);
    const withPrefs = auto.map((e) => ({ ...e, showCountdown: autoPrefs[e.id] ?? e.showCountdown }));
    return [...customEvents, ...withPrefs].sort((a, b) => a.date.localeCompare(b.date));
  }, [customEvents, autoPrefs]);

  const value: Store = useMemo(
    () => ({
      albums,
      photos,
      videos,
      customEvents,
      events,
      comments,
      reports,
      visitors,
      loading,
      isAuthed,
      admin: { name: "Diki Fadillah", username: "admin" },

      login: async (username, password) => {
        try {
          const r = await api("/login", { method: "POST", body: { username, password } });
          if (r.ok && r.secret) {
            setSecret(r.secret);
            setIsAuthed(true);
            return true;
          }
          return false;
        } catch (err) {
          console.log(`Login gagal: ${err}`);
          return false;
        }
      },
      logout: () => {
        setIsAuthed(false);
        setSecret("");
      },
      changePassword: async (newPassword) => {
        try {
          const r = await api("/change-password", { method: "POST", secret, body: { newPassword } });
          if (r.ok && r.secret) {
            setSecret(r.secret);
            return true;
          }
          return false;
        } catch (err) {
          toast.error(`Gagal mengubah sandi: ${err instanceof Error ? err.message : err}`);
          return false;
        }
      },
      refresh,

      addAlbum: (a) => {
        const item = { ...a, id: uid() };
        setAlbums((p) => [item, ...p]);
        withServer(() => api("/album", { method: "POST", secret, body: item }), "Gagal menambah album");
      },
      updateAlbum: (id, a) => {
        setAlbums((p) => p.map((x) => (x.id === id ? { ...x, ...a } : x)));
        withServer(() => api(`/album/${id}`, { method: "PUT", secret, body: a }), "Gagal memperbarui album");
      },
      deleteAlbum: (id) => {
        setAlbums((p) => p.filter((x) => x.id !== id));
        setPhotos((p) => p.filter((x) => x.albumId !== id));
        setVideos((p) => p.filter((x) => x.albumId !== id));
        withServer(() => api(`/album/${id}`, { method: "DELETE", secret }), "Gagal menghapus album");
      },

      addPhoto: (ph) => {
        const item = { ...ph, id: uid() };
        setPhotos((p) => [item, ...p]);
        withServer(() => api("/photo", { method: "POST", secret, body: item }), "Gagal menambah foto");
      },
      updatePhoto: (id, ph) => {
        setPhotos((p) => p.map((x) => (x.id === id ? { ...x, ...ph } : x)));
        withServer(() => api(`/photo/${id}`, { method: "PUT", secret, body: ph }), "Gagal memperbarui foto");
      },
      deletePhoto: (id) => {
        setPhotos((p) => p.filter((x) => x.id !== id));
        withServer(() => api(`/photo/${id}`, { method: "DELETE", secret }), "Gagal menghapus foto");
      },

      addVideo: (v) => {
        const item = { ...v, id: uid() };
        setVideos((p) => [item, ...p]);
        withServer(() => api("/video", { method: "POST", secret, body: item }), "Gagal menambah video");
      },
      updateVideo: (id, v) => {
        setVideos((p) => p.map((x) => (x.id === id ? { ...x, ...v } : x)));
        withServer(() => api(`/video/${id}`, { method: "PUT", secret, body: v }), "Gagal memperbarui video");
      },
      deleteVideo: (id) => {
        setVideos((p) => p.filter((x) => x.id !== id));
        withServer(() => api(`/video/${id}`, { method: "DELETE", secret }), "Gagal menghapus video");
      },

      addEvent: (e) => {
        const item = { ...e, id: uid(), type: "custom" as const };
        setCustomEvents((p) => [item, ...p]);
        withServer(() => api("/event", { method: "POST", secret, body: item }), "Gagal menambah kegiatan");
      },
      updateEvent: (id, e) => {
        // Hari nasional/Islam bersifat otomatis: hanya preferensi hitung mundur yang bisa diubah
        if (id.startsWith("nat-") || id.startsWith("isl-")) {
          if (typeof e.showCountdown === "boolean") {
            const show = e.showCountdown as boolean;
            setAutoPrefs((p) => ({ ...p, [id]: show }));
            withServer(
              () => api("/autoprefs", { method: "PUT", secret, body: { id, show } }),
              "Gagal menyimpan preferensi"
            );
          }
          return;
        }
        setCustomEvents((p) => p.map((x) => (x.id === id ? { ...x, ...e } : x)));
        withServer(() => api(`/event/${id}`, { method: "PUT", secret, body: e }), "Gagal memperbarui kegiatan");
      },
      deleteEvent: (id) => {
        setCustomEvents((p) => p.filter((x) => x.id !== id));
        withServer(() => api(`/event/${id}`, { method: "DELETE", secret }), "Gagal menghapus kegiatan");
      },

      addComment: async (name, message) => {
        // Publik: tidak butuh secret admin. Optimistic update + sinkron nyata dari server.
        const temp: Comment = { id: `temp-${Date.now()}`, name, message, createdAt: new Date().toISOString() };
        setComments((p) => [temp, ...p]);
        try {
          const item = await api("/comment", { method: "POST", body: { name, message } });
          setComments((p) => p.map((c) => (c.id === temp.id ? item : c)));
        } catch (err) {
          setComments((p) => p.filter((c) => c.id !== temp.id));
          toast.error(`Gagal mengirim komentar: ${err instanceof Error ? err.message : err}`);
          throw err;
        }
      },
      deleteComment: (id) => {
        setComments((p) => p.filter((x) => x.id !== id));
        withServer(() => api(`/comment/${id}`, { method: "DELETE", secret }), "Gagal menghapus komentar");
      },

      addReport: (r) => {
        const id = uid();
        const item: Report = { ...r, id, createdAt: new Date().toISOString() };
        setReports((p) => [item, ...p]);
        withServer(() => api("/report", { method: "POST", secret, body: item }), "Gagal menyimpan laporan");
      },
      deleteReport: (id) => {
        setReports((p) => p.filter((x) => x.id !== id));
        withServer(() => api(`/report/${id}`, { method: "DELETE", secret }), "Gagal menghapus laporan");
      },
    }),
    [albums, photos, videos, customEvents, events, comments, reports, isAuthed, visitors, loading, secret, refresh, withServer, setAlbums, setPhotos, setVideos, setCustomEvents, setComments, setReports, setAutoPrefs, setIsAuthed, setSecret]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

export function countMedia(albumId: string, photos: Photo[], videos: Video[]) {
  return {
    photos: photos.filter((p) => p.albumId === albumId).length,
    videos: videos.filter((v) => v.albumId === albumId).length,
  };
}

export const VIDEO_SOURCE_LABEL: Record<VideoSource, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  drive: "Google Drive",
  mp4: "Video MP4",
  link: "Tautan",
};
