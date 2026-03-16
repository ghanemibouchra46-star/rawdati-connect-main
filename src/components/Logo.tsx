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
                <path d="M15 15 L17 21 L23 21 L18 25 L20 31 L15 27 L10 31 L12 25 L7 21 L13 21 Z" fill="#ffd54f" /> {/* Top Left Star */}
                <path d="M85 15 L87 21 L93 21 L88 25 L90 31 L85 27 L80 31 L82 25 L77 21 L83 21 Z" fill="#64b5f6" /> {/* Top Right Star */}
                <path d="M10 60 L12 64 L16 64 L13 67 L14 71 L10 69 L6 71 L7 67 L4 64 L8 64 Z" fill="#f06292" /> {/* Bottom Left Star */}
                <path d="M90 60 L92 64 L96 64 L93 67 L94 71 L90 69 L86 71 L87 67 L84 64 L88 64 Z" fill="#81c784" /> {/* Bottom Right Star */}
              </g>
              
              <circle cx="20" cy="45" r="2.5" fill="#f06292" opacity="0.6" />
              <circle cx="80" cy="40" r="3" fill="#ffd54f" opacity="0.6" />
              <circle cx="15" cy="75" r="2" fill="#64b5f6" opacity="0.6" />
              <circle cx="85" cy="75" r="2.5" fill="#ce93d8" opacity="0.6" />

              {/* Graduation Cap */}
              <g transform="translate(0, -5)">
                <path d="M20 35 L50 22 L80 35 L50 48 Z" fill="#7b1fa2" />
                <path d="M35 38 L35 50 Q50 55 65 50 L65 38" fill="#4a148c" />
                {/* Star on Cap */}
                <path d="M50 28 L52 33 L58 33 L53 36 L55 41 L50 38 L45 41 L47 36 L42 33 L48 33 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" />
                {/* Tassel */}
                <path d="M80 35 L85 55" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="85" cy="55" r="3.5" fill="#ef4444" />
              </g>

              {/* Baby Face */}
              <circle cx="50" cy="65" r="28" fill="#fff9f9" stroke="#7b1fa2" strokeWidth="1" />
              
              {/* Cheeks */}
              <circle cx="32" cy="72" r="6" fill="#ffcdd2" opacity="0.7" />
              <circle cx="68" cy="72" r="6" fill="#ffcdd2" opacity="0.7" />
              
              {/* Eyes - Large & Cute */}
              <g>
                <circle cx="38" cy="62" r="4.5" fill="#1e1b4b" />
                <circle cx="39.5" cy="60" r="1.8" fill="white" />
                <circle cx="37" cy="64" r="0.8" fill="white" />
                
                <circle cx="62" cy="62" r="4.5" fill="#1e1b4b" />
                <circle cx="63.5" cy="60" r="1.8" fill="white" />
                <circle cx="61" cy="64" r="0.8" fill="white" />
              </g>
              
              {/* Brows */}
              <path d="M33 55 Q38 52 43 55" fill="none" stroke="#7b1fa2" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <path d="M57 55 Q62 52 67 55" fill="none" stroke="#7b1fa2" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

              {/* Mouth */}
              <path d="M43 78 Q50 86 57 78" fill="none" stroke="#e91e63" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Arabic Text "روضتي" in a curve */}
              <defs>
                <path id="textCurve" d="M20 88 Q50 98 80 88" />
              </defs>
              <text className="font-arabic font-black" fill="#e91e63" style={{ fontSize: '12px' }}>
                <textPath href="#textCurve" startOffset="50%" textAnchor="middle">
                  روضتي
                </textPath>
              </text>
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
