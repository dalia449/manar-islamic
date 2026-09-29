import React, { useState, useEffect } from 'react';
import { Compass, MapPin, RefreshCw, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { QiblaService, QiblaResult } from '../services/qiblaService';

export const QiblaView: React.FC = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 24.7136, lng: 46.6753 }); // Default Riyadh
  const [cityName, setCityName] = useState('الرياض (المملكة العربية السعودية)');
  const [qiblaData, setQiblaData] = useState<QiblaResult | null>(null);
  const [heading, setHeading] = useState<number>(0);
  const [sensorActive, setSensorActive] = useState(false);
  const [sensorError, setSensorError] = useState<string | null>(null);

  // Compute Qibla
  useEffect(() => {
    const res = QiblaService.calculateQibla(coords.lat, coords.lng);
    setQiblaData(res);
  }, [coords]);

  // Request location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('الموقع الجغرافي غير مدعوم في هذا المتصفح.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setCityName('موقعي الجغرافي الحالي');
      },
      (err) => {
        alert('تعذر الوصول لموقعك الجغرافي. تأكد من منح الإذن من إعدادات المتصفح.');
      }
    );
  };

  // Device Orientation Handler for Real Mobile Compass
  const enableCompassSensor = async () => {
    setSensorError(null);
    const granted = await QiblaService.requestOrientationPermission();
    if (!granted) {
      setSensorError('تم رفض إذن مستشعر الاتجاه والبوصلة.');
      return;
    }

    const orientationHandler = (e: DeviceOrientationEvent) => {
      let compassHeading: number | null = null;
      if ((e as any).webkitCompassHeading !== undefined) {
        compassHeading = (e as any).webkitCompassHeading; // iOS Safari
      } else if (e.alpha !== null) {
        compassHeading = 360 - e.alpha; // Android Chrome
      }

      if (compassHeading !== null) {
        setHeading(compassHeading);
        setSensorActive(true);
      }
    };

    window.addEventListener('deviceorientation', orientationHandler, true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in text-slate-100">
      
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-950 to-emerald-900 border border-[#B7E58A] p-6 sm:p-8 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-2xl overflow-hidden p-1 bg-white border border-[#B7E58A] shadow-md mx-auto mb-3 flex items-center justify-center">
          <img
            src="/assets/manar-logo.jpeg"
            alt="MANAR Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF3DF] text-[#1b5329] text-xs font-semibold mb-2 border border-[#B7E58A]">
          <Compass className="w-3.5 h-3.5" />
          <span>تحديد اتجاه الكعبة المشرفة · مَنار</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-arabic text-white">
          بوصلة القبلة الدقيقة
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-xl mx-auto">
          حساب المثلثات الكروية الدقيق لزاوية الكعبة المشرفة والمسافة بالكيلومترات
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            onClick={handleGetLocation}
            className="px-4 py-2 rounded-xl bg-[#4FAF68] hover:bg-[#8BCF70] text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>تحديث موقعي (GPS)</span>
          </button>
          <button
            onClick={enableCompassSensor}
            className="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-[#1b5329] border border-[#B7E58A] font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{sensorActive ? 'مستشعر البوصلة يعمل بنشاط' : 'تفعيل بوصلة الهاتف الحية'}</span>
          </button>
        </div>
      </div>

      {sensorError && (
        <div className="p-3.5 rounded-2xl bg-[#EFF8EE] border border-[#B7E58A] text-[#1b5329] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#4FAF68]" />
          <span>{sensorError}</span>
        </div>
      )}

      {/* Interactive Compass Dial */}
      {qiblaData && (
        <div className="emerald-card rounded-3xl p-8 border-[#B7E58A] flex flex-col items-center justify-center space-y-8">
          
          <div className="text-center space-y-1">
            <div className="text-xs text-slate-400">الموقع المعتمد: {cityName}</div>
            <div className="text-2xl font-bold font-arabic text-white flex items-center justify-center gap-2">
              <span>زاوية القبلة:</span>
              <span className="font-mono text-3xl text-[#4FAF68]">{qiblaData.qiblaBearingDegrees}°</span>
              <span className="text-xs text-slate-400 font-sans">من الشمال الحقيقي</span>
            </div>
            <div className="text-xs text-emerald-200 font-semibold">
              المسافة إلى الكعبة المشرفة بمكة المكرمة: {qiblaData.distanceKm.toLocaleString()} كم
            </div>
          </div>

          {/* Graphical Compass Visualization */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-[#B7E58A] bg-emerald-950/90 shadow-2xl p-4 flex items-center justify-center">
            
            {/* Compass Rose Markings */}
            <div className="absolute top-2 text-xs font-bold text-[#4FAF68] font-mono">N (0°)</div>
            <div className="absolute bottom-2 text-xs font-bold text-slate-400 font-mono">S (180°)</div>
            <div className="absolute right-2 text-xs font-bold text-slate-400 font-mono">E (90°)</div>
            <div className="absolute left-2 text-xs font-bold text-slate-400 font-mono">W (270°)</div>

            {/* Rotating Needle */}
            <div
              className="relative w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
              style={{
                transform: `rotate(${qiblaData.qiblaBearingDegrees - heading}deg)`,
              }}
            >
              {/* Kaaba Pointer Arrow */}
              <div className="absolute top-4 flex flex-col items-center">
                <div className="w-8 h-8 rounded-lg bg-[#4FAF68] text-white font-bold flex items-center justify-center shadow-lg shadow-[#4FAF68]/20 text-xs">
                  🕋
                </div>
                <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-16 border-b-[#4FAF68] -mt-1"></div>
              </div>

              {/* Needle Line */}
              <div className="w-1.5 h-44 bg-gradient-to-t from-emerald-800 via-[#8BCF70] to-[#4FAF68] rounded-full shadow"></div>

              {/* Center Pin */}
              <div className="absolute w-7 h-7 rounded-full bg-gradient-to-tr from-[#4FAF68] to-[#8BCF70] border-2 border-emerald-950 shadow-md"></div>
            </div>

          </div>

          {/* Calibration Instructions */}
          <div className="max-w-md bg-emerald-950/70 p-4 rounded-2xl border border-emerald-800 text-xs text-slate-300 space-y-2 text-right">
            <div className="font-semibold text-[#1b5329] flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#4FAF68]" />
              <span>إرشادات معايرة بوصلة الهاتف:</span>
            </div>
            <p className="leading-relaxed">
              1. حرّك الهاتف في الهواء على شكل رقم 8 لمعايرة الحساس المغناطيسي الداخلي.
            </p>
            <p className="leading-relaxed">
              2. ابتعد عن الأجهزة الإلكترونية والمعادن الكبيرة لضمان دقة القراءة المغناطيسية.
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
