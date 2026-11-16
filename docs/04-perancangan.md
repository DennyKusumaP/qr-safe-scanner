# BAB 4 — ANALISIS & PERANCANGAN

## 4.1 Perancangan Arsitektur Sistem
Aplikasi ini menggunakan arsitektur *Client-Side Only* (PWA) tanpa backend. Alur data:
1. Input (Kamera/Upload) -> 
2. Decoder (jsQR/BarcodeDetector) -> 
3. Payload Classifier (Deteksi Tipe) -> 
4. URL Parser (jika URL) -> 
5. Rule Engine (Skoring Risiko) -> 
6. UI (Menampilkan Hasil & Edukasi).

## 4.2 Perancangan Rule Engine Heuristik
Sistem menggunakan 12 aturan dengan bobot berbeda. Total skor menentukan tingkat risiko:
- 0-2: Tidak ditemukan indikator risiko
- 3-5: Waspada
- ≥6: Risiko tinggi
*(Khusus R03, jika terdeteksi skema berbahaya, langsung dipaksa menjadi Risiko Tinggi).*

**Tabel 4.1 Daftar Aturan (Rules)**
| Kode | Aturan | Bobot |
|---|---|---|
| R01 | Host berupa IP address | 3 |
| R02 | Punycode / IDN campuran (xn--) | 3 |
| R03 | Skema berbahaya (javascript:, data:) | 10 |
| R04 | Karakter '@' di authority | 3 |
| R05 | http:// (bukan HTTPS) | 2 |
| R06 | Shortlink (bit.ly, dll) | 2 |
| R07 | Domain mirip brand resmi | 2 |
| R08 | Subdomain berlebihan | 2 |
| R09 | Ekstensi file berbahaya (.apk, .exe) | 2 |
| R10 | URL sangat panjang / banyak encoding | 1 |
| R11 | Parameter redirect | 1 |
| R12 | Port tidak umum | 1 |