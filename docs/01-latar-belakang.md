# BAB 1 — PENDAHULUAN

## 1.1 Latar Belakang
Penipuan digital terus berkembang, salah satunya adalah *Quishing* (QR Code Phishing). Pelaku memanfaatkan QR Code untuk mengarahkan korban ke situs palsu, mengunduh malware (APK), atau mencuri data perbankan. Masyarakat awam seringkali langsung memindai QR Code tanpa memeriksa tautan tujuannya. Oleh karena itu, proyek ini membangun "QR Safe Scanner", sebuah PWA yang dapat memindai QR Code dan menganalisis tujuan tautannya menggunakan *Rule Engine Heuristik* untuk memberikan peringatan dini kepada pengguna.

## 1.2 Rumusan Masalah
1. Bagaimana merancang aplikasi PWA yang dapat memindai QR Code secara lokal?
2. Bagaimana mengimplementasikan Rule Engine Heuristik untuk mendeteksi indikator risiko pada URL?
3. Bagaimana dampak aplikasi ini terhadap peningkatan literasi digital masyarakat terkait ancaman *quishing*?

## 1.3 Tujuan Proyek
Tujuan Teknis: Membangun aplikasi web progresif (PWA) pemindai QR dengan analisis URL lokal.
Tujuan Literasi Digital: Memberikan edukasi kepada pengguna mengenai bahaya tautan mencurigakan dan meningkatkan kesadaran akan praktik *quishing*.

## 1.4 Manfaat Proyek
- **Bagi Pengguna:** Alat bantu untuk memeriksa keamanan tautan sebelum dibuka.
- **Bagi Masyarakat:** Media edukasi literasi digital untuk menekan angka penipuan online.
- **Bagi Akademik:** Referensi implementasi Rule Engine dan PWA dalam bidang keamanan siber terapan.

## 1.5 Batasan Masalah
- Aplikasi ini bukan pengganti antivirus.
- Hanya mendeteksi indikator risiko berbasis heuristik, bukan 100% menjamin keamanan.
- Tidak dapat mengekspansi shortlink secara otomatis.
- Tidak memverifikasi keaslian QRIS/pembayaran.