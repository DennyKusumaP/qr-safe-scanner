# BAB 6 — PENGUJIAN

## 6.1 Pengujian Unit (Unit Testing)
Pengujian dilakukan menggunakan framework Vitest untuk memastikan logika berjalan sesuai aturan. Terdapat 13 tes yang mencakup klasifikasi payload dan Rule Engine.

**Tabel 6.1 Hasil Pengujian Unit**
| No | Modul yang Diuji | Skenario | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| 1 | Payload Classifier | Mendeteksi URL (http/https) | Tipe = URL | Lulus |
| 2 | Payload Classifier | Mendeteksi WiFi | Tipe = WIFI | Lulus |
| 3 | Payload Classifier | Mendeteksi vCard/Kontak | Tipe = VCARD | Lulus |
| 4 | Payload Classifier | Mendeteksi Nomor Telepon | Tipe = TELEPON | Lulus |
| 5 | Payload Classifier | Teks Acak | Tipe = TEKS | Lulus |
| 6 | Rule Engine | URL Aman (google.com) | Skor 0, "Tidak ditemukan indikator risiko" | Lulus |
| 7 | Rule Engine | R01 (IP Address) | Terdeteksi R01 | Lulus |
| 8 | Rule Engine | R03 (Skema javascript:) | Status langsung "Risiko tinggi" | Lulus |
| 9 | Rule Engine | R05 & R06 (HTTP & Shortlink) | Skor 4, "Waspada" | Lulus |
| 10 | Rule Engine | R07 (Mirip Brand BCA) | Terdeteksi R07 | Lulus |
| 11 | Rule Engine | R07 & R08 (Subdomain berlebih) | Skor ≥ 6, "Risiko tinggi" | Lulus |
| 12 | Rule Engine | R09 (File .apk) | Terdeteksi R09 | Lulus |
| 13 | Rule Engine | Kombinasi IP + .apk | Skor 7, "Risiko tinggi" | Lulus |

## 6.2 Pengujian Fungsional (Black Box)
Pengujian dilakukan pada aplikasi yang telah di-deploy (Netlify) menggunakan dataset QR Code.

**Tabel 6.2 Dataset Pengujian QR Code**
| No | Isi QR Code | Kategori | Skor | Warna UI | Status |
|---|---|---|---|---|---|
| 1 | https://google.com | Aman | 0 | Hijau | Sesuai |
| 2 | https://youtu.be/... | Aman | 0 | Hijau | Sesuai |
| 3 | https://192.168.1.1 | Waspada | 3 | Kuning | Sesuai |
| 4 | http://bca-login-aman.com | Waspada | 4 | Kuning | Sesuai |
| 5 | http://bit.ly/rahasia | Waspada | 4 | Kuning | Sesuai |
| 6 | http://192.168.1.1/admin.apk | Risiko Tinggi | 7 | Merah | Sesuai |
| 7 | http://login.bca.secure.evil.com/update.zip | Risiko Tinggi | 8 | Merah | Sesuai |

## 6.3 Pengujian PWA & Keamanan
- **PWA:** Aplikasi berhasil di-build dan di-deploy. Fitur *Service Worker* sempat dinonaktifkan sementara saat pengujian untuk menghindari *cache loop*, namun konfigurasi PWA telah disiapkan untuk versi final.
- **Keamanan:** Pemrosesan gambar dan URL dilakukan 100% secara lokal di browser (client-side). Tidak ada data pengguna yang dikirim ke server. Tautan tidak pernah dibuka secara otomatis (ada konfirmasi).