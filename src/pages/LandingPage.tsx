import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { BookOpen, Trophy, Users } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl sm:text-7xl font-bold mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          Divine Wisdom Awaits
        </h1>
        <p className="text-xl text-geeta-gold italic">
          "Set thy heart upon thy work, but never on its reward."
        </p>
        <p className="mt-4 text-gray-400 font-medium tracking-widest uppercase text-sm">
          Co-powered by Culmyca event
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <GlassCard className="p-8 flex flex-col items-center text-center" delay={0.2}>
          <div className="w-16 h-16 bg-geeta-orange/20 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="text-geeta-orange w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">20 Questions</h3>
          <p className="text-sm text-gray-400">Deep dive into the teachings of the Bhagavad Gita.</p>
        </GlassCard>

        <GlassCard className="p-8 flex flex-col items-center text-center border-geeta-gold/30" delay={0.4}>
          <div className="w-16 h-16 bg-geeta-gold/20 rounded-full flex items-center justify-center mb-4">
            <Trophy className="text-geeta-gold w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Leaderboard</h3>
          <p className="text-sm text-gray-400">Compete with others and showcase your knowledge.</p>
        </GlassCard>

        <GlassCard className="p-8 flex flex-col items-center text-center" delay={0.6}>
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
            <Users className="text-blue-400 w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Community</h3>
          <p className="text-sm text-gray-400">Powered by EthicCraft Club & JC Bose University.</p>
        </GlassCard>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/register')}
          className="px-12 py-4 bg-gradient-to-r from-geeta-orange to-geeta-saffron rounded-full font-bold text-xl shadow-lg shadow-geeta-orange/20 hover:shadow-geeta-orange/40 transition-all"
        >
          Start Journey
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/leaderboard')}
          className="px-12 py-4 bg-white/10 border border-white/20 rounded-full font-bold text-xl hover:bg-white/20 transition-all"
        >
          Leaderboard
        </motion.button>
      </div>
      
      <div className="mt-8 relative w-full max-w-4xl h-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        <img 
          src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop" 
          alt="Divine Knowledge" 
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
        <div className="absolute bottom-6 left-8">
          <h4 className="text-2xl font-bold text-white">Divine Knowledge Block</h4>
          <p className="text-gray-300">Explore the eternal truth of the universe.</p>
        </div>
      </div>
    </div>
  );
};
