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
      {/* Eye-catching SVG Icon */}
      <div className={`relative ${iconSize} group`}>
        {/* Glowing Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-pink-400 to-emerald-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity animate-pulse" />
        
        {/* Main Logo Container */}
        <div className="relative h-full w-full bg-white rounded-2xl shadow-lg border-2 border-primary/20 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
          {variant === 'graduated' && (
            <svg viewBox="0 0 100 100" className="w-[98%] h-[98%]">
              {/* Background Decorations (Stars & Dots) */}
              <g className="animate-pulse" style={{ animationDuration: '3s' }}>
                <path d="M12 15 L14 20 L20 20 L15 24 L17 30 L12 26 L7 30 L9 24 L4 20 L10 20 Z" fill="#FFEB3B" /> {/* Yellow Star Top Left */}
                <path d="M88 15 L90 20 L96 20 L91 24 L93 30 L88 26 L83 30 L85 24 L80 20 L86 20 Z" fill="#81D4FA" /> {/* Blue Star Top Right */}
                <path d="M10 65 L12 69 L17 69 L13 72 L14 77 L10 74 L6 77 L7 72 L3 69 L8 69 Z" fill="#F48FB1" /> {/* Pink Star Bottom Left */}
                <path d="M90 65 L92 69 L97 69 L93 72 L94 77 L90 74 L86 77 L87 72 L83 69 L88 69 Z" fill="#A5D6A7" /> {/* Green Star Bottom Right */}
              </g>
              
              <circle cx="20" cy="45" r="2.5" fill="#f06292" opacity="0.6" />
              <circle cx="80" cy="40" r="3" fill="#ffd54f" opacity="0.6" />
              <circle cx="15" cy="75" r="2" fill="#64b5f6" opacity="0.6" />
              <circle cx="85" cy="75" r="2.5" fill="#ce93d8" opacity="0.6" />

              {/* Graduation Cap */}
              <g transform="translate(0, -8)">
                <path d="M15 40 L50 25 L85 40 L50 55 Z" fill="#C2185B" /> {/* Rich Pinkish Purple */}
                <path d="M30 43 L30 55 Q50 62 70 55 L70 43" fill="#880E4F" />
                {/* Star on Cap */}
                <path d="M50 32 L52 37 L58 37 L53 40 L55 45 L50 42 L45 45 L47 40 L42 37 L48 37 Z" fill="#FFEB3B" />
                {/* Tassel */}
                <path d="M85 40 L90 60" stroke="#F44336" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="90" cy="62" r="3.5" fill="#F44336" />
              </g>

              {/* Baby Face */}
              {/* Ears */}
              <circle cx="23" cy="68" r="5" fill="#FFE0E0" stroke="#C2185B" strokeWidth="0.8" />
              <circle cx="77" cy="68" r="5" fill="#FFE0E0" stroke="#C2185B" strokeWidth="0.8" />

              <circle cx="50" cy="68" r="28" fill="#FFFBFB" stroke="#C2185B" strokeWidth="1" />
              
              {/* Hair Curl */}
              <path d="M42 45 Q50 35 58 45 Q50 48 42 45" fill="#C2185B" />
              
              {/* Cheeks */}
              <circle cx="32" cy="75" r="6" fill="#FFCDD2" opacity="0.8" />
              <circle cx="68" cy="75" r="6" fill="#FFCDD2" opacity="0.8" />
              
              {/* Eyes */}
              <g>
                <path d="M32 68 Q38 62 44 68" fill="none" stroke="#283593" strokeWidth="2" strokeLinecap="round" /> {/* Lash-style eyes */}
                <path d="M56 68 Q62 62 68 68" fill="none" stroke="#283593" strokeWidth="2" strokeLinecap="round" />
                
                {/* Blush below eyes */}
                <ellipse cx="38" cy="65" rx="4" ry="3.5" fill="#4527A0" opacity="0.9" />
                <circle cx="39.5" cy="63.5" r="1.2" fill="white" />
                
                <ellipse cx="62" cy="65" rx="4" ry="3.5" fill="#4527A0" opacity="0.9" />
                <circle cx="63.5" cy="63.5" r="1.2" fill="white" />
              </g>
              
              {/* Mouth - Open Smile */}
              <path d="M43 78 Q50 88 57 78 Z" fill="#4527A0" />
              
              {/* Multicolored Arabic Text "روضتي" */}
              <g transform="translate(0, 5)" className="font-arabic">
                {/* ر - Green */}
                <text x="80" y="90" fill="#4CAF50" fontSize="16" fontWeight="900" textAnchor="middle">ر</text>
                {/* و - Yellow */}
                <text x="65" y="94" fill="#FFC107" fontSize="16" fontWeight="900" textAnchor="middle">و</text>
                {/* ض - Blue */}
                <text x="50" y="95" fill="#2196F3" fontSize="16" fontWeight="900" textAnchor="middle">ض</text>
                {/* ت - Pink */}
                <text x="35" y="94" fill="#E91E63" fontSize="16" fontWeight="900" textAnchor="middle">ت</text>
                {/* ي - Green */}
                <text x="20" y="90" fill="#4CAF50" fontSize="16" fontWeight="900" textAnchor="middle">ي</text>
              </g>
            </svg>
          )}

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
            <span className="text-[#e91e63] font-arabic">روضتي</span>
          </span>
          <span className="text-[#7b1fa2] font-fredoka text-sm font-bold tracking-widest uppercase opacity-80">
            Rawdati
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
