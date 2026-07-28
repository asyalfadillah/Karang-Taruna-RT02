import type { Video } from "../../data/store";

/** Sumber yang bisa disematkan (embed) langsung di halaman. */
export function isEmbeddable(v: Video) {
  return v.source === "youtube" || v.source === "mp4" || v.source === "drive";
}

/** Ubah URL menjadi bentuk embed yang benar bila memungkinkan. */
export function toEmbedUrl(v: Video): string {
  const url = v.url.trim();
  if (v.source === "youtube") {
    // dukung berbagai format: watch?v=, youtu.be/, /embed/
    const m = url.match(/(?:youtu\.be\/|watch\?v=|\/embed\/|shorts\/)([\w-]{11})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : url;
  }
  if (v.source === "drive") {
    // ubah /view menjadi /preview
    return url.replace(/\/view.*$/, "/preview");
  }
  return url;
}
