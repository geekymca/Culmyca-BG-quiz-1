import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GlassCard } from '../components/GlassCard';
import { useQuiz } from '../QuizContext';
import { User, Hash, GraduationCap, Phone } from 'lucide-react';

export const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { setParticipant, startQuiz } = useQuiz();
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    branch: '',
    phoneNumber: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.rollNumber && formData.branch && formData.phoneNumber) {
      setParticipant(formData);
      startQuiz();
      navigate('/quiz');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <GlassCard className="w-full max-w-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-geeta-gold">Participant Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <User size={16} /> Full Name
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-geeta-gold transition-colors"
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Hash size={16} /> Roll Number
            </label>
            <input
              required
              type="text"
              value={formData.rollNumber}
              onChange={e => setFormData({ ...formData, rollNumber: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-geeta-gold transition-colors"
              placeholder="Enter roll number"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <GraduationCap size={16} /> Branch Name
            </label>
            <input
              required
              type="text"
              value={formData.branch}
              onChange={e => setFormData({ ...formData, branch: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-geeta-gold transition-colors"
              placeholder="Enter branch"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Phone size={16} /> Phone Number
            </label>
            <input
              required
              type="tel"
              value={formData.phoneNumber}
              onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-geeta-gold transition-colors"
              placeholder="Enter phone number"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-geeta-gold text-black font-bold rounded-lg shadow-lg shadow-geeta-gold/20 hover:bg-geeta-orange transition-colors"
          >
            Start Quiz
          </motion.button>
        </form>
      </GlassCard>
    </div>
  );
};
