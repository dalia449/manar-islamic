import React from 'react';
import { Home, Sparkles, BookOpen, MapPin, Camera } from 'lucide-react';

interface MobileNavProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeView, onNavigate }) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#DCEBDD] px-3 py-2 flex items-center justify-around shadow-xl safe-area-bottom">
      {/* Home */}
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center gap-1 transition ${
          activeView === 'dashboard' || activeView === 'landing' 
            ? 'text-[#1b5329] font-bold scale-105' 
            : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">الرئيسية</span>
      </button>

      {/* Haramain Journey */}
      <button
        onClick={() => onNavigate('haramain')}
        className={`flex flex-col items-center gap-1 transition ${
          ['haramain', 'umrah', 'hajj', 'gates', 'makkah', 'madinah'].includes(activeView)
            ? 'text-[#1b5329] font-bold scale-105' 
            : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <MapPin className="w-5 h-5" />
        <span className="text-[10px]">الحرمين</span>
      </button>

      {/* Floating Center Official MANAR Button */}
      <div className="-mt-6">
        <button
          onClick={() => onNavigate('ai')}
          className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-lg shadow-[#4FAF68]/20 ring-4 ring-[#EFF8EE] hover:scale-105 active:scale-95 transition flex flex-col items-center justify-center border border-[#B7E58A]"
          title="اسأل مَنار"
        >
          <img
            src="/assets/manar-logo.jpeg"
            alt="مَنار"
            className="w-7 h-7 object-contain"
          />
          <span className="text-[9px] font-black text-[#1b5329] leading-none mt-0.5">مَنار</span>
        </button>
      </div>

      {/* Quran */}
      <button
        onClick={() => onNavigate('quran')}
        className={`flex flex-col items-center gap-1 transition ${
          activeView === 'quran' || activeView === 'hadith'
            ? 'text-[#1b5329] font-bold scale-105' 
            : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <BookOpen className="w-5 h-5" />
        <span className="text-[10px]">القرآن</span>
      </button>

      {/* Camera */}
      <button
        onClick={() => onNavigate('camera')}
        className={`flex flex-col items-center gap-1 transition ${
          activeView === 'camera'
            ? 'text-[#1b5329] font-bold scale-105' 
            : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <Camera className="w-5 h-5" />
        <span className="text-[10px]">الكاميرا</span>
      </button>
    </div>
  );
};
