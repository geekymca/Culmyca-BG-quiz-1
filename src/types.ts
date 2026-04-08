export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: string;
}

export interface Participant {
  name: string;
  rollNumber: string;
  branch: string;
  phoneNumber: string;
}

export interface QuizResult extends Participant {
  score: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  timestamp: any;
}
