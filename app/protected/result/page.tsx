'use client';

import { useState, useEffect } from 'react';
import { FaRedo, FaChartLine, FaTrash } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";
import { 
  Loader2, 
  Award, 
  Info, 
  Calendar,
  Clock,
  AlertCircle,
  RefreshCw,
  Trash2,
  CheckCircle,
  XCircle
} from "lucide-react";

interface TestData {
  id: number;
  user_id: string;
  test_id: number;
  total_score: number;
  stress_level: string;
  answer: string;
  created_at: string;
}

interface ScoreCategory {
  label: string;
  range: string;
  description: string;
  color: {
    bg: string;
    text: string;
    gradient: string;
    border: string;
  };
}

const scoreCategories: Record<string, ScoreCategory> = {
  Rendah: {
    label: "Rendah",
    range: "0-13",
    description: "Tingkat stres Anda berada dalam kategori rendah. Tetap jaga pola hidup sehat dan kelola stres dengan baik.",
    color: {
      bg: "bg-green-500",
      text: "text-green-700",
      gradient: "from-green-50 to-green-100",
      border: "border-green-200"
    }
  },
  Sedang: {
    label: "Sedang",
    range: "14-26",
    description: "Tingkat stres Anda berada dalam kategori sedang. Perhatikan faktor pemicu stres dan terapkan teknik relaksasi.",
    color: {
      bg: "bg-yellow-500", 
      text: "text-yellow-700",
      gradient: "from-yellow-50 to-yellow-100",
      border: "border-yellow-200"
    }
  },
  Tinggi: {
    label: "Tinggi",
    range: "27-40",
    description: "Tingkat stres Anda berada dalam kategori tinggi. Disarankan untuk berkonsultasi dengan profesional kesehatan mental.",
    color: {
      bg: "bg-red-500",
      text: "text-red-700",
      gradient: "from-red-50 to-red-100",
      border: "border-red-200"
    }
  }
};

