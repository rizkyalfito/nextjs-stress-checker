'use client'
import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCheck, FaRedo } from "react-icons/fa";

const questions = [
  "Dalam sebulan terakhir, seberapa sering Anda merasa kesal karena sesuatu yang terjadi secara tak terduga?",
  "Dalam sebulan terakhir, seberapa sering Anda merasa bahwa Anda tidak dapat mengendalikan hal-hal penting dalam hidup Anda?",
  "Dalam sebulan terakhir, seberapa sering Anda merasa gugup dan stres?",
  "Dalam sebulan terakhir, seberapa sering Anda merasa percaya diri dalam menangani masalah pribadi Anda?",
  "Dalam sebulan terakhir, seberapa sering Anda merasa bahwa segala sesuatunya berjalan sesuai harapan Anda?",
  "Dalam sebulan terakhir, seberapa sering Anda merasa tidak dapat mengatasi semua hal yang harus Anda lakukan?",
  "Dalam sebulan terakhir, seberapa sering Anda mampu mengendalikan gangguan dalam hidup Anda?",
  "Dalam sebulan terakhir, seberapa sering Anda merasa berada di atas segalanya?",
  "Dalam sebulan terakhir, seberapa sering Anda merasa marah karena hal-hal yang berada di luar kendali Anda?",
  "Dalam sebulan terakhir, seberapa sering Anda merasa bahwa kesulitan menumpuk begitu tinggi sehingga Anda tidak dapat mengatasinya?"
];

const scoringReversed = [4, 5, 7, 8]; // Indeks pertanyaan yang perlu dibalik
const options = ["Tidak Pernah", "Hampir Tidak Pernah", "Kadang-kadang", "Cukup Sering", "Sangat Sering"];

export default function Questions() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(10).fill(-1));
  const [showResults, setShowResults] = useState(false);

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

  const reverseScore = (score: number): number => {
    return 4 - score;
  };

  const calculateScore = (): number => {
    return selectedAnswers.reduce((total, answer, index) => {
      if (answer !== -1) {
        if (scoringReversed.includes(index + 1)) {
          // Menggunakan aturan pembalikan skor yang benar
          const reversedScore = [4, 3, 2, 1, 0][answer];
          return total + reversedScore;
        } else {
          return total + answer;
        }
      }
      return total;
    }, 0);
  }; 
  const getStressLevel = (score: number): string => {
    if (score >= 0 && score <= 13) return "Tingkat Stres Rendah";
    if (score >= 14 && score <= 26) return "Tingkat Stres Sedang";
    return "Tingkat Stres Tinggi";
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(Array(10).fill(-1));
    setShowResults(false);
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
                onClick={() => setShowResults(true)}
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
          <p className="text-lg text-gray-600">Skor Anda: {calculateScore()} / 40</p>
          <p className="text-lg text-gray-600">{getStressLevel(calculateScore())}</p>
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
};
