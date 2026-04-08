import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { useQuiz } from '../QuizContext';
import { User, Hash, GraduationCap, Phone, Book } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { setParticipant, startQuiz } = useQuiz();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    branch: '',
    course: '',
    phoneNumber: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.name && formData.rollNumber && formData.branch && formData.course && formData.phoneNumber) {
      setLoading(true);
      try {
        // Check if roll number already exists
        const q = query(collection(db, 'results'), where('rollNumber', '==', formData.rollNumber.trim()));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setError('This roll number has already attempted the quiz.');
          setLoading(false);
          return;
        }

        setParticipant(formData);
        startQuiz();
        navigate('/quiz');
      } catch (err) {
        console.error("Registration error:", err);
        setError('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <GlassCard className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-geeta-gold">Participant Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <User size={16} /> Full Name
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-geeta-gold transition-colors"
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Hash size={16} /> Roll Number
            </label>
            <input
              required
              type="text"
              value={formData.rollNumber}
              onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-geeta-gold transition-colors"
              placeholder="Enter roll number"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Book size={16} /> Course
              </label>
              <input
                required
                type="text"
                value={formData.course}
                onChange={e => setFormData({ ...formData, course: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-geeta-gold transition-colors"
                placeholder="B.Tech, etc."
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <GraduationCap size={16} /> Branch
              </label>
              <input
                required
                type="text"
                value={formData.branch}
                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-geeta-gold transition-colors"
                placeholder="CSE, etc."
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Phone size={16} /> Phone Number
            </label>
            <input
              required
              type="tel"
              value={formData.phoneNumber}
              onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-geeta-gold transition-colors"
              placeholder="Enter phone number"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-4 bg-geeta-gold text-black font-bold rounded-lg shadow-lg shadow-geeta-gold/20 hover:bg-geeta-orange transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Checking...' : 'Start Quiz'}
          </motion.button>
        </form>
      </GlassCard>
    </div>
  );
};