export default function HalamanHasil() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // New state for notifications
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  
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
        setLoading(false);
        return;
      }
      setTestData(data);
      setLoading(false);
    };

    fetchLatestResult();
  }, [router]);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const getScoreColor = (level: string) => {
    return scoreCategories[level]?.color.bg || "bg-gray-500";
  };

  const handleDeleteTest = async () => {
    // Hapus pesan kesalahan sebelumnya
    setErrorMessage(null);
    
    // Pastikan testData ada
    if (!testData) {
      const errorMsg = "Tidak dapat menghapus tes: Data tes tidak ditemukan";
      console.error(errorMsg);
      setErrorMessage(errorMsg);
      // Show error notification
      setNotification({
        type: 'error',
        message: errorMsg
      });
      return;
    }
    
    // // Tampilkan semua field yang ada di testData
    // console.log("Field-field data tes:", Object.keys(testData));
    
    // Periksa test_id terlebih dahulu, karena sepertinya ini adalah ID yang benar
    const recordId = testData.test_id;
    
    if (!recordId) {
      const errorMsg = "Tidak dapat menghapus tes: ID tes tidak ditemukan";
      console.error(errorMsg);
      setErrorMessage(errorMsg);
      // Show error notification
      setNotification({
        type: 'error',
        message: errorMsg
      });
      return;
    }
    
    try {
      setDeleteLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('history')
        .delete()
        .eq('test_id', recordId)  // Menggunakan test_id sebagai kolom untuk mencari record
        .select();
      
      if (error) {
        const errorMsg = `Error menghapus tes: ${error.message}`;
        console.error(errorMsg);
        setErrorMessage(errorMsg);
        // Show error notification
        setNotification({
          type: 'error',
          message: errorMsg
        });
        return;
      }
      // Show success notification
      setNotification({
        type: 'success',
        message: 'Hasil tes berhasil dihapus'
      });
      
      // Close modal and redirect after a slight delay
      setShowConfirmDelete(false);
      
      // Delay the redirect to allow user to see the success message
      setTimeout(() => {
        router.push('/protected');
      }, 1500);
      
    } catch (err) {
      const errorMsg = `Error tidak terduga saat menghapus: ${err}`;
      console.error(errorMsg);
      setErrorMessage(errorMsg);
      // Show error notification
      setNotification({
        type: 'error',
        message: errorMsg
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-20 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
        <p className="text-gray-600 font-medium">Memuat hasil tes...</p>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="flex items-center justify-center flex-1 py-20">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm max-w-md w-full mx-4">
          <AlertCircle className="w-16 h-16 text-violet-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Belum ada hasil tes</h1>
          <p className="text-gray-600 mb-6">Maaf, kami tidak dapat menemukan hasil tes. Silakan mulai tes baru.</p>
          <button
            onClick={() => router.push('/protected')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 gap-2"
          >
            <RefreshCw className="w-4 h-4" />
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
  });

  const formattedTime = new Date(testData.created_at).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const currentCategory = scoreCategories[testData.stress_level];

  return (
    <div className="flex-1 w-full pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Hasil Tes Stres</h1>
          <div className="flex items-center justify-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className='text-sm'>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className='text-sm'>{formattedTime}</span>
            </div>
          </div>
          <div className="h-1 w-32 bg-violet-600 mx-auto mt-2"></div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Score Card */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="relative mb-6">
                <div className={`w-40 h-40 mx-auto rounded-full ${getScoreColor(testData.stress_level)} bg-opacity-10 flex items-center justify-center`}>
                  <div className={`w-32 h-32 rounded-full ${getScoreColor(testData.stress_level)} bg-opacity-20 flex items-center justify-center`}>
                    <div className={`w-20 h-20 rounded-full ${getScoreColor(testData.stress_level)} flex items-center justify-center`}>
                      <span className="text-4xl font-bold text-white">
                        {testData.total_score}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                  <Award className={`w-10 h-10 ${currentCategory.color.text}`} />
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-3">Tingkat Stres</h2>
              <span className={`text-lg font-bold px-6 py-2 rounded-full bg-gradient-to-r ${currentCategory.color.gradient} ${currentCategory.color.text}`}>
                {testData.stress_level}
              </span>
            </div>
          </div>

          {/* Information Cards */}
          <div className="lg:col-span-8 space-y-6">
            {/* Score Analysis */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-6 h-6 text-violet-600" />
                <h3 className="text-xl font-semibold">Analisis Skor</h3>
              </div>
              
              <div className="space-y-6">
                {/* Score Bar */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span className="font-medium">Skor Anda</span>
                    <span className="font-bold">{testData.total_score}/40</span>
                  </div>
                  <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getScoreColor(testData.stress_level)} transition-all duration-1000`}
                      style={{ width: `${(testData.total_score / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Description */}
                <div className={`p-4 rounded-lg border ${currentCategory.color.border} bg-gradient-to-br ${currentCategory.color.gradient}`}>
                  <p className={`text-base ${currentCategory.color.text}`}>
                    {currentCategory.description}
                  </p>
                </div>

                {/* Scale Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.values(scoreCategories).map((category) => (
                    <div 
                      key={category.label}
                      className={`p-4 rounded-lg bg-gradient-to-br ${category.color.gradient} transform hover:scale-105 transition-transform duration-300`}
                    >
                      <div className={`font-semibold text-base ${category.color.text} mb-1`}>
                        {category.label}
                      </div>
                      <div className={`${category.color.text} text-sm font-medium`}>
                        {category.range}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          <button
            onClick={() => router.push('/protected')}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
          >
            <FaRedo className="w-5 h-5" />
            Mulai Tes Baru
          </button>
          <button
            onClick={() => router.push('/protected/history')}
            className="px-6 py-3 border border-violet-200 text-violet-600 hover:bg-violet-50 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
          >
            <FaChartLine className="w-5 h-5" />
            Lihat Riwayat
          </button>
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="px-6 py-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
          >
            <Trash2 className="w-5 h-5" />
            Hapus Hasil Tes
          </button>
        </div>
        
        {/* Error Message Display */}
        {errorMessage && (
          <div className="w-full max-w-lg mx-auto mb-8">
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Konfirmasi Hapus</h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus hasil tes ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={deleteLoading}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteTest}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
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

      {/* Toast Notification */}
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
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
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
    </div>
  );
}