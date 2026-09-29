import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  BookOpen, 
  Compass, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Camera, 
  ArrowLeft, 
  CheckCircle, 
  Globe, 
  ExternalLink,
  ChevronRight,
  Award,
  Users,
  AlertTriangle,
  HelpCircle,
  Lock,
  Layers,
  Check,
  Building,
  Navigation
} from 'lucide-react';
import { User } from '../types';
import { FeedbackSection } from '../components/FeedbackSection';

interface LandingViewProps {
  currentUser: User | null;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  currentUser,
  onNavigate,
  onOpenAuth,
}) => {
  return (
    <div className="min-h-screen bg-[#FAFCF7] text-slate-800 font-sans selection:bg-[#B7E58A] selection:text-[#1b3823]">
      
      {/* 1. HERO SECTION WITH OFFICIAL ATTACHED MANAR LOGO & SAUDI IDENTITY */}
      <section className="relative pt-10 pb-20 sm:pt-16 sm:pb-24 overflow-hidden border-b border-[#DCEBDD] bg-gradient-to-b from-[#EFF8EE] via-white to-[#FAFCF7]">
        
        {/* Soft natural radial backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#DDF3DF]/40 via-[#8BCF70]/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            
            {/* SAUDI IDENTITY BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#DCEBDD] text-[#1b5329] text-xs sm:text-sm font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#4FAF68] animate-pulse"></span>
              <span>ابتكار تقني سعودي 🇸🇦 | صُمم وطُوّر في المملكة العربية السعودية</span>
              <span className="text-slate-300">|</span>
              <span className="font-sans font-medium text-slate-600">Made in the Kingdom of Saudi Arabia</span>
            </div>

            {/* OFFICIAL ATTACHED LOGO (EXACT AS SUPPLIED) */}
            <div className="relative mb-6 group cursor-pointer" onClick={() => currentUser ? onNavigate('dashboard') : onOpenAuth('login')}>
              <div className="absolute inset-0 rounded-3xl bg-[#8BCF70]/20 blur-xl group-hover:bg-[#8BCF70]/35 transition duration-500"></div>
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden p-2 bg-white border border-[#DCEBDD] shadow-xl shadow-[#4FAF68]/15 group-hover:scale-105 transition duration-300 flex items-center justify-center">
                <img
                  src="/assets/manar-logo.jpeg"
                  alt="شعار منار الرسمي | MANAR Official Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-arabic tracking-tight text-[#1b3823] mb-4 leading-tight">
              مَنار <span className="text-[#8BCF70] font-light">|</span> <span className="text-[#308346] font-sans tracking-wider">MANAR</span>
            </h1>

            <p className="text-xl sm:text-2xl font-arabic text-[#1b5329] max-w-3xl leading-relaxed mb-3">
              "دليلك الموثوق للإيمان، والعلم، ورحلة الحرمين الشريفين"
            </p>

            <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-2xl leading-relaxed mb-8">
              "Your trusted guide for faith, authentic knowledge, and the sacred journey to the Two Holy Mosques."
            </p>

            {/* Primary Calls to Action */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => currentUser ? onNavigate('dashboard') : onOpenAuth('register')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#4FAF68] hover:bg-[#3d9654] text-white font-bold text-base shadow-lg shadow-[#4FAF68]/25 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <span>ابدأ رحلتك مع مَنار</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('haramain')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-[#EFF8EE] text-[#1b5329] border border-[#B7E58A] font-bold text-base shadow-sm flex items-center justify-center gap-2.5 transition"
              >
                <MapPin className="w-5 h-5 text-[#4FAF68]" />
                <span>استكشف رحلة الحرمين</span>
              </button>
            </div>

            {/* Quick Trust Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-[#DCEBDD] w-full text-xs text-slate-700">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4FAF68]" />
                <span>أدلة موثقة دون فتاوى مخترعة</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="w-4 h-4 text-[#4FAF68]" />
                <span>القرآن وصحيح البخاري ومسلم</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 text-[#4FAF68]" />
                <span>بوابات الحرمين وتصاريح نسك</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Globe className="w-4 h-4 text-[#4FAF68]" />
                <span>دعم 9 لغات عالمية</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SECTION 1: WHAT IS MANAR? (ما هي منصة مَنار؟) */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#DCEBDD]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDF3DF] text-[#1b5329] text-xs font-bold mb-4">
              <span>ما هي منصة مَنار؟</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-arabic text-[#1b3823] leading-snug mb-4">
              منارة رقمية إسلامية موثوقة تجمع بين صفاء الشريعة ودقة التقنية
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              <strong>مَنار</strong> هي منصة إسلامية رقمية متكاملة أُسست لتكون الرفيق الأمين لكل مسلم وقاصد لبيت الله الحرام ومسجد رسوله ﷺ. تجمع المنصة بين التوثيق الشرعي الصارم المستند لأكابر دور الإفتاء ومجامع الفقه المعتمدة، وبين أحدث أدوات التوجيه الميداني لمكة المكرمة والمدينة المنورة.
            </p>
            <div className="space-y-3">
              {[
                { title: 'أصالة المنهج', desc: 'نصوص شرعية معتمدة من مجمع الملك فهد، وصحيحي البخاري ومسلم، وهيئة كبار العلماء.' },
                { title: 'مساعد ذكي وقور', desc: 'استرجاع فقهي مسؤول يستشهد بالمصادر ويتوقف بشفافية عند غياب الدليل.' },
                { title: 'دليل ميداني واقعي', desc: 'ملاحة دقيقة لبوابات الحرمين ومسارات ذوي الإعاقة وكبار السن.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#EFF8EE] border border-[#DDF3DF]">
                  <CheckCircle className="w-5 h-5 text-[#4FAF68] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#1b3823] text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#DCEBDD] shadow-sm relative">
            <div className="text-center space-y-4">
              <div className="w-28 h-28 rounded-2xl overflow-hidden mx-auto p-1.5 bg-white border border-[#DCEBDD] shadow-md flex items-center justify-center">
                <img
                  src="/assets/manar-logo.jpeg"
                  alt="MANAR Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-bold text-xl font-arabic text-[#1b3823]">
                رؤية مَنار لخدمة المسلمين
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                أن نكون المرجع الرقمي الأول للمسلم عالمياً في معرفة أحكام دينه وأداء نسكه في الحرمين الشريفين بطمأنينة ويسر، انطلاقاً من أرض الحرمين الشريفين.
              </p>
              <div className="pt-4 border-t border-[#DCEBDD] flex items-center justify-around text-center text-xs">
                <div>
                  <div className="text-lg font-bold text-[#1b5329] font-mono">100%</div>
                  <div className="text-slate-500">مصادر موثقة</div>
                </div>
                <div className="w-px h-8 bg-[#DCEBDD]"></div>
                <div>
                  <div className="text-lg font-bold text-[#1b5329] font-mono">9</div>
                  <div className="text-slate-500">لغات معتمدة</div>
                </div>
                <div className="w-px h-8 bg-[#DCEBDD]"></div>
                <div>
                  <div className="text-lg font-bold text-[#1b5329] font-mono">0%</div>
                  <div className="text-slate-500">فتاوى مخترعة</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION 2: THE PROBLEM WE SOLVE (المشكلة التي نعالجها) */}
      <section className="py-16 sm:py-20 bg-[#EFF8EE] border-b border-[#DCEBDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-[#1b5329] font-bold">لماذا وُجدت مَنار؟</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-arabic text-[#1b3823] mt-2">
              التحديات الحقيقية التي تواجه المسلم وقاصد الحرمين
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-3">
              يواجه المسلمون اليوم تحديات ملموسة في الوصول للمعلومة الدينية النقية والملاحة الميدانية الموثوقة:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'تشتت المعلومات الإسلامية',
                desc: 'تفرق الأحكام الشرعية والأدلة بين مواقع غير معتمدة أو متناقضة مما يربك السائل.',
                icon: AlertTriangle
              },
              {
                title: 'صعوبة الوصول للمصادر الموثوقة',
                desc: 'انتشار الأحاديث الضعيفة والموضوعة والمصادر غير المراجعة من قِبل لجان شرعية متخصصة.',
                icon: HelpCircle
              },
              {
                title: 'حواجز اللغة والتواصل',
                desc: 'صعوبة فهم المصطلحات الفقهية الدقيقة للمسلمين الناطقين بغير العربية أثناء أداء النسك.',
                icon: Globe
              },
              {
                title: 'تعقيد فهم مناسك الحج والعمرة',
                desc: 'الخلط بين الأركان والواجبات والسنن وأخطاء الطواف والسعي والمواقيت المكانية.',
                icon: Compass
              },
              {
                title: 'صعوبة الملاحة في مكة والمدينة',
                desc: 'عدم معرفة أبواب الحرم المفتوحة، مسارات الكراسي المتحركة، وأماكن العربات الكهربائية.',
                icon: Navigation
              },
              {
                title: 'الالتباس بالخدمات الرسمية',
                desc: 'وقوع المعتمرين في فخ المواقع غير المصرحة لإصدار التصاريح أو حجوزات الروضة الوهمية.',
                icon: Lock
              },
            ].map((prob, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#DCEBDD] shadow-sm hover:border-[#8BCF70] transition">
                <div className="w-10 h-10 rounded-xl bg-[#DDF3DF] text-[#1b5329] flex items-center justify-center mb-4">
                  <prob.icon className="w-5 h-5 text-[#4FAF68]" />
                </div>
                <h3 className="font-bold text-[#1b3823] text-base mb-2 font-arabic">{prob.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{prob.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. SECTION 3: WHAT WE PROVIDE (خدمات مَنار الشاملة) */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#DCEBDD]">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#1b5329] font-bold">باقة الخدمات الكاملة</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-arabic text-[#1b3823] mt-2">
            كل ما يحتاجه المسلم في تطبيق ومنصة واحدة
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-3">
            منظومة رقمية متوازنة تغطي الجانب العلمي والعبادي والإرشادي
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[
            { id: 'ai', name: 'المساعد الشرعي الذكي', en: 'AI Islamic Assistant', icon: Sparkles },
            { id: 'quran', name: 'القرآن الكريم', en: 'Quran & Tafsir', icon: BookOpen },
            { id: 'hadith', name: 'الحديث الشريف', en: 'Hadith Collections', icon: Award },
            { id: 'duas', name: 'الأدعية والأذكار', en: 'Duas & Adhkar', icon: Heart },
            { id: 'prayers', name: 'مواقيت الصلاة', en: 'Prayer Times', icon: Clock },
            { id: 'qibla', name: 'اتجاه القبلة', en: 'Qibla Direction', icon: Compass },
            { id: 'learn-prayer', name: 'تعلّم الصلاة والوضوء', en: 'Prayer Learning', icon: CheckCircle },
            { id: 'camera', name: 'كاميرا التعرف المباشر', en: 'Camera AI', icon: Camera },
            { id: 'hajj', name: 'دليل الحج خطوة بخطوة', en: 'Hajj Guidance', icon: Layers },
            { id: 'umrah', name: 'دليل العمرة التفاعلي', en: 'Umrah Journey', icon: MapPin },
            { id: 'makkah', name: 'معالم مكة المكرمة', en: 'Makkah Guide', icon: Building },
            { id: 'madinah', name: 'معالم المدينة المنورة', en: 'Madinah Guide', icon: Building },
            { id: 'rawdah', name: 'حجز الروضة الشريفة', en: 'Rawdah Guidance', icon: Award },
            { id: 'gates', name: 'أبواب الحرمين الموثقة', en: 'Gates Directory', icon: Navigation },
            { id: 'planner', name: 'مخطط الرحلة الذكي', en: 'Trip Planner', icon: Compass },
            { id: 'official-services', name: 'الخدمات الرسمية ونسك', en: 'Official Services', icon: ExternalLink },
            { id: 'languages', name: 'دعم 9 لغات عالمية', en: 'Multilingual Support', icon: Globe },
            { id: 'profile', name: 'حساب وملاحظات المسلم', en: 'Personal Notes & Favs', icon: Users },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(item.id)}
              className="bg-white rounded-2xl p-4 border border-[#DCEBDD] hover:border-[#4FAF68] hover:shadow-md cursor-pointer transition flex flex-col justify-between group text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EFF8EE] group-hover:bg-[#DDF3DF] text-[#1b5329] flex items-center justify-center mx-auto mb-3 transition">
                <item.icon className="w-5 h-5 text-[#4FAF68]" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#1b3823] font-arabic mb-1 leading-snug">{item.name}</h4>
                <p className="text-[10px] text-slate-500 font-sans">{item.en}</p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 5. SECTION 4: HOW MANAR WORKS (كيف تعمل منصة مَنار؟) */}
      <section className="py-16 sm:py-20 bg-[#EFF8EE] border-b border-[#DCEBDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-[#1b5329] font-bold">آلية العمل والمنهجية</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-arabic text-[#1b3823] mt-2">
              كيف تضمن مَنار أعلى درجات الأمان والوقار الشرعي؟
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-3">
              ثلاث طبقات صارمة تفصل بين استفسار المستخدم والإجابة المعتمدة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBDD] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#DDF3DF] text-[#1b5329] font-bold font-mono text-lg flex items-center justify-center">
                01
              </div>
              <h3 className="text-lg font-bold font-arabic text-[#1b3823]">
                1. استرجاع الأدلة والمصادر أولاً (Source-First RAG)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                لا يقوم الذكاء الاصطناعي بتوليد أي نص ديني من تلقاء نفسه، بل يسترجع الآيات القرآنية بأرقامها من مجمع الملك فهد، وصحاح الأحاديث مع تخريجها، وقرارات المجامع الفقهية المعترف بها.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBDD] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#DDF3DF] text-[#1b5329] font-bold font-mono text-lg flex items-center justify-center">
                02
              </div>
              <h3 className="text-lg font-bold font-arabic text-[#1b3823]">
                2. التوقف والتحفظ عند غياب الدليل (Safe Abstention)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                إذا كان السؤال يتعلق بقضية فقهية معاصرة دقيقة أو مسألة خلافية معقدة لا يتوفر لها نص قطعي في قاعدة المصادر، يتوقف المساعد فوراً ويوجه السائل إلى لجان الإفتاء الرسمية المعتمدة.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBDD] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#DDF3DF] text-[#1b5329] font-bold font-mono text-lg flex items-center justify-center">
                03
              </div>
              <h3 className="text-lg font-bold font-arabic text-[#1b3823]">
                3. التوجيه الميداني المباشر للجهات الرسمية
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                في شؤون التصاريح، وتفويج الحجاج، وقطار الحرمين، وحجز الروضة، توفر مَنار التوجيه إلى منصة "نُسُك" ووزارة الحج والعمرة دون ادعاء إصدار أذونات أو طلب بيانات بنكية.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. SECTION 5: HARAMAIN JOURNEY PREVIEW (معاينة رحلة الحرمين) */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-[#DCEBDD]">
        
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#1b5329] font-bold">رحلة الحرمين الشريفين</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-arabic text-[#1b3823] mt-2">
            معاينة مناسك العمرة والحج وبوابات المسجد الحرام
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-3">
            أدوات تفاعلية تيسر لك خطوات النسك مع عدادات الطواف والسعي
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#DCEBDD] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#EFF8EE] text-[#4FAF68] flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-arabic text-[#1b3823]">دليل العمرة التفاعلي</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                9 خطوات عملية تبدأ من الاستعداد والإحرام من الميقات، مروراً بالطواف وصلاة خلف المقام، والسعي والتحلل، مع قائمة تحقق تفاعلية.
              </p>
            </div>
            <button
              onClick={() => onNavigate('umrah')}
              className="w-full py-2.5 rounded-xl bg-[#EFF8EE] hover:bg-[#DDF3DF] text-[#1b5329] font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>فتح دليل العمرة</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#DCEBDD] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#EFF8EE] text-[#4FAF68] flex items-center justify-center mb-3">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-arabic text-[#1b3823]">دليل الحج يوماً بيوم</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                إرشاد منظم لأيام الحج: يوم التروية (8 ذو الحجة)، عرفة، مزدلفة، يوم النحر، وأيام التشريق مع التنبيه على الفتاوى والرخص المعتمدة.
              </p>
            </div>
            <button
              onClick={() => onNavigate('hajj')}
              className="w-full py-2.5 rounded-xl bg-[#EFF8EE] hover:bg-[#DDF3DF] text-[#1b5329] font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>فتح دليل الحج</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#DCEBDD] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#EFF8EE] text-[#4FAF68] flex items-center justify-center mb-3">
                <Navigation className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-arabic text-[#1b3823]">دليل بوابات الحرمين</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                فهرس رقمي موثق لأبواب المسجد الحرام والمسجد النبوي مع تحديد مسارات العربات الكهربائية والكراسي المتحركة ومواقع المعالم المجاورة.
              </p>
            </div>
            <button
              onClick={() => onNavigate('gates')}
              className="w-full py-2.5 rounded-xl bg-[#EFF8EE] hover:bg-[#DDF3DF] text-[#1b5329] font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>استعراض البوابات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#DCEBDD] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#EFF8EE] text-[#4FAF68] flex items-center justify-center mb-3">
                <ExternalLink className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-arabic text-[#1b3823]">الخدمات الرسمية ونسك</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                توجيه موثق لمنصة نُسُك (Nusuk)، التأشيرة السياحية، قطار الحرمين السريع، ومشروع أضاحي الرسمي مع توضيح إخلاء المسؤولية المعتمد.
              </p>
            </div>
            <button
              onClick={() => onNavigate('official-services')}
              className="w-full py-2.5 rounded-xl bg-[#EFF8EE] hover:bg-[#DDF3DF] text-[#1b5329] font-bold text-xs transition flex items-center justify-center gap-1.5"
            >
              <span>الروابط الحكومية الرسمية</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </section>

      {/* 7. SECTION 6: WHY MANAR? (لماذا مَنار؟) */}
      <section className="py-16 sm:py-20 bg-[#EFF8EE] border-b border-[#DCEBDD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-[#1b5329] font-bold">المزايا التنافسية</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-arabic text-[#1b3823] mt-2">
              لماذا يثق المسلمون بمنصة مَنار؟
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-3">
              فوارق جوهرية تجعل مَنار الخيار الأوثق والأنقى معرفياً
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBDD] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#DDF3DF] text-[#4FAF68] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-arabic text-[#1b3823]">أمان شرعي مطلق</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                رقابة شرعية مشددة تمنع توليد الفتاوى دون أدلة، والتزام كامل بقرارات هيئة كبار العلماء ومجامع الفقه المعتمدة.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBDD] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#DDF3DF] text-[#4FAF68] flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-arabic text-[#1b3823]">كاميرا حقيقية مدمجة</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                تقنية التعرف البصري عبر كاميرا المتصفح الحقيقية للتعرف على بوابات الحرمين والآيات الكريمة والإرشاد الفوري للمعتمر.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBDD] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#DDF3DF] text-[#4FAF68] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-arabic text-[#1b3823]">قبلة ومواقيت دقيقة</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                حسابات فلكية معتمدة وفق تقويم أم القرى وطرق الحساب العالمية مع بوصلة قبلة تفاعلية بحساب سمت الكعبة المشرفة.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 8. SECTION 7 & 8: FEEDBACK & RATING (قيّم تجربتك مع مَنار) */}
      <FeedbackSection currentUser={currentUser} />

      {/* 9. SECTION 9: FINAL LOGIN / REGISTER CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-b from-[#EFF8EE] via-[#DDF3DF] to-white border-b border-[#DCEBDD] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto p-1.5 bg-white border border-[#DCEBDD] shadow-md mb-6 flex items-center justify-center">
            <img
              src="/assets/manar-logo.jpeg"
              alt="MANAR Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-arabic text-[#1b3823] mb-4">
            ابدأ رحلتك المباركة مع مَنار الآن
          </h2>
          <p className="text-sm sm:text-base text-slate-700 max-w-xl mx-auto leading-relaxed mb-8">
            سجّل حسابك مجاناً لحفظ أورادك وأدعيتك، وتخطيط رحلة عمرتك أو حجتك، والاستفادة من المساعد الشرعي الذكي ومواقيت الصلاة الدقيقة.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#4FAF68] hover:bg-[#3d9654] text-white font-bold text-base shadow-md transition"
            >
              إنشاء حساب جديد
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-[#EFF8EE] text-[#1b5329] border border-[#B7E58A] font-bold text-base shadow-sm transition"
            >
              تسجيل الدخول للمنصة
            </button>
          </div>
        </div>
      </section>

      {/* 10. FOOTER WITH SAUDI IDENTITY & COMPLETE DIRECTORY */}
      <footer className="bg-white border-t border-[#DCEBDD] pt-14 pb-20 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            
            {/* Col 1: Brand & Saudi Identity */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden p-0.5 bg-white border border-[#DCEBDD] shadow-sm flex items-center justify-center">
                  <img
                    src="/assets/manar-logo.jpeg"
                    alt="MANAR Logo"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="font-bold text-base text-[#1b3823] font-arabic">مَنار | MANAR</div>
                  <div className="text-[10px] text-[#4FAF68] font-semibold">المنصة الإسلامية الرقمية المعتمدة</div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF8EE] text-[#1b5329] text-[11px] font-semibold border border-[#DDF3DF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4FAF68]"></span>
                <span>ابتكار تقني سعودي 🇸🇦 | صُمم وطُوّر في المملكة العربية السعودية</span>
                <span>·</span>
                <span className="font-sans">Made in the Kingdom of Saudi Arabia</span>
              </div>

              <p className="text-slate-600 text-xs leading-relaxed max-w-sm">
                تجمع منصة مَنار بين أصالة المعرفة الشرعية والتقنية الرقمية الحديثة لخدمة المسلمين في شتى بقاع الأرض وتيسير رحلتهم الإيمانية إلى مكة المكرمة والمدينة المنورة.
              </p>
            </div>

            {/* Col 2: Services */}
            <div>
              <h4 className="text-[#1b3823] font-bold mb-3 font-arabic">المعرفة الشرعية</h4>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate('ai')} className="hover:text-[#4FAF68]">اسأل مَنار (AI)</button></li>
                <li><button onClick={() => onNavigate('quran')} className="hover:text-[#4FAF68]">القرآن الكريم والتفاسير</button></li>
                <li><button onClick={() => onNavigate('hadith')} className="hover:text-[#4FAF68]">صحيح البخاري ومسلم</button></li>
                <li><button onClick={() => onNavigate('duas')} className="hover:text-[#4FAF68]">الأذكار والمسبحة</button></li>
                <li><button onClick={() => onNavigate('learn-prayer')} className="hover:text-[#4FAF68]">تعلّم الصلاة والوضوء</button></li>
              </ul>
            </div>

            {/* Col 3: Haramain */}
            <div>
              <h4 className="text-[#1b3823] font-bold mb-3 font-arabic">رحلة الحرمين</h4>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate('umrah')} className="hover:text-[#4FAF68]">دليل العمرة التفاعلي</button></li>
                <li><button onClick={() => onNavigate('hajj')} className="hover:text-[#4FAF68]">دليل الحج يوماً بيوم</button></li>
                <li><button onClick={() => onNavigate('rawdah')} className="hover:text-[#4FAF68]">حجز الروضة الشريفة</button></li>
                <li><button onClick={() => onNavigate('gates')} className="hover:text-[#4FAF68]">أبواب ومداخل الحرمين</button></li>
                <li><button onClick={() => onNavigate('planner')} className="hover:text-[#4FAF68]">مخطط الرحلة وجدول الأيام</button></li>
              </ul>
            </div>

            {/* Col 4: Public Links & Policies */}
            <div>
              <h4 className="text-[#1b3823] font-bold mb-3 font-arabic">عن مَنار والنظام</h4>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate('about')} className="hover:text-[#4FAF68]">عن منصة مَنار</button></li>
                <li><button onClick={() => onNavigate('how-it-works')} className="hover:text-[#4FAF68]">كيف تعمل المنصة</button></li>
                <li><button onClick={() => onNavigate('official-services')} className="hover:text-[#4FAF68]">الخدمات الرسمية ونسك</button></li>
                <li><button onClick={() => onNavigate('help')} className="hover:text-[#4FAF68]">مركز المساعدة والأسئلة</button></li>
                <li><button onClick={() => onNavigate('privacy')} className="hover:text-[#4FAF68]">سياسة الخصوصية</button></li>
                <li><button onClick={() => onNavigate('terms')} className="hover:text-[#4FAF68]">شروط الاستخدام</button></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-[#DCEBDD] flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <div>
              جميع الحقوق محفوظة لمنصة مَنار © {new Date().getFullYear()} · MANAR Islamic Platform
            </div>
            <div className="flex items-center gap-4 text-[#1b5329] font-medium">
              <span>ابتكار تقني سعودي 🇸🇦 | صُمم وطُوّر في المملكة العربية السعودية</span>
              <span>·</span>
              <span>مكة المكرمة · المدينة المنورة</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
