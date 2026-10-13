import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();
const P = "/make-server-35d97b10";

app.use("*", logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "x-admin-secret"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Sandi bawaan diambil dari environment variable ADMIN_SECRET (Supabase → Edge Functions → Secrets).
// Kalau belum diset, jatuh ke "020316" — segera ganti lewat menu Profil Admin atau set ADMIN_SECRET.
const DEFAULT_ADMIN_SECRET = Deno.env.get("ADMIN_SECRET") || "020316";
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

/* ---- admin auth helper ------------------------------------------------ */
async function adminSecret(): Promise<string> {
  const s = await kv.get("admin_secret");
  return (s as string) || DEFAULT_ADMIN_SECRET;
}
async function requireAdmin(c: any): Promise<Response | null> {
  const provided = c.req.header("x-admin-secret");
  const secret = await adminSecret();
  if (!provided || provided !== secret) {
    return c.json({ error: "Unauthorized: sandi admin tidak valid." }, 401);
  }
  return null;
}

/* ---- pembatas percobaan (rate limit) berbasis KV ------------------------ */
async function rateLimited(c: any, bucket: string, max: number, windowMs: number): Promise<boolean> {
  const ip = (c.req.header("x-forwarded-for") || "unknown").split(",")[0].trim();
  const key = `rl:${bucket}:${ip}`;
  const now = Date.now();
  const rec: any = (await kv.get(key)) || { count: 0, resetAt: now + windowMs };
  if (now > rec.resetAt) {
    rec.count = 0;
    rec.resetAt = now + windowMs;
  }
  rec.count += 1;
  await kv.set(key, rec);
  return rec.count > max;
}

/* ---- health ----------------------------------------------------------- */
app.get(`${P}/health`, (c) => c.json({ status: "ok" }));

/* ---- login: validasi sandi, kembalikan secret untuk operasi tulis ----- */
app.post(`${P}/login`, async (c) => {
  try {
    if (await rateLimited(c, "login", 5, 15 * 60 * 1000)) {
      return c.json({ ok: false, error: "Terlalu banyak percobaan login. Coba lagi 15 menit lagi." }, 429);
    }
    const { username, password } = await c.req.json();
    const secret = await adminSecret();
    if ((username || "").trim() === "admin" && password === secret) {
      return c.json({ ok: true, secret });
    }
    return c.json({ ok: false }, 401);
  } catch (err) {
    console.log(`Login error: ${err}`);
    return c.json({ ok: false, error: `${err}` }, 500);
  }
});

/* ---- ganti sandi admin ------------------------------------------------ */
app.post(`${P}/change-password`, async (c) => {
  const unauth = await requireAdmin(c);
  if (unauth) return unauth;
  try {
    const { newPassword } = await c.req.json();
    if (!newPassword || String(newPassword).length < 4) {
      return c.json({ error: "Sandi baru minimal 4 karakter." }, 400);
    }
    await kv.set("admin_secret", String(newPassword));
    return c.json({ ok: true, secret: String(newPassword) });
  } catch (err) {
    console.log(`Change password error: ${err}`);
    return c.json({ error: `${err}` }, 500);
  }
});

/* ---- ambil semua data (publik) ---------------------------------------- */
app.get(`${P}/data`, async (c) => {
  try {
    const [albums, photos, videos, events, comments, reports, posters, articles] = await Promise.all([
      kv.getByPrefix("album:"),
      kv.getByPrefix("photo:"),
      kv.getByPrefix("video:"),
      kv.getByPrefix("event:"),
      kv.getByPrefix("comment:"),
      kv.getByPrefix("report:"),
      kv.getByPrefix("poster:"),
      kv.getByPrefix("article:"),
    ]);
    const autoPrefs = (await kv.get("autoprefs")) || {};
    const visitors = (await kv.get("visitors")) || 0;
    return c.json({
      albums: albums || [],
      photos: photos || [],
      videos: videos || [],
      customEvents: events || [],
      comments: (comments || []).sort((a: any, b: any) => (b.createdAt || "").localeCompare(a.createdAt || "")),
      reports: reports || [],
      posters: posters || [],
      articles: (articles || []).sort((a: any, b: any) => (b.createdAt || "").localeCompare(a.createdAt || "")),
      autoPrefs,
      visitors,
    });
  } catch (err) {
    console.log(`Get data error: ${err}`);
    return c.json({ error: `Gagal mengambil data: ${err}` }, 500);
  }
});

/* ---- penghitung pengunjung (publik) ----------------------------------- */
app.post(`${P}/visit`, async (c) => {
  try {
    const current = ((await kv.get("visitors")) as number) || 0;
    const next = current + 1;
    await kv.set("visitors", next);
    return c.json({ visitors: next });
  } catch (err) {
    console.log(`Visit error: ${err}`);
    return c.json({ error: `${err}` }, 500);
  }
});

/* ---- generic CRUD builder --------------------------------------------- */
function crud(name: string, prefix: string) {
  app.post(`${P}/${name}`, async (c) => {
    const unauth = await requireAdmin(c);
    if (unauth) return unauth;
    try {
      const body = await c.req.json();
      const id = body.id || uid();
      const item = { ...body, id };
      await kv.set(`${prefix}${id}`, item);
      return c.json(item);
    } catch (err) {
      console.log(`Create ${name} error: ${err}`);
      return c.json({ error: `${err}` }, 500);
    }
  });

  app.put(`${P}/${name}/:id`, async (c) => {
    const unauth = await requireAdmin(c);
    if (unauth) return unauth;
    try {
      const id = c.req.param("id");
      const patch = await c.req.json();
      const existing = (await kv.get(`${prefix}${id}`)) || { id };
      const item = { ...existing, ...patch, id };
      await kv.set(`${prefix}${id}`, item);
      return c.json(item);
    } catch (err) {
      console.log(`Update ${name} error: ${err}`);
      return c.json({ error: `${err}` }, 500);
    }
  });

  app.delete(`${P}/${name}/:id`, async (c) => {
    const unauth = await requireAdmin(c);
    if (unauth) return unauth;
    try {
      const id = c.req.param("id");
      await kv.del(`${prefix}${id}`);
      return c.json({ ok: true });
    } catch (err) {
      console.log(`Delete ${name} error: ${err}`);
      return c.json({ error: `${err}` }, 500);
    }
  });
}

crud("photo", "photo:");
crud("video", "video:");
crud("event", "event:");
crud("report", "report:");
crud("poster", "poster:");
crud("article", "article:");

/* ---- album (dengan cascade delete foto/video) ------------------------- */
app.post(`${P}/album`, async (c) => {
  const unauth = await requireAdmin(c);
  if (unauth) return unauth;
  try {
    const body = await c.req.json();
    const id = body.id || uid();
    const item = { ...body, id };
    await kv.set(`album:${id}`, item);
    return c.json(item);
  } catch (err) {
    console.log(`Create album error: ${err}`);
    return c.json({ error: `${err}` }, 500);
  }
});

app.put(`${P}/album/:id`, async (c) => {
  const unauth = await requireAdmin(c);
  if (unauth) return unauth;
  try {
    const id = c.req.param("id");
    const patch = await c.req.json();
    const existing = (await kv.get(`album:${id}`)) || { id };
    const item = { ...existing, ...patch, id };
    await kv.set(`album:${id}`, item);
    return c.json(item);
  } catch (err) {
    console.log(`Update album error: ${err}`);
    return c.json({ error: `${err}` }, 500);
  }
});

app.delete(`${P}/album/:id`, async (c) => {
  const unauth = await requireAdmin(c);
  if (unauth) return unauth;
  try {
    const id = c.req.param("id");
    await kv.del(`album:${id}`);
    // cascade: hapus foto & video milik album ini
    const [photos, videos] = await Promise.all([kv.getByPrefix("photo:"), kv.getByPrefix("video:")]);
    const delKeys = [
      ...(photos || []).filter((p: any) => p.albumId === id).map((p: any) => `photo:${p.id}`),
      ...(videos || []).filter((v: any) => v.albumId === id).map((v: any) => `video:${v.id}`),
    ];
    if (delKeys.length) await kv.mdel(delKeys);
    return c.json({ ok: true });
  } catch (err) {
    console.log(`Delete album error: ${err}`);
    return c.json({ error: `${err}` }, 500);
  }
});

/* ---- komentar (kirim publik, hapus khusus admin) ---------------------- */
app.post(`${P}/comment`, async (c) => {
  try {
    if (await rateLimited(c, "comment", 5, 10 * 60 * 1000)) {
      return c.json({ error: "Terlalu banyak komentar. Coba lagi beberapa menit lagi." }, 429);
    }
    const body = await c.req.json();
    const name = String(body.name || "").trim().slice(0, 60);
    const message = String(body.message || "").trim().slice(0, 500);
    if (!name || !message) {
      return c.json({ error: "Nama dan komentar wajib diisi." }, 400);
    }
    if (/https?:\/\/|www\./i.test(message) || /https?:\/\/|www\./i.test(name)) {
      return c.json({ error: "Komentar tidak boleh berisi link." }, 400);
    }
    const id = uid();
    const item = { id, name, message, createdAt: new Date().toISOString() };
    await kv.set(`comment:${id}`, item);
    return c.json(item);
  } catch (err) {
    console.log(`Create comment error: ${err}`);
    return c.json({ error: `${err}` }, 500);
  }
});

app.delete(`${P}/comment/:id`, async (c) => {
  const unauth = await requireAdmin(c);
  if (unauth) return unauth;
  try {
    const id = c.req.param("id");
    await kv.del(`comment:${id}`);
    return c.json({ ok: true });
  } catch (err) {
    console.log(`Delete comment error: ${err}`);
    return c.json({ error: `${err}` }, 500);
  }
});

/* ---- preferensi hitung mundur hari nasional/Islam --------------------- */
app.put(`${P}/autoprefs`, async (c) => {
  const unauth = await requireAdmin(c);
  if (unauth) return unauth;
  try {
    const { id, show } = await c.req.json();
    const prefs = ((await kv.get("autoprefs")) as Record<string, boolean>) || {};
    prefs[id] = !!show;
    await kv.set("autoprefs", prefs);
    return c.json(prefs);
  } catch (err) {
    console.log(`Autoprefs error: ${err}`);
    return c.json({ error: `${err}` }, 500);
  }
});

Deno.serve(app.fetch);
