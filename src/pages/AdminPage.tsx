import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { QuizResult } from '../types';
import { Trash2, Lock, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<(QuizResult & { id: string })[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAdmin) {
      const q = query(
        collection(db, 'results'),
        orderBy('timestamp', 'desc')
      );

      const path = 'results';
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ 
          ...(doc.data() as QuizResult), 
          id: doc.id 
        }));
        setResults(data);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      });

      return () => unsubscribe();
    }
  }, [isAdmin]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '108') {
      setIsAdmin(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this participant?')) {
      try {
        await deleteDoc(doc(db, 'results', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `results/${id}`);
      }
    }
  };

  const filteredResults = results.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-4xl font-bold text-red-400">Admin Portal</h2>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-red-500"
          />
        </div>

        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-white/10 rounded-lg flex items-center gap-2 hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={18} /> Home
        </button>
      </div>

      <GlassCard className="w-full max-w-6xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="p-4 font-bold text-gray-300">Participant</th>
                <th className="p-4 font-bold text-gray-300">Roll No</th>
                <th className="p-4 font-bold text-gray-300">Course/Branch</th>
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
                      <p className="font-bold">{result.name}</p>
                      <p className="text-xs text-gray-400">{result.phoneNumber}</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{result.rollNumber}</td>
                  <td className="p-4">
                    <p className="text-sm font-medium">{result.course}</p>
                    <p className="text-xs text-gray-400">{result.branch}</p>
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
                    No participants found.
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
