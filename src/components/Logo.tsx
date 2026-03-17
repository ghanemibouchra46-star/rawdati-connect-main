interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  variant?: 'cute' | 'growth' | 'playful' | 'garden' | 'graduated';
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className = '', 
  showText = true,
  variant = 'graduated'
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
      {/* Premium Logo Container */}
      <div className={`relative ${iconSize} group`}>
        {/* Dynamic Glowing Aura */}
        <div className="absolute -inset-1 bg-gradient-to-tr from-[#6C5CE7] via-[#FF6B6B] to-[#4ECDC4] rounded-2xl blur-md opacity-30 group-hover:opacity-60 transition-all duration-700 animate-pulse" />
        
        {/* Glassmorphic Base */}
        <div className="relative h-full w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-700 ease-out">
          {variant === 'graduated' && (
            <svg viewBox="0 0 100 100" className="w-[92%] h-[92%] drop-shadow-md">
              <defs>
                <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6C5CE7" />
                  <stop offset="100%" stopColor="#FF6B6B" />
                </linearGradient>
                <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4ECDC4" />
                  <stop offset="100%" stopColor="#6C5CE7" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Decorative Floating Elements */}
              <circle cx="15" cy="15" r="3" fill="#FFD93D" className="animate-bounce" style={{ animationDuration: '4s' }} />
              <path d="M85 20 L88 26 L94 26 L89 30 L91 36 L85 32 L79 36 L81 30 L76 26 L82 26 Z" fill="#4ECDC4" className="animate-pulse" />
              
              {/* Organic Shape Background */}
              <path d="M50 15 Q80 15 85 50 Q80 85 50 85 Q20 85 15 50 Q20 15 50 15" fill="none" stroke="url(#mainGradient)" strokeWidth="0.5" opacity="0.3" />

              {/* Central Premium Icon - Stylized Child/Growth */}
              <g className="transition-all duration-500 group-hover:translate-y-[-2px]">
                {/* Outer Glow Circle */}
                <circle cx="50" cy="45" r="30" fill="url(#mainGradient)" opacity="0.1" />
                
                {/* Main Head Shape */}
                <circle cx="50" cy="48" r="24" fill="white" stroke="url(#mainGradient)" strokeWidth="1.5" />
                
                {/* Styled Hair/Crown of Growth */}
                <path d="M35 32 Q50 15 65 32 Q50 25 35 32" fill="url(#mainGradient)" />
                <circle cx="50" cy="18" r="4" fill="#FFD93D" filter="url(#glow)" />

                {/* Expressive Cute Eyes */}
                <g>
                  <circle cx="42" cy="46" r="3.5" fill="#2D3436" />
                  <circle cx="43" cy="44.5" r="1.5" fill="white" />
                  
                  <circle cx="58" cy="46" r="3.5" fill="#2D3436" />
                  <circle cx="59" cy="44.5" r="1.5" fill="white" />
                </g>

                {/* Joyful Smile */}
                <path d="M44 56 Q50 64 56 56" fill="none" stroke="#FF6B6B" strokeWidth="2.5" strokeLinecap="round" />
                
                {/* Rosy Cheeks */}
                <circle cx="36" cy="54" r="3" fill="#FF6B6B" opacity="0.2" />
                <circle cx="64" cy="54" r="3" fill="#FF6B6B" opacity="0.2" />
              </g>

              {/* Elegant Arabic Text Integration */}
              <defs>
                <path id="curveLabel" d="M20 82 Q50 94 80 82" />
              </defs>
              <text className="font-arabic font-black" fill="#6C5CE7" style={{ fontSize: '13px', letterSpacing: '0.05em' }}>
                <textPath href="#curveLabel" startOffset="50%" textAnchor="middle">
                  روضتي
                </textPath>
              </text>
            </svg>
          )}

          {/* Fallback for other variants could be updated similarly if needed */}
          {variant !== 'graduated' && (
            <div className="text-primary font-black text-xl">R</div>
          )}

          {/* Interactive Light Reflection */}
          <div className="absolute -inset-full h-[300%] w-[300%] bg-gradient-to-tr from-transparent via-white/30 to-transparent -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
        </div>
      </div>

      {/* Modern Typography Branding */}
      {showText && (
        <div className="flex flex-col -space-y-1">
          <span className={`font-black tracking-tight ${textSize} bg-gradient-to-r from-[#6C5CE7] to-[#FF6B6B] bg-clip-text text-transparent drop-shadow-sm`}>
            روضتي
          </span>
          <span className="text-[#2D3436] font-fredoka text-xs font-bold tracking-[0.2em] uppercase opacity-60">
            Rawdati
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
