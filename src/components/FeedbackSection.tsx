import React, { useState } from 'react';
import { Star, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { storageService } from '../services/storageService';
import { FeedbackCategory, User } from '../types';

interface FeedbackSectionProps {
  currentUser: User | null;
  onSuccessNotice?: () => void;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({ currentUser, onSuccessNotice }) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState<FeedbackCategory>('Overall Experience');
  const [comment, setComment] = useState('');
  const [hasProblem, setHasProblem] = useState(false);
  const [problemDescription, setProblemDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories: FeedbackCategory[] = [
    'Overall Experience',
    'AI Assistant',
    'Quran',
    'Hajj & Umrah',
    'Makkah',
    'Madinah',
    'Prayer',
    'Qibla',
    'Camera AI',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() && rating === 0) return;

    setLoading(true);
    setTimeout(() => {
      storageService.submitFeedback({
        userId: currentUser?.id || 'guest',
        userName: currentUser?.name || 'زائر مَنار',
        userEmail: currentUser?.email || 'visitor@manar.app',
        rating,
        category,
        comment: comment.trim(),
        hasProblem,
        problemDescription: hasProblem ? problemDescription.trim() : undefined,
      });

      setLoading(false);
      setSubmitted(true);
      if (onSuccessNotice) onSuccessNotice();
    }, 350);
  };

  const handleReset = () => {
    setSubmitted(false);
    setComment('');
    setProblemDescription('');
    setHasProblem(false);
    setRating(5);
  };

  return (
    <section className="py-16 bg-[#EFF8EE] border-y border-[#DCEBDD]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF3DF] text-[#1b5329] text-xs font-semibold mb-3 border border-[#B7E58A]">
            <MessageSquare className="w-3.5 h-3.5 text-[#4FAF68]" />
            <span>صوتك أمانة ورأيك يهمنا</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-arabic text-[#1b3823]">
            قيّم تجربتك مع مَنار
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            نحرص على الاستماع لملاحظات قاصدي بيت الله الحرام وطلاب العلم لتطوير المنصة وخدمة المسلمين بأعلى معايير الدقة والوقار.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white rounded-3xl p-8 border border-[#B7E58A] shadow-md text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#DDF3DF] text-[#4FAF68] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold font-arabic text-[#1b3823]">
              جزاكم الله خيراً ونفع بكم!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              تم استلام تقييمكم وملاحظاتكم بنجاح، وستتم مراجعتها من قِبل إدارة منصة مَنار وفريق الرقابة الشرعية لمواصلة تحسين التجربة.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-[#4FAF68] hover:bg-[#3d9654] text-white font-bold text-xs transition shadow-sm"
            >
              إرسال تقييم إضافي
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBDD] shadow-sm space-y-6">
            
            {/* 1. Star Rating */}
            <div className="text-center space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                ما هو تقييمك العام للمنصة؟
              </label>
              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 transition transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        (hoverRating !== null ? hoverRating >= star : rating >= star)
                          ? 'fill-[#4FAF68] text-[#4FAF68]'
                          : 'fill-slate-100 text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-[#1b5329]">
                {rating === 5 ? 'ممتاز ومبارك (5 من 5)' :
                 rating === 4 ? 'جيد جداً (4 من 5)' :
                 rating === 3 ? 'جيد (3 من 5)' :
                 rating === 2 ? 'مقبول (2 من 5)' : 'يحتاج إلى تحسين (1 من 5)'}
              </span>
            </div>

            {/* 2. Category Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                اختر الخدمة أو القسم المراد تقييمه:
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      category === cat
                        ? 'bg-[#4FAF68] text-white shadow-sm'
                        : 'bg-[#FAFCF7] text-slate-700 border border-[#DCEBDD] hover:bg-[#DDF3DF]'
                    }`}
                  >
                    {cat === 'Overall Experience' ? 'التجربة الإجمالية' :
                     cat === 'AI Assistant' ? 'المساعد الشرعي الذكي' :
                     cat === 'Quran' ? 'القرآن والتفاسير' :
                     cat === 'Hajj & Umrah' ? 'الحج والعمرة' :
                     cat === 'Makkah' ? 'دليل مكة المكرمة' :
                     cat === 'Madinah' ? 'دليل المدينة المنورة' :
                     cat === 'Prayer' ? 'مواقيت الصلاة والتعلم' :
                     cat === 'Qibla' ? 'اتجاه القبلة' :
                     cat === 'Camera AI' ? 'كاميرا التعرف المباشر' : 'أخرى'}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Comment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                ملاحظاتك أو اقتراحاتك الكريمة:
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="اكتب انطباعك أو أي اقتراح ترى أنه يخدم ضيوف الرحمن ويثري المحتوى..."
                rows={3}
                required
                className="w-full px-4 py-3 rounded-2xl bg-[#FAFCF7] border border-[#DCEBDD] focus:border-[#4FAF68] focus:bg-white text-xs sm:text-sm text-slate-800 focus:outline-none transition"
              />
            </div>

            {/* 4. Problem Encountered Toggle */}
            <div className="p-4 rounded-2xl bg-[#EFF8EE] border border-[#DDF3DF] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#4FAF68]" />
                  <span className="text-xs font-bold text-slate-800">هل واجهت مشكلة؟</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHasProblem(false)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      !hasProblem ? 'bg-white text-[#1b5329] shadow-sm border border-[#B7E58A]' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    لا، سارت الأمور بسلاسة
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasProblem(true)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      hasProblem ? 'bg-[#4FAF68] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    نعم، واجهت صعوبة
                  </button>
                </div>
              </div>

              {hasProblem && (
                <div className="pt-2 animate-fade-in">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    وصف المشكلة التي واجهتك بالتفصيل:
                  </label>
                  <textarea
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="مثال: تعذر تحديد الموقع، بطء في الاتصال، ملاحظة على دقة معلومة بوابة..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DCEBDD] text-xs text-slate-800 focus:outline-none focus:border-[#4FAF68]"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !comment.trim()}
              className="w-full py-3.5 rounded-2xl bg-[#4FAF68] hover:bg-[#3d9654] disabled:opacity-50 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>جارٍ الإرسال...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>إرسال الملاحظات</span>
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </section>
  );
};
