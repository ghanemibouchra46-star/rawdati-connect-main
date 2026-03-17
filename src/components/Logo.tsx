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
      {/* Premium Image Replication Container */}
      <div className={`relative ${iconSize} group`}>
        {/* Subtle Glow Aura */}
        <div className="absolute -inset-1 bg-gradient-to-tr from-[#9B59B6] via-[#E74C3C] to-[#F1C40F] rounded-full blur-md opacity-20 group-hover:opacity-40 transition-all duration-700 animate-pulse" />
        
        {/* Main Logo Container */}
        <div className="relative h-full w-full bg-white rounded-full shadow-lg flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-500">
          {variant === 'graduated' && (
            <svg viewBox="0 0 200 240" className="w-[95%] h-[95%]">
              {/* Background Stars & Dots */}
              <g className="animate-pulse" style={{ animationDuration: '4s' }}>
                <path d="M30 40 L35 52 L47 52 L38 60 L41 72 L31 64 L21 72 L24 60 L15 52 L27 52 Z" fill="#FFD700" /> {/* Yellow Star Top Left */}
                <path d="M170 35 L173 43 L181 43 L175 48 L177 56 L170 51 L163 56 L165 48 L159 43 L167 43 Z" fill="#87CEEB" /> {/* Blue Star Top Right */}
                <path d="M40 180 L44 188 L52 188 L46 193 L48 201 L40 196 L32 201 L34 193 L28 188 L36 188 Z" fill="#FFD700" /> {/* Yellow Star Bottom Left */}
                <path d="M175 160 L179 168 L187 168 L181 173 L183 181 L175 176 L167 181 L169 173 L163 168 L171 168 Z" fill="#FFD700" /> {/* Yellow Star Mid Right */}
                <path d="M178 200 L181 206 L187 206 L182 210 L184 216 L178 212 L172 216 L174 210 L169 206 L175 206 Z" fill="#2ECC71" /> {/* Green Star Bottom Right */}
                
                {/* Floating Blobs (Pink) */}
                <path d="M25 85 Q35 75 45 85 Q55 95 45 105 Q35 115 25 105 Q15 95 25 85" fill="#FFB6C1" />
                <path d="M175 220 Q180 215 185 220 Q190 225 185 230 Q180 235 175 230 Q170 225 175 220" fill="#FFB6C1" />
                
                {/* Dots */}
                <circle cx="180" cy="80" r="6" fill="#FFA07A" />
                <circle cx="20" cy="140" r="5" fill="#FFD700" />
                <circle cx="25" cy="190" r="4" fill="#87CEEB" />
                <circle cx="20" cy="220" r="5" fill="#FFB6C1" />
                <circle cx="190" cy="150" r="5" fill="#FF69B4" />
              </g>

              {/* Baby Face Group */}
              <g transform="translate(45, 60)">
                {/* Ear Left */}
                <circle cx="0" cy="80" r="15" fill="#FFC9C9" stroke="#6D214F" strokeWidth="2" />
                {/* Ear Right */}
                <circle cx="110" cy="80" r="15" fill="#FFC9C9" stroke="#6D214F" strokeWidth="2" />
                
                {/* Main Face */}
                <circle cx="55" cy="80" r="65" fill="#FFFFFF" stroke="#6D214F" strokeWidth="3" />
                
                {/* Hair Curl */}
                <path d="M40 30 Q55 10 70 30 Q55 40 40 30" fill="#9B59B6" stroke="#6D214F" strokeWidth="1" />
                
                {/* Brows */}
                <path d="M30 55 Q38 48 45 55" fill="none" stroke="#6D214F" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M65 55 Q72 48 80 55" fill="none" stroke="#6D214F" strokeWidth="2.5" strokeLinecap="round" />
                
                {/* Eyes */}
                <g>
                  <ellipse cx="38" cy="72" rx="9" ry="11" fill="#2D3436" />
                  <circle cx="41" cy="68" r="3" fill="white" />
                  <path d="M28 72 Q30 75 32 72 M28 75 Q30 78 32 75" fill="none" stroke="#6D214F" strokeWidth="1" /> {/* Lashes */}
                  
                  <ellipse cx="72" cy="72" rx="9" ry="11" fill="#2D3436" />
                  <circle cx="75" cy="68" r="3" fill="white" />
                  <path d="M78 72 Q80 75 82 72 M78 75 Q80 78 82 75" fill="none" stroke="#6D214F" strokeWidth="1" /> {/* Lashes */}
                </g>
                
                {/* Cheeks */}
                <circle cx="25" cy="85" r="12" fill="#FF7675" opacity="0.6" />
                <circle cx="85" cy="85" r="12" fill="#FF7675" opacity="0.6" />
                
                {/* Nose */}
                <circle cx="55" cy="82" r="4" fill="#FF7675" opacity="0.8" />
                
                {/* Mouth */}
                <path d="M40 100 Q55 125 70 100 Q55 105 40 100" fill="#2D3436" stroke="#6D214F" strokeWidth="1" />
                <path d="M45 112 Q55 118 65 112" fill="#FF7675" />
                
                {/* Graduation Cap */}
                <g transform="translate(0, -50)">
                  <path d="M10 50 L55 25 L100 50 L55 75 Z" fill="#9B59B6" stroke="#6D214F" strokeWidth="2" />
                  <path d="M30 55 L30 70 Q55 80 80 70 L80 55" fill="#8E44AD" stroke="#6D214F" strokeWidth="2" />
                  {/* Star */}
                  <path d="M55 40 L58 46 L65 46 L60 50 L62 57 L55 53 L48 57 L50 50 L45 46 L52 46 Z" fill="#F1C40F" />
                  {/* Tassel */}
                  <path d="M100 50 L105 85" stroke="#D63031" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M103 85 Q105 100 107 85" fill="#D63031" />
                </g>
              </g>

              {/* Colorful "روضتي" Text - Positioned Below Face */}
              <g transform="translate(100, 215)" textAnchor="middle">
                <text className="font-arabic font-black" style={{ fontSize: '28px' }}>
                  <tspan fill="#F1C40F">ر</tspan>
                  <tspan fill="#FF7675">و</tspan>
                  <tspan fill="#3498DB">ض</tspan>
                  <tspan fill="#FF7675">ت</tspan>
                  <tspan fill="#2ECC71">ي</tspan>
                </text>
              </g>
            </svg>
          )}

          {variant !== 'graduated' && (
            <div className="text-primary font-black text-xl">R</div>
          )}

          {/* Interactive Shine */}
          <div className="absolute -inset-full h-[300%] w-[300%] bg-gradient-to-tr from-transparent via-white/20 to-transparent -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
        </div>
      </div>

      {/* Side Typography - Reverted to Screenshot Style */}
      {showText && (
        <div className="flex flex-col -space-y-1">
          <div className={`font-black tracking-tight ${textSize} flex gap-0.5`}>
            <span className="text-[#F1C40F]">ر</span>
            <span className="text-[#FF7675]">و</span>
            <span className="text-[#3498DB]">ض</span>
            <span className="text-[#FF7675]">ت</span>
            <span className="text-[#2ECC71]">ي</span>
          </div>
          <span className="text-gray-400 font-sans text-xs font-bold tracking-wider capitalize">
            Rawdati
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
