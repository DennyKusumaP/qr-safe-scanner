export interface ParsedURL {
  protocol: string;
  hostname: string;
  pathname: string;
  search: string;
  fullUrl: string;
}

/**
 * Membaca URL dengan aman menggunakan API bawaan browser.
 * Mengembalikan null jika URL tidak valid.
 */
export function parseURL(urlString: string): ParsedURL | null {
  try {
    // Kita gunakan 'new URL()' bawaan browser. 
    // Ini adalah cara paling aman, tidak akan mengeksekusi kode berbahaya.
    const url = new URL(urlString);
    return {
      protocol: url.protocol,
      hostname: url.hostname,
      pathname: url.pathname,
      search: url.search,
      fullUrl: url.href
    };
  } catch (e) {
    return null; // Jika string bukan URL yang valid
  }
}