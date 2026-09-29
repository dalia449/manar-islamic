import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, CheckCircle, Printer, Download, Clock, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { TripPlan, TripActivity, User } from '../types';
import { storageService } from '../services/storageService';

interface TripPlannerViewProps {
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const TripPlannerView: React.FC<TripPlannerViewProps> = ({ currentUser, onOpenAuth }) => {
  const [destination, setDestination] = useState<'makkah' | 'madinah' | 'both'>('both');
  const [startDate, setStartDate] = useState('2026-10-10');
  const [endDate, setEndDate] = useState('2026-10-17');
  const [travelersCount, setTravelersCount] = useState(2);
  const [hotelMakkah, setHotelMakkah] = useState('فندق دار التوحيد إنتركونتيننتال');
  const [hotelMadinah, setHotelMadinah] = useState('فندق دار التقوى المدينة');
  const [rawdahTime, setRawdahTime] = useState('الثلاثاء 09:30 صباحًا (عبر تطبيق نسك)');
  const [notes, setNotes] = useState('تجهيز الإحرام من المطار، وحجز قطار الحرمين مسبقًا.');

  const [activities, setActivities] = useState<TripActivity[]>([
    { id: 'act-1', dayNumber: 1, timeSlot: '14:00', title: 'الوصول إلى مطار الملك عبد العزيز بجدة والتوجه لمكة', description: 'استقلال قطار الحرمين السريع إلى محطة مكة المكرمة (الرصيفة).', completed: true, category: 'transport' },
    { id: 'act-2', dayNumber: 1, timeSlot: '17:30', title: 'تسجيل الدخول في الفندق وصلاة المغرب بالمسجد الحرام', description: 'الراحة والاستعداد لأداء مناسك العمرة في أجواء معتدلة.', completed: true, category: 'rest' },
    { id: 'act-3', dayNumber: 2, timeSlot: '07:00', title: 'أداء مناسك العمرة (الطواف والسعي والتحلل)', description: 'الطواف 7 أشواط، ركعتي الطواف، السعي بين الصفا والمروة 7 أشواط، والحلق/التقصير.', completed: false, category: 'umrah' },
    { id: 'act-4', dayNumber: 3, timeSlot: '09:00', title: 'زيارة مجمع الملك عبد العزيز لكسوة الكعبة المشرفة', description: 'الاطلاع على مراحل حياكة وتطريز ثوب الكعبة المشرفة بأيدي الكفاءات السعودية.', completed: false, category: 'ziyarah' },
    { id: 'act-5', dayNumber: 4, timeSlot: '11:00', title: 'الانطلاق إلى المدينة المنورة عبر قطار الحرمين السريع', description: 'رحلة مريحة وسريعة تستغرق ساعتين و20 دقيقة.', completed: false, category: 'transport' },
    { id: 'act-6', dayNumber: 5, timeSlot: '09:30', title: 'موعد الصلاة في الروضة الشريفة (تصريح نسك)', description: 'الحضور قبل الموعد بـ 15 دقيقة عند البوابة المحددة في التصريح الرسمي.', completed: false, category: 'rawdah' },
    { id: 'act-7', dayNumber: 6, timeSlot: '08:00', title: 'زيارة مسجد قباء ومسجد القبلتين وجبل أحد', description: 'التطهر والصلاة في قباء (أجر عمرة) والسلام على شهداء أحد.', completed: false, category: 'ziyarah' },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newDay, setNewDay] = useState(1);
  const [newTime, setNewTime] = useState('10:00');

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAct: TripActivity = {
      id: 'act_' + Date.now(),
      dayNumber: newDay,
      timeSlot: newTime,
      title: newTitle,
      description: 'نشاط مخصص تمت إضافته إلى جدول رحلتك.',
      completed: false,
      category: 'prayer',
    };

    setActivities(prev => [...prev, newAct].sort((a, b) => a.dayNumber - b.dayNumber));
    setNewTitle('');
  };

  const toggleActivityComplete = (id: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const handleSaveTrip = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    storageService.saveTrip({
      userId: currentUser.id,
      destination,
      startDate,
      endDate,
      travelersCount,
      hotelMakkah,
      hotelMadinah,
      rawdahAppointmentTime: rawdahTime,
      notes,
      activities,
    });

    alert('تم حفظ جدول الرحلة بنجاح في حسابك في مَنار!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in text-slate-100">
      
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
                <Calendar className="w-3.5 h-3.5" />
                <span>تنظيم وإدارة مسار الزيارة والنسك · مَنار</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-arabic text-white">
                مخطط الرحلة الذكي إلى الحرمين الشريفين
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-2xl">
                صمم جدول زيارتك بين مكة المكرمة والمدينة المنورة، ونظم مواعيد العمرة والروضة والصلوات والتنقل
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSaveTrip}
              className="px-5 py-2.5 rounded-2xl bg-[#4FAF68] hover:bg-[#8BCF70] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#4FAF68]/20 flex items-center gap-2 transition"
            >
              <CheckCircle className="w-4 h-4" />
              <span>حفظ في حسابي</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-2xl bg-emerald-950 hover:bg-emerald-900 text-slate-200 border border-emerald-800 text-xs font-semibold flex items-center gap-2 transition"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة وتصدير</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trip Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Destination & Dates */}
        <div className="emerald-card rounded-3xl p-6 border-[#DCEBDD] space-y-4">
          <h3 className="font-bold text-white text-base font-arabic">1. الوجهة والمواعيد</h3>
          
          <div>
            <label className="text-xs text-slate-300 block mb-1.5 font-semibold">الوجهة المستهدفة:</label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {[
                { id: 'both', name: 'مكة والمدينة' },
                { id: 'makkah', name: 'مكة فقط' },
                { id: 'madinah', name: 'المدينة فقط' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDestination(d.id as any)}
                  className={`p-2 rounded-xl border text-center transition font-semibold ${destination === d.id ? 'bg-[#4FAF68] text-white font-bold border-[#8BCF70]' : 'bg-emerald-950 border-emerald-800 text-slate-300'}`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-300 block mb-1">تاريخ الوصول:</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 block mb-1">تاريخ المغادرة:</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">عدد المسافرين (الأفراد / العائلة):</label>
            <input
              type="number"
              min={1}
              value={travelersCount}
              onChange={e => setTravelersCount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-white text-xs"
            />
          </div>
        </div>

        {/* Accommodation & Appointments */}
        <div className="emerald-card rounded-3xl p-6 border-[#DCEBDD] space-y-4">
          <h3 className="font-bold text-white text-base font-arabic">2. السكن والمواعيد الرسمية</h3>

          <div>
            <label className="text-xs text-slate-300 block mb-1">فندق / مقر الإقامة بمكة:</label>
            <input
              type="text"
              value={hotelMakkah}
              onChange={e => setHotelMakkah(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-white text-xs"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">فندق / مقر الإقامة بالمدينة:</label>
            <input
              type="text"
              value={hotelMadinah}
              onChange={e => setHotelMadinah(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-white text-xs"
            />
          </div>

          <div>
            <label className="text-xs text-[#1b5329] block mb-1 font-semibold">موعد تصريح الروضة الشريفة (نسك):</label>
            <input
              type="text"
              value={rawdahTime}
              onChange={e => setRawdahTime(e.target.value)}
              placeholder="مثال: الثلاثاء 09:30 صباحًا"
              className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-[#B7E58A] text-[#1b5329] text-xs"
            />
          </div>
        </div>

        {/* Add Custom Activity Form */}
        <div className="emerald-card rounded-3xl p-6 border-[#DCEBDD] flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base font-arabic mb-3">3. إضافة نشاط مخصص للجدول</h3>
            <form onSubmit={handleAddActivity} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">عنوان النشاط / العبادة:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="مثال: صلاة التراويح / زيارة معرض عمارة الحرمين"
                  className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">اليوم رقم:</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={newDay}
                    onChange={e => setNewDay(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">الوقت المقترح:</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-emerald-950 border border-emerald-800 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة للجدول</span>
              </button>
            </form>
          </div>

          <div className="text-[11px] text-slate-400 pt-3 border-t border-emerald-800">
            يمكنك حفظ جدولك والوصول إليه دون اتصال بالإنترنت في أي وقت.
          </div>
        </div>

      </div>

      {/* Generated Interactive Timeline */}
      <div className="emerald-card rounded-3xl p-6 sm:p-8 border-[#4FAF68]/25 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
          <div>
            <h2 className="text-xl font-bold font-arabic text-white">جدول خطة الرحلة التفاعلي</h2>
            <p className="text-xs text-slate-300 mt-0.5">انقر على المربع لتحديد الأنشطة المنجزة</p>
          </div>
          <span className="text-xs text-[#1b5329] font-mono font-bold bg-[#EFF8EE] px-3 py-1 rounded-full border border-[#B7E58A]">
            {activities.filter(a => a.completed).length} / {activities.length} مكتمل
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {activities.map((act) => (
            <div
              key={act.id}
              className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${act.completed ? 'bg-emerald-950/40 border-emerald-700/60 opacity-80' : 'bg-emerald-950/80 border-emerald-800'}`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => toggleActivityComplete(act.id)}
                  className={`mt-1 transition ${act.completed ? 'text-emerald-400' : 'text-slate-400 hover:text-[#1b5329]'}`}
                >
                  <CheckCircle className="w-5 h-5" />
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#DDF3DF] text-[#1b5329] font-bold font-mono text-[11px]">
                      اليوم {act.dayNumber} · {act.timeSlot}
                    </span>
                    <h4 className={`font-bold font-arabic text-sm sm:text-base ${act.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {act.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDeleteActivity(act.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition shrink-0"
                title="حذف النشاط"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
