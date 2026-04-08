import React, { createContext, useContext, useState, useEffect } from 'react';
import { Participant, QuizQuestion, QuizResult } from './types';
import { getRandomQuestions } from './data/questions';
import { db } from './lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './lib/errorHandlers';

interface QuizContextType {
  participant: Participant | null;
  setParticipant: (p: Participant) => void;
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  score: number;
  answers: { questionId: string; selected: string; isCorrect: boolean }[];
  timeTaken: number;
  isFinished: boolean;
  startQuiz: () => void;
  submitAnswer: (answer: string, timeForThisQuestion: number) => void;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; selected: string; isCorrect: boolean }[]>([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const startQuiz = () => {
    setQuestions(getRandomQuestions(20));
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setTimeTaken(0);
    setIsFinished(false);
  };

  const submitAnswer = (answer: string, timeForThisQuestion: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correct;
    
    if (isCorrect) setScore(prev => prev + 1);
    
    setAnswers(prev => [...prev, { 
      questionId: currentQuestion.id, 
      selected: answer, 
      isCorrect 
    }]);
    
    setTimeTaken(prev => prev + timeForThisQuestion);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setIsFinished(true);
    if (participant) {
      const path = 'results';
      try {
        await addDoc(collection(db, path), {
          name: participant.name,
          rollNumber: participant.rollNumber,
          branch: participant.branch,
          course: participant.course,
          phoneNumber: participant.phoneNumber,
          score,
          totalQuestions: questions.length,
          timeTaken,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    }
  };

  const resetQuiz = () => {
    setParticipant(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setTimeTaken(0);
    setIsFinished(false);
  };

  return (
    <QuizContext.Provider value={{
      participant, setParticipant, questions, currentQuestionIndex,
      score, answers, timeTaken, isFinished,
      startQuiz, submitAnswer, resetQuiz
    }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuiz must be used within a QuizProvider');
  return context;
};
