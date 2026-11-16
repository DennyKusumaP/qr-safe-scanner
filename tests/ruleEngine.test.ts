import { describe, it, expect } from 'vitest';
import { parseURL } from '../src/core/url-parser/urlParser';
import { analyzeURL } from '../src/core/rules/ruleEngine';

describe('Rule Engine Heuristik', () => {
  // Helper untuk mempermudah tes
  const analyze = (url: string) => {
    const parsed = parseURL(url);
    if (!parsed) throw new Error('URL tidak valid');
    return analyzeURL(parsed);
  };

  it('harus menganggap URL biasa sebagai Tidak ditemukan indikator risiko', () => {
    const result = analyze('https://google.com');
    expect(result.level).toBe('Tidak ditemukan indikator risiko');
    expect(result.score).toBe(0);
  });

  it('R01: harus mendeteksi IP Address', () => {
    const result = analyze('http://192.168.1.1/admin');
    expect(result.matches.some(m => m.code === 'R01')).toBe(true);
  });

  it('R03: skema javascript: harus langsung memaksa Risiko Tinggi', () => {
    const result = analyze('javascript:alert(1)');
    expect(result.level).toBe('Risiko tinggi');
    expect(result.matches.some(m => m.code === 'R03')).toBe(true);
  });

  it('R05 & R06: harus mendeteksi HTTP dan Shortlink', () => {
    const result = analyze('http://bit.ly/rahasia');
    expect(result.matches.some(m => m.code === 'R05')).toBe(true); // HTTP
    expect(result.matches.some(m => m.code === 'R06')).toBe(true); // Shortlink
    expect(result.level).toBe('Waspada');
  });

  it('R07: harus mendeteksi domain mirip brand', () => {
    const result = analyze('http://bca-login-aman.com');
    expect(result.matches.some(m => m.code === 'R07')).toBe(true);
  });

  it('R07 & R08: harus mendeteksi subdomain berlebihan dan brand', () => {
    const result = analyze('http://login.bca.secure.evil.com');
    expect(result.matches.some(m => m.code === 'R07')).toBe(true);
    expect(result.matches.some(m => m.code === 'R08')).toBe(true);
    expect(result.level).toBe('Risiko tinggi'); // Skor akan >= 6
  });

  it('R09: harus mendeteksi file berbahaya (.apk)', () => {
    const result = analyze('https://example.com/aplikasi.apk');
    expect(result.matches.some(m => m.code === 'R09')).toBe(true);
  });
});