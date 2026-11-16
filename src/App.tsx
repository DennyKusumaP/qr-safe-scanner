import { useState } from 'react';
import { decodeImage } from './qrDecoder';
import CameraScanner from './ui/components/CameraScanner';
import { classifyPayload, type PayloadResult } from './core/payload/payloadClassifier';
import { parseURL } from './core/url-parser/urlParser';
import { analyzeURL, type AnalysisResult } from './core/rules/ruleEngine';

function App() {
  const [result, setResult] = useState<PayloadResult | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const processText = (text: string) => {
    const payload = classifyPayload(text);
    setResult(payload);
    setError(null);

    if (payload.type === 'URL') {
      const parsedUrl = parseURL(payload.rawData);
      if (parsedUrl) {
        const analysisResult = analyzeURL(parsedUrl);
        setAnalysis(analysisResult);
      } else {
        setAnalysis(null);
        setError("Format URL tidak valid.");
      }
    } else {
      setAnalysis(null);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResult(null);
    setAnalysis(null);
    setError(null);

    try {
      const decodedText = await decodeImage(file);
      if (decodedText) {
        processText(decodedText);
      } else {
        setError("QR Code tidak terdeteksi di dalam gambar ini.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat memproses gambar.");
    }
  };

  const handleScanSuccess = (text: string) => {
    setIsScanning(false);
    processText(text);
  };

  const getRiskColor = (level: string) => {
    if (level === 'Risiko tinggi') return 'bg-red-100 text-red-800 border-red-300';
    if (level === 'Waspada') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  // Fungsi untuk membuka link dengan konfirmasi keamanan
  const handleOpenLink = (url: string) => {
    if (analysis?.level === 'Risiko tinggi') {
      const confirm = window.confirm(
        "PERINGATAN KERAS: Tautan ini memiliki RISIKO TINGGI dan berpotensi mencuri data Anda. Apakah Anda benar-benar yakin ingin membukanya?"
      );
      if (!confirm) return; // Batal buka
    } else if (analysis?.level === 'Waspada') {
      const confirm = window.confirm(
        "Hati-hati: Tautan ini memiliki indikator mencurigakan. Tetap lanjutkan membuka tautan?"
      );
      if (!confirm) return;
    }
    
    // Buka link di tab baru dengan aman (noopener, noreferrer)
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Fungsi untuk menyalin teks
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Teks berhasil disalin!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      
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
        <div className="mt-4 p-5 bg-white border border-gray-200 shadow-md rounded-lg w-full max-w-md">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Hasil Pemindaian</h3>
          
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded mb-2">
              Tipe: {result.type}
            </span>
            <p className="break-all bg-gray-50 p-3 rounded border text-gray-800 font-mono text-sm">
              {result.rawData}
            </p>
          </div>

          {analysis && (
            <div className={`mt-4 p-4 border rounded-lg ${getRiskColor(analysis.level)}`}>
              <div className="flex justify-between items-center mb-2">
                <strong className="text-lg">Status: {analysis.level}</strong>
                <span className="text-sm font-bold">Skor: {analysis.score}</span>
              </div>
              
              {analysis.matches.length > 0 ? (
                <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                  {analysis.matches.map((match, index) => (
                    <li key={index}>
                      {match.reason}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm mt-2">Sistem tidak menemukan indikator risiko pada tautan ini.</p>
              )}
            </div>
          )}

          {/* TOMBOL AKSI & EDUKASI */}
          <div className="mt-5 flex gap-3">
            {result.type === 'URL' && (
              <button 
                onClick={() => handleOpenLink(result.rawData)}
                className={`flex-1 text-white px-4 py-2 rounded-lg shadow transition ${analysis?.level === 'Risiko tinggi' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {analysis?.level === 'Risiko tinggi' ? 'Buka (Berisiko!)' : 'Buka Tautan'}
              </button>
            )}
            <button 
              onClick={() => handleCopy(result.rawData)}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition"
            >
              Salin Teks
            </button>
          </div>

          {/* KOTAK EDUKASI */}
          <div className="mt-5 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            <strong className="block mb-1">💡 Tahukah kamu?</strong>
            Penipuan lewat QR Code disebut <strong>Quishing</strong>. Selalu periksa domain tautan sebelum membuka. Jangan pernah memasukkan password atau data pribadi di situs yang mencurigakan.
          </div>
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