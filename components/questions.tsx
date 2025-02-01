'use client';
import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import questions from "@/utils/test/questions.json";
import { saveTestHistoryAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import { calculateScore } from "@/utils/test/calculateScore";

const options = ["Tidak Pernah", "Hampir Tidak Pernah", "Kadang-kadang", "Cukup Sering", "Sangat Sering"];

interface TestAnswers {
  [key: string]: number | null;
}

export default function Questions() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(10).fill(-1));
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };

    fetchUserId();
  }, []);

  const handleOptionSelect = (index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = index;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const getStressLevel = (score: number): string => {
    if (score >= 0 && score <= 13) return "Rendah";
    if (score >= 14 && score <= 26) return "Sedang";
    return "Tinggi";
  };

  const saveResults = async () => {
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    const totalScore = calculateScore(selectedAnswers);
    const stressLevel = getStressLevel(totalScore);
    
    const answers: TestAnswers = selectedAnswers.reduce((acc, answer, index) => {
      acc[`q${index + 1}`] = answer === -1 ? null : answer;
      return acc;
    }, {} as TestAnswers);

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("totalScore", totalScore.toString());
    formData.append("stressLevel", stressLevel);
    formData.append("answers", JSON.stringify(answers));

    try {
      const result = await saveTestHistoryAction(formData);
      
      if (result.error) {
        alert(result.error);
        return;
      }

      router.push('/protected/result');
    } catch (error) {
      console.error("Error detail:", error);
      alert("Terjadi kesalahan saat menyimpan hasil tes.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-2xl p-8">
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">
            Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
          </span>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {questions[currentQuestionIndex]}
        </h2>

        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`w-full py-4 px-6 text-left border-2 rounded-xl transition-all duration-200 
                ${selectedAnswers[currentQuestionIndex] === index 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${selectedAnswers[currentQuestionIndex] === index 
                    ? 'border-blue-500' 
                    : 'border-gray-300'}`}
                >
                  {selectedAnswers[currentQuestionIndex] === index && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <span className="text-lg">{option}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl disabled:opacity-50 hover:bg-gray-200 transition-colors"
          >
            <FaArrowLeft className="inline-block mr-2" /> Sebelumnya
          </button>

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswers[currentQuestionIndex] === -1}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl disabled:opacity-50 hover:bg-blue-700 transition-colors"
            >
              Selanjutnya <FaArrowRight className="inline-block ml-2" />
            </button>
          ) : (
            <button
              onClick={saveResults}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              Selesai <FaCheck className="inline-block ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}