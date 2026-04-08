import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="abstract-bg">
      <div 
        className="abstract-shape bg-geeta-orange w-[500px] h-[500px] -top-20 -left-20" 
        style={{ animationDelay: '0s' }}
      />
      <div 
        className="abstract-shape bg-geeta-gold w-[400px] h-[400px] top-1/2 -right-20" 
        style={{ animationDelay: '-5s' }}
      />
      <div 
        className="abstract-shape bg-blue-500 w-[300px] h-[300px] -bottom-20 left-1/3" 
        style={{ animationDelay: '-10s' }}
      />
    </div>
  );
};
