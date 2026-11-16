# BAB 8 — KESIMPULAN & SARAN

## 8.1 Kesimpulan
Berdasarkan hasil perancangan, implementasi, dan pengujian, dapat disimpulkan bahwa:
1. Aplikasi PWA "QR Safe Scanner" berhasil dibangun dan dapat memindai QR Code secara lokal (melalui kamera maupun unggahan gambar) tanpa mengirim data ke server.
2. Rule Engine Heuristik (R01-R12) berhasil diimplementasikan dan mampu mendeteksi indikator risiko pada URL (seperti IP Address, shortlink, dan file berbahaya) dengan akurasi pengujian unit mencapai 100% (13 tes lulus).
3. Aplikasi ini berhasil menjadi media literasi digital, dibuktikan dengan antarmuka yang memberikan alasan risiko secara transparan serta kotak edukasi (*"Tahukah kamu?"*).

## 8.2 Keterbatasan
1. Sistem hanya menganalisis indikator permukaan (heuristik) dan tidak dapat menjamin 100% keamanan tautan.
2. Tautan shortlink tidak dapat diperluas secara otomatis karena keterbatasan arsitektur *client-side*.
3. Verifikasi QRIS dan pembayaran tidak dilakukan dalam versi MVP ini.

## 8.3 Saran Pengembangan Lanjutan
1. **Integrasi Machine Learning (AI):** Melatih model untuk mendeteksi pola URL phishing yang lebih kompleks.
2. **Backend Reputasi (API):** Mengintegrasikan API pihak ketiga (seperti Google Safe Browsing) untuk cek reputasi domain secara *real-time*.
3. **Fitur Verifikasi QRIS:** Menambahkan modul untuk memverifikasi keaslian merchant QRIS.
4. **Auto-expand Shortlink:** Menggunakan *serverless function* untuk mengecek tujuan akhir dari tautan pendek sebelum ditampilkan ke pengguna.