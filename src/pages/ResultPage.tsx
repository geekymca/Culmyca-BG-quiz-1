import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { useQuiz } from '../QuizContext';
import { Trophy, Clock, RotateCcw, LayoutDashboard, Instagram } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { score, questions, timeTaken, participant, resetQuiz } = useQuiz();
  const { width, height } = useWindowSize();
  const [countdown, setCountdown] = useState(3);

  const percentage = (score / questions.length) * 100;
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = 'https://www.instagram.com/ethiccraft_ymca/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const handleFollowInstagram = () => {
    window.open('https://www.instagram.com/ethiccraft_ymca/', '_blank');
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

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Score</p>
            <p className="text-3xl font-bold text-white">{score} / {questions.length}</p>
          </div>
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Time Taken</p>
            <p className="text-3xl font-bold text-white">{timeTaken}s</p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 mb-10"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Instagram className="text-pink-500" size={24} />
            <h3 className="text-xl font-bold">Follow EthicCraft YMCA</h3>
          </div>
          <p className="text-gray-400 mb-4">Stay updated for Results!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFollowInstagram}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-lg shadow-purple-500/20 mb-2"
          >
            Follow on Instagram
          </motion.button>
          <p className="text-xs text-gray-500 italic">Redirecting in {countdown}s...</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-geeta-gold text-black font-bold rounded-xl transition-all"
          >
            <RotateCcw size={20} /> Back to Home
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
