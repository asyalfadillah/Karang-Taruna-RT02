/**
 * Mengompres gambar di browser sebelum disimpan, supaya ukuran file tidak
 * membengkak (foto dari kamera HP biasanya 3-10MB, padahal yang ditampilkan
 * di web cukup jauh lebih kecil). Hasilnya berupa data URL (base64) JPEG.
 *
 * @param file       File gambar asli dari input
 * @param maxWidth   Lebar maksimum hasil kompresi (px)
 * @param quality    Kualitas JPEG 0-1 (0.75-0.8 biasanya sudah cukup bagus)
 */
export function compressImage(file: File, maxWidth = 1600, quality = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result as string); // fallback: pakai gambar asli kalau canvas gagal
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => resolve(reader.result as string); // fallback aman
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
