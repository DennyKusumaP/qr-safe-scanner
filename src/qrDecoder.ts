import jsQR from 'jsqr';

export async function decodeImage(file: File): Promise<string | null> {
  // 1. COBA PAKAI BARCODE DETECTOR (Bawaan Chrome/Edge, akurasi super tinggi)
  if ('BarcodeDetector' in window) {
    try {
      // @ts-ignore
      const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
      const imageBitmap = await createImageBitmap(file);
      const barcodes = await barcodeDetector.detect(imageBitmap);
      
      if (barcodes.length > 0) {
        return barcodes[0].rawValue;
      }
    } catch (e) {
      console.warn('BarcodeDetector gagal, mencoba fallback ke jsQR...', e);
    }
  }

  // 2. FALLBACK KE JSQR (Kalau browser tidak mendukung)
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);

        // Paksa background putih
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Coba baca normal
        let code = jsQR(imageData.data, imageData.width, imageData.height);
        
        // Kalau gagal, coba baca terbalik (invert)
        if (!code) {
          code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
          });
        }

        resolve(code ? code.data : null);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}