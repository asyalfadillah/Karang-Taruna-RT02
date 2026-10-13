// Hanya izinkan link http(s), mailto, dan tel. Menolak "javascript:", "data:" dsb.
export function safeUrl(url?: string): string {
  if (!url) return "#";
  try {
    const u = new URL(url, window.location.origin);
    return ["http:", "https:", "mailto:", "tel:"].includes(u.protocol) ? url : "#";
  } catch {
    return "#";
  }
}
