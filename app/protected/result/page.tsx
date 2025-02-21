'use client';
import { useState, useEffect } from 'react';
import { FaRedo, FaChartLine } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import { Loader2, Award } from "lucide-react";

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

  const getScoreColor = (level: string) => {
    switch (level) {
      case "Rendah":
        return "bg-green-500";
      case "Sedang":
        return "bg-yellow-500";
      case "Tinggi":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getScoreGradient = (level: string) => {
    switch (level) {
      case "Rendah":
        return "from-green-500 to-green-600";
      case "Sedang":
        return "from-yellow-500 to-yellow-600";
      case "Tinggi":
        return "from-red-500 to-red-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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

  const formattedDate = new Date(testData.created_at).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white gap-5">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 ">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Hasil Tes PSS</h1>
          <div className="h-1 w-32 bg-blue-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
          {/* Score Section */}
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <div className={`w-48 h-48 rounded-full ${getScoreColor(testData.stress_level)} bg-opacity-10 flex items-center justify-center`}>
              <div className={`w-36 h-36 rounded-full ${getScoreColor(testData.stress_level)} bg-opacity-20 flex items-center justify-center`}>
                <div className={`w-24 h-24 rounded-full ${getScoreColor(testData.stress_level)} flex items-center justify-center`}>
                  <span className="text-4xl font-bold text-white">
                    {testData.total_score}
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
              <Award className={`w-10 h-10 ${
                testData.stress_level === "Rendah" ? "text-green-500" :
                testData.stress_level === "Sedang" ? "text-yellow-500" : "text-red-500"
              }`} />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-3">Tingkat Stres</h2>
            <span className={`text-xl font-bold px-6 py-2 rounded-full ${
              testData.stress_level === "Rendah" ? "bg-green-100 text-green-700" :
              testData.stress_level === "Sedang" ? "bg-yellow-100 text-yellow-700" :
              "bg-red-100 text-red-700"
            }`}>
              {testData.stress_level}
            </span>
          </div>
        </div>


          {/* Scale Visualization */}
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-10">
            <h3 className="text-xl font-semibold mb-6">Informasi Skala Stres</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Skor Anda</span>
                  <span>{testData.total_score}/40</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getScoreColor(testData.stress_level)} transition-all duration-1000`}
                    style={{ width: `${(testData.total_score / 40) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center pt-4">
                <div className="p-4 rounded-lg bg-green-50">
                  <div className="font-semibold text-green-700">Rendah</div>
                  <div className="text-sm text-green-600">0-13</div>
                </div>
                <div className="p-4 rounded-lg bg-yellow-50">
                  <div className="font-semibold text-yellow-700">Sedang</div>
                  <div className="text-sm text-yellow-600">14-26</div>
                </div>
                <div className="p-4 rounded-lg bg-red-50">
                  <div className="font-semibold text-red-700">Tinggi</div>
                  <div className="text-sm text-red-600">27-40</div>
                </div>
              </div>
            </div>
          </div>
        </div>
              {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push('/protected')}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FaRedo className="w-4 h-4" />
              Mulai Tes Baru
            </button>
            <button
              onClick={() => router.push('/protected/history')}
              className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FaChartLine className="w-4 h-4" />
              Lihat Riwayat
            </button>
          </div>
      </main>
    </div>
  );
}