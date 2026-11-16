import { describe, it, expect } from 'vitest';
import { classifyPayload } from '../src/core/payload/payloadClassifier';

describe('Payload Classifier', () => {
  it('harus mendeteksi URL dengan benar', () => {
    expect(classifyPayload('https://google.com').type).toBe('URL');
    expect(classifyPayload('http://example.com').type).toBe('URL');
  });

  it('harus mendeteksi WiFi', () => {
    expect(classifyPayload('WIFI:S:NamaWiFi;T:WPA;P:password;;').type).toBe('WIFI');
  });

  it('harus mendeteksi Kontak (vCard)', () => {
    expect(classifyPayload('BEGIN:VCARD\nVERSION:3.0\nFN:Denny\nEND:VCARD').type).toBe('VCARD');
  });

  it('harus mendeteksi Nomor Telepon', () => {
    expect(classifyPayload('tel:+628123456789').type).toBe('TELEPON');
    expect(classifyPayload('08123456789').type).toBe('TELEPON');
  });

  it('harus mengembalikan TEKS jika tidak dikenali', () => {
    expect(classifyPayload('Halo apa kabar?').type).toBe('TEKS');
  });
});