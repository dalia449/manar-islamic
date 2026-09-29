import React, { useState } from 'react';
import { Sparkles, Globe, MapPin, Clock, Bell, Check, Compass, BookOpen } from 'lucide-react';
import { User, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, i18n } from '../services/i18nService';
import { storageService } from '../services/storageService';

interface OnboardingModalProps {
  user: User;
  isOpen: boolean;
  onComplete: (updatedUser: User) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  user,
  isOpen,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState<LanguageCode>(user.language || 'ar');
  const [country, setCountry] = useState(user.country || 'المملكة العربية السعودية');
  const [city, setCity] = useState(user.city || 'مكة المكرمة');
  const [calcMethod, setCalcMethod] = useState(user.preferences?.prayerCalculationMethod || 'UmmAlQura');
  const [asrJuristic, setAsrJuristic] = useState<'standard' | 'hanafi'>(user.preferences?.asrJuristic || 'standard');
  const [notifications, setNotifications] = useState(user.preferences?.notifications ?? true);
  const [hajjUmrahInterest, setHajjUmrahInterest] = useState(true);
  const [learningInterest, setLearningInterest] = useState(true);

  if (!isOpen) return null;

  const handleFinish = () => {
    i18n.setLanguage(language);
    const updated: User = {
      ...user,
      language,
      country,
      city,
      preferences: {
        prayerCalculationMethod: calcMethod,
        asrJuristic,
        notifications,
        hajjUmrahInterest,
        learningInterest,
      }
    };
    storageService.setCurrentUser(updated);
    onComplete(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-emerald-900 border border-[#B7E58A] rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100 overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-12 w-64 h-64 bg-[#EFF8EE] rounded-full blur-3xl pointer-events-none"></div>

        {/* Header with official logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl overflow-hidden p-1 bg-white border border-[#B7E58A] shadow-lg shadow-[#4FAF68]/20 mb-2 flex items-center justify-center">
            <img
              src="/assets/manar-logo.jpeg"
              alt="شعار منار الرسمي"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-xl font-bold font-arabic text-white">
            مرحبًا بك في مَنار · تهيئة تجربتك الشخصية
          </h2>
          <p className="text-xs text-emerald-200/80 mt-1">
            خطوة {step} من 3: تخصيص محتواك الديني ورحلتك
          </p>

          {/* Progress bar */}
          <div className="w-full bg-emerald-950 h-1.5 rounded-full overflow-hidden mt-3">
            <div
              className="bg-[#8BCF70] h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* STEP 1: Language & Location */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#1b5329] flex items-center gap-1.5 mb-2">
                <Globe className="w-4 h-4 text-[#4FAF68]" />
                <span>اختر لغتك المفضلة (Preferred Language)</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLanguage(l.code)}
                    className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-0.5 ${language === l.code ? 'bg-[#4FAF68] text-white font-bold border-[#8BCF70] shadow-md' : 'bg-emerald-950/80 border-emerald-800 text-slate-300 hover:border-[#B7E58A]'}`}
                  >
                    <span className="text-base">{l.flag}</span>
                    <span className="text-xs">{l.nativeName}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#4FAF68]" />
                  <span>دولة الإقامة</span>
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-emerald-700/60 focus:border-[#8BCF70] text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1 mb-1">
                  <Compass className="w-3.5 h-3.5 text-[#4FAF68]" />
                  <span>المدينة</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-emerald-700/60 focus:border-[#8BCF70] text-white text-xs"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 py-2.5 rounded-xl bg-[#4FAF68] hover:bg-[#8BCF70] text-white font-bold text-sm transition flex items-center justify-center gap-1"
            >
              <span>متابعة</span>
            </button>
          </div>
        )}

        {/* STEP 2: Prayer Calculation Methods */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#1b5329] flex items-center gap-1.5 mb-2">
                <Clock className="w-4 h-4 text-[#4FAF68]" />
                <span>طريقة حساب مواقيت الصلاة</span>
              </label>
              <div className="space-y-2">
                {[
                  { id: 'UmmAlQura', name: 'تقويم أم القرى (مكة المكرمة)', desc: 'المعتمد في المملكة العربية السعودية ودول الخليج' },
                  { id: 'Egyptian', name: 'الهيئة المصرية العامة للمساحة', desc: 'مصر، السودان، وبلاد الشام' },
                  { id: 'MWL', name: 'رابطة العالم الإسلامي (MWL)', desc: 'أوروبا، الشرق الأقصى، وأجزاء من أمريكا' },
                  { id: 'ISNA', name: 'الجمعية الإسلامية لأمريكا الشمالية (ISNA)', desc: 'الولايات المتحدة وكندا' },
                  { id: 'Karachi', name: 'جامعة العلوم الإسلامية بكراتشي', desc: 'باكستان، الهند، وأفغانستان' },
                ].map((item) => (
                  <label
                    key={item.id}
                    onClick={() => setCalcMethod(item.id)}
                    className={`block p-2.5 rounded-xl border cursor-pointer transition ${calcMethod === item.id ? 'bg-[#DDF3DF] border-[#8BCF70] text-[#1b5329]' : 'bg-emerald-950/60 border-emerald-800 text-slate-300 hover:border-[#B7E58A]'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs">{item.name}</div>
                      {calcMethod === item.id && <Check className="w-4 h-4 text-[#4FAF68]" />}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">حساب صلاة العصر (المذهب الفقهي):</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAsrJuristic('standard')}
                  className={`p-2 rounded-xl border text-xs text-center transition ${asrJuristic === 'standard' ? 'bg-[#4FAF68] text-white font-bold border-[#8BCF70]' : 'bg-emerald-950 border-emerald-800 text-slate-300'}`}
                >
                  الجمهور (شافعي، حنبلي، مالكي)
                </button>
                <button
                  type="button"
                  onClick={() => setAsrJuristic('hanafi')}
                  className={`p-2 rounded-xl border text-xs text-center transition ${asrJuristic === 'hanafi' ? 'bg-[#4FAF68] text-white font-bold border-[#8BCF70]' : 'bg-emerald-950 border-emerald-800 text-slate-300'}`}
                >
                  المذهب الحنفي (ظل مثلين)
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl bg-emerald-950 text-slate-300 text-xs hover:text-white"
              >
                السابق
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 rounded-xl bg-[#4FAF68] hover:bg-[#8BCF70] text-white font-bold text-sm transition"
              >
                متابعة
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Goals & Interests */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-[#1b5329] block mb-2">
                ما الذي ترغب بالتركيز عليه في رحلتك مع مَنار؟
              </label>

              <label 
                onClick={() => setHajjUmrahInterest(!hajjUmrahInterest)}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${hajjUmrahInterest ? 'bg-[#DDF3DF] border-[#8BCF70]' : 'bg-emerald-950/60 border-emerald-800 opacity-70'}`}
              >
                <input
                  type="checkbox"
                  checked={hajjUmrahInterest}
                  onChange={() => {}}
                  className="rounded accent-[#4FAF68] w-4 h-4 mt-1"
                />
                <div>
                  <div className="font-bold text-xs text-white">إرشاد الحج والعمرة والرحلة إلى مكة والمدينة</div>
                  <div className="text-[11px] text-emerald-200/80">أدلة تفاعلية، خطوات العمرة، حجز الروضة عبر نسك، وأبواب الحرمين</div>
                </div>
              </label>

              <label 
                onClick={() => setLearningInterest(!learningInterest)}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${learningInterest ? 'bg-[#DDF3DF] border-[#8BCF70]' : 'bg-emerald-950/60 border-emerald-800 opacity-70'}`}
              >
                <input
                  type="checkbox"
                  checked={learningInterest}
                  onChange={() => {}}
                  className="rounded accent-[#4FAF68] w-4 h-4 mt-1"
                />
                <div>
                  <div className="font-bold text-xs text-white">التعلّم الإسلامي والقرآن والحديث والأذكار</div>
                  <div className="text-[11px] text-emerald-200/80">تلاوة وسماع القرآن، صحاح الأحاديث، والمسبحة التفاعلية اليومية</div>
                </div>
              </label>

              <label 
                onClick={() => setNotifications(!notifications)}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${notifications ? 'bg-[#DDF3DF] border-[#8BCF70]' : 'bg-emerald-950/60 border-emerald-800 opacity-70'}`}
              >
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => {}}
                  className="rounded accent-[#4FAF68] w-4 h-4 mt-1"
                />
                <div>
                  <div className="font-bold text-xs text-white">تنبيهات مواقيت الصلاة والأذكار</div>
                  <div className="text-[11px] text-emerald-200/80">إشعارات تذكيرية عند دخول وقت الصلاة وأذكار الصباح والمساء</div>
                </div>
              </label>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                onClick={() => setStep(2)}
                className="py-2.5 px-4 rounded-xl bg-emerald-950 text-slate-300 text-xs hover:text-white"
              >
                السابق
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#4FAF68] to-[#3d9654] hover:from-[#3d9654] hover:to-[#4FAF68] text-white font-bold text-sm shadow-xl shadow-[#4FAF68]/20 flex items-center justify-center gap-1.5 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>بدء تجربة مَنار المباركة</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
