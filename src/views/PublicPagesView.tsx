import React from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  MapPin, 
  Sparkles, 
  HelpCircle, 
  Lock, 
  ArrowLeft,
  ExternalLink,
  Award,
  Globe,
  Building
} from 'lucide-react';

interface PublicPagesViewProps {
  pageId: string;
  onNavigate: (view: string) => void;
}

export const PublicPagesView: React.FC<PublicPagesViewProps> = ({ pageId, onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans text-slate-800">
      
      {/* 1. ABOUT MANAR */}
      {pageId === 'about' && (
        <div className="bg-white rounded-3xl p-8 border border-[#DCEBDD] shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden p-1 bg-white border border-[#DCEBDD] shadow-sm shrink-0 flex items-center justify-center">
              <img
                src="/assets/manar-logo.jpeg"
                alt="MANAR Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-arabic text-[#1b3823]">عن منصة مَنار | About MANAR</h1>
              <p className="text-xs text-[#4FAF68] font-semibold">ابتكار تقني سعودي 🇸🇦 | صُمم وطُوّر في المملكة العربية السعودية</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed pt-4 border-t border-[#EFF8EE]">
            <p>
              تأسست <strong>مَنار</strong> لتكون المنارة الرقمية الإسلامية الأولى المعنية بتقديم المحتوى الشرعي الموثوق وإرشاد ضيوف الرحمن في رحلتهم إلى الحرمين الشريفين، بمزيج فريد من وقار الشريعة ودقة التقنية الحديثة.
            </p>
            <div className="p-4 rounded-2xl bg-[#EFF8EE] border border-[#DDF3DF] space-y-2">
              <span className="font-bold text-[#1b5329] text-sm">رسالتنا:</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                تيسير الوصول إلى المعرفة الإسلامية النقية من مصادرها الأصيلة، وتوفير دليل رقمي تفاعلي متكامل للمعتمر والحاج يعينه على أداء مناسكه وفق هدي النبي ﷺ بيسر وطمأنينة.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#EFF8EE] border border-[#DDF3DF] space-y-2">
              <span className="font-bold text-[#1b5329] text-sm">التزامنا الشرعي والتقني:</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                تعتمد المنصة منهج أهل السنة والجماعة وتستقي نصوصها من مجمع الملك فهد لطباعة المصحف الشريف وصحيحي البخاري ومسلم وهيئة كبار العلماء بالمملكة العربية السعودية، وتخلو تماماً من الفتاوى المخترعة أو ادعاء إصدار التصاريح الحكومية.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. HOW IT WORKS */}
      {pageId === 'how-it-works' && (
        <div className="bg-white rounded-3xl p-8 border border-[#DCEBDD] shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-arabic text-[#1b3823]">كيف تعمل منصة مَنار؟</h1>
            <p className="text-xs text-slate-500 mt-2">منهجية دقيقة ثلاثية الطبقات للتحقق الشرعي والملاحة الميدانية</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#EFF8EE]">
            {[
              {
                step: '1',
                title: 'تحديد المسألة أو الحاجة',
                desc: 'سواء كنت تبحث عن حكم فقهي في العمرة، آية قرآنية بتفسيرها، بوابة دخول للمسجد الحرام، أو مواقيت الصلاة الدقيقة.'
              },
              {
                step: '2',
                title: 'الاسترجاع الموجه من المصادر الموثقة',
                desc: 'يبحث المحرك الذكي في قاعدة بيانات النصوص المعتمدة والمحققة (القرآن، التفاسير، صحاح الحديث، وأدلة هيئة شؤون الحرمين).'
              },
              {
                step: '3',
                title: 'الشفافية والتوقف عند غياب الدليل',
                desc: 'تُعرض الإجابة مدعومة بنص الآية أو الحديث أو رقم البوابة، مع توجيه مباشر للمصادر الرسمية ولجان الفتوى المعتمدة.'
              },
            ].map((s) => (
              <div key={s.step} className="p-4 rounded-2xl bg-[#EFF8EE] border border-[#DDF3DF] flex items-start gap-4">
                <span className="w-8 h-8 rounded-xl bg-[#4FAF68] text-white font-bold flex items-center justify-center font-mono shrink-0">
                  {s.step}
                </span>
                <div>
                  <h3 className="font-bold text-sm text-[#1b3823]">{s.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. HELP & FAQ */}
      {pageId === 'help' && (
        <div className="bg-white rounded-3xl p-8 border border-[#DCEBDD] shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-arabic text-[#1b3823]">مركز المساعدة والأسئلة الشائعة</h1>
            <p className="text-xs text-slate-500 mt-1">إجابات واضحة ومباشرة لأبرز استفسارات المستخدمين</p>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#EFF8EE]">
            {[
              {
                q: 'هل تصدر مَنار تصاريح العمرة أو حجز الروضة الشريفة؟',
                a: 'لا، مَنار دليل معرفي وإرشادي موثق، والتصاريح الرسمية تصدر حصرياً من خلال منصة "نُسُك" (Nusuk) الحكومية التابعة لوزارة الحج والعمرة بالمملكة العربية السعودية.'
              },
              {
                q: 'ما مدى دقة إجابات المساعد الشرعي الذكي (اسأل مَنار)؟',
                a: 'تمت برمجة المساعد الشرعي وفق معايير صارمة تلزمه بالاستشهاد بالنصوص القرآنية والأحاديث الصحيحة من مصادرها، ويحظر عليه التكهن أو الفتوى في النوازل المعاصرة.'
              },
              {
                q: 'كيف تحتسب مواقيت الصلاة في مَنار؟',
                a: 'تعتمد مَنار تقويم أم القرى كطريقة أساسية معتمدة بالمملكة العربية السعودية، مع توفير خيارات رابطة العالم الإسلامي والهيئة المصرية والجامعات الإسلامية للمستخدمين حول العالم.'
              },
              {
                q: 'هل تعمل كاميرا التعرف المباشر بدون إنترنت؟',
                a: 'تستخدم الكاميرا واجهات المتصفح المباشرة للتعرف الميداني على المعالم، وتتطلب اتصالاً لتحديث قاعدة بيانات البوابات والآيات.'
              },
            ].map((faq, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#FAFCF7] border border-[#DCEBDD]">
                <div className="font-bold text-[#1b5329] text-sm mb-1">{faq.q}</div>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PRIVACY POLICY */}
      {pageId === 'privacy' && (
        <div className="bg-white rounded-3xl p-8 border border-[#DCEBDD] shadow-sm space-y-4 text-xs leading-relaxed">
          <h1 className="text-2xl font-bold font-arabic text-[#1b3823] mb-2">سياسة الخصوصية وأمان البيانات</h1>
          <p>
            تلتزم منصة مَنار بحماية خصوصية زوارها ومستخدميها بأعلى معايير الشفافية والمسؤولية:
          </p>
          <ul className="list-disc pr-5 space-y-2 text-slate-600">
            <li><strong>بيانات الموقع الجغرافي:</strong> تُستخدم محلياً في جهازك فقط لحساب مواقيت الصلاة واتجاه القبلة، ولا يتم تخزين إحداثياتك أو تتبع حركتك على خوادمنا.</li>
            <li><strong>إذن الكاميرا:</strong> يُطلب فقط عند استخدام ميزة "كاميرا التعرف المباشر"، ولا يتم تسجيل أي بث فيديو سري أو تخزين صور دون إذنك المباشر.</li>
            <li><strong>حساب المستخدم:</strong> لا نقوم بمشاركة بريدك الإلكتروني أو بياناتك الشخصية مع أي أطراف ثالثة أو جهات إعلانية.</li>
            <li><strong>أمان كلمات المرور:</strong> يتم تشفير كلمات المرور بصورة آمنة تمنع حفظها كنصوص صريحة.</li>
          </ul>
        </div>
      )}

      {/* 5. TERMS OF USE */}
      {pageId === 'terms' && (
        <div className="bg-white rounded-3xl p-8 border border-[#DCEBDD] shadow-sm space-y-4 text-xs leading-relaxed">
          <h1 className="text-2xl font-bold font-arabic text-[#1b3823] mb-2">شروط الاستخدام والمسؤولية الشرعية</h1>
          <p>
            باستخدامك لمنصة مَنار، فإنك تقر وتوافق على البنود التالية:
          </p>
          <ul className="list-disc pr-5 space-y-2 text-slate-600">
            <li><strong>الطبيعة التوجيهية:</strong> تقدم المنصة إرشادات علمية وتاريخية وتسهيلات ميدانية، ولا تعد بديلاً عن مجالس الفتوى الرسمية في المسائل الشخصية المعقدة.</li>
            <li><strong>الخدمات الحكومية:</strong> جميع الروابط الرسمية (نُسُك، قطار الحرمين، التأشيرات) تنقلك إلى منصات الدولة الرسمية المستقلة تماماً.</li>
            <li><strong>احترام الوقار الإسلامي:</strong> يحظر استخدام أي من أدوات المنصة أو المساعد الذكي في الاستهزاء بالدين أو التضليل الفقهي.</li>
          </ul>
        </div>
      )}

      {/* Back button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#EFF8EE] hover:bg-[#DDF3DF] text-[#1b5329] border border-[#B7E58A] font-bold text-xs transition"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span>العودة إلى الصفحة الرئيسية</span>
        </button>
      </div>

    </div>
  );
};
