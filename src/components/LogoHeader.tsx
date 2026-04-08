import React from 'react';

export const LogoHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center w-full max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4">
        <img 
          src="https://i.ibb.co/B2ZRn5JH/images-2.jpg" 
          alt="EthicCraft Logo" 
          className="h-16 w-16 rounded-full object-cover border-2 border-geeta-gold shadow-lg"
          referrerPolicy="no-referrer"
        />
        <div className="hidden sm:block">
          <h2 className="text-xl font-bold text-geeta-gold">EthicCraft Club</h2>
          <p className="text-xs text-gray-300">Values for Life</p>
        </div>
      </div>
      
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-geeta-gold via-geeta-orange to-geeta-saffron bg-clip-text text-transparent">
          Bhagavad Geeta Quiz
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <h2 className="text-xl font-bold text-white">JC Bose University</h2>
          <p className="text-xs text-gray-300">YMCA, Faridabad</p>
        </div>
        <img 
          src="https://i.ibb.co/Ld4FmBcn/images-1.png" 
          alt="YMCA Logo" 
          className="h-16 w-16 object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};
