import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { QuizResult } from '../types';
import { Trash2, Lock, ArrowLeft, Search, Sparkles, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';
import { RESULTS_COLLECTION, CURRENT_QUIZ_ID } from '../QuizContext';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<(QuizResult & { id: string })[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState<'krishna' | 'legacy'>('krishna');

  useEffect(() => {
    if (isAdmin) {
      const q = query(
        collection(db, RESULTS_COLLECTION),
        orderBy('timestamp', 'desc')
      );

      const path = RESULTS_COLLECTION;
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const allData = snapshot.docs.map(doc => ({ 
          ...(doc.data() as QuizResult), 
          id: doc.id 
        }));
        // Filter by selected quiz
        const filtered = allData.filter(item => {
          if (selectedQuiz === 'krishna') {
            return item.quizId === CURRENT_QUIZ_ID;
          } else {
            return item.quizId !== CURRENT_QUIZ_ID;
          }
        });
        setResults(filtered);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      });

      return () => unsubscribe();
    }
  }, [isAdmin, selectedQuiz]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '108') {
      setIsAdmin(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteDoc(doc(db, RESULTS_COLLECTION, deletingId));
      setDeletingId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${RESULTS_COLLECTION}/${deletingId}`);
      setDeletingId(null);
    }
  };

  const filteredResults = results.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.phoneNumber && r.phoneNumber.includes(searchTerm))
  );

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <GlassCard className="w-full max-w-md p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <Lock className="text-red-400 w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Admin Management</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
              placeholder="Enter admin password"
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors"
            >
              Access Portal
            </button>
          </form>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4 py-8">
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-red-400">Admin Portal</h2>
          <div className="bg-red-500/20 text-red-400 px-4 py-1 rounded-full font-bold border border-red-500/30 text-sm">
            Total: {results.length}
          </div>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search name, roll no, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-red-500 text-sm"
          />
        </div>

        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-white/10 rounded-lg flex items-center gap-2 hover:bg-white/20 transition-all text-sm font-medium"
        >
          <ArrowLeft size={18} /> Home
        </button>
      </div>

      {/* Quiz Collection Selector */}
      <div className="w-full max-w-6xl mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedQuiz('krishna')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
              selectedQuiz === 'krishna'
                ? 'bg-geeta-gold text-black border-geeta-gold shadow-md'
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Sparkles size={16} /> Shri Krishan Janamotsav (Active)
          </button>
          <button
            onClick={() => setSelectedQuiz('legacy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
              selectedQuiz === 'legacy'
                ? 'bg-geeta-gold text-black border-geeta-gold shadow-md'
                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <History size={16} /> Previous Gita Quiz
          </button>
        </div>
        
        <p className="text-xs text-gray-400">
          Showing: <span className="text-geeta-gold font-medium">{selectedQuiz === 'krishna' ? 'Shri Krishan Janamotsav Results' : 'Previous Gita Quiz Results'}</span>
        </p>
      </div>

      <GlassCard className="w-full max-w-6xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="p-4 font-bold text-gray-300">Participant</th>
                <th className="p-4 font-bold text-gray-300">Roll No</th>
                <th className="p-4 font-bold text-gray-300">Course / Branch</th>
                <th className="p-4 font-bold text-gray-300">Score</th>
                <th className="p-4 font-bold text-gray-300">Time</th>
                <th className="p-4 font-bold text-gray-300 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result) => (
                <tr
                  key={result.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-bold text-white">{result.name}</p>
                      <p className="text-xs text-gray-400">{result.phoneNumber}</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">
                    {result.rollNumber.startsWith('GEN-') ? (
                      <span className="text-xs text-geeta-gold bg-geeta-gold/10 px-2 py-0.5 rounded border border-geeta-gold/20">
                        General
                      </span>
                    ) : (
                      result.rollNumber
                    )}
                  </td>
                  <td className="p-4">
                    {result.course === 'General' || result.branch === 'General Audience' ? (
                      <span className="text-xs font-semibold text-geeta-gold bg-geeta-gold/15 px-2 py-1 rounded-full border border-geeta-gold/30">
                        General Audience
                      </span>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-white">{result.course}</p>
                        <p className="text-xs text-gray-400">{result.branch}</p>
                      </>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="bg-geeta-gold/20 text-geeta-gold px-3 py-1 rounded-full font-bold">
                      {result.score} / {result.totalQuestions}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 font-mono">{result.timeTaken}s</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(result.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                      title="Delete Participant"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredResults.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 italic">
                    No participants found in this quiz dataset.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm"
            >
              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="text-red-400 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Delete Participant?</h3>
                <p className="text-gray-400 mb-8">This action cannot be undone. Are you sure you want to remove this participant's result from {selectedQuiz}?</p>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setDeletingId(null)}
                    className="flex-1 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
