import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', showText = true }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const textSizeMap = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  const iconSize = sizeMap[size];
  const textSize = textSizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Eye-catching SVG Icon */}
      <div className={`relative ${iconSize} group`}>
        {/* Glowing Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-pink-400 to-emerald-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity animate-pulse" />
        
        {/* Main Logo Container */}
        <div className="relative h-full w-full bg-white rounded-2xl shadow-lg border-2 border-primary/20 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
          <svg 
            viewBox="0 0 100 100" 
            className="w-[80%] h-[80%] drop-shadow-sm"
            style={{ 
              filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))' 
            }}
          >
            {/* Friendly Baby Face / Growth Symbol */}
            <circle cx="50" cy="50" r="40" fill="url(#logoGradient)" />
            <path 
              d="M30 45 Q50 65 70 45" 
              fill="none" 
              stroke="white" 
              strokeWidth="6" 
              strokeLinecap="round" 
              className="animate-bounce"
              style={{ animationDuration: '3s' }}
            />
            <circle cx="35" cy="40" r="4" fill="white" />
            <circle cx="65" cy="40" r="4" fill="white" />
            
            {/* Playful Sprouts */}
            <path 
              d="M50 10 L60 25 M50 10 L40 25" 
              stroke="#00b050" 
              strokeWidth="4" 
              strokeLinecap="round" 
            />
            
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#e82c84', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#ff85b3', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Shine Effect */}
          <div className="absolute -inset-full h-[300%] w-[300%] bg-white/20 -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
        </div>
      </div>

      {/* Styled Text */}
      {showText && (
        <div className="flex flex-col -space-y-1">
          <span className={`font-black tracking-tight ${textSize}`}>
            <span className="text-pink-600 font-arabic">روضتي</span>
          </span>
          <span className="text-emerald-600 font-fredoka text-sm font-bold tracking-widest uppercase opacity-80">
            Rawdati
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
