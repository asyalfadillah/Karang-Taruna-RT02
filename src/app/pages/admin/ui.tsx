import { AnimatePresence, motion } from "motion/react";
import { X, AlertTriangle } from "lucide-react";
import React from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className={`w-full ${wide ? "max-w-3xl" : "max-w-lg"} bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 sticky top-0 bg-white z-10">
              <h3 className="text-[#1C3A54]" style={{ fontWeight: 700 }}>{title}</h3>
              <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Konfirmasi Hapus",
  message,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center" initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()}>
            <span className="grid place-items-center size-14 rounded-full bg-red-100 text-[#9C2B2F] mx-auto mb-4"><AlertTriangle className="size-7" /></span>
            <h3 style={{ fontWeight: 700 }}>{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
            <div className="mt-6 flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-[#F6F2EA] hover:bg-black/5 transition" style={{ fontWeight: 600 }}>Batal</button>
              <button onClick={() => { onConfirm(); onClose(); }} className="flex-1 py-2.5 rounded-xl bg-[#9C2B2F] text-white hover:bg-[#7a1f22] transition" style={{ fontWeight: 600 }}>Hapus</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-foreground" style={{ fontWeight: 500 }}>{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export const inputClass =
  "w-full px-4 py-2.5 rounded-xl bg-[#F6F2EA] border border-black/5 outline-none focus:border-[#1C3A54] transition";
