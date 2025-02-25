'use client';

import { useEffect, useState } from 'react';
import { getTestHistoryAction } from '@/app/actions';
import HistoryCard from "@/components/card-history";
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from './linechart';
import { AlertCircle, History, TrendingUp, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from 'next/link';

interface TestHistoryData {
  id: string;
  created_at: string;
  total_score: number;
  stress_level: string;
  answer: string;
  user_id: string;
}

export default function TestHistory() {
  const [history, setHistory] = useState<TestHistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'list' | 'chart'>('list');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError('User tidak ditemukan');
          setLoading(false);
          return;
        }

        const result = await getTestHistoryAction(user.id);
        
        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          const validatedData = result.data.map((item, index) => ({
            ...item,
            id: item.id || `history-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          }));
          setHistory(validatedData);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Terjadi kesalahan saat mengambil data');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-20 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        <p className="text-gray-600 font-medium">Memuat riwayat tes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-2xl mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
        <AlertCircle className="h-16 w-16 text-violet-600 mb-6" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Data Tidak Ditemukan</h2>
        <p className="text-gray-600 text-center mb-2">
          Maaf, kami tidak dapat menemukan riwayat tes anda, mulai tes untuk melihat riwayat
        </p>
        <p className="text-gray-600 text-center mb-8">
          Silakan mulai tes baru.
        </p>
        <Link 
          href="/protected"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all duration-300"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Mulai Tes
        </Link>
      </div>
    );
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Riwayat Pemeriksaan Stress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Lihat dan pantau perkembangan tingkat stress Anda dari waktu ke waktu.
            Gunakan informasi ini untuk memahami pola dan mengambil langkah yang tepat
            untuk mengelola stress dengan lebih baik.
          </p>
        </CardContent>
      </Card>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Riwayat Tes</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView('list')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeView === 'list' 
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <History className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setActiveView('chart')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeView === 'chart' 
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Grafik
            </button>
          </div>
        </div>

        {activeView === 'chart' ? (
          <Card>
            <CardContent className="pt-6">
              <LineChart data={history.map(item => ({
                date: new Date(item.created_at).toLocaleDateString('id-ID'),
                score: item.total_score
              })).reverse()} />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {history.map((item) => {
              let parsedAnswers: Record<string, number>;
              try {
                parsedAnswers = typeof item.answer === 'string' 
                  ? JSON.parse(item.answer) 
                  : item.answer;
              } catch (err) {
                console.error('Error parsing answers:', err);
                parsedAnswers = {};
              }

              return (
                <HistoryCard
                  key={item.id}
                  id={item.id}
                  date={item.created_at}
                  totalScore={item.total_score}
                  stressLevel={item.stress_level}
                  answers={parsedAnswers}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}