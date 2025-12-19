import React from 'react';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  variant?: 'white' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';
  customBg?: string; // Allow override
}

export const BentoCard: React.FC<BentoCardProps> = ({ 
  children, 
  className = '', 
  title, 
  icon,
  variant = 'white',
  customBg,
}) => {
  
  const bgColors = {
    white: 'bg-white',
    yellow: 'bg-pop-yellow',
    green: 'bg-pop-green',
    blue: 'bg-pop-blue',
    purple: 'bg-pop-purple',
    pink: 'bg-pop-pink'
  };

  const activeBg = customBg || bgColors[variant];

  return (
    <div className={`
      relative 
      ${activeBg} 
      border-2 border-black 
      rounded-2xl 
      shadow-hard 
      p-6 
      flex flex-col 
      ${className} 
      transition-all duration-500 ease-in-out
      hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
    `}>
      {/* Decorative dots in corners for industrial/toy feel */}
      <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-black/20"></div>
      <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-black/20"></div>

      {(title || icon) && (
        <div className="flex items-center gap-3 mb-5 border-b-2 border-black/10 pb-3 relative z-10 shrink-0">
          {icon && (
            <div className="bg-white border-2 border-black rounded-lg p-1.5 shadow-hard-sm">
              {icon}
            </div>
          )}
          {title && <h2 className="text-xl font-display font-black text-black uppercase tracking-tight transform rotate-1">{title}</h2>}
        </div>
      )}
      {/* min-h-0 is critical for nested scrolling flex children */}
      <div className="flex-1 relative z-10 min-h-0">
        {children}
      </div>
    </div>
  );
};