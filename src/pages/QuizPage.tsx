import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { useQuiz } from '../QuizContext';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

export const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    questions, currentQuestionIndex, submitAnswer, 
    participant, isFinished 
  } = useQuiz();
  
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!participant) {
      navigate('/register');
      return;
    }
  }, [participant, navigate]);

  useEffect(() => {
    if (isFinished) {
      navigate('/result');
    }
  }, [isFinished, navigate]);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [currentQuestionIndex]);

  const startTimer = () => {
    setTimeLeft(15);
    setIsAnswered(false);
    setSelectedOption(null);
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleTimeUp = () => {
    stopTimer();
    setIsAnswered(true);
    setTimeout(() => {
      submitAnswer('', 15);
    }, 1000);
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    
    stopTimer();
    setSelectedOption(option);
    setIsAnswered(true);
    
    setTimeout(() => {
      submitAnswer(option, 15 - timeLeft);
    }, 1500);
  };

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
      <div className="w-full max-w-3xl mb-8 flex justify-between items-center">
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
          <span className="text-geeta-gold font-bold">Question</span>
          <span className="text-white">{currentQuestionIndex + 1} / {questions.length}</span>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${timeLeft <= 3 ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-white'}`}>
          <Clock size={20} className={timeLeft <= 3 ? 'animate-pulse' : ''} />
          <span className="font-mono text-xl font-bold">{timeLeft}s</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full max-w-3xl"
        >
          <GlassCard className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight">
              {currentQuestion.question}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((option, index) => {
                const isCorrect = option === currentQuestion.correct;
                const isSelected = option === selectedOption;
                
                let buttonClass = "bg-white/5 border-white/10 hover:bg-white/10";
                if (isAnswered) {
                  if (isCorrect) buttonClass = "bg-green-500/20 border-green-500/50 text-green-400";
                  else if (isSelected) buttonClass = "bg-red-500/20 border-red-500/50 text-red-400";
                  else buttonClass = "bg-white/5 border-white/10 opacity-50";
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={!isAnswered ? { scale: 1.02 } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    onClick={() => handleOptionSelect(option)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${buttonClass}`}
                  >
                    <span className="text-lg">{option}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="text-green-400" />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="text-red-400" />}
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 w-full max-w-3xl bg-white/5 h-2 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-geeta-gold"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>
    </div>
  );
};
