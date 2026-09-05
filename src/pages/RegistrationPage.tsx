import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { useQuiz, RESULTS_COLLECTION, CURRENT_QUIZ_ID } from '../QuizContext';
import { User, Hash, GraduationCap, Phone, Book, Users, CheckCircle2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Participant } from '../types';

export const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { setParticipant, startQuiz } = useQuiz();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGeneral, setIsGeneral] = useState(false);
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

    if (!formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }

    const trimmedPhone = formData.phoneNumber.trim();
    if (!trimmedPhone) {
      setError('Please enter your phone number.');
      return;
    }

    if (trimmedPhone.replace(/[\s-]/g, '').length < 8) {
      setError('Please enter a valid phone number with at least 8 digits.');
      return;
    }

    if (!isGeneral && (!formData.rollNumber.trim() || !formData.branch.trim() || !formData.course.trim())) {
      setError('Please fill out all student fields, or select General Audience.');
      return;
    }

    setLoading(true);
    try {
      if (isGeneral) {
        // Check phone duplicate in current quiz
        const q = query(
          collection(db, RESULTS_COLLECTION),
          where('quizId', '==', CURRENT_QUIZ_ID),
          where('phoneNumber', '==', trimmedPhone)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setError('This phone number has already attempted the quiz.');
          setLoading(false);
          return;
        }
      } else {
        // Check roll number duplicate in current quiz
        const q = query(
          collection(db, RESULTS_COLLECTION),
          where('quizId', '==', CURRENT_QUIZ_ID),
          where('rollNumber', '==', formData.rollNumber.trim())
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setError('This roll number has already attempted the quiz.');
          setLoading(false);
          return;
        }
      }

      const participantPayload: Participant = {
        name: formData.name.trim(),
        phoneNumber: trimmedPhone,
        rollNumber: isGeneral ? `GEN-${trimmedPhone}` : formData.rollNumber.trim(),
        course: isGeneral ? 'General' : formData.course.trim(),
        branch: isGeneral ? 'General Audience' : formData.branch.trim(),
        isGeneral,
        audienceType: isGeneral ? 'general' : 'student'
      };

      setParticipant(participantPayload);
      startQuiz();
      navigate('/quiz');
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err?.code === 'permission-denied') {
        setError('Permission denied by database. Please refresh the page and try again.');
      } else {
        setError('An error occurred while connecting. Please check your network and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <GlassCard className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold mb-2 text-center text-geeta-gold">Participant Details</h2>
        <p className="text-xs text-center text-gray-400 mb-6">Enter your information to begin the Shri Krishan Janamotsav Quiz</p>
        
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

          {/* General Audience Toggle Button below Name */}
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Users size={14} className="text-geeta-gold" /> Audience Category
              </label>
              {isGeneral && (
                <span className="text-[11px] font-medium text-geeta-gold flex items-center gap-1 bg-geeta-gold/10 px-2 py-0.5 rounded-full border border-geeta-gold/30">
                  <CheckCircle2 size={12} /> General Audience
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="audience-student-btn"
                onClick={() => setIsGeneral(false)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  !isGeneral
                    ? 'bg-geeta-gold/20 border-geeta-gold text-geeta-gold shadow-sm font-semibold'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <GraduationCap size={15} /> Student (YMCA)
              </button>
              
              <button
                type="button"
                id="audience-general-btn"
                onClick={() => setIsGeneral(true)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  isGeneral
                    ? 'bg-gradient-to-r from-geeta-orange/30 to-geeta-gold/30 border-geeta-orange text-geeta-gold shadow-sm font-semibold ring-1 ring-geeta-orange/40'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Users size={15} /> General Audience
              </button>
            </div>

            {isGeneral ? (
              <p className="text-[11px] text-geeta-gold/90 italic pt-1">
                ✓ College fields disabled. Only Name & Phone Number are required.
              </p>
            ) : (
              <p className="text-[11px] text-gray-400 italic pt-1">
                Please provide your roll number, course, and branch details.
              </p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className={`text-sm font-medium flex items-center gap-2 ${isGeneral ? 'text-gray-500' : 'text-gray-300'}`}>
                <Hash size={16} /> Roll Number
              </label>
              {isGeneral && (
                <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                  Not required for General Audience
                </span>
              )}
            </div>
            <input
              required={!isGeneral}
              disabled={isGeneral}
              type="text"
              value={isGeneral ? 'General Audience (Not Applicable)' : formData.rollNumber}
              onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
              className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none transition-colors ${
                isGeneral
                  ? 'bg-white/5 border-white/5 text-gray-500 cursor-not-allowed select-none'
                  : 'bg-white/5 border-white/10 text-white focus:border-geeta-gold'
              }`}
              placeholder="Enter roll number"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className={`text-sm font-medium flex items-center gap-2 ${isGeneral ? 'text-gray-500' : 'text-gray-300'}`}>
                  <Book size={16} /> Course
                </label>
              </div>
              <input
                required={!isGeneral}
                disabled={isGeneral}
                type="text"
                value={isGeneral ? 'General' : formData.course}
                onChange={e => setFormData({ ...formData, course: e.target.value })}
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none transition-colors ${
                  isGeneral
                    ? 'bg-white/5 border-white/5 text-gray-500 cursor-not-allowed select-none'
                    : 'bg-white/5 border-white/10 text-white focus:border-geeta-gold'
                }`}
                placeholder="B.Tech, etc."
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className={`text-sm font-medium flex items-center gap-2 ${isGeneral ? 'text-gray-500' : 'text-gray-300'}`}>
                  <GraduationCap size={16} /> Branch
                </label>
              </div>
              <input
                required={!isGeneral}
                disabled={isGeneral}
                type="text"
                value={isGeneral ? 'General Audience' : formData.branch}
                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none transition-colors ${
                  isGeneral
                    ? 'bg-white/5 border-white/5 text-gray-500 cursor-not-allowed select-none'
                    : 'bg-white/5 border-white/10 text-white focus:border-geeta-gold'
                }`}
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

          {error && <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 py-2 px-3 rounded-lg">{error}</p>}

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
