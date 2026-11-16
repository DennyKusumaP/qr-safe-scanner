import { useState } from 'react';
import { decodeImage } from './qrDecoder';
import CameraScanner from './ui/components/CameraScanner';

function App() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResult(null);
    setError(null);

    try {
      const decodedText = await decodeImage(file);
      if (decodedText) {
        setResult(decodedText);
      } else {
        setError("QR Code tidak terdeteksi di dalam gambar ini.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memproses gambar.");
    }
  };

  const handleScanSuccess = (text: string) => {
    setIsScanning(false);
    setResult(text);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
      {/* Komponen Kamera akan muncul jika isScanning = true */}
      {isScanning && (
        <CameraScanner 
          onScanSuccess={handleScanSuccess} 
          onCancel={() => setIsScanning(false)} 
        />
      )}

      <h1 className="text-3xl font-bold text-blue-600 mb-2">QR Safe Scanner</h1>
      <p className="text-gray-600 text-center mb-8">
        Literasi Digital - Kelompok 3<br/>
        Pemindai QR Code dengan Analisis Tujuan Tautan
      </p>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setIsScanning(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Scan QR
        </button>
        
        <label className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg shadow hover:bg-gray-50 transition cursor-pointer">
          Upload Gambar
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileUpload} 
          />
        </label>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg w-full max-w-md">
          <strong>Berhasil Terbaca:</strong>
          <p className="mt-2 break-all bg-white p-2 rounded">{result}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg w-full max-w-md">
          {error}
        </div>
      )}
    </div>
  )
}

export default App;