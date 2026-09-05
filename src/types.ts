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
  course: string;
  phoneNumber: string;
  isGeneral?: boolean;
  audienceType?: 'student' | 'general';
}

export interface QuizResult extends Participant {
  score: number;
  totalQuestions: number;
  timeTaken: number; // in seconds
  timestamp: any;
  quizId?: string;
}
