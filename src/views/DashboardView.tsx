import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  MapPin, 
  Compass, 
  Clock, 
  Heart, 
  Camera, 
  CheckCircle, 
  ArrowLeft, 
  Calendar, 
  Bookmark, 
  Sliders, 
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Layers,
  MessageSquare
} from 'lucide-react';
import { User } from '../types';
import { prayerService, PrayerTimes } from '../services/prayerService';
import { storageService } from '../services/storageService';

interface DashboardViewProps {
  currentUser: User | null;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  onNavigate,
  onOpenAuth,
}) => {
  const [prayers, setPrayers] = useState<PrayerTimes | null>(null);
  const [dailyTasbihCount, setDailyTasbihCount] = useState<number>(33);
  const [targetTasbih] = useState<number>(100);
  const [savedItemsCount, setSavedItemsCount] = useState(0);

  useEffect(() => {
    // Calculate prayer times for user's city/coordinates
    const lat = 21.4225; // Default Makkah
    const lng = 39.8262;
    const calc = prayerService.calculate(
      lat, 
      lng, 
      new Date(), 
      currentUser?.preferences?.prayerCalculationMethod || 'UmmAlQura',
      currentUser?.preferences?.asrJuristic || 'standard'
    );
    setPrayers(calc);

    if (currentUser) {
      const items = storageService.getSavedItems(currentUser.id);
      setSavedItemsCount(items.length);
    }
  }, [currentUser]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in font-sans text-slate-800">
      
      {/* 1. GREETING & HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EFF8EE] via-white to-[#EFF8EE] border border-[#DCEBDD] p-6 sm:p-8 shadow-sm">
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-5 text-right w-full md:w-auto">
            {/* OFFICIAL ATTACHED MANAR LOGO ASSET */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden p-1.5 bg-white border border-[#DCEBDD] shadow-md shrink-0 flex items-center justify-center">
              <img
                src="/assets/manar-logo.jpeg"
                alt="شعار منار الرسمي"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF3DF] text-[#1b5329] text-xs font-semibold mb-2 border border-[#B7E58A]">
                <Sparkles className="w-3.5 h-3.5 text-[#4FAF68]" />
                <span>مرحباً بك في مَنار · دليلك إلى الإيمان والحرمين</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-arabic text-[#1b3823]">
                {currentUser ? `حياك الله، ${currentUser.name}` : 'أهلاً بك في منصة مَنار'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                تقويم أم القرى المعتمد · مواقيت الصلوات بدقة الحرمين · مساعد شرعي بأدلة القرآن والسنة
              </p>
            </div>
          </div>

          {/* Quick CTA or Status */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate('ai')}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#4FAF68] hover:bg-[#3d9654] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>اسأل مَنار (AI)</span>
            </button>
            <button
              onClick={() => onNavigate('umrah')}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-[#EFF8EE] text-[#1b5329] border border-[#B7E58A] font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition"
            >
              <MapPin className="w-4 h-4 text-[#4FAF68]" />
              <span>دليل العمرة</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. PRAYER TIME STATUS & TASBIH COUNTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Next Prayer Banner */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-[#DCEBDD] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#4FAF68]" />
              <span className="font-bold text-[#1b3823] text-sm">مواقيت الصلاة اليوم (تقويم أم القرى)</span>
            </div>
            <span className="text-xs bg-[#EFF8EE] text-[#1b5329] px-2.5 py-1 rounded-full font-semibold border border-[#DDF3DF]">
              مكة المكرمة
            </span>
          </div>

          {/* Prayer grid */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3 text-center my-2">
            {[
              { name: 'الفجر', time: prayers ? prayers.fajr : '04:58' },
              { name: 'الظهر', time: prayers ? prayers.dhuhr : '12:21' },
              { name: 'العصر', time: prayers ? prayers.asr : '15:43' },
              { name: 'المغرب', time: prayers ? prayers.maghrib : '18:18' },
              { name: 'العشاء', time: prayers ? prayers.isha : '19:48' },
            ].map((p, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded-2xl bg-[#FAFCF7] border border-[#DCEBDD] hover:border-[#8BCF70] transition"
              >
                <div className="text-xs text-slate-500 font-medium mb-1">{p.name}</div>
                <div className="text-sm sm:text-base font-bold text-[#1b3823] font-mono">{p.time}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#EFF8EE] flex items-center justify-between text-xs">
            <span className="text-slate-600">طريقة الحساب: تقويم أم القرى (مكة المكرمة)</span>
            <button
              onClick={() => onNavigate('prayers')}
              className="text-[#308346] font-bold hover:underline flex items-center gap-1"
            >
              <span>تفاصيل أكثر</span>
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>
        </div>

        {/* Daily Tasbih Widget */}
        <div className="bg-white rounded-3xl p-6 border border-[#DCEBDD] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#4FAF68]" />
              <span className="font-bold text-[#1b3823] text-sm">الورد اليومي والمسبحة</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">{dailyTasbihCount} / {targetTasbih}</span>
          </div>

          <div className="text-center py-4 space-y-2">
            <div className="font-quran text-lg text-[#1b3823] font-bold">
              "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ"
            </div>
            <button
              onClick={() => setDailyTasbihCount(prev => prev + 1)}
              className="w-20 h-20 rounded-full mx-auto bg-gradient-to-tr from-[#4FAF68] via-[#8BCF70] to-[#B7E58A] text-white font-extrabold text-2xl shadow-md active:scale-95 transition flex items-center justify-center font-mono"
            >
              {dailyTasbihCount}
            </button>
            <div className="text-[11px] text-slate-500">اضغط للتسبيح والذكر</div>
          </div>

          <div className="pt-3 border-t border-[#EFF8EE] flex items-center justify-between text-xs">
            <button
              onClick={() => setDailyTasbihCount(0)}
              className="text-slate-500 hover:text-slate-800"
            >
              تصفير
            </button>
            <button
              onClick={() => onNavigate('duas')}
              className="text-[#308346] font-bold hover:underline flex items-center gap-1"
            >
              <span>حصن المسلم والأذكار</span>
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>
        </div>

      </div>

      {/* 3. CORE ACTION GRID (ALL MANAR SERVICES) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-arabic text-[#1b3823]">
            بوابة الخدمات والتوجيه الشرعي
          </h2>
          <span className="text-xs text-slate-500">وصول سريع لكل الأقسام</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'ai',
              title: 'اسأل مَنار (AI)',
              subtitle: 'استرجاع فقهي من أمهات الكتب والمجامع',
              icon: Sparkles,
              tag: 'المعتمد'
            },
            {
              id: 'quran',
              title: 'القرآن الكريم',
              subtitle: '114 سورة وتفاسير مجمع الملك فهد',
              icon: BookOpen,
              tag: 'مصحف'
            },
            {
              id: 'hadith',
              title: 'الحديث الشريف',
              subtitle: 'صحيح البخاري ومسلم بدرجات التوثيق',
              icon: ShieldCheck,
              tag: 'صحاح'
            },
            {
              id: 'umrah',
              title: 'دليل العمرة التفاعلي',
              subtitle: 'أشواط الطواف والسعي وقائمة التحقق',
              icon: MapPin,
              tag: 'مناسك'
            },
            {
              id: 'hajj',
              title: 'دليل الحج خطوة بخطوة',
              subtitle: 'مناسك أيام التروية وعرفة ومزدلفة',
              icon: Layers,
              tag: 'ركن الحج'
            },
            {
              id: 'gates',
              title: 'أبواب الحرمين الشريفين',
              subtitle: 'مداخل الكراسي وعربات كبار السن',
              icon: Compass,
              tag: 'ملاحة'
            },
            {
              id: 'camera',
              title: 'كاميرا التعرف المباشر',
              subtitle: 'التعرف على بوابات الحرم والآيات الكريمة',
              icon: Camera,
              tag: 'مباشر'
            },
            {
              id: 'planner',
              title: 'مخطط رحلة الحرمين',
              subtitle: 'جدول الأيام ومواعيد الروضة الشريفة',
              icon: Calendar,
              tag: 'تخطيط'
            },
          ].map((card, i) => (
            <div
              key={i}
              onClick={() => onNavigate(card.id)}
              className="bg-white rounded-3xl p-5 border border-[#DCEBDD] hover:border-[#8BCF70] hover:shadow-md cursor-pointer transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#EFF8EE] text-[#1b5329] group-hover:bg-[#DDF3DF] flex items-center justify-center transition">
                    <card.icon className="w-5 h-5 text-[#4FAF68]" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EFF8EE] text-[#1b5329] border border-[#DDF3DF]">
                    {card.tag}
                  </span>
                </div>
                <h3 className="font-bold text-[#1b3823] text-sm mb-1">{card.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{card.subtitle}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EFF8EE] flex items-center justify-between text-xs text-[#308346] font-bold">
                <span>فتح القسم</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
