'use client';
import { useState, useEffect } from 'react';
import { FaRedo } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";

interface TestData {
  id: number;
  user_id: string;
  total_score: number;
  stress_level: string;
  answer: string;
  created_at: string;
}

export default function ResultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState<TestData | null>(null);
  
  useEffect(() => {
    const fetchLatestResult = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/sign-in');
        return;
      }

      const { data, error } = await supabase
        .from('history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching results:', error);
        setLoading(false);
        return;
      }

      setTestData(data);
      setLoading(false);
    };

    fetchLatestResult();
  }, [router]);

  const getStressAdvice = (level: string) => {
    switch (level) {
      case "Rendah":
        return "Pertahankan gaya hidup sehatmu! Tetap jaga keseimbangan antara aktivitas dan istirahat.";
      case "Sedang":
        return "Cobalah teknik relaksasi sederhana dan atur jadwal istirahat yang cukup. Pertimbangkan untuk berbagi cerita dengan orang terdekat.";
      case "Tinggi":
        return "Sangat disarankan untuk berkonsultasi dengan profesional kesehatan mental. Jangan ragu untuk mencari bantuan.";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Data tidak ditemukan</h1>
          <button
            onClick={() => router.push('/protected')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Mulai Tes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Hasil Tes Stres</h1>
          <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-blue-600">{testData.total_score}</span>
          </div>
          <div className={`text-lg font-semibold mb-2 ${
            testData.stress_level === "Rendah" ? "text-green-600" :
            testData.stress_level === "Sedang" ? "text-yellow-600" : "text-red-600"
          }`}>
            Tingkat Stres: {testData.stress_level}
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {getStressAdvice(testData.stress_level)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-blue-800 mb-3">Rekomendasi</h3>
            <ul className="space-y-2 text-blue-700">
              <li>• Lakukan olahraga ringan secara teratur</li>
              <li>• Praktikkan teknik pernapasan dalam</li>
              <li>• Jaga pola tidur yang teratur</li>
              <li>• Batasi konsumsi kafein</li>
            </ul>
          </div>
          <div className="bg-green-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-green-800 mb-3">Langkah Selanjutnya</h3>
            <ul className="space-y-2 text-green-700">
              <li>• Catat pemicu stres dalam jurnal harian</li>
              <li>• Tetapkan rutinitas self-care</li>
              <li>• Jadwalkan waktu istirahat</li>
              <li>• Pertimbangkan konsultasi profesional</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push('/protected')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaRedo /> Mulai Tes Baru
          </button>
          <button
            onClick={() => router.push('/protected/history')}
            className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
          >
            Lihat Riwayat
          </button>
        </div>
      </div>
    </div>
  );
}