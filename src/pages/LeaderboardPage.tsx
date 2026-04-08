import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { QuizResult } from '../types';
import { Trophy, Medal, Award, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

export const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      const q = query(
        collection(db, 'results'),
        orderBy('score', 'desc'),
        orderBy('timeTaken', 'asc'),
        limit(50)
      );

      const path = 'results';
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data() as QuizResult);
        setResults(data);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      });

      return () => unsubscribe();
    }
  }, [isAdmin]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password protection as requested
    if (password === 'Geeta2024') {
      setIsAdmin(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <GlassCard className="w-full max-w-md p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-geeta-gold/20 rounded-full flex items-center justify-center">
              <Lock className="text-geeta-gold w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Admin Access Only</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-geeta-gold"
              placeholder="Enter admin password"
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-geeta-gold text-black font-bold rounded-lg hover:bg-geeta-orange transition-colors"
            >
              Unlock Leaderboard
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full py-3 text-gray-400 flex items-center justify-center gap-2 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} /> Back to Home
            </button>
          </form>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4 py-8">
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-geeta-gold">Leaderboard</h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-white/10 rounded-lg flex items-center gap-2 hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={18} /> Home
        </button>
      </div>

      <GlassCard className="w-full max-w-4xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="p-4 font-bold text-gray-300">Rank</th>
                <th className="p-4 font-bold text-gray-300">Participant</th>
                <th className="p-4 font-bold text-gray-300">Roll No</th>
                <th className="p-4 font-bold text-gray-300">Score</th>
                <th className="p-4 font-bold text-gray-300">Time</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={index}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {index === 0 && <Trophy size={18} className="text-geeta-gold" />}
                      {index === 1 && <Medal size={18} className="text-gray-300" />}
                      {index === 2 && <Award size={18} className="text-geeta-orange" />}
                      <span className={`font-bold ${index < 3 ? 'text-geeta-gold' : 'text-gray-400'}`}>
                        #{index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-bold">{result.name}</p>
                      <p className="text-xs text-gray-400">{result.branch}</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{result.rollNumber}</td>
                  <td className="p-4">
                    <span className="bg-geeta-gold/20 text-geeta-gold px-3 py-1 rounded-full font-bold">
                      {result.score} / {result.totalQuestions}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 font-mono">{result.timeTaken}s</td>
                </motion.tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 italic">
                    No results recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
