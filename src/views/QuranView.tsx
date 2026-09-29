import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Play, 
  Pause, 
  Bookmark, 
  Copy, 
  Check, 
  Volume2, 
  ShieldCheck, 
  Heart,
  ChevronRight,
  Filter
} from 'lucide-react';
import { SURAHS_LIST, ALL_114_SURAHS } from '../data/quranData';
import { AUTHENTIC_HADITHS } from '../data/hadithData';
import { QuranSurah, HadithItem } from '../types';
import { storageService } from '../services/storageService';

export const QuranView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quran' | 'hadith'>('quran');
  
  // Quran state
  const [quranSearch, setQuranSearch] = useState('');
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(1);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioRef] = useState<HTMLAudioElement>(new Audio());
  const [copiedAyah, setCopiedAyah] = useState<number | null>(null);

  // Hadith state
  const [hadithSearch, setHadithSearch] = useState('');
  const [hadithCategory, setHadithCategory] = useState<string>('all');
  const [copiedHadith, setCopiedHadith] = useState<string | null>(null);

  const selectedSurah = SURAHS_LIST.find(s => s.number === selectedSurahNumber) || SURAHS_LIST[0];

  const filteredSurahs = ALL_114_SURAHS.filter(s => 
    s.ar.includes(quranSearch) || 
    s.en.toLowerCase().includes(quranSearch.toLowerCase()) || 
    String(s.num).includes(quranSearch)
  );

  const filteredHadiths = AUTHENTIC_HADITHS.filter(h => {
    const matchesCat = hadithCategory === 'all' || h.category === hadithCategory;
    const matchesSearch = 
      h.textArabic.includes(hadithSearch) || 
      h.textTranslation.toLowerCase().includes(hadithSearch.toLowerCase()) ||
      h.narrator.toLowerCase().includes(hadithSearch.toLowerCase()) ||
      h.collection.toLowerCase().includes(hadithSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const togglePlayAudio = (url?: string) => {
    if (!url) return;
    if (playingAudio === url) {
      audioRef.pause();
      setPlayingAudio(null);
    } else {
      audioRef.src = url;
      audioRef.play();
      setPlayingAudio(url);
      audioRef.onended = () => setPlayingAudio(null);
    }
  };

  const handleCopyAyah = (ayahNum: number, text: string) => {
    navigator.clipboard.writeText(`${text} [سورة ${selectedSurah.nameArabic}: ${ayahNum}]`);
    setCopiedAyah(ayahNum);
    setTimeout(() => setCopiedAyah(null), 2000);
  };

  const handleCopyHadith = (id: string, arabic: string, translation: string, ref: string) => {
    navigator.clipboard.writeText(`${arabic}\n\n${translation}\n[${ref}]`);
    setCopiedHadith(id);
    setTimeout(() => setCopiedHadith(null), 2000);
  };

  const handleSaveAyah = (ayahNum: number, text: string) => {
    const currentUser = storageService.getCurrentUser();
    if (!currentUser) return;
    storageService.toggleSaveItem({
      userId: currentUser.id,
      type: 'quran',
      title: `سورة ${selectedSurah.nameArabic} - الآية ${ayahNum}`,
      content: text,
      reference: `سورة ${selectedSurah.nameArabic} (${selectedSurah.nameEnglish})`
    });
    alert('تم حفظ الآية الكريمة في سجلك الشخصي!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* 1. SECTION HEADER */}
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
                <BookOpen className="w-3.5 h-3.5" />
                <span>الوحي المعصوم والسنن الثابتة · مَنار</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-arabic text-white">
                القرآن الكريم وصحاح الأحاديث النبوية
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-2xl">
                تلاوة وتدبر المصحف الشريف والسنن الصحاح المروية بأسانيدها المحققة
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('quran')}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition ${activeTab === 'quran' ? 'bg-[#4FAF68] text-white shadow-lg' : 'bg-emerald-900 text-slate-300 hover:text-white'}`}
            >
              القرآن الكريم (114 سورة)
            </button>
            <button
              onClick={() => setActiveTab('hadith')}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition ${activeTab === 'hadith' ? 'bg-[#4FAF68] text-white shadow-lg' : 'bg-emerald-900 text-slate-300 hover:text-white'}`}
            >
              الأحاديث النبوية المحققة
            </button>
          </div>
        </div>
      </div>

      {/* 2. QURAN TAB */}
      {activeTab === 'quran' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: 114 Surahs Index */}
          <div className="lg:col-span-4 emerald-card rounded-3xl p-5 border-[#4FAF68]/25 h-[680px] flex flex-col">
            <div className="relative mb-3">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={quranSearch}
                onChange={e => setQuranSearch(e.target.value)}
                placeholder="بحث باسم السورة أو رقمها..."
                className="w-full pl-3 pr-10 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-white text-xs focus:border-[#8BCF70] focus:outline-none"
              />
            </div>

            <div className="text-[11px] text-[#1b5329]/80 mb-2 px-1 flex justify-between">
              <span>فهرس السور (114 سورة)</span>
              <span>الآيات والنزول</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filteredSurahs.map((surah) => {
                const isSelected = selectedSurahNumber === surah.num;
                return (
                  <button
                    key={surah.num}
                    onClick={() => setSelectedSurahNumber(surah.num)}
                    className={`w-full text-right p-2.5 rounded-xl border transition flex items-center justify-between ${isSelected ? 'bg-[#4FAF68] text-white font-bold border-[#8BCF70] shadow-md' : 'bg-emerald-950/60 border-emerald-800/80 text-slate-200 hover:bg-emerald-900'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center ${isSelected ? 'bg-emerald-950 text-[#1b5329]' : 'bg-emerald-900 text-[#4FAF68]'}`}>
                        {surah.num}
                      </span>
                      <div>
                        <div className="font-bold text-xs">{surah.ar}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>{surah.en}</div>
                      </div>
                    </div>

                    <div className="text-left text-[10px]">
                      <div>{surah.ayahs} آية</div>
                      <div className={isSelected ? 'text-white/80' : 'text-emerald-300/80'}>{surah.type === 'Meccan' ? 'مكية' : 'مدنية'}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Surah Reading & Audio View */}
          <div className="lg:col-span-8 emerald-card rounded-3xl p-6 sm:p-8 border-[#4FAF68]/25 h-[680px] flex flex-col justify-between">
            
            {/* Surah Header Banner */}
            <div className="pb-4 border-b border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-[#DDF3DF] text-[#1b5329] font-bold text-base flex items-center justify-center border border-[#B7E58A]">
                  {selectedSurah.number}
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-arabic text-white">
                    سورة {selectedSurah.nameArabic}
                  </h2>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>{selectedSurah.nameEnglish} ({selectedSurah.translationEnglish})</span>
                    <span>·</span>
                    <span>{selectedSurah.numberOfAyahs} آية</span>
                    <span>·</span>
                    <span className="text-[#4FAF68]">{selectedSurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                  </div>
                </div>
              </div>

              {selectedSurah.sampleAyahs?.[0]?.audioUrl && (
                <button
                  onClick={() => togglePlayAudio(selectedSurah.sampleAyahs[0].audioUrl)}
                  className="px-3.5 py-2 rounded-xl bg-[#4FAF68] hover:bg-[#8BCF70] text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
                >
                  {playingAudio === selectedSurah.sampleAyahs[0].audioUrl ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>إيقاف التلاوة</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>استماع للتلاوة</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Surah Verses */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
              
              {/* Bismillah Header (except for At-Tawbah) */}
              {selectedSurah.number !== 9 && (
                <div className="text-center font-quran text-2xl sm:text-3xl text-[#1b5329] py-3 select-none">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
              )}

              {selectedSurah.sampleAyahs && selectedSurah.sampleAyahs.length > 0 ? (
                selectedSurah.sampleAyahs.map((ayah) => (
                  <div
                    key={ayah.numberInSurah}
                    className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800/80 space-y-3 group hover:border-[#B7E58A] transition"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="w-6 h-6 rounded-full bg-[#DDF3DF] text-[#1b5329] font-bold flex items-center justify-center font-mono text-[11px]">
                        {ayah.numberInSurah}
                      </span>

                      <div className="flex items-center gap-2">
                        {ayah.audioUrl && (
                          <button
                            onClick={() => togglePlayAudio(ayah.audioUrl)}
                            className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-[#1b5329] transition"
                            title="سماع الآية"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleSaveAyah(ayah.numberInSurah, ayah.textArabic)}
                          className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-slate-300 hover:text-[#1b5329] transition"
                          title="حفظ الآية"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCopyAyah(ayah.numberInSurah, ayah.textArabic)}
                          className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-slate-300 hover:text-white transition"
                          title="نسخ الآية"
                        >
                          {copiedAyah === ayah.numberInSurah ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Arabic Text */}
                    <p className="font-quran text-2xl sm:text-3xl text-right leading-loose text-white pt-1">
                      {ayah.textArabic}
                    </p>

                    {/* English Translation */}
                    <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1 border-t border-emerald-900">
                      {ayah.translationEnglish}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  جاري تحميل باقي آيات السورة من المصحف المعتمد لمجمع الملك فهد لطباعة المصحف الشريف.
                </div>
              )}

            </div>

            {/* Reading Footer */}
            <div className="pt-3 border-t border-emerald-800 flex items-center justify-between text-xs text-slate-400">
              <span>المصدر: مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة</span>
              <span className="text-[#1b5329]">خط الرسم العثماني المعتمد</span>
            </div>

          </div>

        </div>
      )}

      {/* 3. HADITH TAB */}
      {activeTab === 'hadith' && (
        <div className="space-y-6">
          
          {/* Search & Categories Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={hadithSearch}
                onChange={e => setHadithSearch(e.target.value)}
                placeholder="بحث في الأحاديث، الرواة، أو الكتب..."
                className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-white text-xs focus:border-[#8BCF70] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs pb-1">
              {[
                { id: 'all', name: 'جميع الأبواب' },
                { id: 'Faith', name: 'الإيمان والنية' },
                { id: 'Hajj & Umrah', name: 'الحج والعمرة' },
                { id: 'Prayer', name: 'الصلاة' },
                { id: 'Knowledge', name: 'العلم' },
                { id: 'Manners', name: 'الآداب والأخلاق' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setHadithCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition font-semibold border ${hadithCategory === c.id ? 'bg-[#4FAF68] text-white font-bold border-[#8BCF70] shadow' : 'bg-emerald-950 border-emerald-800 text-slate-300'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Hadiths Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredHadiths.map((h) => (
              <div key={h.id} className="emerald-card rounded-3xl p-6 border-[#DCEBDD] flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-800 text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-[#1b5329]">{h.collection}</span>
                      <span className="text-slate-400 font-mono">#{h.hadithNumber}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      {h.grade}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#1b5329]/80 mt-2">
                    عن: {h.narrator}
                  </div>

                  <p className="font-quran text-lg sm:text-xl text-right leading-loose text-white py-3">
                    "{h.textArabic}"
                  </p>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed pt-2 border-t border-emerald-900">
                    {h.textTranslation}
                  </p>
                </div>

                <div className="pt-3 border-t border-emerald-800 flex items-center justify-between text-xs text-slate-400">
                  <span>التحقيق: {h.scholarGrading}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyHadith(h.id, h.textArabic, h.textTranslation, `${h.collection}: ${h.hadithNumber}`)}
                      className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-800 text-slate-300 hover:text-white transition flex items-center gap-1"
                      title="نسخ الحديث"
                    >
                      {copiedHadith === h.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-slate-400 p-4 bg-emerald-950/60 rounded-2xl border border-emerald-800">
            تلتزم مَنار بعدم توليد أحاديث غير محققة، وتقديم المتون المسندة بأرقامها المعتمدة في الأصول الستة.
          </div>
        </div>
      )}

    </div>
  );
};
