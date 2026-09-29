import React, { useState } from 'react';
import { BookOpen, Check, Volume2, ShieldCheck, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';

interface StepDetail {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  description: string;
  dhikrArabic: string;
  dhikrTranslation: string;
  sunnahTips: string[];
}

export const PrayerLearningView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wudu' | 'prayer'>('prayer');
  const [selectedStepIdx, setSelectedStepIdx] = useState(0);

  const wuduSteps: StepDetail[] = [
    {
      id: 'w-1',
      nameArabic: 'النية والتسمية وغسل الكفين',
      nameEnglish: 'Intention, Bismillah & Washing Hands',
      description: 'استحضار النية بالقلب، وقول "بِسْمِ اللَّهِ"، وغسل الكفين ثلاث مرات وتخليل الأصابع.',
      dhikrArabic: 'بِسْمِ اللَّهِ',
      dhikrTranslation: 'In the name of Allah.',
      sunnahTips: ['النية محلها القلب ولا يتلفظ بها', 'البدء بالتسمية سنة مؤكدة']
    },
    {
      id: 'w-2',
      nameArabic: 'المضمضة والاستنشاق',
      nameEnglish: 'Rinsing Mouth & Snuffing Water into Nose',
      description: 'المضمضة والاستنشاق ثلاث مرات بكف واحدة يملأ بها فمه وأنفه ثم يستنثر بشماله.',
      dhikrArabic: 'لا يوجد ذكر مخصوص للمضمضة، ويُستحب الإسباغ.',
      dhikrTranslation: 'No specific verbal supplication for rinsing.',
      sunnahTips: ['المبالغة لغير الصائم', 'استخدام اليد اليسرى للاستنثار']
    },
    {
      id: 'w-3',
      nameArabic: 'غسل الوجه كاملاً',
      nameEnglish: 'Washing the Entire Face',
      description: 'غسل الوجه ثلاث مرات من منابت شعر الرأس المعتاد إلى أسفل الذقن طولاً، ومن الأذن إلى الأذن عرضاً.',
      dhikrArabic: 'غسل الفرض مع تخليل اللحية الكثة.',
      dhikrTranslation: 'Obligatory facial washing including through a thick beard.',
      sunnahTips: ['التأكد من وصول الماء لكافة جوانب الوجه']
    },
    {
      id: 'w-4',
      nameArabic: 'غسل اليدين إلى المرفقين',
      nameEnglish: 'Washing Arms up to the Elbows',
      description: 'غسل اليد اليمنى من أطراف الأصابع إلى ما بعد المرفق ثلاثاً، ثم اليد اليسرى كذلك.',
      dhikrArabic: 'غسل مسبغ مع إدارة الماء على المرفق.',
      dhikrTranslation: 'Thorough washing including the elbows.',
      sunnahTips: ['البدء باليمين قبل اليسار']
    },
    {
      id: 'w-5',
      nameArabic: 'مسح الرأس والأذنين',
      nameEnglish: 'Wiping Head and Ears',
      description: 'بل الكفين ومسح الرأس من مقدمته إلى قفاه ثم ردهما إلى المقدمة مرة واحدة، ثم مسح باطن الأذنين بالسبابتين وظاهرهما بالإبهامين.',
      dhikrArabic: 'المسح مرة واحدة بماء جديد.',
      dhikrTranslation: 'Wiped once with fresh water.',
      sunnahTips: ['المسح لا يتكرر ثلاثًا بل مرة واحدة بالسنة الصحيحة']
    },
    {
      id: 'w-6',
      nameArabic: 'غسل الرجلين إلى الكعبين',
      nameEnglish: 'Washing Feet up to the Ankles',
      description: 'غسل الرجل اليمنى مع الكعبين ثلاثاً وتخليل أصابع القدمين بالخنصر، ثم الرجل اليسرى.',
      dhikrArabic: 'أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ.',
      dhikrTranslation: 'I bear witness that there is no god but Allah alone, and Muhammad is His slave and Messenger.',
      sunnahTips: ['التحذير من إغفال الأعقاب: "ويل للأعقاب من النار"']
    }
  ];

  const prayerSteps: StepDetail[] = [
    {
      id: 'p-1',
      nameArabic: 'تكبيرة الإحرام والقيام',
      nameEnglish: 'Takbirat al-Ihram & Standing (Qiyam)',
      description: 'استقبال القبلة ورفع اليدين حذو المنكبين أو فروع الأذنين قائلاً: "اللَّهُ أَكْبَرُ"، ثم وضع اليد اليمنى على ظهر اليسرى على الصدر.',
      dhikrArabic: 'اللَّهُ أَكْبَرُ. سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلاَ إِلَهَ غَيْرُكَ.',
      dhikrTranslation: 'Allah is the Greatest. Glory be to You, O Allah, and praise be to You. Blessed is Your name and exalted is Your majesty, and there is no deity besides You.',
      sunnahTips: ['النظر إلى موضع السجود بخشوع', 'عدم الالتفات في الصلاة']
    },
    {
      id: 'p-2',
      nameArabic: 'قراءة سورة الفاتحة وما تيسر',
      nameEnglish: 'Recitation of Surah Al-Fatihah',
      description: 'الاستعاذة بالله والبسملة سراً، ثم تلاوة سورة الفاتحة بترتيل وهدوء؛ فإنها ركن لا تصح الصلاة إلا بها، ثم قراءة سورة أخرى.',
      dhikrArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ · الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ...',
      dhikrTranslation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful... [Al-Fatihah].',
      sunnahTips: ['الوقوف عند رأس كل آية', 'قول "آمين" بعد الفاتحة']
    },
    {
      id: 'p-3',
      nameArabic: 'الركوع والاطمئنان فيه',
      nameEnglish: 'Ruku\' (Bowing with Stillness)',
      description: 'التكبير والنزول للركوع، ووضع الكفين مفرجتي الأصابع على الركبتين، ومساواة الظهر بالرأس دون خفضه أو رفعه والاطمئنان التام.',
      dhikrArabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ (ثلاث مرات). سُبُّوحٌ قُدُّوسٌ رَبُّ الْمَلاَئِكَةِ وَالرُّوحِ.',
      dhikrTranslation: 'Glory is to my Lord, the Magnificent (x3). Perfect and Holy is the Lord of the angels and the Spirit.',
      sunnahTips: ['تسوية الظهر بحيث لو صب عليه الماء لاستقر', 'الاطمئنان ركن أساسي لا تصح الصلاة بدونه']
    },
    {
      id: 'p-4',
      nameArabic: 'الرفع من الركوع والاعتدال',
      nameEnglish: 'Rising from Ruku\' (I\'tidal)',
      description: 'الرفع معتدلاً رافعاً يديه حذو منكبيه قائلاً: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ"، ثم السكون والاطمئنان في القيام.',
      dhikrArabic: 'رَبَّنَا وَلَكَ الْحَمْدُ، حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ، مِلْءَ السَّمَاوَاتِ وَمِلْءَ الأَرْضِ.',
      dhikrTranslation: 'Our Lord, to You is praise - an abundant beautiful blessed praise, filling the heavens and filling the earth.',
      sunnahTips: ['استقرار كل عضو في موضعه قبل النزول للسجود']
    },
    {
      id: 'p-5',
      nameArabic: 'السجود على الأعضاء السبعة',
      nameEnglish: 'Sujud on the Seven Body Parts',
      description: 'النزول للسجود مكبراً، والتمكين التام للأعضاء السبعة: الجبهة مع الأنف، والكفان، والركبتان، وأطراف أصابع القدمين متجهة للقبلة.',
      dhikrArabic: 'سُبْحَانَ رَبِّيَ الأَعْلَى (ثلاث مرات). سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ اللَّهُمَّ اغْفِرْ لِي.',
      dhikrTranslation: 'Glory is to my Lord, the Most High (x3). Glory be to You, O Allah, our Lord, and praise be to You. O Allah, forgive me.',
      sunnahTips: ['أقرب ما يكون العبد من ربه وهو ساجد فأكثروا فيه من الدعاء', 'مباعدة العضدين عن الجنبين للرجل دون افتراش الذراعين كالكلب']
    },
    {
      id: 'p-6',
      nameArabic: 'الجلسة بين السجدتين',
      nameEnglish: 'Sitting between the Two Sujuds',
      description: 'الرفع من السجود مكبراً والجلوس مفترشاً رجله اليسرى وناصباً اليمنى، ووضع الكفين على الفخذين.',
      dhikrArabic: 'رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي، اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَاجْبُرْنِي وَعَافِنِي وَارْزُقْنِي.',
      dhikrTranslation: 'Lord forgive me, Lord forgive me. O Allah, forgive me, have mercy on me, guide me, mend me, grant me well-being and provide for me.',
      sunnahTips: ['السكون حتى يرجع كل عظم إلى مكانه']
    },
    {
      id: 'p-7',
      nameArabic: 'التشهد والإشارة بالسبابة',
      nameEnglish: 'Tashahhud with Index Finger Pointing',
      description: 'الجلوس للتشهد، ووضع اليد اليمنى مقبوضة مع الإشارة بالسبابة نحو القبلة واليسرى مبسوطة، وتلاوة التحيات والصلاة الإبراهيمية.',
      dhikrArabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلاَمُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ... اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ...',
      dhikrTranslation: 'All compliments, prayers and pure words are due to Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings...',
      sunnahTips: ['تحريك السبابة أو الإشارة بها عند التوحيد والدعاء', 'التعوذ من عذاب القبر وعذاب جهنم وفتنة المحيا والممات والمسيح الدجال']
    },
    {
      id: 'p-8',
      nameArabic: 'التسليم وإنهاء الصلاة',
      nameEnglish: 'Tasleem (Concluding the Prayer)',
      description: 'الالتفات يميناً حتى يُرى بياض الخد قائلاً: "السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ"، ثم الالتفات يساراً كذلك.',
      dhikrArabic: 'السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ (يميناً ويساراً).',
      dhikrTranslation: 'Peace and the mercy of Allah be upon you.',
      sunnahTips: ['التسليمة الأولى ركن يخرج بها من الصلاة']
    }
  ];

  const currentSteps = activeTab === 'wudu' ? wuduSteps : prayerSteps;
  const currentStep = currentSteps[selectedStepIdx] || currentSteps[0];

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
                <BookOpen className="w-3.5 h-3.5" />
                <span>صفة صلاة النبي ﷺ والوضوء الشرعي · مَنار</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-arabic text-white">
                تعلّم الصلاة والوضوء بالخطوات المرئية
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-2xl">
                "صَلُّوا كَمَا رَأَيْتُمُونِي أُصَلِّي" (صحيح البخاري) · دليل تعليمي مرئي مفصل لكل حركة وذكر
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => { setActiveTab('prayer'); setSelectedStepIdx(0); }}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition ${activeTab === 'prayer' ? 'bg-[#4FAF68] text-white shadow-lg' : 'bg-emerald-900 text-slate-300 hover:text-white'}`}
            >
              صفة الصلاة (8 مراحل)
            </button>
            <button
              onClick={() => { setActiveTab('wudu'); setSelectedStepIdx(0); }}
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition ${activeTab === 'wudu' ? 'bg-[#4FAF68] text-white shadow-lg' : 'bg-emerald-900 text-slate-300 hover:text-white'}`}
            >
              صفة الوضوء (6 خطوات)
            </button>
          </div>
        </div>
      </div>

      {/* Main Educational Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Steps List */}
        <div className="lg:col-span-4 emerald-card rounded-3xl p-5 border-[#4FAF68]/25 h-[640px] flex flex-col">
          <div className="font-bold text-white text-xs mb-3 px-1">
            {activeTab === 'prayer' ? 'مراحل الصلاة بالترتيب:' : 'خطوات الوضوء المسنونة:'}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {currentSteps.map((step, idx) => {
              const isSelected = selectedStepIdx === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => setSelectedStepIdx(idx)}
                  className={`w-full text-right p-3 rounded-2xl border transition flex items-center justify-between ${isSelected ? 'bg-[#4FAF68] text-white font-bold border-[#8BCF70] shadow-md' : 'bg-emerald-950/60 border-emerald-800 text-slate-300 hover:bg-emerald-900'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center font-mono ${isSelected ? 'bg-emerald-950 text-[#1b5329]' : 'bg-emerald-900 text-[#4FAF68]'}`}>
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-xs">{step.nameArabic}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>{step.nameEnglish}</div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Step Detail View */}
        <div className="lg:col-span-8 emerald-card rounded-3xl p-6 sm:p-8 border-[#4FAF68]/25 h-[640px] flex flex-col justify-between space-y-4">
          
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-[#DDF3DF] text-[#1b5329] font-bold text-lg flex items-center justify-center border border-[#B7E58A] font-mono">
                  {selectedStepIdx + 1}
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-arabic text-white">
                    {currentStep.nameArabic}
                  </h2>
                  <div className="text-xs text-slate-400">{currentStep.nameEnglish}</div>
                </div>
              </div>

              <span className="text-xs bg-emerald-950 px-3 py-1 rounded-full border border-[#B7E58A] text-[#1b5329] font-semibold">
                هيئة مسنونة ومحققة
              </span>
            </div>

            {/* Description */}
            <div className="my-5 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
              <span className="font-bold text-[#1b5329] block mb-1">الكيفية والصفة:</span>
              {currentStep.description}
            </div>

            {/* Dhikr recitation box */}
            <div className="my-5 p-5 rounded-2xl bg-[#EFF8EE] border border-[#B7E58A] space-y-2">
              <span className="font-bold text-[#1b5329] text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>الذكر والتسبيح المشروع:</span>
              </span>
              <p className="font-quran text-xl sm:text-2xl text-right leading-loose text-white py-1">
                "{currentStep.dhikrArabic}"
              </p>
              <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1 border-t border-emerald-800">
                {currentStep.dhikrTranslation}
              </p>
            </div>

            {/* Sunnah Tips */}
            <div className="bg-emerald-950/50 p-4 rounded-2xl border border-emerald-800 text-xs space-y-1.5">
              <span className="font-bold text-[#1b5329] block">سنن وآداب مستحبة:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {currentStep.sunnahTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="pt-4 border-t border-emerald-800 flex items-center justify-between">
            <button
              disabled={selectedStepIdx === 0}
              onClick={() => setSelectedStepIdx(prev => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-slate-300 text-xs font-semibold disabled:opacity-40 transition"
            >
              المرحلة السابقة
            </button>

            <button
              disabled={selectedStepIdx === currentSteps.length - 1}
              onClick={() => setSelectedStepIdx(prev => Math.min(currentSteps.length - 1, prev + 1))}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4FAF68] to-[#3d9654] hover:from-[#3d9654] text-white font-bold text-xs disabled:opacity-40 transition shadow"
            >
              المرحلة التالية
            </button>
          </div>

        </div>

      </div>

      {/* MANDATORY RELIGIOUS SAFETY NOTICE */}
      <div className="p-4 rounded-2xl bg-emerald-950 border border-[#B7E58A] text-xs text-slate-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#4FAF68] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#1b5329] block mb-0.5">ضابط شرعي حاسم في تطبيق مَنار:</span>
          تلتزم منصة مَنار بتعليم صفة الصلاة النبوية للأغراض الإرشادية والتثقيفية فقط. لا تقضي المنصة تلقائيًا بصحة صلاة المستخدم أو بطلانها، فالحكم على العبادات يرجع للقواعد الشرعية المستقرة وفتوى أهل العلم.
        </div>
      </div>

    </div>
  );
};
