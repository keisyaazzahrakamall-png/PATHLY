# Metodologi Sumber Data Karier Pathly

**Versi pemetaan:** 1.1  
**Peninjauan terakhir:** 5 September 2026  
**Cakupan:** lima karier bawaan Pathly

Dokumen ini menjelaskan asal daftar keahlian, arti bobot, dan batasan data. Pemetaan
dilakukan manual oleh tim Pathly; aplikasi tidak menghasilkan kebutuhan karier secara
otomatis menggunakan AI.

## Sumber Acuan

1. **O\*NET OnLine** digunakan sebagai profil pekerjaan dasar karena menyediakan tugas,
   aktivitas kerja, keahlian, dan teknologi yang berkaitan dengan suatu pekerjaan.
   O\*NET berorientasi pada pasar kerja Amerika Serikat, sehingga tidak digunakan
   sendirian untuk menyimpulkan kebutuhan Indonesia.
2. **ESCO** digunakan sebagai pembanding istilah pekerjaan dan keahlian. ESCO merupakan
   klasifikasi Uni Eropa yang dapat dipakai untuk career guidance dan skills-gap analysis.
3. **Portal SKKNI Kemnaker** menjadi titik rujuk konteks standar kompetensi Indonesia.
   Pathly belum mengklaim setiap skill pada MVP sebagai unit kompetensi SKKNI tertentu.
4. **Sampel lowongan Indonesia di Jobstreet** digunakan sebagai pemeriksaan konteks lokal.
   Halaman lowongan bersifat dinamis; catatan di bawah merekam temuan saat peninjauan,
   bukan jaminan bahwa lowongan yang sama akan tetap aktif.

Sumber umum:

- [O\*NET Database](https://www.onetcenter.org/database.html)
- [ESCO Services/API](https://esco.ec.europa.eu/en/use-esco/use-esco-services-api)
- [Portal SKKNI Kemnaker](https://skkni.kemnaker.go.id/)

## Pemetaan per Karier

| Karier Pathly | Profil pekerjaan utama | Sampel lowongan Indonesia | Ringkasan temuan |
| --- | --- | --- | --- |
| Data Analyst | [O\*NET Business Intelligence Analysts, 15-2051.01](https://www.onetonline.org/link/summary/15-2051.01) | [Jobstreet Data Analyst](https://id.jobstreet.com/id/data-analyst-jobs) | Sampel menampilkan analisis data, laporan/dashboard, SQL, Excel, Power BI/Tableau, insight, dan rekomendasi bisnis. |
| Business Analyst | [O\*NET Management Analysts, 13-1111.00](https://www.onetonline.org/link/summary/13-1111.00) | [Jobstreet Business Analyst](https://id.jobstreet.com/id/business-analyst-jobs) | Sampel menampilkan requirement elicitation, stakeholder engagement, desain solusi, testing/UAT, serta kesesuaian kebutuhan bisnis dan teknis. |
| Front-End Developer | [O\*NET Web Developers, 15-1254.00](https://www.onetonline.org/link/summary/15-1254.00) | [Jobstreet Front End Developer](https://id.jobstreet.com/id/front-end-developer-jobs) | Sampel menampilkan implementasi UI, React/Next.js, web responsif, pengujian, dan integrasi API. |
| UI/UX Designer | [O\*NET Web and Digital Interface Designers, 15-1255.00](https://www.onetonline.org/link/summary/15-1255.00) | [Jobstreet UI/UX Designer](https://id.jobstreet.com/id/ui-ux-designer-jobs) | Sampel menampilkan proses discovery sampai delivery, menerjemahkan kebutuhan pengguna, antarmuka intuitif, dan desain visual digital. |
| Digital Marketing Specialist | [O\*NET Search Marketing Strategists, 13-1161.01](https://www.onetonline.org/link/summary/13-1161.01) | [Jobstreet Digital Marketing Specialist](https://id.jobstreet.com/id/digital-marketing-specialist-jobs) | Sampel menampilkan performance marketing, paid media, SEO, analitik, konten, dan optimalisasi kampanye. |

Sampel Jobstreet ditinjau pada 5 September 2026. Untuk setiap karier, tim membaca
ringkasan beberapa lowongan yang tampil pada halaman hasil dan hanya mempertahankan
keahlian yang konsisten dengan profil pekerjaan dasar. Nama perusahaan tidak dipakai
untuk memberi bobot tambahan.

## Aturan Bobot dan Target

Bobot dan target adalah **heuristik prioritas belajar Pathly**, bukan standar kelulusan,
sertifikasi, atau ambang rekrutmen.

| Kategori | Bobot | Target Pathly | Aturan kurasi |
| --- | ---: | ---: | --- |
| Inti | 3 | 2 — Sudah Diterapkan | Terhubung langsung dengan keluaran utama peran dan muncul konsisten pada profil pekerjaan serta sampel lokal. |
| Penting | 2 | 1 — Sedang Belajar | Mendukung alat, kolaborasi, atau proses kerja, tetapi bukan keluaran utama yang sama pada seluruh konteks pekerjaan. |

Skor kesesuaian hanya menggunakan level pengguna, target, dan bobot. Kategori atau
tautan referensi bukti **tidak menambah skor**.

## Batasan dan Jadwal Tinjau

- Lima profil Pathly menyederhanakan variasi jabatan, senioritas, industri, dan perusahaan.
- O\*NET dan ESCO bukan standar pasar kerja Indonesia.
- Sampel lowongan merupakan snapshot kecil dan dapat berubah atau kedaluwarsa.
- Pemetaan belum ditinjau praktisi untuk setiap bidang.
- Tim perlu meninjau ulang setiap semester, mencatat tanggal, dan membandingkan minimal
  tiga lowongan aktif per karier sebelum mengubah skill, bobot, atau target.

Perubahan pemetaan harus memperbarui dokumen ini, `js/requirements.js`, tanggal
`lastReviewed` di `js/careers.js`, dan pengujian terkait.
