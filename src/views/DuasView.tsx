import React, { useState } from 'react';
import { Heart, RotateCcw, Check, Sparkles, Volume2, Bookmark, Copy, ShieldCheck } from 'lucide-react';
import { AUTHENTIC_DUAS } from '../data/duasData';
import { DuaItem } from '../types';
import { storageService } from '../services/storageService';

export const DuasView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('morning');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredDuas = AUTHENTIC_DUAS.filter(d => d.category === selectedCategory);

  const incrementCount = (dua: DuaItem) => {
    const current = counts[dua.id] || 0;
    if (current < dua.repeatTarget) {
      const next = current + 1;
      setCounts(prev => ({ ...prev, [dua.id]: next }));

      // Optional haptic vibration if supported on mobile
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(next === dua.repeatTarget ? [50, 50, 50] : 30);
      }
    }
  };

  const resetCount = (duaId: string) => {
    setCounts(prev => ({ ...prev, [duaId]: 0 }));
  };

  const handleCopy = (dua: DuaItem) => {
    navigator.clipboard.writeText(`${dua.textArabic}\n\n${dua.translation}\n[${dua.reference}]`);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBookmark = (dua: DuaItem) => {
    const currentUser = storageService.getCurrentUser();
    if (!currentUser) return;
    storageService.toggleSaveItem({
      userId: currentUser.id,
      type: 'dua',
      title: dua.titleArabic,
      content: dua.textArabic,
      reference: dua.reference,
    });
    alert('تم حفظ الذكر في سجلك الشخصي!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-950 to-emerald-900 border border-[#B7E58A] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden p-1 bg-white border border-[#B7E58A] shadow-md shrink-0 flex items-center justify-center">
              <img
                src="/assets/manar-logo.jpeg"
                alt="MANAR Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF3DF] text-[#1b5329] text-xs font-semibold mb-2 border border-[#B7E58A]">
                <Heart className="w-3.5 h-3.5" />
                <span>حصن المسلم والمسبحة الإلكترونية · مَنار</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-arabic text-white">
                الأذكار اليومية وأدعية الحرمين الشريفين
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-2xl">
                أذكار الصباح والمساء والنسك مع عداد إلكتروني تفاعلي وتتبع لمرات التكرار
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs sm:text-sm font-semibold no-scrollbar">
        {[
          { id: 'morning', name: 'أذكار الصباح' },
          { id: 'evening', name: 'أذكار المساء' },
          { id: 'prayer', name: 'أذكار بعد الصلاة' },
          { id: 'hajj_umrah', name: 'أدعية الحج والعمرة' },
          { id: 'travel', name: 'دعاء السفر والترحال' },
          { id: 'quranic', name: 'أدعية قرآنية' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2.5 rounded-2xl whitespace-nowrap transition font-bold ${selectedCategory === c.id ? 'bg-[#4FAF68] text-white shadow-md' : 'emerald-card text-slate-300 hover:text-white'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Duas List with Interactive Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDuas.map((dua) => {
          const currentCount = counts[dua.id] || 0;
          const isDone = currentCount >= dua.repeatTarget;
          return (
            <div
              key={dua.id}
              className={`emerald-card rounded-3xl p-6 border transition flex flex-col justify-between space-y-4 ${isDone ? 'border-emerald-500/60 bg-emerald-900/40' : 'border-[#4FAF68]/25'}`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
                  <h3 className="font-bold font-arabic text-white text-base sm:text-lg">
                    {dua.titleArabic}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold bg-[#DDF3DF] text-[#1b5329] px-2 py-0.5 rounded-full border border-[#B7E58A]">
                      {currentCount} / {dua.repeatTarget}
                    </span>
                    {isDone && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                </div>

                {/* Arabic Dhikr */}
                <p className="font-quran text-xl sm:text-2xl text-right leading-loose text-white py-3">
                  "{dua.textArabic}"
                </p>

                {/* English Translation */}
                <p className="text-xs text-slate-300 font-sans leading-relaxed pt-2 border-t border-emerald-900">
                  {dua.translation}
                </p>

                {dua.virtue && (
                  <div className="mt-3 p-2.5 rounded-xl bg-[#EFF8EE] border border-[#DCEBDD] text-[#1b5329] text-xs">
                    <span className="font-bold text-[#1b5329]">الفضل: </span>
                    {dua.virtue}
                  </div>
                )}
              </div>

              {/* Interactive Counter Controls */}
              <div className="pt-3 border-t border-emerald-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(dua)}
                    className="p-2 rounded-xl bg-emerald-950 hover:bg-emerald-800 text-slate-300 hover:text-white transition"
                    title="نسخ الذكر"
                  >
                    {copiedId === dua.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleBookmark(dua)}
                    className="p-2 rounded-xl bg-emerald-950 hover:bg-emerald-800 text-slate-300 hover:text-[#1b5329] transition"
                    title="حفظ في رحلتي"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => resetCount(dua.id)}
                    className="p-2 rounded-xl bg-emerald-950 hover:bg-emerald-800 text-slate-400 hover:text-slate-200 transition"
                    title="إعادة التعيين"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => incrementCount(dua)}
                  disabled={isDone}
                  className={`px-6 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition shadow ${isDone ? 'bg-emerald-800/80 text-emerald-300 border border-emerald-600 cursor-default' : 'bg-gradient-to-r from-[#4FAF68] to-[#3d9654] hover:from-[#3d9654] text-white shadow-[#4FAF68]/20'}`}
                >
                  {isDone ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>اكتمل الذكر بفضل الله</span>
                    </>
                  ) : (
                    <>
                      <span>تسبيح (+1)</span>
                      <span className="font-mono bg-emerald-950/20 px-1.5 py-0.5 rounded text-[11px]">
                        {currentCount}
                      </span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[10px] text-slate-400 text-right">
                التخريج: {dua.reference}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
