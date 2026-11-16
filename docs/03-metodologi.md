# BAB 3 — METODOLOGI

## 3.1 Metode Pengembangan Sistem
Proyek ini dikembangkan menggunakan metode **Design Thinking** karena berfokus pada kebutuhan pengguna (user-centric). Tahapan yang dilakukan:
1. **Empathize:** Menganalisis permasalahan maraknya penipuan QR Code (quishing) di masyarakat.
2. **Define:** Menetapkan fitur utama berupa pemindai QR lokal dan analisis risiko heuristik.
3. **Ideate:** Merancang Rule Engine (R01-R12) dan antarmuka PWA.
4. **Prototype:** Mengimplementasikan kode menggunakan React, TypeScript, dan Tailwind CSS.
5. **Test:** Melakukan pengujian unit (Vitest) dan evaluasi pengguna (usability test).

## 3.2 Tahapan Pengembangan
*(Amira: Ceritakan secara singkat alur dari analisis kebutuhan, perancangan, implementasi, hingga evaluasi)*.

## 3.3 Metode Evaluasi Pengguna
Evaluasi dilakukan dalam dua tahap:
1. **Usability Test:** Menggunakan kuesioner System Usability Scale (SUS) untuk mengukur kemudahan penggunaan aplikasi.
2. **Pre-test dan Post-test:** Untuk mengukur peningkatan pemahaman responden mengenai bahaya *quishing* sebelum dan sesudah menggunakan aplikasi.

## 3.4 Instrumen Pengumpulan Data
- **Kuesioner SUS:** 10 pertanyaan standar (skala 1-5).
- **Kuesioner Literasi Digital:** Soal pilihan ganda seputar keamanan tautan dan QR Code.
- **Dataset Uji:** Kumpulan URL aman dan berbahaya (Risiko Tinggi) untuk menguji akurasi Rule Engine.