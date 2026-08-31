import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import { useStore } from "../../data/store";
import { Field, inputClass } from "./ui";

export function ProfilePage() {
  const { admin, changePassword } = useStore();
  const [profile, setProfile] = useState({ name: admin.name, username: admin.username, email: "diki.fadillah@rt02.id", phone: "+62 812-3456-7890" });
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [busy, setBusy] = useState(false);

  const submitPwd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.next.length < 4) { toast.error("Password baru minimal 4 karakter."); return; }
    if (pwd.next !== pwd.confirm) { toast.error("Konfirmasi password tidak cocok."); return; }
    setBusy(true);
    const ok = await changePassword(pwd.next);
    setBusy(false);
    if (ok) {
      toast.success("Password berhasil diubah. Gunakan sandi baru untuk login berikutnya.");
      setPwd({ current: "", next: "", confirm: "" });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl text-[#1C3A54]" style={{ fontWeight: 700 }}>Profil Admin</h1>
        <p className="text-muted-foreground text-sm">Kelola informasi akun administrator.</p>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 p-6 flex items-center gap-5">
        <span className="grid place-items-center size-20 rounded-2xl bg-[#1C3A54] text-white text-2xl" style={{ fontWeight: 800 }}>DF</span>
        <div>
          <h2 className="text-[#1C3A54]" style={{ fontWeight: 700 }}>{profile.name}</h2>
          <p className="text-sm text-muted-foreground flex items-center gap-1"><ShieldCheck className="size-4 text-green-500" /> Administrator</p>
          <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Mail className="size-4" /> {profile.email}</span>
            <span className="flex items-center gap-1"><Phone className="size-4" /> {profile.phone}</span>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); toast.success("Profil berhasil diperbarui."); }} className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <h3 className="text-[#1C3A54]" style={{ fontWeight: 600 }}>Informasi Akun</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nama Lengkap"><input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputClass} /></Field>
          <Field label="Username"><input value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} className={inputClass} /></Field>
          <Field label="Email"><input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={inputClass} /></Field>
          <Field label="No. Telepon"><input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={inputClass} /></Field>
        </div>
        <button className="px-6 py-2.5 rounded-xl bg-[#1C3A54] text-white hover:bg-[#9C2B2F] transition" style={{ fontWeight: 600 }}>Simpan Profil</button>
      </form>

      <form onSubmit={submitPwd} className="bg-white rounded-2xl border border-black/5 p-6 space-y-4">
        <h3 className="text-[#1C3A54]" style={{ fontWeight: 600 }}>Ubah Password</h3>
        <Field label="Password Saat Ini"><input type="password" value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} className={inputClass} /></Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Password Baru"><input type="password" value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} className={inputClass} /></Field>
          <Field label="Konfirmasi Password"><input type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} className={inputClass} /></Field>
        </div>
        <button disabled={busy} className="px-6 py-2.5 rounded-xl bg-[#9C2B2F] text-white hover:bg-[#7a1f22] transition disabled:opacity-60" style={{ fontWeight: 600 }}>{busy ? "Menyimpan…" : "Ubah Password"}</button>
      </form>
    </div>
  );
}
