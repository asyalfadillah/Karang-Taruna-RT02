import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { AnimatePresence, motion, motion as m } from "motion/react";
import { ShieldCheck, User, Lock, Eye, EyeOff, ArrowLeft, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../../data/store";

export function LoginPage() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [forgot, setForgot] = useState(false);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (await login(username, password)) {
        toast.success("Berhasil masuk. Selamat datang, Diki Fadillah!");
        navigate("/adminrt02");
      } else {
        setError(true);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left brand */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden bg-gradient-to-br from-[#0F4C81] to-[#0b3660]">
        <div className="absolute -top-20 -right-20 size-80 rounded-full bg-[#D32F2F]/20 blur-3xl" />
        <div className="absolute bottom-0 -left-20 size-80 rounded-full bg-[#D4AF37]/20 blur-3xl" />
        <Link to="/" className="relative flex items-center gap-2 text-white/80 hover:text-white text-sm"><ArrowLeft className="size-4" /> Kembali ke Website</Link>
        <div className="relative">
          <span className="grid place-items-center size-16 rounded-2xl bg-white/10 mb-6"><ShieldCheck className="size-8 text-[#D4AF37]" /></span>
          <h1 className="text-4xl leading-tight" style={{ fontWeight: 800 }}>Panel Admin<br />Karang Taruna RT 02</h1>
          <p className="mt-4 text-white/70 max-w-md">Kelola album, foto, dan video dokumentasi HUT RI & Panggung Kemerdekaan dengan mudah dan aman.</p>
        </div>
        <p className="relative text-sm text-white/50">© 2026 Remaja Karang Taruna RT 02</p>
      </div>

      {/* right form */}
      <div className="flex items-center justify-center p-6 bg-[#F5F7FA]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
          <div className="lg:hidden mb-6">
            <Link to="/" className="flex items-center gap-2 text-[#0F4C81] text-sm"><ArrowLeft className="size-4" /> Kembali ke Website</Link>
          </div>
          <h2 className="text-2xl text-[#0F4C81]" style={{ fontWeight: 700 }}>{forgot ? "Lupa Password" : "Login Admin"}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{forgot ? "Masukkan email untuk reset password." : "Masuk untuk mengelola dokumentasi."}</p>

          {forgot ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Tautan reset password telah dikirim ke email Anda.");
                setForgot(false);
              }}
              className="mt-6 space-y-4"
            >
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <input required type="email" placeholder="Email admin" className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F7FA] border border-black/5 outline-none focus:border-[#0F4C81] transition" />
              </div>
              <button className="w-full py-3 rounded-xl bg-[#0F4C81] text-white hover:bg-[#D32F2F] transition" style={{ fontWeight: 600 }}>Kirim Tautan Reset</button>
              <button type="button" onClick={() => setForgot(false)} className="w-full text-sm text-muted-foreground hover:text-[#0F4C81]">Kembali ke Login</button>
            </form>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <input value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Username" className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F5F7FA] border border-black/5 outline-none focus:border-[#0F4C81] transition" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} required type={show ? "text" : "password"} placeholder="Password" className="w-full pl-11 pr-11 py-3 rounded-xl bg-[#F5F7FA] border border-black/5 outline-none focus:border-[#0F4C81] transition" />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-[#0F4C81] size-4" />
                  Ingat Saya
                </label>
                <button type="button" onClick={() => setForgot(true)} className="text-[#0F4C81] hover:text-[#D32F2F]">Lupa Password?</button>
              </div>
              <button disabled={busy} className="w-full py-3 rounded-xl bg-[#D32F2F] text-white hover:bg-[#b71c1c] transition shadow-lg disabled:opacity-60" style={{ fontWeight: 600 }}>{busy ? "Memproses…" : "Masuk"}</button>
              <p className="text-xs text-center text-muted-foreground bg-[#F5F7FA] rounded-lg py-2">Login: username <b></b> / sandi <b></b></p>
            </form>
          )}
        </motion.div>
      </div>

      {/* popup salah sandi */}
      <AnimatePresence>
        {error && (
          <m.div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setError(false)}>
            <m.div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center relative" initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 10 }} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setError(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
              <span className="grid place-items-center size-16 rounded-full bg-red-100 text-[#D32F2F] mx-auto mb-4"><AlertTriangle className="size-8" /></span>
              <h3 className="text-lg" style={{ fontWeight: 700 }}>Sandi Salah!</h3>
              <p className="mt-2 text-sm text-muted-foreground">Username atau password yang Anda masukkan tidak sesuai. Silakan coba lagi.</p>
              <button onClick={() => { setError(false); setPassword(""); }} className="mt-6 w-full py-2.5 rounded-xl bg-[#D32F2F] text-white hover:bg-[#b71c1c] transition" style={{ fontWeight: 600 }}>Coba Lagi</button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
