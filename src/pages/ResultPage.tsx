import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { useQuiz } from '../QuizContext';
import { Trophy, Clock, RotateCcw, LayoutDashboard } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { score, questions, timeTaken, participant, resetQuiz } = useQuiz();
  const { width, height } = useWindowSize();

  const percentage = (score / questions.length) * 100;
  
  const getMessage = () => {
    if (percentage === 100) return "Divine Excellence! You have mastered the Gita's wisdom.";
    if (percentage >= 80) return "Outstanding! Your understanding is profound.";
    if (percentage >= 60) return "Good effort! Continue your spiritual journey.";
    return "Keep learning! The wisdom of the Gita is eternal.";
  };

  const handleRestart = () => {
    resetQuiz();
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
      {percentage >= 70 && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} />}
      
      <GlassCard className="w-full max-w-2xl p-8 md:p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="w-24 h-24 bg-geeta-gold/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Trophy className="text-geeta-gold w-12 h-12" />
        </motion.div>

        <h2 className="text-4xl font-bold mb-2">Congratulations, {participant?.name}!</h2>
        <p className="text-xl text-geeta-gold italic mb-8">{getMessage()}</p>

        <div className="grid grid-cols-2 gap-6 mb-12">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Score</p>
            <p className="text-3xl font-bold text-white">{score} / {questions.length}</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Time Taken</p>
            <p className="text-3xl font-bold text-white">{timeTaken}s</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-geeta-gold text-black font-bold rounded-xl transition-all"
          >
            <RotateCcw size={20} /> Try Again
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/leaderboard')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
          >
            <LayoutDashboard size={20} /> View Leaderboard
          </motion.button>
        </div>
      </GlassCard>
    </div>
  );
};
