import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Compass, Bell, BellOff, Volume2, ShieldCheck, RefreshCw, ChevronDown } from 'lucide-react';
import { prayerService, PrayerTimes, CITIES_CATALOG, CityPreset } from '../services/prayerService';
import { storageService } from '../services/storageService';

export const PrayerTimesView: React.FC = () => {
  const currentUser = storageService.getCurrentUser();
  const [selectedCity, setSelectedCity] = useState<CityPreset>(CITIES_CATALOG[0]); // Default Makkah
  const [useGps, setUseGps] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [prayers, setPrayers] = useState<PrayerTimes | null>(null);
  
  // Settings
  const [calcMethod, setCalcMethod] = useState(currentUser?.preferences?.prayerCalculationMethod || 'UmmAlQura');
  const [asrJuristic, setAsrJuristic] = useState<'standard' | 'hanafi'>(currentUser?.preferences?.asrJuristic || 'standard');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Recalculate
  const updateTimes = (lat: number, lng: number) => {
    const calc = prayerService.calculate(lat, lng, new Date(), calcMethod, asrJuristic);
    setPrayers(calc);
  };

  useEffect(() => {
    if (useGps && gpsCoords) {
      updateTimes(gpsCoords.lat, gpsCoords.lng);
    } else {
      updateTimes(selectedCity.lat, selectedCity.lng);
    }
  }, [selectedCity, useGps, gpsCoords, calcMethod, asrJuristic]);

  // Request actual Geolocation permission
  const requestCurrentLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('خاصية تحديد الموقع الجغرافي غير مدعومة في متصفحك.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setUseGps(true);
        updateTimes(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.warn('Geolocation error', err);
        setUseGps(false);
        setLocationError('تم رفض إذن تحديد الموقع. يمكنك اختيار مدينتك يدويًا من القائمة أدناه.');
      }
    );
  };

  const playAdhanTest = () => {
    const adhanAudio = new Audio('https://cdn.islamic.network/adhan/makkah.mp3');
    adhanAudio.play().catch(e => console.warn('Audio autoplay restricted', e));
    alert('جاري تشغيل محاكاة صوت الأذان المبارك من الحرم المكي الشريف.');
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
                <Clock className="w-3.5 h-3.5" />
                <span>تقويم الصلاة الدقيق · مَنار</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-arabic text-white">
                مواقيت الصلاة والأذان
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-2xl">
                حساب فلكي دقيق وفق تقويم أم القرى والمراكز الفلكية المعتمدة مع دعم الموقع الجغرافي
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={requestCurrentLocation}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold transition flex items-center gap-2 ${useGps ? 'bg-[#4FAF68] text-white border-[#8BCF70]' : 'bg-emerald-900 text-slate-200 border-[#B7E58A] hover:bg-emerald-800'}`}
            >
              <Compass className="w-4 h-4" />
              <span>{useGps ? 'الموقع الجغرافي الحالي مفعّل' : 'تحديد موقعي التلقائي (GPS)'}</span>
            </button>

            <button
              onClick={playAdhanTest}
              className="p-2.5 rounded-2xl bg-emerald-950 hover:bg-emerald-800 text-[#4FAF68] border border-[#B7E58A] transition"
              title="تجربة صوت أذان الحرم المكي"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {locationError && (
        <div className="p-3.5 rounded-2xl bg-[#EFF8EE] border border-[#B7E58A] text-[#1b5329] text-xs">
          {locationError}
        </div>
      )}

      {/* Main Countdown & Times Bento */}
      {prayers && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Big Next Prayer Card */}
          <div className="lg:col-span-5 emerald-card rounded-3xl p-8 border-[#B7E58A] flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-emerald-800 text-xs">
                <span className="text-[#1b5329] font-bold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{useGps ? 'موقعي الجغرافي الحالي' : selectedCity.nameArabic}</span>
                </span>
                <span className="text-slate-400">
                  {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>

              <div className="my-8 text-center">
                <span className="text-xs uppercase tracking-widest text-slate-400 block mb-1">الصلاة القادمة</span>
                <h3 className="text-4xl sm:text-5xl font-extrabold font-arabic text-white mb-2">
                  صلاة {prayers.nextPrayer.nameArabic}
                </h3>
                <div className="font-mono text-3xl font-bold text-[#4FAF68]">
                  {prayers.nextPrayer.time}
                </div>

                <div className="mt-5 inline-block px-5 py-2 rounded-2xl bg-emerald-950 border border-[#B7E58A] text-center">
                  <span className="text-[11px] text-slate-400 block">الوقت المتبقي للأذان</span>
                  <span className="font-mono font-bold text-[#1b5329] text-lg">
                    {prayers.nextPrayer.formattedCountdown}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-emerald-800">
              تقويم أم القرى · مكة المكرمة
            </div>
          </div>

          {/* 6 Times Grid & Manual City Picker */}
          <div className="lg:col-span-7 emerald-card rounded-3xl p-6 border-[#4FAF68]/25 flex flex-col justify-between space-y-5">
            
            {/* City Selector */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-emerald-800">
              <label className="text-xs font-semibold text-slate-300">اختر المدينة يدويًا:</label>
              <select
                disabled={useGps}
                value={selectedCity.nameEnglish}
                onChange={(e) => {
                  const found = CITIES_CATALOG.find(c => c.nameEnglish === e.target.value);
                  if (found) setSelectedCity(found);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-700 text-white text-xs focus:border-[#8BCF70] focus:outline-none"
              >
                {CITIES_CATALOG.map((city) => (
                  <option key={city.nameEnglish} value={city.nameEnglish}>
                    {city.nameArabic} ({city.country})
                  </option>
                ))}
              </select>
            </div>

            {/* Prayers List Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: 'الفجر', en: 'Fajr', time: prayers.fajr, desc: 'أذان الفجر الصادق' },
                { name: 'الشروق', en: 'Sunrise', time: prayers.sunrise, desc: 'انتهاء وقت الفجر' },
                { name: 'الظهر', en: 'Dhuhr', time: prayers.dhuhr, desc: 'زوال الشمس' },
                { name: 'العصر', en: 'Asr', time: prayers.asr, desc: 'ظل الشيء مثله' },
                { name: 'المغرب', en: 'Maghrib', time: prayers.maghrib, desc: 'غروب قرص الشمس' },
                { name: 'العشاء', en: 'Isha', time: prayers.isha, desc: 'مغيب الشفق الأحمر' },
              ].map((p) => {
                const isNext = prayers.nextPrayer.nameArabic === p.name;
                return (
                  <div
                    key={p.name}
                    className={`p-4 rounded-2xl border text-center transition ${isNext ? 'bg-[#DDF3DF] border-[#8BCF70] ring-2 ring-[#4FAF68]/40' : 'bg-emerald-950/70 border-emerald-800/80'}`}
                  >
                    <div className="text-xs font-semibold text-slate-200">{p.name}</div>
                    <div className="font-mono text-xl sm:text-2xl font-bold text-white mt-1">{p.time}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{p.desc}</div>
                    {isNext && <span className="inline-block mt-2 text-[10px] text-[#1b5329] font-bold bg-[#DDF3DF] px-2 py-0.5 rounded-full">الصلاة القادمة</span>}
                  </div>
                );
              })}
            </div>

            {/* Settings & Juristic Adjustment */}
            <div className="pt-3 border-t border-emerald-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">طريقة الحساب:</span>
                <select
                  value={calcMethod}
                  onChange={e => setCalcMethod(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-white text-xs"
                >
                  <option value="UmmAlQura">أم القرى (مكة المكرمة)</option>
                  <option value="Egyptian">المساحة المصرية</option>
                  <option value="MWL">رابطة العالم الإسلامي</option>
                  <option value="ISNA">أمريكا الشمالية (ISNA)</option>
                  <option value="Karachi">جامعة كراتشي</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">مذهب العصر:</span>
                <button
                  onClick={() => setAsrJuristic(asrJuristic === 'standard' ? 'hanafi' : 'standard')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-[#1b5329] font-bold"
                >
                  {asrJuristic === 'standard' ? 'الجمهور (ظل مثل)' : 'الحنفي (ظل مثلين)'}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
