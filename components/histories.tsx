'use client';

import { useEffect, useState } from 'react';
import { getTestHistoryAction, deleteAllTestHistoryAction } from '@/app/actions';
import HistoryCard from "@/components/card-history";
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart } from './linechart';
import { AlertCircle, History, TrendingUp, RefreshCw, Trash2, CheckCircle2, XCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
  const [userId, setUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('User tidak ditemukan');
        setLoading(false);
        return;
      }

      setUserId(user.id);

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

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDeleteAllHistory = async () => {
    if (!userId) {
      toast.error("User tidak ditemukan");
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      setShowDeleteDialog(false);
      
      const result = await deleteAllTestHistoryAction(userId);
      
      if (result.error) {
        console.error('Delete error details:', result.details);
        toast.error(result.error);
      } else {
        // Reset history list
        setHistory([]);
        toast.success(`Berhasil menghapus ${result.count || 'semua'} riwayat tes`);
        
        // Force router refresh to ensure page data is updated
        router.refresh();
        
        // Refetch data to ensure we have the latest state
        await fetchHistory();
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      toast.error('Terjadi kesalahan saat menghapus data: ' + (err.message || String(err)));
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate average stress score
  const averageScore = history.length > 0 
    ? Math.round(history.reduce((sum, item) => sum + item.total_score, 0) / history.length) 
    : 0;

  // Get stress level color
  const getStressLevelColor = (level: string) => {
    switch(level.toLowerCase()) {
      case 'rendah': return 'bg-green-500';
      case 'sedang': return 'bg-yellow-500';
      case 'tinggi': return 'bg-orange-500';
      case 'sangat tinggi': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-20 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        <p className="text-gray-600 font-medium mt-4">Memuat riwayat tes...</p>
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
      <Toaster position="top-center" richColors />
      
      <div className="max-w-5xl mx-auto space-y-6 px-4 py-6">
        <Card className="mb-6 border-l-4 border-l-violet-600 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-violet-800">Riwayat Pemeriksaan Stress</CardTitle>
            <CardDescription className="text-gray-600">
              Pantau perkembangan tingkat stress Anda dari waktu ke waktu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Gunakan informasi ini untuk memahami pola dan mengambil langkah yang tepat
              untuk mengelola stress dengan lebih baik.
            </p>
          </CardContent>
        </Card>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-sm border-t-4 border-t-violet-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Tes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">{history.length}</p>
                <p className="text-gray-500 mb-1">pemeriksaan</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-t-4 border-t-blue-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Tes Terakhir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <p className="text-lg font-semibold">
                  {history.length > 0 
                    ? new Date(history[0].created_at).toLocaleDateString('id-ID')
                    : "-"
                  }
                </p>
                {history.length > 0 && (
                  <Badge 
                    className={`mt-1 self-start ${getStressLevelColor(history[0].stress_level)}`}
                  >
                    {history[0].stress_level}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Data Historis</h2>
          
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
            size="sm"
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Hapus Semua</span>
            <span className="sm:hidden">Hapus</span>
          </Button>
        </div>

        <Tabs defaultValue="list" className="w-full" onValueChange={(value) => setActiveView(value as 'list' | 'chart')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Daftar Tes
            </TabsTrigger>
            <TabsTrigger value="chart" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Grafik Trend
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Grafik Perkembangan Stress</CardTitle>
                <CardDescription>Visualisasi perubahan tingkat stress dari waktu ke waktu</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {history.length > 1 ? (
                  <LineChart data={history.map(item => ({
                    date: new Date(item.created_at).toLocaleDateString('id-ID'),
                    score: item.total_score
                  })).reverse()} />
                ) : (
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">Informasi</AlertTitle>
                    <AlertDescription className="text-blue-700">
                      Diperlukan minimal 2 data tes untuk menampilkan grafik trend. Silakan lakukan tes lagi untuk melihat grafik perkembangan.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="list">
            <div className="space-y-4">
            {history.map((item, index) => {
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
                <div key={item.id} className={index === 0 ? "relative" : ""}>
                  {index === 0 && (
                    <div className="absolute -left-4 top-4 rounded-r-md bg-violet-600 text-white text-xs font-medium py-1 px-2 shadow-sm">
                      Terbaru
                    </div>
                  )}
                  <HistoryCard
                    id={item.id}
                    date={item.created_at}
                    totalScore={item.total_score}
                    stressLevel={item.stress_level}
                    answers={parsedAnswers}
                  />
                </div>
              );
            })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Konfirmasi Penghapusan
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus semua riwayat tes? 
              <span className="font-semibold block mt-1 text-red-500">Tindakan ini tidak bisa dibatalkan.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-between mt-6 gap-4 flex-col sm:flex-row">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Batal
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteAllHistory}
              disabled={isDeleting}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                  Menghapus...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Ya, Hapus Semua
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}