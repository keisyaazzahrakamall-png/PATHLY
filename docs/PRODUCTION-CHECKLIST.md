# Checklist Produksi dan Submission Pathly

Gunakan daftar ini setelah kode final diunggah ke GitHub. Jangan menandai langkah yang
belum benar-benar diuji.

## 1. Deployment Vercel

- [ ] Import repository Pathly ke Vercel.
- [ ] Framework preset: **Vite**.
- [ ] Build command: `npm run build`.
- [ ] Output directory: `dist`.
- [ ] Environment variables `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY`
      tersedia jika tidak memakai nilai publik bawaan.
- [ ] Deployment production berhasil dan semua halaman HTML dapat dibuka langsung.
- [ ] `vercel.json` terbaca; cek response headers production.

## 2. Redirect Supabase Auth

Di Supabase Dashboard → Authentication → URL Configuration:

- [ ] **Site URL** berisi URL production Vercel yang tepat.
- [ ] Redirect URL konfirmasi: `https://DOMAIN-VERCEL/confirm-email.html`.
- [ ] Redirect URL reset: `https://DOMAIN-VERCEL/reset-password.html`.
- [ ] Redirect development: `http://localhost:5173/**`.
- [ ] Bila preview Vercel dipakai, tambahkan pola preview yang sesuai akun/tim.

Referensi: [Supabase Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).

## 3. Uji Dua Akun

Gunakan dua email yang memang dapat menerima tautan. Pastikan data akun A tidak muncul
pada akun B.

| Alur | Akun A | Akun B |
| --- | --- | --- |
| Daftar dan konfirmasi email | [ ] | [ ] |
| Login dan logout | [ ] | [ ] |
| Lupa password → email → buat password baru | [ ] | [ ] |
| Isi profil | [ ] | [ ] |
| Pilih satu target dan selesaikan asesmen | [ ] | [ ] |
| Catat referensi dan pilih “Belum Ada Bukti” pada skill lain | [ ] | [ ] |
| Simpan refleksi dan buat roadmap | [ ] | [ ] |
| Centang progres, logout, lalu login kembali | [ ] | [ ] |
| Nilai target karier kedua dan kembali ke target pertama | [ ] | [ ] |
| Reset Perjalanan hanya menghapus data akun aktif | [ ] | [ ] |

Catat browser, perangkat, tanggal, hasil aktual, dan bug pada setiap kegagalan.

## 4. Akses Juri

- [ ] Buat satu akun demo tanpa data pribadi.
- [ ] Konfirmasi email akun demo sebelum diserahkan.
- [ ] Isi satu perjalanan lengkap agar juri bisa langsung melihat hasil dan roadmap.
- [ ] Letakkan cara akses pada README atau kolom submission yang memang bersifat privat.
- [ ] Jangan menaruh password demo di repository publik; gunakan kolom submission privat.

## 5. Screenshot Production

Simpan file di `docs/screenshots/` dengan nama berikut:

- [ ] `landing-page.png`
- [ ] `asesmen-referensi.png`
- [ ] `hasil-kesesuaian.png`
- [ ] `roadmap-jalur-saya.png`

Ambil dari URL production, gunakan data dummy, dan pastikan tidak ada email atau data
pribadi yang terlihat.

## 6. Uji Pengguna Ringkas

Uji minimal 3–5 mahasiswa. Ini bukan syarat agar aplikasi berjalan, tetapi dibutuhkan
untuk mendukung klaim dampak.

Tanyakan sesudah mereka mencoba tanpa diarahkan:

1. Apa tujuan Pathly menurutmu?
2. Apakah kamu memahami perbedaan skor, referensi bukti, dan refleksi?
3. Apakah kamu dapat mengganti target tanpa kehilangan hasil lama?
4. Langkah roadmap mana yang paling jelas dan paling membingungkan?
5. Apakah Pathly membantumu menentukan satu tindakan berikutnya? Mengapa?

Catat jumlah partisipan, skenario, temuan, perubahan yang dilakukan, dan keterbatasannya.
Jangan mengklaim hasil uji pengguna sebelum kegiatan benar-benar dilakukan.

## 7. README dan Submission

- [ ] Isi URL live demo.
- [ ] Isi URL repository.
- [ ] Isi identitas dan tautan anggota tim; hapus baris yang tidak dipakai.
- [ ] Masukkan screenshot ke bagian Demo dan Screenshot.
- [ ] Jalankan `npm run check` dan catat jumlah test terbaru.
- [ ] Periksa tidak ada credential rahasia atau Supabase `service_role` key.
- [ ] Pastikan `README.md` berada di root repository.
