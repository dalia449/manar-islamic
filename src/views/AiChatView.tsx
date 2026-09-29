import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Camera, 
  ShieldCheck, 
  BookOpen, 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle, 
  Copy, 
  Check, 
  ChevronDown, 
  Layers,
  HelpCircle,
  Bookmark,
  Info,
  ChevronUp
} from 'lucide-react';
import { AiChatMessage, SourceCitation } from '../types';
import { AiService, AnswerStatusType } from '../services/aiService';
import { ViewSourcesModal } from '../components/ViewSourcesModal';
import { storageService } from '../services/storageService';

interface AiChatViewProps {
  onOpenLiveCamera: () => void;
}

export const AiChatView: React.FC<AiChatViewProps> = ({ onOpenLiveCamera }) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'manar',
      text: 'السلام عليكم ورحمة الله وبركاته. مرحبًا بك في المساعد الشرعي الذكي لمنصة مَنار. أنا مبرمج وفق نموذج "الإجابة أولاً": أقدم الإجابة المباشرة الشافية، ثم التوضيح وبيان العلة، ثم الدليل الصريح من القرآن والسنة، ثم المصادر المعتمدة دون اختراع فتاوى. كيف أستطيع خدمتك اليوم؟',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      answerData: {
        answer: 'مَنار يقدم الإجابة المباشرة أولاً مدعومة بأدلة الوحيين الشريفين ومصادر الشريعة المعتمدة.',
        explanation: 'الهدف تيسير المعلومة الفقهية للمسلم والمعتمر والحاج دون إرباكه بقوائم مصادر مجردة.',
        evidence: 'قال تعالى: {فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ} [النحل: 43].',
        verseOrHadith: 'قال رسول الله ﷺ: "مَن يُرِدِ اللَّهُ به خَيْرًا يُفَقِّهْهُ في الدِّينِ" [صحيح البخاري: 71].',
        sources: [
          { title: 'صحيح البخاري', authority: 'الإمام محمد بن إسماعيل البخاري', reference: 'كتاب العلم، رقم 71', url: 'https://sunnah.com/bukhari:71' },
          { title: 'منهجية مَنار الشرعية', authority: 'الضوابط الفقهية والتقنية', reference: 'الإصدار 1.0', url: 'https://alifta.gov.sa' }
        ]
      }
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatMode, setChatMode] = useState<'quick' | 'detailed' | 'simple' | 'sources_only' | 'compare_views' | 'hajj_umrah'>('quick');
  const [selectedSources, setSelectedSources] = useState<SourceCitation[] | null>(null);
  const [modalVerseOrHadith, setModalVerseOrHadith] = useState<string | undefined>(undefined);
  const [modalUncertainty, setModalUncertainty] = useState<string | undefined>(undefined);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Collapsible state for Evidence & Sources per message
  const [expandedSections, setExpandedSections] = useState<Record<string, { evidence: boolean; sources: boolean }>>({});

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const toggleSection = (msgId: string, section: 'evidence' | 'sources') => {
    setExpandedSections(prev => {
      const current = prev[msgId] || { evidence: true, sources: false };
      return {
        ...prev,
        [msgId]: {
          ...current,
          [section]: !current[section]
        }
      };
    });
  };

  const getStatusBadgeRender = (status?: AnswerStatusType) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DDF3DF] text-[#1b5329] border border-[#B7E58A]">
            <Check className="w-3 h-3 text-[#4FAF68]" />
            <span>موثّق بالمصادر</span>
          </span>
        );
      case 'needs_more_info':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <Info className="w-3 h-3 text-amber-600" />
            <span>بحاجة إلى معلومات إضافية</span>
          </span>
        );
      case 'multiple_views':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            <Layers className="w-3 h-3 text-blue-600" />
            <span>توجد آراء فقهية متعددة</span>
          </span>
        );
      case 'insufficient_evidence':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>لم يتم العثور على دليل كافٍ</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DDF3DF] text-[#1b5329] border border-[#B7E58A]">
            <ShieldCheck className="w-3 h-3 text-[#4FAF68]" />
            <span>موثّق بالمصادر</span>
          </span>
        );
    }
  };

  // Web Speech API Voice Recognition
  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('خاصية التعرف على الصوت غير مدعومة في متصفحك الحالي، يرجى استخدام متصفح كـ Chrome أو Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Voice recognition error', err);
      setIsListening(false);
    }
  };

  const handleSend = async (questionToSend?: string) => {
    const q = (questionToSend || inputText).trim();
    if (!q || loading) return;

    setInputText('');

    const userMsg: AiChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: chatMode,
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await AiService.ask({
        question: q,
        mode: chatMode,
        language: 'ar',
      });

      const manarMsg: AiChatMessage = {
        id: 'msg_manar_' + Date.now(),
        sender: 'manar',
        text: res.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        answerData: res,
      };

      setMessages(prev => [...prev, manarMsg]);
    } catch (err: any) {
      const errorMsg: AiChatMessage = {
        id: 'msg_err_' + Date.now(),
        sender: 'manar',
        text: 'لا يمكنني الجزم بالإجابة من المصادر الموثوقة المتاحة حالياً.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        answerData: {
          answer: 'لا يمكنني الجزم بالإجابة من المصادر الموثوقة المتاحة.',
          explanation: 'السبب: السؤال يتطلب تدقيقاً خاصاً أو فتوى شخصية من هيئة رسمية معتمدة.',
          uncertaintyNotice: 'يمكنك الرجوع إلى جهة إفتاء أو عالم موثوق لهذه المسألة (مثل الرئاسة العامة للبحوث العلمية والإفتاء بالمملكة العربية السعودية).'
        }
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBookmark = (msg: AiChatMessage) => {
    const currentUser = storageService.getCurrentUser();
    if (!currentUser) return;
    storageService.toggleSaveItem({
      userId: currentUser.id,
      type: 'aiAnswer',
      title: msg.answerData?.answer ? msg.answerData.answer.slice(0, 45) + '...' : 'إجابة مَنار الشرعية',
      content: msg.text,
      reference: msg.answerData?.sources?.[0]?.title,
    });
    alert('تم حفظ الإجابة ومصادرها في سجل رحلتي!');
  };

  const openSourcesModal = (msg: AiChatMessage) => {
    if (msg.answerData?.sources) {
      setSelectedSources(msg.answerData.sources);
      setModalVerseOrHadith(msg.answerData.verseOrHadith);
      setModalUncertainty(msg.answerData.uncertaintyNotice);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-140px)] flex flex-col animate-fade-in font-sans text-slate-800">
      
      {/* Header Bar */}
      <div className="bg-white border border-[#DCEBDD] rounded-3xl p-4 shadow-sm mb-4 shrink-0 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden p-0.5 bg-white border border-[#DCEBDD] shadow-sm shrink-0 flex items-center justify-center">
            <img
              src="/assets/manar-logo.jpeg"
              alt="MANAR Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold font-arabic text-[#1b3823]">مساعد مَنار الشرعي الذكي</h1>
              <span className="text-[10px] bg-[#EFF8EE] text-[#1b5329] px-2.5 py-0.5 rounded-full border border-[#B7E58A] font-bold">
                الإجابة أولاً · Answer-First
              </span>
            </div>
            <p className="text-xs text-slate-500">
              إجابة مباشرة شافية أولاً ← ثم التوضيح ← ثم الدليل ← ثم المصادر المعتمدة
            </p>
          </div>
        </div>

        {/* AI Mode Selector */}
        <div className="flex items-center gap-1 text-xs bg-[#EFF8EE] p-1 rounded-2xl border border-[#DDF3DF] overflow-x-auto">
          {[
            { id: 'quick', name: 'إجابة مباشرة' },
            { id: 'detailed', name: 'إجابة مفصلة' },
            { id: 'simple', name: 'شرح ميسر' },
            { id: 'compare_views', name: 'مقارنة المذاهب' },
            { id: 'hajj_umrah', name: 'دليل النسك' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setChatMode(mode.id as any)}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap font-semibold ${chatMode === mode.id ? 'bg-[#4FAF68] text-white shadow-sm' : 'text-slate-600 hover:text-[#1b3823]'}`}
            >
              {mode.name}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Questions Quick Chips */}
      <div className="flex items-center gap-2 pb-3 overflow-x-auto text-xs shrink-0 no-scrollbar">
        <span className="text-[#308346] font-bold whitespace-nowrap flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>أسئلة شائعة:</span>
        </span>
        {[
          'كيف أؤدي العمرة؟',
          'كيف أحجز الروضة؟',
          'هل هذا حلال؟',
          'كيف أصلي؟',
          'وين أقرب بوابة؟',
          'ما الدليل على وجوب الطواف؟',
        ].map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#EFF8EE] text-slate-700 hover:text-[#1b3823] border border-[#DCEBDD] hover:border-[#8BCF70] whitespace-nowrap transition shadow-2xs font-medium"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-sm">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const msgExpandState = expandedSections[msg.id] || { evidence: true, sources: false };

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-10 h-10 rounded-xl overflow-hidden p-0.5 bg-white border border-[#DCEBDD] shadow-sm shrink-0 self-start mt-1 flex items-center justify-center">
                  <img
                    src="/assets/manar-logo.jpeg"
                    alt="MANAR"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-3xl p-5 shadow-sm space-y-4 leading-relaxed ${
                  isUser 
                    ? 'bg-[#4FAF68] text-white font-medium rounded-tr-none' 
                    : 'bg-white border border-[#DCEBDD] text-slate-800 rounded-tl-none'
                }`}
              >
                {/* USER MESSAGE */}
                {isUser && (
                  <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                    {msg.text}
                  </div>
                )}

                {/* MANAR AI RESPONSE STRUCTURED: 1. ANSWER -> 2. EXPLANATION -> 3. EVIDENCE -> 4. SOURCES */}
                {!isUser && msg.answerData && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    
                    {/* Header with status badge */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#EFF8EE]">
                      <span className="font-bold text-xs text-[#1b5329] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#4FAF68]" />
                        <span>رد منصة مَنار الشرعي</span>
                      </span>
                      {getStatusBadgeRender((msg.answerData as any).statusBadge)}
                    </div>

                    {/* 1. DIRECT ANSWER BOX (الإجابة المباشرة - ALWAYS VISIBLE) */}
                    <div className="p-4 rounded-2xl bg-[#EFF8EE] border border-[#B7E58A] space-y-1.5 shadow-2xs">
                      <div className="flex items-center gap-1.5 font-extrabold text-[#1b5329] text-xs uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-[#4FAF68]"></span>
                        <span>الإجابة</span>
                      </div>
                      <div className="text-sm sm:text-base font-bold text-[#1b3823] leading-relaxed whitespace-pre-wrap">
                        {msg.answerData.answer || msg.text}
                      </div>
                    </div>

                    {/* Official booking action card if present */}
                    {(msg.answerData as any).officialServiceLink && (
                      <div className="p-3.5 rounded-2xl bg-white border border-[#4FAF68] shadow-sm flex items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-xs text-[#1b3823]">
                            {(msg.answerData as any).officialServiceLink.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            الخدمة الحكومية الرسمية لإصدار التصاريح والحجوزات
                          </div>
                        </div>
                        <a
                          href={(msg.answerData as any).officialServiceLink.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-xl bg-[#4FAF68] hover:bg-[#3d9654] text-white text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                        >
                          <span>{(msg.answerData as any).officialServiceLink.actionLabel || 'فتح الخدمة الرسمية'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                    {/* 2. SHORT EXPLANATION (التوضيح) */}
                    {msg.answerData.explanation && (
                      <div className="p-3.5 rounded-2xl bg-[#FAFCF7] border border-[#DCEBDD] text-slate-700 space-y-1">
                        <span className="font-bold text-xs text-[#1b5329] block">التوضيح:</span>
                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.answerData.explanation}
                        </p>
                      </div>
                    )}

                    {/* 3. EVIDENCE SECTION (الدليل - Collapsible with clear toggle) */}
                    {(msg.answerData.evidence || msg.answerData.verseOrHadith) && (
                      <div className="rounded-2xl border border-[#DCEBDD] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleSection(msg.id, 'evidence')}
                          className="w-full p-3 bg-[#EFF8EE] hover:bg-[#DDF3DF] transition flex items-center justify-between text-xs font-bold text-[#1b5329]"
                        >
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#4FAF68]" />
                            <span>الدليل من الكتاب والسنة</span>
                          </div>
                          {msgExpandState.evidence ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {msgExpandState.evidence && (
                          <div className="p-3.5 bg-white space-y-2 text-xs leading-relaxed border-t border-[#EFF8EE] animate-fade-in">
                            {msg.answerData.evidence && (
                              <p className="text-slate-700 leading-relaxed font-arabic text-xs sm:text-sm">
                                {msg.answerData.evidence}
                              </p>
                            )}
                            {msg.answerData.verseOrHadith && (
                              <div className="p-2.5 rounded-xl bg-[#FAFCF7] border border-[#B7E58A] font-quran text-sm sm:text-base text-[#1b3823] font-bold leading-relaxed">
                                {msg.answerData.verseOrHadith}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Differing Views (Khilaf) Accordion */}
                    {msg.answerData.differingViews && msg.answerData.differingViews.length > 0 && (
                      <div className="p-3 rounded-2xl bg-[#FAFCF7] border border-[#B7E58A] space-y-2">
                        <span className="font-bold text-xs text-[#1b5329] block">الأقوال والمذاهب الفقهية المعتبرة:</span>
                        <div className="space-y-1.5">
                          {msg.answerData.differingViews.map((v, i) => (
                            <div key={i} className="p-2.5 rounded-xl bg-white border border-[#DCEBDD] text-xs">
                              <span className="font-bold text-[#1b3823]">{v.view} </span>
                              <span className="text-[#308346] font-semibold">({v.proponents}): </span>
                              <span className="text-slate-600 block mt-0.5">{v.evidence}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Uncertainty Notice / Refusal to fabricate */}
                    {msg.answerData.uncertaintyNotice && (
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                        <div>{msg.answerData.uncertaintyNotice}</div>
                      </div>
                    )}

                    {/* 4. SOURCES SECTION (المصادر المعتمدة - Collapsible drawer trigger) */}
                    <div className="pt-2 border-t border-[#EFF8EE] flex flex-wrap items-center justify-between gap-2 text-xs">
                      {msg.answerData.sources && msg.answerData.sources.length > 0 ? (
                        <button
                          onClick={() => openSourcesModal(msg)}
                          className="px-3 py-1.5 rounded-xl bg-[#EFF8EE] hover:bg-[#DDF3DF] text-[#1b5329] font-bold border border-[#B7E58A] flex items-center gap-1.5 transition shadow-2xs"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#4FAF68]" />
                          <span>عرض المصادر المعتمدة ({msg.answerData.sources.length})</span>
                        </button>
                      ) : (
                        <div className="text-[11px] text-slate-400">مستند إلى مصادر الشريعة المعتمدة</div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleBookmark(msg)}
                          className="p-1.5 rounded-lg bg-[#FAFCF7] hover:bg-[#EFF8EE] text-slate-500 hover:text-[#1b5329] border border-[#DCEBDD] transition"
                          title="حفظ في رحلتي"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCopy(msg.id, `${msg.answerData?.answer}\n\n${msg.answerData?.explanation || ''}`)}
                          className="p-1.5 rounded-lg bg-[#FAFCF7] hover:bg-[#EFF8EE] text-slate-500 hover:text-[#1b5329] border border-[#DCEBDD] transition flex items-center gap-1"
                          title="نسخ الإجابة"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-[#4FAF68]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {/* Non-structured Manar message fallback */}
                {!isUser && !msg.answerData && (
                  <div className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                    {msg.text}
                  </div>
                )}

                <div className="text-[10px] text-right text-slate-400 pt-1 font-mono">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden p-0.5 bg-white border border-[#DCEBDD] shadow-sm shrink-0 flex items-center justify-center">
              <img
                src="/assets/manar-logo.jpeg"
                alt="MANAR"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#B7E58A] text-xs text-[#1b5329] flex items-center gap-2 shadow-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-[#4FAF68]" />
              <span>جاري استرجاع الأدلة وصياغة الإجابة المباشرة المعتمدة...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="mt-3 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center bg-white border border-[#DCEBDD] focus-within:border-[#4FAF68] rounded-2xl p-2 shadow-md focus-within:ring-2 focus-within:ring-[#4FAF68]/30 transition"
        >
          {/* Camera Trigger */}
          <button
            type="button"
            onClick={onOpenLiveCamera}
            className="p-2.5 rounded-xl bg-[#EFF8EE] hover:bg-[#DDF3DF] text-[#1b5329] transition shrink-0"
            title="فتح كاميرا مَنار للرؤية الحاسوبية المباشرة"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Voice Input Trigger */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl transition shrink-0 ml-1.5 ${
              isListening 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-[#EFF8EE] hover:bg-[#DDF3DF] text-slate-600 hover:text-[#1b3823]'
            }`}
            title={isListening ? 'إيقاف التسجيل الصوتي' : 'تحدث صوتيًا'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? 'جاري الاستماع لصوتك المبارك...' : 'اسأل مَنار (مثال: كيف أؤدي العمرة؟ كيف أحجز الروضة؟ هل هذا حلال؟)'}
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-2.5 rounded-xl bg-[#4FAF68] hover:bg-[#3d9654] text-white font-bold disabled:opacity-40 transition shadow-sm shrink-0"
          >
            <Send className="w-5 h-5 rotate-180" />
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-500 mt-2">
          منصة مَنار تعتمد مبدأ: <strong>الإجابة أولاً ← ثم التوضيح ← ثم الدليل ← ثم المصادر</strong>.
        </div>
      </div>

      {/* Expandable Sources Modal */}
      {selectedSources && (
        <ViewSourcesModal
          isOpen={Boolean(selectedSources)}
          onClose={() => setSelectedSources(null)}
          sources={selectedSources}
          verseOrHadith={modalVerseOrHadith}
          uncertaintyNotice={modalUncertainty}
        />
      )}

    </div>
  );
};
