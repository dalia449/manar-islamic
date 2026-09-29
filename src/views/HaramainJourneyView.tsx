import React, { useState } from 'react';
import { 
  MapPin, 
  CheckSquare, 
  Square, 
  Compass, 
  Calendar, 
  Info, 
  ExternalLink, 
  Search, 
  Filter, 
  Sparkles, 
  Check, 
  RotateCcw, 
  ShieldCheck, 
  ArrowLeft,
  Building2,
  Train,
  FileCheck,
  ChevronDown
} from 'lucide-react';
import { UMRAH_STEPS, HAJJ_DAY_BY_DAY } from '../data/hajjUmrahData';
import { HARAMAIN_LOCATIONS } from '../data/placesData';
import { VERIFIED_GATES } from '../data/gatesData';
import { storageService } from '../services/storageService';
import { User, GateInfo } from '../types';

interface HaramainJourneyViewProps {
  currentUser: User | null;
  onNavigate: (view: string) => void;
  initialTab?: string;
}

export const HaramainJourneyView: React.FC<HaramainJourneyViewProps> = ({
  currentUser,
  onNavigate,
  initialTab = 'umrah',
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Umrah Interactive Counters & Checklist State
  const [tawafCounter, setTawafCounter] = useState(0);
  const [saiCounter, setSaiCounter] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    return currentUser ? storageService.getChecklistProgress(currentUser.id, 'umrah') : {};
  });

  // Gates State & Filters
  const [gatesList, setGatesList] = useState<GateInfo[]>(() => storageService.getGates());
  const [gateSearch, setGateSearch] = useState('');
  const [gateMosqueFilter, setGateMosqueFilter] = useState<'all' | 'haram' | 'prophet'>('all');
  const [wheelchairOnly, setWheelchairOnly] = useState(false);

  // Selected Place Modal
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);

  const toggleStep = (stepId: string) => {
    const updated = { ...completedSteps, [stepId]: !completedSteps[stepId] };
    setCompletedSteps(updated);
    if (currentUser) {
      storageService.setChecklistProgress(currentUser.id, 'umrah', updated);
    }
  };

  const filteredGates = gatesList.filter(g => {
    const matchesMosque = gateMosqueFilter === 'all' || g.mosque === gateMosqueFilter;
    const matchesWheelchair = !wheelchairOnly || g.accessibility.wheelchairRamp;
    const matchesSearch = 
      g.nameArabic.includes(gateSearch) || 
      g.nameEnglish.toLowerCase().includes(gateSearch.toLowerCase()) ||
      String(g.gateNumber).includes(gateSearch);
    return matchesMosque && matchesWheelchair && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* 1. SECTION HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-950 to-emerald-900 border border-[#B7E58A] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-right">
            <div className="w-16 h-16 rounded-2xl overflow-hidden p-1 bg-white border border-[#B7E58A] shadow-md shrink-0 flex items-center justify-center">
              <img
                src="/assets/manar-logo.jpeg"
                alt="MANAR Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF3DF] text-[#1b5329] text-xs font-semibold mb-2 border border-[#B7E58A]">
                <MapPin className="w-3.5 h-3.5" />
                <span>دليل رحلة الحرمين الشريفين · مَنار</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-arabic text-white">
                رحلة الحرمين · مكة المكرمة والمدينة المنورة
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-2xl">
                دليلك المتكامل خطوة بخطوة للعمرة والحج والروضة الشريفة وبوابات الحرمين والخدمات الرسمية
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('planner')}
              className="px-5 py-3 rounded-2xl bg-[#4FAF68] hover:bg-[#8BCF70] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#4FAF68]/20 flex items-center gap-2 transition"
            >
              <Calendar className="w-4 h-4" />
              <span>مخطط الرحلة الذكي</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUBTABS NAVIGATION */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-emerald-800 text-xs sm:text-sm font-semibold no-scrollbar">
        {[
          { id: 'umrah', name: 'دليل العمرة التفاعلي' },
          { id: 'hajj', name: 'دليل الحج يوماً بيوم' },
          { id: 'makkah', name: 'معالم مكة المكرمة' },
          { id: 'madinah', name: 'معالم المدينة المنورة' },
          { id: 'rawdah', name: 'الروضة الشريفة وحجز نسك' },
          { id: 'gates', name: 'أبواب ومداخل الحرمين' },
          { id: 'official', name: 'الخدمات الرسمية ونسك' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-2xl transition whitespace-nowrap flex items-center gap-1.5 ${activeTab === tab.id ? 'bg-[#4FAF68] text-white font-bold shadow-md' : 'text-slate-300 hover:text-white hover:bg-emerald-900/60'}`}
          >
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB: UMRAH */}
      {activeTab === 'umrah' && (
        <div className="space-y-6">
          
          {/* Dual Interactive Counter for Tawaf & Sa'i */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Tawaf Counter */}
            <div className="emerald-card rounded-3xl p-5 border-[#B7E58A] flex items-center justify-between">
              <div>
                <div className="text-xs text-[#1b5329] font-bold mb-1">عداد أشواط الطواف (حول الكعبة)</div>
                <div className="text-2xl font-bold font-arabic text-white flex items-baseline gap-2">
                  <span>الشوط:</span>
                  <span className="text-3xl font-mono text-[#4FAF68]">{tawafCounter}</span>
                  <span className="text-xs text-slate-400">/ 7 أشواط</span>
                </div>
                <div className="text-[11px] text-emerald-200 mt-1">
                  {tawafCounter === 0 && 'ابدأ بمحاذاة الحجر الأسود والتكبير'}
                  {tawafCounter > 0 && tawafCounter < 7 && 'بين الركنين: ربنا آتنا في الدنيا حسنة...'}
                  {tawafCounter >= 7 && 'تم الطواف بفضل الله! توجه لركعتي الطواف.'}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setTawafCounter(prev => Math.min(7, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-[#4FAF68] hover:bg-[#8BCF70] text-white font-bold text-xs shadow transition"
                >
                  شوط مكتمل (+1)
                </button>
                <button
                  onClick={() => setTawafCounter(0)}
                  className="px-3 py-1 rounded-xl bg-emerald-950 text-slate-400 hover:text-slate-200 text-[10px] flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>تصفير</span>
                </button>
              </div>
            </div>

            {/* Sa'i Counter */}
            <div className="emerald-card rounded-3xl p-5 border-[#B7E58A] flex items-center justify-between">
              <div>
                <div className="text-xs text-[#1b5329] font-bold mb-1">عداد أشواط السعي (الصفا والمروة)</div>
                <div className="text-2xl font-bold font-arabic text-white flex items-baseline gap-2">
                  <span>الشوط:</span>
                  <span className="text-3xl font-mono text-[#4FAF68]">{saiCounter}</span>
                  <span className="text-xs text-slate-400">/ 7 أشواط</span>
                </div>
                <div className="text-[11px] text-emerald-200 mt-1">
                  {saiCounter % 2 === 1 ? 'أنت متجه الآن إلى المروة' : saiCounter > 0 && saiCounter < 7 ? 'أنت متجه الآن إلى الصفا' : saiCounter === 0 ? 'البداية من الصفا' : 'تم السعي بفضل الله عند المروة!'}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSaiCounter(prev => Math.min(7, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-[#4FAF68] hover:bg-[#8BCF70] text-white font-bold text-xs shadow transition"
                >
                  شوط مكتمل (+1)
                </button>
                <button
                  onClick={() => setSaiCounter(0)}
                  className="px-3 py-1 rounded-xl bg-emerald-950 text-slate-400 hover:text-slate-200 text-[10px] flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>تصفير</span>
                </button>
              </div>
            </div>

          </div>

          {/* 9 Interactive Umrah Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-arabic text-white">خطوات العمرة التسعة المعتمدة:</h2>
              <span className="text-xs text-[#1b5329]">
                مكتمل: {Object.values(completedSteps).filter(Boolean).length} / 9
              </span>
            </div>

            {UMRAH_STEPS.map((step) => {
              const isDone = Boolean(completedSteps[step.id]);
              return (
                <div
                  key={step.id}
                  className={`emerald-card rounded-2xl p-5 border transition ${isDone ? 'border-emerald-500/60 bg-emerald-900/40' : 'border-emerald-800'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleStep(step.id)}
                        className="mt-1 text-[#4FAF68] hover:text-[#1b5329] transition"
                      >
                        {isDone ? (
                          <CheckSquare className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <Square className="w-6 h-6 text-slate-400" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#DDF3DF] text-[#1b5329] text-xs font-bold flex items-center justify-center border border-[#B7E58A]">
                            {step.stepNumber}
                          </span>
                          <h3 className="font-bold font-arabic text-white text-base">
                            {step.titleArabic}
                          </h3>
                          <span className="text-xs text-slate-400 font-sans">({step.titleEnglish})</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed pt-1">
                          {step.summaryArabic}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details block */}
                  <div className="mt-4 pt-3 border-t border-emerald-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-emerald-950/60 p-3 rounded-xl space-y-1">
                      <div className="font-bold text-[#1b5329]">ما يُفعل شرعًا:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-200">
                        {step.whatToDo.map((todo, idx) => (
                          <li key={idx}>{todo}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-emerald-950/60 p-3 rounded-xl space-y-1">
                      <div className="font-bold text-[#1b5329]">ما يُقال:</div>
                      <p className="text-slate-200 font-arabic leading-relaxed">
                        {step.whatToSay}
                      </p>
                    </div>

                    {step.commonMistakes.length > 0 && (
                      <div className="bg-rose-950/30 border border-rose-500/20 p-2.5 rounded-xl text-rose-200 col-span-1 md:col-span-2">
                        <span className="font-bold text-rose-300 block mb-0.5">أخطاء شائعة يجب تجنبها:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                          {step.commonMistakes.map((m, idx) => (
                            <li key={idx}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 col-span-1 md:col-span-2 pt-1">
                      <span className="font-bold text-slate-300">الدليل والتوثيق: </span>
                      {step.evidenceSource}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB: HAJJ */}
      {activeTab === 'hajj' && (
        <div className="space-y-6">
          <div className="emerald-card rounded-2xl p-5 border-[#DCEBDD]">
            <h2 className="text-xl font-bold font-arabic text-white mb-2">
              رحلة الحج المباركة يوماً بيوم (Day-by-Day Hajj Journey)
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              دليل تفاعلي يبين مناسك الحج وفق هدي النبي ﷺ في حجة الوداع: من يوم التروية بمنى إلى طواف الوداع بالبيت العتيق.
            </p>
          </div>

          <div className="space-y-4">
            {HAJJ_DAY_BY_DAY.map((day) => (
              <div key={day.dayNumber} className="emerald-card rounded-2xl p-6 border-emerald-800 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-xl bg-[#4FAF68] text-white font-bold text-xs">
                      {day.dateHijri}
                    </span>
                    <h3 className="text-lg font-bold font-arabic text-white">{day.dayNameArabic}</h3>
                  </div>
                  <span className="text-xs text-[#1b5329] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{day.location}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {day.summaryArabic}
                </p>

                <div className="bg-emerald-950/70 p-3.5 rounded-xl space-y-1.5 text-xs">
                  <div className="font-bold text-[#1b5329]">أهم الأعمال والواجبات:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-200">
                    {day.actions.map((act, idx) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                </div>

                <div className="text-xs text-emerald-200 bg-emerald-900/40 p-2.5 rounded-xl border border-emerald-800">
                  <span className="font-bold text-[#1b5329]">الذكر والدعاء المستحب: </span>
                  {day.duasRecommended}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: MAKKAH & MADINAH */}
      {(activeTab === 'makkah' || activeTab === 'madinah') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-arabic text-white">
              {activeTab === 'makkah' ? 'معالم ومشاعر مكة المكرمة' : 'معالم ومساجد المدينة المنورة'}
            </h2>
            <span className="text-xs text-slate-400">معلومات موثقة مع ضوابط الزيارة الشرعية</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {HARAMAIN_LOCATIONS.filter(p => p.city === activeTab).map((place) => (
              <div key={place.id} className="emerald-card emerald-card-hover rounded-3xl p-6 border-[#DCEBDD] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#DDF3DF] text-[#1b5329] border border-[#B7E58A] capitalize">
                      {place.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-arabic text-white mb-1">{place.nameArabic}</h3>
                  <div className="text-xs text-slate-400 mb-3">{place.nameEnglish}</div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {place.descriptionArabic}
                  </p>

                  {place.visitingHours && (
                    <div className="text-xs text-[#1b5329] mb-3">
                      <span className="font-bold text-[#1b5329]">أوقات الزيارة: </span>
                      {place.visitingHours}
                    </div>
                  )}

                  {place.guidelines && (
                    <div className="bg-emerald-950/60 p-3 rounded-xl space-y-1 text-xs">
                      <span className="font-bold text-[#1b5329] block mb-1">إرشادات الزائر:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                        {place.guidelines.map((g, idx) => (
                          <li key={idx}>{g}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-emerald-800 flex items-center justify-between text-xs text-slate-400">
                  <span>المصدر: {place.officialSource}</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1 text-[#1b5329] hover:underline"
                  >
                    <span>عرض على الخريطة</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: RAWDAH GUIDE */}
      {activeTab === 'rawdah' && (
        <div className="space-y-6">
          <div className="emerald-card rounded-3xl p-6 border-[#B7E58A] space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-emerald-800">
              <div className="w-12 h-12 rounded-2xl bg-[#DDF3DF] border border-[#B7E58A] flex items-center justify-center text-[#1b5329]">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-arabic text-white">
                  دليل زيارة الروضة الشريفة وحجز نسك (The Noble Rawdah)
                </h2>
                <p className="text-xs text-slate-300">
                  "ما بين بيتي ومنبري روضة من رياض الجنة" (صحيح البخاري ومسلم)
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              تقع الروضة الشريفة في المسجد النبوي الشريف بين حجرة السيدة عائشة رضي الله عنها ومنبر النبي ﷺ، والصلاة فيها مستحبة اقتداءً بالسنة النبوية الشريفة.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="bg-emerald-950/70 p-4 rounded-2xl space-y-2 border border-emerald-800">
                <div className="font-bold text-[#1b5329] text-sm">خطوات حجز تصريح الروضة عبر "نُسُك":</div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                  <li>تحميل تطبيق "نُسُك" (Nusuk) الرسمي على هاتفك المحمول.</li>
                  <li>تسجيل الدخول برقم التأشيرة أو الهوية الوطنية/الإقامة.</li>
                  <li>اختيار خدمة "الصلاة في الروضة الشريفة" (للرجال أو للنساء).</li>
                  <li>تحديد التاريخ والوقت المناسب من المواعيد المتاحة رسميًا.</li>
                  <li>الاحتفاظ برمز الاستجابة السريعة (QR Code) على هاتفك وإبرازه عند نقطة التفويج.</li>
                </ol>
              </div>

              <div className="bg-emerald-950/70 p-4 rounded-2xl space-y-2 border border-emerald-800">
                <div className="font-bold text-[#1b5329] text-sm">آداب وسنن دخول الروضة الشريفة:</div>
                <ul className="list-disc list-inside space-y-1.5 text-slate-300 leading-relaxed">
                  <li>الوضوء الكامل واستحضار الخشوع والسكينة وخفض الصوت.</li>
                  <li>الحضور قبل الموعد بـ 15 دقيقة عند البوابة المحددة في التصريح.</li>
                  <li>صلاة ركعتين تحية المسجد، والإكثار من الصلاة على النبي ﷺ والدعاء.</li>
                  <li>التزام المدة المحددة لتمكين إخوانك المصلين من أداء النسك بيسر.</li>
                </ul>
              </div>
            </div>

            {/* MANDATORY OFFICIAL BOOKING DISCLAIMER */}
            <div className="p-4 rounded-2xl bg-[#EFF8EE] border border-[#B7E58A] text-[#1b5329] text-xs flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 text-[#4FAF68] mt-0.5" />
              <div>
                <span className="font-bold text-[#1b5329] block mb-0.5">تنبيه نظامي حاسم:</span>
                تؤكد منصة مَنار أنها لا تُصدر تصاريح زيارة الروضة الشريفة ولا تدعي وجود حجوزات مباشرة عبرها؛ الحجز الرسمي يتم حصريًا من خلال تطبيق "نُسُك" الحكومي المعتمد.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <a
                href="https://www.nusuk.sa"
                target="_blank"
                rel="noreferrer noopener"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4FAF68] to-[#3d9654] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#4FAF68]/20 transition"
              >
                <span>الانتقال لمنصة نُسُك الرسمية للحجز</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      )}

      {/* TAB: GATES & ENTRANCES */}
      {activeTab === 'gates' && (
        <div className="space-y-6">
          <div className="emerald-card rounded-2xl p-5 border-[#DCEBDD] flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-arabic text-white">دليل أبواب ومداخل الحرمين الشريفين</h2>
              <p className="text-xs text-slate-300 mt-1">
                بيانات مدققة للبوابات الرئيسية، مسارات الكراسي المتحركة، والسلالم الكهربائية
              </p>
            </div>

            <div className="text-xs bg-emerald-950 px-3 py-1.5 rounded-xl border border-[#B7E58A] text-[#1b5329]">
              قابلة للتعديل والتحقق المباشر من مسؤولي النظام
            </div>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={gateSearch}
                onChange={e => setGateSearch(e.target.value)}
                placeholder="بحث باسم البوابة أو رقمها..."
                className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-white text-xs focus:border-[#8BCF70] focus:outline-none"
              />
            </div>

            <div className="flex gap-1.5">
              {[
                { id: 'all', name: 'الكل' },
                { id: 'haram', name: 'المسجد الحرام' },
                { id: 'prophet', name: 'المسجد النبوي' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setGateMosqueFilter(f.id as any)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${gateMosqueFilter === f.id ? 'bg-[#4FAF68] text-white font-bold border-[#8BCF70]' : 'bg-emerald-950 border-emerald-800 text-slate-300'}`}
                >
                  {f.name}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950 border border-emerald-800 cursor-pointer select-none text-xs text-slate-300">
              <input
                type="checkbox"
                checked={wheelchairOnly}
                onChange={e => setWheelchairOnly(e.target.checked)}
                className="rounded accent-[#4FAF68] w-4 h-4"
              />
              <span>مداخل مجهزة للكراسي المتحركة فقط</span>
            </label>
          </div>

          {/* Gates List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGates.map((gate) => (
              <div key={gate.id} className="emerald-card rounded-2xl p-5 border-emerald-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-[#DDF3DF] text-[#1b5329] font-bold text-sm flex items-center justify-center border border-[#B7E58A] font-mono">
                      {gate.gateNumber}
                    </span>
                    <div>
                      <h3 className="font-bold font-arabic text-white text-base">{gate.nameArabic}</h3>
                      <div className="text-[11px] text-slate-400">{gate.nameEnglish}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${gate.isOpen ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300'}`}>
                    {gate.isOpen ? 'مفتوح للدخول' : 'مغلق مؤقتًا'}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <div><span className="text-[#1b5329] font-semibold">الموقع: </span>{gate.locationArea}</div>
                  <div><span className="text-[#1b5329] font-semibold">يخدم: </span>{gate.areaServed}</div>
                  <div><span className="text-[#1b5329] font-semibold">أبرز المعالم القريبة: </span>{gate.nearbyLandmarks}</div>
                </div>

                {/* Accessibility Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                  {gate.accessibility.wheelchairRamp && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-700">
                      ✓ منحدر كراسي متحركة
                    </span>
                  )}
                  {gate.accessibility.escalator && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-[#1b5329] border border-emerald-700">
                      ✓ سلالم كهربائية
                    </span>
                  )}
                  {gate.accessibility.elderlyCarts && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-[#1b5329] border border-emerald-700">
                      ✓ عربات كبار السن
                    </span>
                  )}
                  {gate.accessibility.brailleSignage && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-slate-300 border border-emerald-700">
                      ✓ لوحات برايل
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-emerald-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>تم التحقق: {gate.lastVerifiedDate}</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${gate.latitude},${gate.longitude}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1 text-[#1b5329] hover:underline"
                  >
                    <span>الموقع الجغرافي</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-xs text-slate-400 p-3 bg-emerald-950/60 rounded-xl border border-emerald-800">
            تنبيه: قد تتغير مسارات الأبواب مؤقتًا خلال مواسم الذروة وفق تعليمات إدارة التفويج بالحرمين الشريفين.
          </div>
        </div>
      )}

      {/* TAB: OFFICIAL SERVICES */}
      {activeTab === 'official' && (
        <div className="space-y-6">
          <div className="emerald-card rounded-2xl p-5 border-[#DCEBDD]">
            <h2 className="text-xl font-bold font-arabic text-white mb-2">
              دليل الخدمات الحكومية والمنصات الرسمية المعتمدة
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              روابط مباشرة ومحدثة للجهات الرسمية بالمملكة العربية السعودية لخدمة ضيوف الرحمن.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {storageService.getOfficialServices().map((svc) => (
              <div key={svc.id} className="emerald-card rounded-3xl p-6 border-[#DCEBDD] flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#DDF3DF] text-[#1b5329] border border-[#B7E58A]">
                      خدمة حكومية معتمدة
                    </span>
                    <span className="text-[10px] text-slate-400">تدقيق: {svc.lastVerified}</span>
                  </div>

                  <h3 className="text-lg font-bold font-arabic text-white mb-1">{svc.titleArabic}</h3>
                  <div className="text-xs text-slate-400 mb-3">{svc.titleEnglish}</div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {svc.descriptionArabic}
                  </p>

                  <div className="p-3 rounded-xl bg-[#EFF8EE] border border-[#B7E58A] text-[#1b5329] text-[11px] leading-relaxed">
                    {svc.disclaimer}
                  </div>
                </div>

                <a
                  href={svc.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4FAF68] to-[#3d9654] hover:from-[#3d9654] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <span>فتح الخدمة الرسمية ({svc.titleArabic.split(' ')[0]})</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
