'use client';

import { useEffect, useState, useRef } from 'react';
import { getTestHistoryAction, deleteAllTestHistoryAction } from '@/app/actions';
import HistoryCard from "@/components/card-history";
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart } from './linechart';
import { AlertCircle, History, TrendingUp, RefreshCw, Trash2, CheckCircle2, XCircle, Info, Loader2, Calendar, Clock, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
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
  const [pdfLoading, setPdfLoading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartImageRef = useRef<string | null>(null);
  const router = useRouter();

  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

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
  
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // New useEffect to capture chart as image when history changes
  useEffect(() => {
    // If we have enough data to render a chart, capture it
    if (history.length > 1 && chartRef.current) {
      // Allow time for chart to render
      const timer = setTimeout(() => {
        captureChartAsImage();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [history]);

  // Function to capture chart as image
  const captureChartAsImage = async () => {
    try {
      if (!chartRef.current) return;
      
      // Dynamically import the html2canvas library
      const html2canvas = (await import('html2canvas')).default;
      
      const canvas = await html2canvas(chartRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      // Convert canvas to data URL
      const imageData = canvas.toDataURL('image/png');
      chartImageRef.current = imageData;
      
    } catch (err) {
      console.error("Failed to capture chart:", err);
    }
  };

  const handleDeleteAllHistory = async () => {
    if (!userId) {
      setNotification({
        type: 'error',
        message: 'User tidak ditemukan'
      });
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      setShowDeleteDialog(false);
      
      const result = await deleteAllTestHistoryAction(userId);
      
      if (result.error) {
        console.error('Delete error details:', result.details);
        setNotification({
          type: 'error',
          message: `Terjadi kesalahan saat menghapus data: ${result.error}`
        });
      } else {
        // Reset history list
        setHistory([]);
        setNotification({
          type: 'success',
          message: `Berhasil menghapus ${result.count || 'semua'} riwayat tes`
        });
        
        // Force router refresh to ensure page data is updated
        router.refresh();
        
        // Refetch data to ensure we have the latest state
        await fetchHistory();
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      setNotification({
        type: 'error',
        message: 'Terjadi kesalahan saat menghapus data: ' + (err.message || String(err))
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Function to generate and download PDF with chart
  const handleDownloadPDF = async () => {
    try {
      setPdfLoading(true);
      
      // If chart exists and we're in chart view, capture it first
      if (history.length > 1 && activeView === 'chart' && chartRef.current) {
        await captureChartAsImage();
      }
      
      // Dynamically import the html2pdf library
      const html2pdf = (await import('html2pdf.js')).default;
      
      if (!pdfRef.current) {
        throw new Error("Content reference not found");
      }
      
      // Before making PDF visible, inject the chart image if we have one
      if (chartImageRef.current && history.length > 1) {
        const chartPlaceholder = pdfRef.current.querySelector('.chart-placeholder');
        if (chartPlaceholder) {
          // Replace the placeholder with the actual chart image
          const img = document.createElement('img');
          img.src = chartImageRef.current;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'contain';
          
          // Clear the placeholder and append the image
          chartPlaceholder.innerHTML = '';
          chartPlaceholder.appendChild(img);
        }
      }
      
      // Temporarily make the PDF content visible
      pdfRef.current.classList.remove('hidden');
      pdfRef.current.classList.add('pdf-generation');
      
      const opt = {
        margin: 10,
        filename: `Riwayat_Tes_Stres_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' as 'portrait' | 'landscape' 
        }
      };
      
      // Create and download the PDF
      const pdf = html2pdf().from(pdfRef.current).set(opt);
      await pdf.save();
      
      // Hide the PDF content again after generation
      pdfRef.current.classList.add('hidden');
      pdfRef.current.classList.remove('pdf-generation');
      
      // Show success notification
      setNotification({
        type: 'success',
        message: 'PDF berhasil diunduh'
      });
      
    } catch (err) {
      console.error("PDF generation error:", err);
      // Show error notification
      setNotification({
        type: 'error',
        message: 'Gagal mengunduh PDF'
      });
      
      // Make sure we re-hide the content even if there was an error
      if (pdfRef.current) {
        pdfRef.current.classList.add('hidden');
        pdfRef.current.classList.remove('pdf-generation');
      }
    } finally {
      setPdfLoading(false);
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

  // Get stress level color for text and gradients
  const getStressLevelStyles = (level: string) => {
    switch(level.toLowerCase()) {
      case 'rendah': 
        return {
          text: 'text-green-800',
          gradient: 'from-green-100 to-green-200',
          border: 'border-green-300'
        };
      case 'sedang': 
        return {
          text: 'text-yellow-800',
          gradient: 'from-yellow-100 to-yellow-200',
          border: 'border-yellow-300'
        };
      case 'tinggi': 
        return {
          text: 'text-orange-800',
          gradient: 'from-orange-100 to-orange-200',
          border: 'border-orange-300'
        };
      case 'sangat tinggi': 
        return {
          text: 'text-red-800',
          gradient: 'from-red-100 to-red-200',
          border: 'border-red-300'
        };
      default: 
        return {
          text: 'text-gray-800',
          gradient: 'from-gray-100 to-gray-200',
          border: 'border-gray-300'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <div className="max-w-5xl mx-auto space-y-6 px-4 py-6">
        <Card className="mb-6 border-l-4 border-l-violet-600 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-violet-800">Riwayat Pemeriksaan Stress</CardTitle>
            <CardDescription className="text-gray-600">
              Pantau perkembangan tingkat stress Anda dari waktu ke waktu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Gunakan informasi ini untuk memahami pola dan mengambil langkah yang tepat
                untuk mengelola stress dengan lebih baik.
              </p>
              <Button 
                onClick={handleDownloadPDF} 
                disabled={pdfLoading}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                {pdfLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Export PDF
              </Button>
            </div>
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
          <Card className="shadow-sm border-t-4 border-t-green-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Rata-Rata Skor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">{averageScore}</p>
                <p className="text-gray-500 mb-1">/ 40</p>
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
                  <div ref={chartRef}>
                    <LineChart data={history.map(item => ({
                      date: new Date(item.created_at).toLocaleDateString('id-ID'),
                      score: item.total_score
                    })).reverse()} />
                  </div>
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

      {/* Hidden PDF template */}
      <div ref={pdfRef} className="hidden gap-1 text-sm leading-snug">
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-center gap-4 items-center mb-2">
            <img src="/ook.WEBP" alt="OK OCE Kemanusiaan Logo" className="h-12 object-contain" />
            <img src="/ooi.png" alt="OK OCE Indonesia Logo" className="h-12 object-contain" />
          </div>

          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-1">RIWAYAT TES TINGKAT STRES</h1>
            <h3 className="text-sm text-gray-600 mb-2">Program Kesehatan Mental OK OCE Kemanusiaan</h3>
            <div className="h-1 w-24 bg-violet-600 mx-auto mb-3"></div>
          </div>

          <div className="flex items-center justify-center gap-4 text-gray-600 mt-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">{new Date().toLocaleDateString('id-ID')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs">{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        {/* Summary Info */}
        <div className="mb-4">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h2 className="text-base font-semibold mb-2">Ringkasan</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
                <div className="text-gray-500 text-xs mb-1">Total Tes</div>
                <div className="text-xl font-bold">{history.length}</div>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
                <div className="text-gray-500 text-xs mb-1">Tes Terakhir</div>
                <div className="text-sm font-medium">{history.length > 0 ? formatDate(history[0].created_at) : "-"}</div>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
                <div className="text-gray-500 text-xs mb-1">Rata-Rata Skor</div>
                <div className="text-xl font-bold">{averageScore}<span className="text-sm text-gray-500 font-normal"> / 40</span></div>
              </div>
            </div>
          </div>
        </div>

                {/* Trend Graph */}
        {/* {history.length > 1 && (
          <div className="mb-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-base font-semibold mb-2">Grafik Perkembangan Stress</h2>
              chartRef ditempel ke div pembungkus
              <div className="h-40 w-full" ref={chartRef}>
                <LineChart
                  data={history.map(item => ({
                    date: new Date(item.created_at).toLocaleDateString('id-ID'),
                    score: item.total_score
                  })).reverse()}
                />
              </div>
            </div>
          </div>
        )} */}
        {/* History List */}
        <div className="mb-4">
          <h2 className="text-base font-semibold mb-2">Riwayat Tes</h2>
          <div className="space-y-3">
            {history.slice(0, 5).map((item, index) => {
              const colorStyles = getStressLevelStyles(item.stress_level);
              
              return (
                <div key={item.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">Tes #{history.length - index}</div>
                      <div className="text-xs text-gray-500">
                        {formatDate(item.created_at)} - {formatTime(item.created_at)}
                      </div>
                    </div>
                    <div className={`px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${colorStyles.gradient} ${colorStyles.text}`}>
                      {item.stress_level}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Skor</span>
                      <span className="font-bold">{item.total_score}/40</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getStressLevelColor(item.stress_level)}`} 
                        style={{ width: `${(item.total_score / 40) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {history.length > 5 && (
              <div className="text-center text-gray-500 text-xs mt-2">
                ...dan {history.length - 5} hasil tes lainnya
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mb-3">
          <div className="bg-gray-50 border-l-4 border-violet-600 p-3 rounded">
            <h4 className="font-semibold text-sm text-gray-800 mb-1">Penting Diketahui</h4>
            <p className="text-xs text-gray-600">
              Hasil ini sebagai langkah awal menyadari kondisi stres Anda. Bukan pengganti diagnosis profesional. Jika gejala berlanjut, konsultasikan dengan psikolog.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs pt-2 border-t border-gray-200 mt-12">
          <p>© {new Date().getFullYear()} OK OCE Kemanusiaan - Program Kesehatan Mental</p>
          <p>Di bawah naungan OK OCE Indonesia</p>
        </div>
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus semua riwayat tes? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isDeleting}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteAllHistory}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md w-full animate-fade-in-up">
          <div 
            className={`${
              notification.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            } rounded-lg border p-4 shadow-lg flex items-start gap-3`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            )}
            
            <div className="flex-1">
              <h3 className="font-medium mb-1">
                {notification.type === 'success' ? 'Berhasil' : 'Error'}
              </h3>
              <p className="text-sm">{notification.message}</p>
            </div>
            
            <button 
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}