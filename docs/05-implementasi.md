# BAB 5 — IMPLEMENTASI

## 5.1 Struktur Proyek
Proyek dibangun dengan struktur modular agar mudah diuji:
- `src/core/decoder/` : Logika pemindaian QR (jsQR & BarcodeDetector).
- `src/core/payload/` : Logika klasifikasi isi QR (URL, WiFi, vCard, dll).
- `src/core/rules/` : Logika Rule Engine heuristik (R01-R12).
- `src/ui/` : Komponen antarmuka React (Tailwind CSS).

## 5.2 Modul Inti (Core Modules)
### 5.2.1 QR Decoder
Modul ini menggunakan API `BarcodeDetector` bawaan browser sebagai metode utama, dengan `jsQR` sebagai *fallback*. Gambar diproses di atas `<canvas>` yang dilapisi latar belakang putih (untuk mencegah kegagalan baca pada gambar transparan).

*(Matta: Lampirkan potongan kode penting dari `qrDecoder.ts` di sini)*

### 5.2.2 Payload Classifier & URL Parser
Modul ini menggunakan Regular Expression (Regex) untuk mendeteksi tipe data. Jika tipe data adalah URL, objek `new URL()` bawaan browser digunakan untuk memecah domain, protokol, dan path secara aman tanpa mengeksekusi tautan.

*(Fidela: Lampirkan potongan kode dari `payloadClassifier.ts` dan `urlParser.ts`)*

### 5.2.3 Rule Engine Heuristik
Modul ini adalah inti keamanan aplikasi. Sistem mencocokkan URL dengan 12 aturan (R01-R12) dan menjumlahkan bobotnya untuk menentukan level risiko (Aman, Waspada, Risiko Tinggi).

*(Denny: Lampirkan potongan kode fungsi `analyzeURL` di sini)*

## 5.3 Antarmuka Pengguna (UI)
Aplikasi menggunakan React dengan *state management* (`useState`) untuk menampilkan hasil scan. Jika risiko tinggi, UI akan berubah menjadi warna merah dan tombol "Buka Tautan" akan memunculkan peringatan (konfirmasi).

*(Sulthania: Lampirkan screenshot aplikasi di sini: Tampilan Home, Tampilan Scan Kamera, dan Tampilan Hasil (Warna Merah/Hijau))*