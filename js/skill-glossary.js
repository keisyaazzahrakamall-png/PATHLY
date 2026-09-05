const SKILL_DESCRIPTIONS = {
  "SQL": "Bahasa untuk mengambil, menyaring, dan mengolah data di dalam basis data.",
  "Excel / Google Sheets": "Lembar kerja untuk menghitung, membersihkan, menganalisis, dan menyajikan data.",
  "Analisis Data": "Proses mengubah data mentah menjadi temuan yang berguna untuk keputusan.",
  "BI / Visualisasi Data": "Cara menyajikan data melalui grafik atau dasbor agar pola mudah dipahami.",
  "Visualisasi Data": "Cara menyajikan data melalui grafik atau dasbor agar pola mudah dipahami.",
  "Berpikir Analitis": "Kemampuan memecah masalah, mencari pola, dan menarik kesimpulan berdasarkan bukti.",
  "Berpikir Berbasis Data": "Kemampuan memakai data, bukan dugaan saja, sebagai dasar keputusan.",
  "Komunikasi": "Kemampuan menyampaikan ide dan hasil kerja dengan jelas kepada orang lain.",
  "Analisis Kebutuhan": "Proses menggali masalah dan menentukan kebutuhan pengguna atau bisnis.",
  "BRD / FSD": "Dokumen yang menjelaskan kebutuhan bisnis dan rincian fungsi sistem.",
  "UAT": "Pengujian oleh pengguna untuk memastikan sistem sudah sesuai kebutuhan.",
  "Pemetaan Proses": "Cara menggambarkan urutan kerja agar alur, hambatan, dan peluang perbaikan terlihat.",
  "SDLC / Agile": "Pendekatan untuk merencanakan, membangun, menguji, dan memperbaiki perangkat lunak.",
  "Komunikasi Pemangku Kepentingan": "Kemampuan menyelaraskan kebutuhan dan keputusan dengan pihak yang terlibat.",
  "HTML / CSS": "HTML menyusun isi halaman web, sedangkan CSS mengatur tampilan dan tata letaknya.",
  "JavaScript": "Bahasa pemrograman yang membuat halaman web menjadi interaktif.",
  "React / Framework Modern": "Perangkat bantu untuk membangun antarmuka web dari komponen yang dapat digunakan ulang.",
  "Integrasi API": "Cara menghubungkan aplikasi dengan layanan atau data dari sistem lain.",
  "Git": "Alat untuk mencatat perubahan kode dan berkolaborasi dalam pengembangan perangkat lunak.",
  "Desain Responsif": "Teknik membuat tampilan tetap nyaman pada ponsel, tablet, dan komputer.",
  "Figma": "Aplikasi kolaboratif untuk merancang antarmuka dan membuat purwarupa digital.",
  "Riset UX": "Proses memahami kebutuhan, kebiasaan, dan masalah pengguna melalui penelitian.",
  "Alur Pengguna": "Urutan langkah yang dilalui pengguna untuk menyelesaikan tujuan di dalam produk.",
  "Wireframing": "Sketsa struktur layar untuk menguji susunan isi sebelum membuat desain rinci.",
  "Pembuatan Purwarupa": "Membuat simulasi interaktif untuk menguji ide dan alur sebelum produk dibangun.",
  "Kemudahan Penggunaan": "Kualitas yang membuat produk mudah dipahami, digunakan, dan dipelajari.",
  "Desain Visual / UI": "Pengaturan warna, tipografi, ikon, dan tata letak agar antarmuka jelas dan konsisten.",
  "Kolaborasi": "Kemampuan bekerja bersama, berbagi konteks, dan menyelesaikan tujuan tim.",
  "Google Ads": "Platform Google untuk membuat dan mengukur iklan berbayar.",
  "Meta Ads": "Platform untuk membuat dan mengukur iklan di Facebook dan Instagram.",
  "Analitik": "Pengukuran data untuk memahami perilaku audiens dan hasil kegiatan pemasaran.",
  "SEO / SEM": "SEO meningkatkan visibilitas pencarian organik; SEM memakai strategi pencarian berbayar.",
  "Optimalisasi Kampanye": "Proses memperbaiki target, materi, biaya, dan hasil kampanye berdasarkan data.",
  "Konten": "Materi informasi atau promosi yang dibuat untuk menarik dan membantu audiens."
};

export function getSkillDescription(skill) {
  if (SKILL_DESCRIPTIONS[skill]) return SKILL_DESCRIPTIONS[skill];

  const normalized = String(skill || "").toLowerCase();

  if (normalized.includes("data")) {
    return "Kemampuan mengumpulkan, mengolah, atau memahami data untuk menghasilkan informasi yang berguna.";
  }

  if (normalized.includes("desain") || normalized.includes("design")) {
    return "Kemampuan merancang solusi visual atau pengalaman agar mudah dipahami dan digunakan.";
  }

  if (normalized.includes("komunikasi") || normalized.includes("reporting")) {
    return "Kemampuan menyampaikan informasi dan hasil kerja secara jelas kepada orang lain.";
  }

  if (normalized.includes("testing") || normalized.includes("pengujian")) {
    return "Proses memeriksa hasil kerja untuk menemukan masalah dan memastikan kebutuhan terpenuhi.";
  }

  return `Kemampuan yang digunakan dalam pekerjaan ${skill} dan perlu dibuktikan melalui latihan atau proyek.`;
}
