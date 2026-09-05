import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { QuizResult } from '../types';
import { Trophy, Medal, Award, Lock, ArrowLeft, Sparkles, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';
import { RESULTS_COLLECTION, CURRENT_QUIZ_ID } from '../QuizContext';

export const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'krishna' | 'legacy'>('krishna');

  useEffect(() => {
    if (isAdmin) {
      const q = query(
        collection(db, RESULTS_COLLECTION),
        orderBy('score', 'desc'),
        limit(200)
      );

      const path = RESULTS_COLLECTION;
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data() as QuizResult);
        // Filter by selected quiz
        const filtered = data.filter(item => {
          if (activeTab === 'krishna') {
            return item.quizId === CURRENT_QUIZ_ID;
          } else {
            return item.quizId !== CURRENT_QUIZ_ID;
          }
        });

        // Sort in-memory: highest score first, ties broken by least time taken
        filtered.sort((a, b) => (b.score - a.score) || (a.timeTaken - b.timeTaken));
        setResults(filtered.slice(0, 30));
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      });

      return () => unsubscribe();
    }
  }, [isAdmin, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '108') {
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
      <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-geeta-gold">
            {activeTab === 'krishna' ? 'Shri Krishan Janamotsav Leaderboard' : 'Gita Quiz Leaderboard'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">Top 30 participants ranked by score and completion speed</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-white/10 rounded-lg flex items-center gap-2 hover:bg-white/20 transition-all text-sm font-medium"
        >
          <ArrowLeft size={18} /> Home
        </button>
      </div>

      {/* Quiz Selector Toggle */}
      <div className="w-full max-w-4xl mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('krishna')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
            activeTab === 'krishna'
              ? 'bg-geeta-gold text-black border-geeta-gold shadow-md shadow-geeta-gold/20'
              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Sparkles size={16} /> Shri Krishan Janamotsav (Active)
        </button>
        <button
          onClick={() => setActiveTab('legacy')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
            activeTab === 'legacy'
              ? 'bg-geeta-gold text-black border-geeta-gold shadow-md shadow-geeta-gold/20'
              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
          }`}
        >
          <History size={16} /> Previous Gita Quiz
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
                  transition={{ delay: index * 0.03 }}
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
                      {result.course === 'General' || result.branch === 'General Audience' ? (
                        <span className="inline-block mt-0.5 text-[11px] font-medium text-geeta-gold bg-geeta-gold/10 px-2 py-0.5 rounded border border-geeta-gold/30">
                          General Audience
                        </span>
                      ) : (
                        <p className="text-xs text-gray-400">{result.course} - {result.branch}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">
                    {result.rollNumber.startsWith('GEN-') ? (
                      <span className="text-xs text-gray-400 italic">Guest</span>
                    ) : (
                      result.rollNumber
                    )}
                  </td>
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
                    No results recorded yet in this quiz collection.
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
