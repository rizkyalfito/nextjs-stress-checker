import { format, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react';

interface TestHistoryCardProps {
  id: string;
  date: string;
  totalScore: number;
  stressLevel: string;
  answers: Record<string, number>;
}

const getStressLevelInfo = (level: string) => {
  switch (level.toLowerCase()) {
    case 'rendah':
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: CheckCircle,
        description: 'Tingkat stres rendah - tetap jaga kesehatan mental Anda'
      };
    case 'sedang':
      return {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: AlertTriangle,
        description: 'Tingkat stres sedang - pertimbangkan untuk berkonsultasi'
      };
    case 'tinggi':
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: AlertTriangle,
        description: 'Tingkat stres tinggi - sangat disarankan untuk berkonsultasi'
      };
    default:
      return {
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        icon: Activity,
        description: 'Status stres tidak teridentifikasi'
      };
  }
};

export default function HistoryCard({ id, date, totalScore, stressLevel, answers }: TestHistoryCardProps) {
  const formattedDate = (() => {
    try {
      const dateObj = parseISO(date);
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date format');
      }
      return format(dateObj, "d MMMM yyyy, HH:mm", { locale: idLocale });
    } catch (error) {
      try {
        const timestamp = date.split('.')[0];
        const dateObj = parseISO(timestamp);
        if (isNaN(dateObj.getTime())) {
          console.error('Invalid date:', date);
          return '-';
        }
        return format(dateObj, "d MMMM yyyy, HH:mm", { locale: idLocale });
      } catch (innerError) {
        console.error('Error formatting date:', innerError);
        return '-';
      }
    }
  })();

  const levelInfo = getStressLevelInfo(stressLevel);
  const StressIcon = levelInfo.icon;

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border ${levelInfo.borderColor} transition-all duration-200 hover:shadow-lg`}>
      <div className={`${levelInfo.bgColor} px-6 py-3 border-b ${levelInfo.borderColor}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StressIcon className={`${levelInfo.color} w-5 h-5`} />
            <h3 className={`text-lg font-semibold ${levelInfo.color}`}>Tingkat Stres {stressLevel}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
        </div>
        <p className={`text-sm mt-1 ${levelInfo.color}`}>{levelInfo.description}</p>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6 bg-blue-50 p-4 rounded-lg">
          <div>
            <h4 className="text-blue-800 font-semibold">Total Skor Penilaian</h4>
            <p className="text-sm text-blue-600">Berdasarkan jawaban dari semua pertanyaan</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-blue-600">{totalScore}</span>
            <p className="text-sm text-blue-500">dari 40</p>
          </div>
        </div>
        
        <div>
          <h4 className="text-gray-700 font-medium mb-3 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Detail Jawaban Per Pertanyaan
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Object.entries(answers).map(([question, answer]) => {
              const answerKey = `${id}-q${question.replace('q', '')}-${answer}`;
              const questionNumber = question.replace('q', '');
              return (
                <div 
                  key={answerKey}
                  className="relative bg-gray-50 rounded-lg p-3 border border-gray-100 hover:border-blue-200 transition-colors duration-200"
                >
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">{questionNumber}</span>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700 mb-1">{answer}</div>
                    <div className="text-xs text-gray-500">Poin</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}