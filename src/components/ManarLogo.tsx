import React from 'react';

export const MANAR_OFFICIAL_LOGO_PATH = '/assets/manar-logo.jpeg';

interface ManarLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  className?: string;
  imgClassName?: string;
  showText?: boolean;
  textSubtitle?: string;
  onClick?: () => void;
  alt?: string;
}

export const ManarLogo: React.FC<ManarLogoProps> = ({
  size = 'md',
  className = '',
  imgClassName = '',
  showText = false,
  textSubtitle = 'دليلك الموثوق للإيمان والحرمين',
  onClick,
  alt = 'شعار منار الرسمي | Official MANAR Logo',
}) => {
  // Size mappings (aspect-ratio 1:1, object-contain to never distort or crop)
  const sizeMap: Record<string, { box: string; img: string }> = {
    xs: { box: 'w-7 h-7', img: 'w-7 h-7' },
    sm: { box: 'w-9 h-9', img: 'w-9 h-9' },
    md: { box: 'w-12 h-12', img: 'w-12 h-12' },
    lg: { box: 'w-16 h-16', img: 'w-16 h-16' },
    xl: { box: 'w-24 h-24', img: 'w-24 h-24' },
    '2xl': { box: 'w-32 h-32', img: 'w-32 h-32' },
    hero: { box: 'w-36 h-36 sm:w-44 sm:h-44', img: 'w-36 h-36 sm:w-44 sm:h-44' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Unmodified Logo Asset - Kept Pristine and Uncropped */}
      <div className={`relative ${currentSize.box} shrink-0 rounded-2xl overflow-hidden bg-white shadow-sm flex items-center justify-center p-1 border border-[#DCEBDD]/60`}>
        <img
          src={MANAR_OFFICIAL_LOGO_PATH}
          alt={alt}
          className={`${currentSize.img} object-contain transition-transform duration-300`}
          referrerPolicy="no-referrer"
          loading="eager"
          onError={(e) => {
            // High reliability fallback to alternate valid paths
            const target = e.currentTarget;
            if (target.src.includes('manar-logo.jpeg')) {
              target.src = '/manar-logo.jpg';
            } else if (target.src.includes('manar-logo.jpg')) {
              target.src = '/manar.jpeg';
            }
          }}
        />
      </div>

      {showText && (
        <div className="select-none">
          <div className="flex items-center gap-2">
            <span className="font-arabic font-extrabold text-2xl text-[#1b3823] tracking-wide">
              مَنار
            </span>
            <span className="text-[#8BCF70] font-light">|</span>
            <span className="font-sans font-bold text-sm tracking-widest text-[#308346]">
              MANAR
            </span>
          </div>
          {textSubtitle && (
            <div className="text-[10px] text-slate-500 font-medium">
              {textSubtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer group text-right focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4FAF68] rounded-2xl"
      >
        {content}
      </button>
    );
  }

  return content;
};
