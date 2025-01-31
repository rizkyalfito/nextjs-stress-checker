'use client';
import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaCheck, FaRedo } from "react-icons/fa";
import questions from "@/utils/test/questions.json";
import { calculateScore } from "@/utils/test/calculateScore";
import { saveTestHistoryAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/client"; // Pastikan diimpor dengan benar

const options = ["Tidak Pernah", "Hampir Tidak Pernah", "Kadang-kadang", "Cukup Sering", "Sangat Sering"];

interface TestAnswers {
  [key: string]: number | null;
}

interface TestHistory {
  userId: string;
  totalScore: number;
  stressLevel: string;
  answers: TestAnswers;
}

export default function Questions() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(10).fill(-1));
  const [showResults, setShowResults] = useState(false);
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

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(10).fill(-1));
    setShowResults(false);
  };

  const convertToFormData = (testHistory: TestHistory): FormData => {
    const formData = new FormData();
    formData.append("userId", testHistory.userId);
    formData.append("totalScore", String(testHistory.totalScore));
    formData.append("stressLevel", testHistory.stressLevel);
    formData.append("answers", JSON.stringify(testHistory.answers));
    return formData;
  };

  const saveResults = async () => {
    if (!userId) {
      alert("User not logged in!");
      return;
    }
  
    const score = calculateScore(selectedAnswers);
  
    const answers: TestAnswers = selectedAnswers.reduce((acc, answer, index) => {
      acc[`q${index + 1}`] = answer === -1 ? null : answer;
      return acc;
    }, {} as TestAnswers);
  
    const testHistory: TestHistory = {
      userId,
      totalScore: score,
      stressLevel: getStressLevel(score),
      answers: answers,
    };
  
    const formData = convertToFormData(testHistory);
  
    try {
      const result = await saveTestHistoryAction(formData);
      
      if (result.error) {
        alert(result.error);
        return;
      }
  
      setShowResults(true);
      alert("Hasil tes berhasil disimpan!");
    } catch (error) {
      console.error("Error detail:", error);
      alert("Terjadi kesalahan saat menyimpan hasil tes.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
      {!showResults ? (
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Pertanyaan {currentQuestionIndex + 1}</h1>
          <h2 className="text-lg text-gray-700 mb-4">{questions[currentQuestionIndex]}</h2>
          <div className="space-y-2">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                className={`w-full py-2 px-4 text-left border rounded-md ${selectedAnswers[currentQuestionIndex] === index ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:opacity-50"
            >
              <FaArrowLeft className="inline-block mr-2" /> Sebelumnya
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswers[currentQuestionIndex] === -1}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
              >
                Selanjutnya <FaArrowRight className="inline-block ml-2" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowResults(true);
                  saveResults();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Kirim <FaCheck className="inline-block ml-2" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Quiz Selesai!</h1>
          <p className="text-lg text-gray-600">Skor Anda: {calculateScore(selectedAnswers)} / 40</p>
          <p className="text-lg text-gray-600">{getStressLevel(calculateScore(selectedAnswers))}</p>
          <button
            onClick={restartQuiz}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
          >
            <FaRedo className="inline-block mr-2" /> Mulai Ulang Quiz
          </button>
        </div>
      )}
    </div>
  );
}
