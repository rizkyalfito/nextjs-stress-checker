const scoringReversed = [4, 5, 7, 8]; // Indeks pertanyaan yang perlu dibalik

export const reverseScore = (score: number): number => {
  return 4 - score;
};

export const calculateScore = (selectedAnswers: number[]): number => {
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
