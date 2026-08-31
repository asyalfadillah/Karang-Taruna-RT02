import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "id" | "en" | "ar";

export const LANGUAGES: { code: Lang; label: string; native: string }[] = [
  { code: "id", label: "Indonesian", native: "Indonesia" },
  { code: "en", label: "English", native: "English" },
  { code: "ar", label: "Arabic", native: "العربية" },
];

// Kamus terjemahan. Struktur bertingkat, diakses via t("bagian.kunci").
// Catatan: hanya teks tetap (UI) di halaman publik yang diterjemahkan.
// Data yang diisi admin (nama album, judul foto, komentar warga, dll) TIDAK
// diterjemahkan otomatis karena itu konten buatan pengguna, bukan teks UI.
const dict = {
  id: {
    nav: { beranda: "Beranda", tentang: "Tentang", dokumentasi: "Dokumentasi", kalender: "Kalender", donatur: "Donatur", kontak: "Kontak" },
    hero: {
      badge: "Bersama Remaja Karang Taruna 02, Warga 02",
      titlePrefix: "Dokumentasi",
      titleHighlight: "Kegiatan HUT RI RT 02",
      desc: "Mengabadikan setiap momen kegiatan HUT RI dan Panggung Kemerdekaan yang diselenggarakan oleh Remaja Karang Taruna RT 02.",
      cta: "Lihat Dokumentasi",
    },
    about: {
      eyebrow: "Tentang Dokumentasi",
      title: "Mengabadikan Semangat Kemerdekaan RT 02",
      desc: "Website ini berisi dokumentasi foto dan video kegiatan HUT RI serta Panggung Kemerdekaan yang diselenggarakan oleh Remaja Karang Taruna RT 02 sebagai arsip digital yang mudah diakses kapan saja.",
      f1t: "Arsip Foto", f1d: "Kumpulan foto kegiatan yang tertata rapi per album.",
      f2t: "Galeri Video", f2d: "Rekaman momen penting dalam format video.",
      f3t: "Arsip Digital", f3d: "Dokumentasi tersimpan aman dan mudah diakses.",
      f4t: "Kebersamaan", f4d: "Menjaga semangat gotong royong warga RT 02.",
    },
    doc: {
      eyebrow: "Dokumentasi", title: "Album Kegiatan",
      desc: "Jelajahi album dokumentasi kegiatan HUT RI dan Panggung Kemerdekaan yang telah kami arsipkan.",
      search: "🔍 Cari dokumentasi",
      empty: "Belum ada album dokumentasi", emptySub: "Album akan ditambahkan oleh admin melalui panel CMS.",
      photo: "Foto", video: "Video", viewAlbum: "Lihat Album",
    },
    album: {
      notFound: "Album tidak ditemukan.", backHome: "Kembali ke Beranda", backToDocs: "Kembali ke Dokumentasi",
      viewAllDocs: "Lihat Semua Dokumentasi", noPhotos: "Belum ada foto pada album ini.",
      noVideos: "Belum ada video pada album ini.", loadMore: "Muat Lebih Banyak", more: "lagi",
    },
    kalender: {
      eyebrow: "Agenda", title: "Kalender Kegiatan",
      desc: "Jadwal kegiatan Karang Taruna RT 02, hari besar nasional & Islam, dan hitung mundur menuju acara mendatang.",
      months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
      dow: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
      legendNational: "Hari Nasional", legendIslamic: "Hari Besar Islam", legendActivity: "Kegiatan RT 02",
      upcoming: "Agenda Mendatang", noUpcoming: "Belum ada agenda mendatang.",
    },
    gallery: {
      eyebrow: "Galeri Foto", title: "Momen Terbaik", desc: "Kumpulan foto pilihan dari berbagai kegiatan kami.",
      empty: "Galeri masih kosong", emptySub: "Foto akan diunggah oleh admin melalui panel CMS.",
      loadMore: "Muat Lebih Banyak",
    },
    video: {
      badge: "Video", title: "Galeri Video", desc: "Saksikan rekaman momen kegiatan HUT RI dan Panggung Kemerdekaan.",
      empty: "Belum ada video", emptySub: "Video akan ditambahkan oleh admin melalui panel CMS.",
      watch: "Tonton",
    },
    poster: { eyebrow: "Pengumuman", title: "Poster Informasi", desc: "Info dan pengumuman terbaru seputar kegiatan RT 02." },
    reports: {
      eyebrow: "Transparansi", title: "Laporan Keuangan",
      desc: "Laporan pemasukan dan pengeluaran kegiatan RT 02, dikelompokkan per tahun. Silakan unduh untuk melihat rincian lengkapnya.",
      year: "Tahun", docs: "dokumen", format: "Format", download: "Unduh",
      noPreview: "Pratinjau langsung belum didukung untuk file",
      downloadInstead: "Silakan unduh untuk melihat isinya.",
    },
    donors: {
      eyebrow: "Ucapan Terima Kasih", title: "Terima Kasih Kepada Para Donatur",
      desc: "Terselenggaranya rangkaian kegiatan HUT RI dan Panggung Kemerdekaan RT 02 tidak lepas dari dukungan serta kemurahan hati Bapak/Ibu warga sekalian. Atas nama Remaja Karang Taruna RT 02, kami mengucapkan terima kasih yang sebesar-besarnya atas segala bentuk sumbangan, baik materi, tenaga, maupun doa, yang telah diberikan. Semoga kebaikan Bapak/Ibu dibalas berlipat ganda oleh Allah SWT.",
      note: "Mohon maaf apabila terdapat nama yang belum tercantum atau terjadi kekeliruan penulisan. Silakan hubungi pengurus RT 02 untuk konfirmasi dan perbaikan data.",
    },
    comments: {
      eyebrow: "Kolom Komentar", title: "Tinggalkan Pesan atau Kesan",
      desc: "Sampaikan komentar, saran, atau kesan kamu tentang kegiatan RT 02 di sini.",
      namePlaceholder: "Nama kamu", msgPlaceholder: "Tulis komentar kamu...",
      send: "Kirim Komentar", sending: "Mengirim...",
      empty: "Belum ada komentar. Jadilah yang pertama!",
      errRequired: "Nama dan komentar wajib diisi.", success: "Komentar terkirim, terima kasih!",
      justNow: "Baru saja", minAgo: "menit lalu", hrAgo: "jam lalu", dayAgo: "hari lalu",
    },
    contact: {
      eyebrow: "Kontak", title: "Hubungi Kami", desc: "Terhubung dengan Remaja Karang Taruna RT 02 melalui kanal berikut.",
      orgName: "Remaja Karang Taruna RT 02",
    },
    footer: {
      tagline: "Bersama Remaja Karang Taruna 02, Warga 02. Arsip digital dokumentasi kegiatan HUT RI & Panggung Kemerdekaan.",
      quickLinks: "Tautan Cepat", social: "Media Sosial", address: "Alamat",
      copyright: "© 2026 Remaja Karang Taruna RT 02. Seluruh hak cipta dilindungi.",
    },
    search: {
      placeholder: "Cari foto, video, atau album dokumentasi...",
      filters: { semua: "semua", album: "album", foto: "foto", video: "video" },
      sortLatest: "Terbaru", sortOldest: "Terlama", sortAz: "A - Z", sortZa: "Z - A",
      recent: "Pencarian Terakhir", noRecent: "Belum ada.", popular: "Pencarian Populer",
      notFound: "Dokumentasi yang Anda cari tidak ditemukan.",
    },
  },
  en: {
    nav: { beranda: "Home", tentang: "About", dokumentasi: "Documentation", kalender: "Calendar", donatur: "Donors", kontak: "Contact" },
    hero: {
      badge: "Together with Karang Taruna 02 Youth, RT 02 Residents",
      titlePrefix: "Documentation of",
      titleHighlight: "RT 02 Independence Day Events",
      desc: "Preserving every moment of Independence Day celebrations and the Freedom Stage event organized by Karang Taruna RT 02 youth.",
      cta: "View Documentation",
    },
    about: {
      eyebrow: "About This Archive",
      title: "Preserving RT 02's Spirit of Independence",
      desc: "This website contains photo and video documentation of Independence Day activities and the Freedom Stage event organized by Karang Taruna RT 02 youth, as a digital archive accessible anytime.",
      f1t: "Photo Archive", f1d: "A collection of event photos neatly organized by album.",
      f2t: "Video Gallery", f2d: "Recordings of key moments in video format.",
      f3t: "Digital Archive", f3d: "Documentation stored securely and easy to access.",
      f4t: "Togetherness", f4d: "Keeping the spirit of mutual cooperation among RT 02 residents alive.",
    },
    doc: {
      eyebrow: "Documentation", title: "Event Albums",
      desc: "Browse our archived photo albums of Independence Day activities and the Freedom Stage event.",
      search: "🔍 Search documentation",
      empty: "No albums yet", emptySub: "Albums will be added by the admin via the CMS panel.",
      photo: "Photos", video: "Videos", viewAlbum: "View Album",
    },
    album: {
      notFound: "Album not found.", backHome: "Back to Home", backToDocs: "Back to Documentation",
      viewAllDocs: "View All Documentation", noPhotos: "No photos in this album yet.",
      noVideos: "No videos in this album yet.", loadMore: "Load More", more: "more",
    },
    kalender: {
      eyebrow: "Agenda", title: "Event Calendar",
      desc: "Karang Taruna RT 02 event schedule, national & Islamic holidays, and a countdown to upcoming events.",
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      dow: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      legendNational: "National Holiday", legendIslamic: "Islamic Holiday", legendActivity: "RT 02 Event",
      upcoming: "Upcoming Events", noUpcoming: "No upcoming events yet.",
    },
    gallery: {
      eyebrow: "Photo Gallery", title: "Best Moments", desc: "A curated collection of photos from our various events.",
      empty: "Gallery is still empty", emptySub: "Photos will be uploaded by the admin via the CMS panel.",
      loadMore: "Load More",
    },
    video: {
      badge: "Videos", title: "Video Gallery", desc: "Watch recordings of Independence Day activities and the Freedom Stage event.",
      empty: "No videos yet", emptySub: "Videos will be added by the admin via the CMS panel.",
      watch: "Watch",
    },
    poster: { eyebrow: "Announcements", title: "Info Posters", desc: "Latest info and announcements about RT 02 activities." },
    reports: {
      eyebrow: "Transparency", title: "Financial Reports",
      desc: "Income and expense reports for RT 02 activities, grouped by year. Download to see full details.",
      year: "Year", docs: "documents", format: "Format", download: "Download",
      noPreview: "Live preview is not supported for",
      downloadInstead: "Please download to view its contents.",
    },
    donors: {
      eyebrow: "Acknowledgements", title: "Thank You to Our Donors",
      desc: "The Independence Day activities and Freedom Stage event of RT 02 would not have been possible without the generous support of our residents. On behalf of Karang Taruna RT 02 youth, we extend our deepest gratitude for every contribution of funds, effort, and prayers given. May your kindness be rewarded many times over.",
      note: "We apologize if any names are missing or misspelled. Please contact the RT 02 committee for corrections.",
    },
    comments: {
      eyebrow: "Comments", title: "Leave a Message or Impression",
      desc: "Share your comments, suggestions, or impressions about RT 02 activities here.",
      namePlaceholder: "Your name", msgPlaceholder: "Write your comment...",
      send: "Send Comment", sending: "Sending...",
      empty: "No comments yet. Be the first!",
      errRequired: "Name and comment are required.", success: "Comment sent, thank you!",
      justNow: "Just now", minAgo: "min ago", hrAgo: "hr ago", dayAgo: "day(s) ago",
    },
    contact: {
      eyebrow: "Contact", title: "Get in Touch", desc: "Connect with Karang Taruna RT 02 youth through the channels below.",
      orgName: "Karang Taruna RT 02 Youth",
    },
    footer: {
      tagline: "Together with Karang Taruna 02 Youth, RT 02 Residents. Digital archive documenting Independence Day and Freedom Stage activities.",
      quickLinks: "Quick Links", social: "Social Media", address: "Address",
      copyright: "© 2026 Karang Taruna RT 02 Youth. All rights reserved.",
    },
    search: {
      placeholder: "Search photos, videos, or documentation albums...",
      filters: { semua: "all", album: "album", foto: "photo", video: "video" },
      sortLatest: "Latest", sortOldest: "Oldest", sortAz: "A - Z", sortZa: "Z - A",
      recent: "Recent Searches", noRecent: "None yet.", popular: "Popular Searches",
      notFound: "The documentation you're looking for was not found.",
    },
  },
  ar: {
    nav: { beranda: "الرئيسية", tentang: "حول", dokumentasi: "التوثيق", kalender: "التقويم", donatur: "المتبرعون", kontak: "اتصل بنا" },
    hero: {
      badge: "بالتعاون مع شباب كارانج تارونا 02، سكان RT 02",
      titlePrefix: "توثيق",
      titleHighlight: "فعاليات عيد الاستقلال RT 02",
      desc: "توثيق كل لحظة من فعاليات عيد الاستقلال ومهرجان الحرية التي ينظمها شباب كارانج تارونا RT 02.",
      cta: "عرض التوثيق",
    },
    about: {
      eyebrow: "عن هذا الأرشيف",
      title: "الحفاظ على روح استقلال RT 02",
      desc: "يحتوي هذا الموقع على توثيق بالصور والفيديو لأنشطة عيد الاستقلال ومهرجان الحرية التي ينظمها شباب كارانج تارونا RT 02، كأرشيف رقمي يمكن الوصول إليه في أي وقت.",
      f1t: "أرشيف الصور", f1d: "مجموعة صور الفعاليات منظمة بعناية حسب الألبوم.",
      f2t: "معرض الفيديو", f2d: "تسجيلات للحظات المهمة بصيغة فيديو.",
      f3t: "أرشيف رقمي", f3d: "توثيق محفوظ بأمان وسهل الوصول إليه.",
      f4t: "التآزر", f4d: "الحفاظ على روح التعاون بين سكان RT 02.",
    },
    doc: {
      eyebrow: "التوثيق", title: "ألبومات الفعاليات",
      desc: "تصفح ألبومات التوثيق المؤرشفة لفعاليات عيد الاستقلال ومهرجان الحرية.",
      search: "🔍 بحث في التوثيق",
      empty: "لا توجد ألبومات بعد", emptySub: "سيتم إضافة الألبومات من قبل المسؤول عبر لوحة الإدارة.",
      photo: "صورة", video: "فيديو", viewAlbum: "عرض الألبوم",
    },
    album: {
      notFound: "الألبوم غير موجود.", backHome: "العودة إلى الرئيسية", backToDocs: "العودة إلى التوثيق",
      viewAllDocs: "عرض كل التوثيق", noPhotos: "لا توجد صور في هذا الألبوم بعد.",
      noVideos: "لا توجد فيديوهات في هذا الألبوم بعد.", loadMore: "تحميل المزيد", more: "أخرى",
    },
    kalender: {
      eyebrow: "الأجندة", title: "تقويم الفعاليات",
      desc: "جدول فعاليات كارانج تارونا RT 02، الأعياد الوطنية والإسلامية، والعد التنازلي للفعاليات القادمة.",
      months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
      dow: ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"],
      legendNational: "عيد وطني", legendIslamic: "عيد إسلامي", legendActivity: "فعالية RT 02",
      upcoming: "الفعاليات القادمة", noUpcoming: "لا توجد فعاليات قادمة بعد.",
    },
    gallery: {
      eyebrow: "معرض الصور", title: "أفضل اللحظات", desc: "مجموعة مختارة من الصور من مختلف فعالياتنا.",
      empty: "المعرض لا يزال فارغًا", emptySub: "سيتم رفع الصور من قبل المسؤول عبر لوحة الإدارة.",
      loadMore: "تحميل المزيد",
    },
    video: {
      badge: "فيديو", title: "معرض الفيديو", desc: "شاهد تسجيلات فعاليات عيد الاستقلال ومهرجان الحرية.",
      empty: "لا توجد فيديوهات بعد", emptySub: "سيتم إضافة الفيديوهات من قبل المسؤول عبر لوحة الإدارة.",
      watch: "مشاهدة",
    },
    poster: { eyebrow: "إعلانات", title: "ملصقات المعلومات", desc: "أحدث المعلومات والإعلانات حول فعاليات RT 02." },
    reports: {
      eyebrow: "الشفافية", title: "التقارير المالية",
      desc: "تقارير الإيرادات والمصروفات لفعاليات RT 02، مصنفة حسب السنة. يرجى التحميل لعرض التفاصيل الكاملة.",
      year: "سنة", docs: "مستندات", format: "الصيغة", download: "تحميل",
      noPreview: "المعاينة المباشرة غير مدعومة لملفات",
      downloadInstead: "يرجى التحميل لعرض المحتوى.",
    },
    donors: {
      eyebrow: "شكر وتقدير", title: "شكرًا لجميع المتبرعين",
      desc: "لم يكن تنظيم سلسلة فعاليات عيد الاستقلال ومهرجان الحرية RT 02 ليتحقق لولا دعم وكرم سكاننا الأعزاء. نيابة عن شباب كارانج تارونا RT 02، نتقدم بجزيل الشكر على كل مساهمة من مال أو جهد أو دعاء. جزاكم الله خيرًا.",
      note: "نعتذر إذا كان هناك اسم لم يُذكر أو هناك خطأ في الكتابة. يرجى التواصل مع إدارة RT 02 للتصحيح.",
    },
    comments: {
      eyebrow: "التعليقات", title: "اترك رسالة أو انطباعًا",
      desc: "شارك تعليقاتك أو اقتراحاتك أو انطباعاتك حول فعاليات RT 02 هنا.",
      namePlaceholder: "اسمك", msgPlaceholder: "اكتب تعليقك...",
      send: "إرسال التعليق", sending: "جارٍ الإرسال...",
      empty: "لا توجد تعليقات بعد. كن أول من يعلق!",
      errRequired: "الاسم والتعليق مطلوبان.", success: "تم إرسال التعليق، شكرًا لك!",
      justNow: "الآن", minAgo: "دقيقة مضت", hrAgo: "ساعة مضت", dayAgo: "يوم مضى",
    },
    contact: {
      eyebrow: "اتصل بنا", title: "تواصل معنا", desc: "تواصل مع شباب كارانج تارونا RT 02 عبر القنوات التالية.",
      orgName: "شباب كارانج تارونا RT 02",
    },
    footer: {
      tagline: "بالتعاون مع شباب كارانج تارونا 02، سكان RT 02. أرشيف رقمي لتوثيق فعاليات عيد الاستقلال ومهرجان الحرية.",
      quickLinks: "روابط سريعة", social: "وسائل التواصل الاجتماعي", address: "العنوان",
      copyright: "© 2026 شباب كارانج تارونا RT 02. جميع الحقوق محفوظة.",
    },
    search: {
      placeholder: "ابحث عن صور أو فيديوهات أو ألبومات التوثيق...",
      filters: { semua: "الكل", album: "ألبوم", foto: "صورة", video: "فيديو" },
      sortLatest: "الأحدث", sortOldest: "الأقدم", sortAz: "أ - ي", sortZa: "ي - أ",
      recent: "عمليات البحث الأخيرة", noRecent: "لا يوجد بعد.", popular: "عمليات البحث الشائعة",
      notFound: "لم يتم العثور على التوثيق الذي تبحث عنه.",
    },
  },
} as const;

export type TranslationDict = typeof dict.id;

function getPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (path: string) => string;
  td: TranslationDict; // akses langsung ke kamus (untuk array seperti months/dow)
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      return (localStorage.getItem("rt02_lang") as Lang) || "id";
    } catch {
      return "id";
    }
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("rt02_lang", l);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (path: string) => {
    const val = getPath(dict[lang], path);
    return typeof val === "string" ? val : path;
  };

  return <LanguageContext.Provider value={{ lang, setLang, t, td: dict[lang] }}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang harus dipakai di dalam LanguageProvider");
  return ctx;
}
