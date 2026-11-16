import type { ParsedURL } from '../url-parser/urlParser';

export type RiskLevel = 'Tidak ditemukan indikator risiko' | 'Waspada' | 'Risiko tinggi';

export interface RuleMatch {
  code: string;
  reason: string;
  weight: number;
}

export interface AnalysisResult {
  score: number;
  level: RiskLevel;
  matches: RuleMatch[];
}

const BRANDS = ['bca', 'bri', 'mandiri', 'bni', 'shopee', 'tokopedia', 'dana', 'gopay', 'ovo', 'linkaja'];
const SHORTLINK_DOMAINS = ['bit.ly', 'tinyurl.com', 't.co', 's.id', 'bit.do', 'ow.ly', 'is.gd'];
const BAD_EXTENSIONS = ['.apk', '.exe', '.zip', '.scr', '.bat'];

export function analyzeURL(parsedUrl: ParsedURL): AnalysisResult {
  const matches: RuleMatch[] = [];
  const { protocol, hostname, pathname, search } = parsedUrl;

  // R01: Host berupa IP Address (Bobot 3)
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    matches.push({ code: 'R01', reason: 'Domain menggunakan alamat IP, bukan nama domain.', weight: 3 });
  }

  // R02: Punycode (Bobot 3)
  if (hostname.includes('xn--')) {
    matches.push({ code: 'R02', reason: 'Domain menggunakan format Punycode yang dapat menyamarkan karakter asli.', weight: 3 });
  }

  // R03: Skema berbahaya (Bobot 10)
  if (['javascript:', 'data:', 'file:', 'intent:'].includes(protocol)) {
    matches.push({ code: 'R03', reason: 'Tautan menggunakan protokol berbahaya yang bisa mengeksekusi kode.', weight: 10 });
  }

  // R04: Karakter '@' di authority (Bobot 3)
  if (parsedUrl.fullUrl.includes('@') && parsedUrl.fullUrl.indexOf('@') < parsedUrl.fullUrl.indexOf(hostname)) {
    matches.push({ code: 'R04', reason: 'Ada karakter @ di URL yang dapat menyamarkan domain asli.', weight: 3 });
  }

  // R05: http:// (bukan HTTPS) (Bobot 2)
  if (protocol === 'http:') {
    matches.push({ code: 'R05', reason: 'Tautan tidak menggunakan enkripsi HTTPS.', weight: 2 });
  }

  // R06: Shortlink (Bobot 2)
  if (SHORTLINK_DOMAINS.some(domain => hostname === domain || hostname.endsWith('.' + domain))) {
    matches.push({ code: 'R06', reason: 'Tautan menggunakan shortlink sehingga tujuan akhir tidak terlihat.', weight: 2 });
  }

  // R07: Domain mirip brand resmi (Bobot 2)
  const hostWithoutTld = hostname.replace(/\.[a-z]+$/, '');
  const brandFound = BRANDS.find(brand => hostWithoutTld.includes(brand));
  if (brandFound) {
    const isOfficial = hostname === `${brandFound}.com` || hostname === `${brandFound}.co.id` || hostname === `${brandFound}.id`;
    if (!isOfficial) {
      matches.push({ code: 'R07', reason: `Domain menyebut nama brand (${brandFound.toUpperCase()}) tapi bukan domain resminya.`, weight: 2 });
    }
  }

  // R08: Subdomain berlebihan (Bobot 2)
  const dotCount = (hostname.match(/\./g) || []).length;
  if (dotCount >= 4) {
    matches.push({ code: 'R08', reason: 'Domain memiliki subdomain yang terlalu banyak (berlebihan).', weight: 2 });
  }

  // R09: Ekstensi file berbahaya (Bobot 2)
  if (BAD_EXTENSIONS.some(ext => pathname.toLowerCase().endsWith(ext))) {
    matches.push({ code: 'R09', reason: 'Tautan mengarah langsung ke file berbahaya (seperti .apk atau .exe).', weight: 2 });
  }

  // R10: URL sangat panjang / banyak encoding (Bobot 1)
  const percentCount = (parsedUrl.fullUrl.match(/%[0-9A-F]{2}/gi) || []).length;
  if (parsedUrl.fullUrl.length > 100 || percentCount > 10) {
    matches.push({ code: 'R10', reason: 'URL terlalu panjang atau memiliki banyak encoding karakter.', weight: 1 });
  }

  // R11: Parameter redirect (Bobot 1)
  if (/[?&](url|next|redirect)=/i.test(search)) {
    matches.push({ code: 'R11', reason: 'URL berisi parameter yang mengarahkan ke halaman lain (redirect).', weight: 1 });
  }

  // R12: Port tidak umum (Bobot 1)
  if (parsedUrl.fullUrl.includes(':')) {
      const urlObj = new URL(parsedUrl.fullUrl);
      if (urlObj.port && !['80', '443', '8080', '8443'].includes(urlObj.port)) {
          matches.push({ code: 'R12', reason: 'URL menggunakan nomor port yang tidak umum.', weight: 1 });
      }
  }

  // Hitung total skor dari semua aturan yang cocok
  const score = matches.reduce((total, match) => total + match.weight, 0);
  
  let level: RiskLevel = 'Tidak ditemukan indikator risiko';
  if (matches.some(m => m.code === 'R03')) {
    level = 'Risiko tinggi';
  } else if (score >= 6) {
    level = 'Risiko tinggi';
  } else if (score >= 3) {
    level = 'Waspada';
  }

  return { score, level, matches };
}