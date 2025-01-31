'use client';

import { useEffect, useState } from 'react';
import { getTestHistoryAction } from '@/app/actions';
import HistoryCard from "@/components/card-history";
import { createClient } from '@/utils/supabase/client';

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
          // Ensure each item has a valid unique ID
          const validatedData = result.data.map((item, index) => ({
            ...item,
            // Use database ID if available, otherwise create a unique ID
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
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center text-gray-600 p-4">
        Belum ada riwayat tes
      </div>
    );
  }

  return (
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
            key={item.id} // Using the guaranteed unique ID
            id={item.id}
            date={item.created_at}
            totalScore={item.total_score}
            stressLevel={item.stress_level}
            answers={parsedAnswers}
          />
        );
      })}
    </div>
  );
}