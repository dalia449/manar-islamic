import React from 'react';
import { X, ShieldCheck, ExternalLink, BookOpen, CheckCircle } from 'lucide-react';
import { SourceCitation } from '../types';

interface ViewSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: SourceCitation[];
  verseOrHadith?: string;
  uncertaintyNotice?: string;
}

export const ViewSourcesModal: React.FC<ViewSourcesModalProps> = ({
  isOpen,
  onClose,
  sources,
  verseOrHadith,
  uncertaintyNotice,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-emerald-900 border border-[#B7E58A] rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-100 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#4FAF68]" />
            <h3 className="text-base font-bold font-arabic text-white">
              المصادر الشرعية المعتمدة للإجابة (Verified Sources)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-emerald-950/60 hover:bg-emerald-950 text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 py-4 pr-1 text-xs">
          
          {/* Methodology Card */}
          <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-700/60 text-slate-300 leading-relaxed">
            <div className="font-semibold text-[#1b5329] mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>منهجية مَنار الصارمة في الاسترجاع والتوثيق (RAG):</span>
            </div>
            تعتمد منصة مَنار على استرجاع الأدلة حصرًا من المصادر المعتمدة: نصوص القرآن الكريم، وصحاح السنة النبوية، وقرارات مجامع الفقه الإسلامي المعتمدة، دون تأليف فتاوى أو أحكام مستقلة.
          </div>

          {/* Verse or Hadith Citation */}
          {verseOrHadith && (
            <div className="p-3.5 rounded-2xl bg-[#EFF8EE] border border-[#B7E58A] space-y-1">
              <div className="font-bold text-[#1b5329] flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>النص الشرعي المستشهد به:</span>
              </div>
              <p className="text-white font-arabic text-sm leading-relaxed">
                {verseOrHadith}
              </p>
            </div>
          )}

          {/* List of Sources */}
          <div>
            <div className="font-semibold text-slate-200 mb-2">قائمة المراجع المحققة:</div>
            {sources && sources.length > 0 ? (
              <div className="space-y-2">
                {sources.map((src, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white text-xs">{src.title}</div>
                      <div className="text-[#1b5329]/90 text-[11px]">{src.authority}</div>
                      <div className="text-slate-400 text-[10px] font-mono">{src.reference}</div>
                    </div>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-[#4FAF68] transition shrink-0"
                        title="فتح المصدر الأصلي"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 italic">تم الاسترجاع من القاعدة المعتمدة للأحاديث الصحاح والمجامع الفقهية.</div>
            )}
          </div>

          {/* Uncertainty notice */}
          {uncertaintyNotice && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-[#DCEBDD] text-slate-300 text-[11px] leading-relaxed">
              <span className="font-bold text-[#1b5329]">ملاحظة التحقق: </span>
              {uncertaintyNotice}
            </div>
          )}

        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-800 text-slate-200 text-xs font-semibold transition border border-emerald-800 mt-2"
        >
          إغلاق
        </button>

      </div>
    </div>
  );
};
