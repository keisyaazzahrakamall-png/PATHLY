# Checklist Penilaian ITechnoCup 2026

Dokumen ini memetakan bukti yang perlu ditunjukkan saat penilaian. Nilai akhir tetap menjadi keputusan juri; checklist ini memastikan setiap aspek memiliki bukti yang dapat didemokan.

## 1. Kesesuaian tema dan subtema - 20%

- Masalah: mahasiswa kesulitan menghubungkan pilihan karier, kemampuan, dan langkah pengembangan.
- Solusi: asesmen berbukti, analisis kesenjangan, serta peta jalan personal.
- SDG: SDG 8 melalui persiapan transisi pendidikan-ke-kerja dan pengembangan kompetensi relevan.
- Bukti demo: landing page, alur eksplorasi, hasil asesmen, dan peta jalan.

## 2. Inovasi dan orisinalitas ide - 20%

- Tiga mode berdasarkan kondisi pengguna: eksplorasi, validasi 2–3 pilihan, dan persiapan target.
- Penilaian keahlian tidak hanya memakai tingkat diri, tetapi juga meminta jenis bukti.
- Kesenjangan diubah menjadi langkah Pelajari–Terapkan–Buktikan.
- Data dan progres dipersonalisasi per akun.

## 3. Fungsionalitas website - 20%

- Daftar, konfirmasi email, login, logout, sesi, dan reset kata sandi.
- Profil, tahap karier, pemilihan atau perbandingan karier.
- Validasi asesmen, hasil scoring, refleksi, peta jalan, dan progres dua arah.
- Loading lambat, error, empty state, serta reset perjalanan.
- Bukti teknis: `npm run check`.

## 4. UI/UX dan responsivitas - 15%

- Navigasi landing berurutan: Cara Kerja, Jelajahi Karier, Mengapa Pathly.
- Tombol perjalanan menyesuaikan progres akun.
- Istilah “karier” konsisten.
- Kontras tombol dan status diperiksa; animasi menghormati `prefers-reduced-motion`.
- Layout responsif untuk desktop, tablet, dan ponsel.
- Tugas peta jalan dikelompokkan per prioritas dan centang dapat dibatalkan.

## 5. Implementasi teknologi - 15%

- Modul ES pada Vanilla JavaScript dan bundling Vite.
- Supabase Auth, PostgreSQL, dan Row Level Security.
- Cache browser diikat ke ID pengguna aktif agar data akun tidak tertukar.
- Content Security Policy dan validasi input pekerjaan.
- Unit test untuk scoring dan keamanan input.

## 6. Dokumentasi dan repositori - 10%

- README menjelaskan masalah, fitur, teknologi, instalasi, penggunaan, struktur, SDG, dan keterbatasan interpretasi.
- `.env.example` tersedia tanpa menyimpan kredensial rahasia.
- Migrasi basis data tersedia dan dapat dijalankan ulang.
- Folder kode dipisah berdasarkan auth, data, scoring, halaman, dan fitur.

## Skenario demo singkat

1. Daftar atau login sebagai satu pengguna.
2. Isi profil lalu pilih “Saya memiliki beberapa pilihan”.
3. Bandingkan 2–3 karier dan tentukan satu target.
4. Tunjukkan definisi keahlian, validasi tingkat + bukti, dan opsi bukti Lainnya.
5. Tunjukkan hasil kesesuaian dan prioritas kesenjangan.
6. Isi lalu simpan refleksi adaptabilitas.
7. Buka peta jalan, centang tugas, lalu batalkan centang untuk membuktikan progres dua arah.
8. Kembali ke beranda dan gunakan tombol Jalur Saya untuk kembali ke progres akun.
9. Logout lalu login dengan akun lain untuk membuktikan pemisahan data pengguna.
