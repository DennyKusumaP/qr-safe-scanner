export type PayloadType = 'URL' | 'WIFI' | 'VCARD' | 'TELEPON' | 'TEKS';

export interface PayloadResult {
  type: PayloadType;
  rawData: string;
}

export function classifyPayload(text: string): PayloadResult {
  const trimmed = text.trim();

  // 1. Cek URL (http:// atau https://)
  if (/^https?:\/\//i.test(trimmed)) {
    return { type: 'URL', rawData: trimmed };
  }

  // 2. Cek WiFi (format standar: WIFI:S:NamaWiFi;...)
  if (/^WIFI:/i.test(trimmed)) {
    return { type: 'WIFI', rawData: trimmed };
  }

  // 3. Cek Kontak vCard (format standar: BEGIN:VCARD)
  if (/^BEGIN:VCARD/i.test(trimmed)) {
    return { type: 'VCARD', rawData: trimmed };
  }

  // 4. Cek Nomor Telepon (format tel: atau hanya angka/+)
  if (/^tel:/i.test(trimmed) || /^\+?[0-9\s\-()]{7,15}$/.test(trimmed)) {
    return { type: 'TELEPON', rawData: trimmed };
  }

  // 5. Jika tidak cocok semua, anggap Teks Biasa
  return { type: 'TEKS', rawData: trimmed };
}