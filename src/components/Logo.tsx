interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  variant?: 'cute' | 'growth' | 'playful' | 'garden';
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className = '', 
  showText = true,
  variant = 'garden'
}) => {
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
          {variant === 'garden' && (
            <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] drop-shadow-sm">
              {/* Soft Background Sun/Glow */}
              <circle cx="80" cy="20" r="15" fill="#fff9c4" className="animate-pulse" />
              
              {/* Tree */}
              <rect x="65" y="50" width="8" height="30" rx="2" fill="#a1887f" />
              <circle cx="60" cy="45" r="15" fill="#81c784" />
              <circle cx="78" cy="45" r="15" fill="#a5d6a7" />
              <circle cx="69" cy="32" r="15" fill="#66bb6a" />
              
              {/* Child */}
              <circle cx="35" cy="55" r="8" fill="#ffccbc" /> {/* Head */}
              <path d="M35 63 L35 75 M35 68 L25 60 M35 68 L45 60" stroke="#5c6bc0" strokeWidth="4" strokeLinecap="round" /> {/* Body & Arms */}
              <path d="M35 75 L30 85 M35 75 L40 85" stroke="#3f51b5" strokeWidth="4" strokeLinecap="round" /> {/* Legs */}
              
              {/* Grass/Earth */}
              <path d="M10 85 Q50 75 90 85" fill="none" stroke="#9bc1bc" strokeWidth="4" strokeLinecap="round" />
            </svg>
          )}

          {variant === 'cute' && (
            <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] drop-shadow-sm">
              <circle cx="50" cy="50" r="40" fill="url(#cuteGradient)" />
              <path d="M30 45 Q50 65 70 45" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" className="animate-bounce" style={{ animationDuration: '3s' }} />
              <circle cx="35" cy="40" r="4" fill="white" />
              <circle cx="65" cy="40" r="4" fill="white" />
              <defs>
                <linearGradient id="cuteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#e82c84', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#ff85b3', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
            </svg>
          )}

          {variant === 'growth' && (
            <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] drop-shadow-sm">
              <path d="M20 80 Q50 80 80 80" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" />
              <path d="M50 80 L50 40" stroke="#00b050" strokeWidth="6" strokeLinecap="round" />
              <path d="M50 50 Q70 30 50 20 Q30 30 50 50" fill="#00b050" />
              <path d="M50 60 Q80 40 50 40 Q20 40 50 60" fill="#10b981" />
              <circle cx="50" cy="15" r="8" fill="#fbbf24" className="animate-pulse" />
            </svg>
          )}

          {variant === 'playful' && (
            <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] drop-shadow-sm">
              <rect x="20" y="20" width="25" height="25" rx="4" fill="#ef4444" />
              <rect x="55" y="20" width="25" height="25" rx="12" fill="#3b82f6" />
              <rect x="20" y="55" width="25" height="25" rx="12" fill="#f59e0b" />
              <rect x="55" y="55" width="25" height="25" rx="4" fill="#10b981" />
              <circle cx="50" cy="50" r="10" fill="white" className="animate-spin-slow" />
            </svg>
          )}
          
          {/* Shine Effect */}
          <div className="absolute -inset-full h-[300%] w-[300%] bg-white/20 -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
        </div>
      </div>

      {/* Styled Text */}
      {showText && (
        <div className="flex flex-col -space-y-1">
          <span className={`font-black tracking-tight ${textSize}`}>
            <span className="text-slate-700 font-arabic">روضتي</span>
          </span>
          <span className="text-slate-500 font-fredoka text-sm font-bold tracking-widest uppercase opacity-80">
            Rawdati
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
