import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(onFinish, 500);
    }, 2400);
    return () => clearTimeout(timer);
  }, [onFinish]);

  const handleSkip = () => {
    setFading(true);
    setTimeout(onFinish, 200);
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAFCF7] transition-opacity duration-500 ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Soft natural aura */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#DDF3DF]/60 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-[#8BCF70]/20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md animate-fade-in">
        
        {/* OFFICIAL ATTACHED LOGO ASSET */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-3xl bg-[#8BCF70]/20 blur-xl animate-pulse"></div>
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl overflow-hidden p-2 bg-white border border-[#DCEBDD] shadow-xl shadow-[#4FAF68]/15 flex items-center justify-center">
            <img
              src="/assets/manar-logo.jpeg"
              alt="شعار منار الرسمي | MANAR Official Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1b3823] font-arabic tracking-wide drop-shadow-sm">
            مَنار
          </h1>
          <span className="text-[#8BCF70] font-light text-3xl">|</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#308346] tracking-widest font-sans drop-shadow-sm">
            MANAR
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed mb-6 max-w-sm">
          دليلك الموثوق للإيمان، والعلم، ورحلة الحرمين الشريفين
        </p>

        {/* Saudi Identity */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF8EE] border border-[#DDF3DF] text-[#1b5329] text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4FAF68]"></span>
          <span>ابتكار تقني سعودي 🇸🇦 | صُمم وطُوّر في المملكة العربية السعودية</span>
        </div>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white hover:bg-[#EFF8EE] border border-[#DCEBDD] text-slate-600 hover:text-[#1b3823] text-xs font-semibold transition"
        >
          <span>تخطي والبدء</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
