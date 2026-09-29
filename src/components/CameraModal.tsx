import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Sparkles, AlertTriangle, ShieldCheck, Check, Upload, HelpCircle, ChevronDown, ChevronUp, FileText, ExternalLink, Info, Layers, BookOpen } from 'lucide-react';
import { CameraService, ImageAnalysisResult, AnswerStatusType } from '../services/cameraService';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat?: (text: string, imageBase64: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisMode, setAnalysisMode] = useState<'product_food' | 'prayer_education' | 'clothing' | 'general'>('product_food');
  const [customQuestion, setCustomQuestion] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  
  // Collapsible toggle for details & technical OCR
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [showSources, setShowSources] = useState(false);

  const getStatusBadgeRender = (status?: AnswerStatusType) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DDF3DF] text-[#1b5329] border border-[#B7E58A]">
            <Check className="w-3 h-3 text-[#4FAF68]" />
            <span>موثّق بالمصادر</span>
          </span>
        );
      case 'needs_more_info':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <Info className="w-3 h-3 text-amber-600" />
            <span>بحاجة إلى معلومات إضافية</span>
          </span>
        );
      case 'multiple_views':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            <Layers className="w-3 h-3 text-blue-600" />
            <span>توجد آراء فقهية متعددة</span>
          </span>
        );
      case 'insufficient_evidence':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>لم يتم العثور على دليل كافٍ</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DDF3DF] text-[#1b5329] border border-[#B7E58A]">
            <ShieldCheck className="w-3 h-3 text-[#4FAF68]" />
            <span>موثّق بالمصادر</span>
          </span>
        );
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      setAnalysisResult(null);
      setPermissionDenied(false);
      setShowTechnicalDetails(false);
      setShowSources(false);
      startLiveCamera();
    } else {
      CameraService.stopCamera();
      setCameraActive(false);
    }
    return () => {
      CameraService.stopCamera();
    };
  }, [isOpen]);

  const startLiveCamera = async () => {
    if (!videoRef.current) return;
    setPermissionDenied(false);
    const ok = await CameraService.startCamera(videoRef.current);
    if (ok) {
      setCameraActive(true);
    } else {
      setCameraActive(false);
      setPermissionDenied(true);
    }
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const snap = CameraService.captureSnapshot(videoRef.current);
    if (snap) {
      setCapturedImage(snap);
      CameraService.stopCamera();
      setCameraActive(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    startLiveCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setCapturedImage(base64);
        CameraService.stopCamera();
        setCameraActive(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;
    setAnalyzing(true);
    try {
      const res = await CameraService.analyzeImage(capturedImage, analysisMode, customQuestion);
      setAnalysisResult(res);
    } catch (e) {
      console.error('Analysis error', e);
    } finally {
      setAnalyzing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#DCEBDD] shadow-2xl p-5 sm:p-6 text-slate-800 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EFF8EE] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden p-0.5 bg-white border border-[#DCEBDD] shadow-sm shrink-0 flex items-center justify-center">
              <img
                src="/assets/manar-logo.jpeg"
                alt="MANAR Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base font-arabic text-[#1b3823]">كاميرا مَنار للرؤية المباشرة</h3>
                <span className="text-[10px] bg-[#EFF8EE] text-[#1b5329] px-2 py-0.5 rounded-full border border-[#B7E58A] font-bold">
                  Answer-First Vision
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                التقط صورة للمنتج أو اللباس أو هيئة الصلاة للحصول على إجابة واضحة ومباشرة أولاً
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#FAFCF7] hover:bg-[#EFF8EE] text-slate-500 hover:text-slate-800 transition border border-[#DCEBDD]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-xs font-semibold">
          {[
            { id: 'product_food', label: 'المنتجات والأغذية', desc: 'مكونات ومعايير حلال' },
            { id: 'clothing', label: 'اللباس والإحرام', desc: 'ستر العورة وضوابط الإحرام' },
            { id: 'prayer_education', label: 'تعليم الصلاة', desc: 'هيئات الركوع والسجود' },
            { id: 'general', label: 'معالم وملاحة', desc: 'بوابات الحرمين والنصوص' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setAnalysisMode(m.id as any);
                setAnalysisResult(null);
              }}
              className={`p-2.5 rounded-2xl border text-center transition flex flex-col justify-between ${
                analysisMode === m.id
                  ? 'bg-[#EFF8EE] border-[#4FAF68] text-[#1b5329] shadow-2xs font-bold'
                  : 'bg-[#FAFCF7] border-[#DCEBDD] text-slate-600 hover:bg-[#EFF8EE]'
              }`}
            >
              <div className="font-bold">{m.label}</div>
              <div className="text-[10px] opacity-75 font-normal mt-0.5">{m.desc}</div>
            </button>
          ))}
        </div>

        {/* Camera Viewport & Capture */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center border border-[#DCEBDD]">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured Frame"
              className="w-full h-full object-contain"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
              />

              {permissionDenied && (
                <div className="text-center p-6 space-y-3 text-slate-200">
                  <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
                  <div className="font-bold text-sm">تم رفض إذن الكاميرا أو المتصفح غير مدعوم</div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    يرجى السماح بالوصول للكاميرا من إعدادات المتصفح، أو يمكنك اختيار صورة من جهازك.
                  </p>
                  <div className="flex gap-2 justify-center pt-2">
                    <button
                      onClick={startLiveCamera}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-xs font-semibold text-white transition flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>إعادة المحاولة</span>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-[#4FAF68] text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>تحميل صورة من الجهاز</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Viewfinder brackets */}
          {cameraActive && !capturedImage && (
            <div className="absolute inset-4 pointer-events-none border-2 border-[#8BCF70] rounded-xl flex items-center justify-center">
              <span className="text-[11px] bg-slate-900/80 px-3 py-1 rounded-full text-white border border-[#B7E58A]">
                وجّه الكاميرا نحو المنتج أو الحركة المراد فحصها
              </span>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
          <div className="flex items-center gap-2">
            {!capturedImage ? (
              <>
                <button
                  disabled={!cameraActive}
                  onClick={handleCapture}
                  className="px-5 py-2.5 rounded-xl bg-[#4FAF68] hover:bg-[#3d9654] text-white font-bold text-xs flex items-center gap-2 shadow-sm disabled:opacity-50 transition"
                >
                  <Camera className="w-4 h-4" />
                  <span>التقاط الصورة الآن</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2.5 rounded-xl bg-[#FAFCF7] hover:bg-[#EFF8EE] text-slate-700 text-xs flex items-center gap-1.5 border border-[#DCEBDD]"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>تحميل من الاستوديو</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleRetake}
                className="px-4 py-2 rounded-xl bg-[#FAFCF7] hover:bg-[#EFF8EE] text-slate-700 text-xs flex items-center gap-1.5 border border-[#DCEBDD]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>إعادة الالتقاط</span>
              </button>
            )}
          </div>

          {capturedImage && (
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="px-6 py-2.5 rounded-xl bg-[#4FAF68] hover:bg-[#3d9654] text-white font-bold text-xs shadow-md flex items-center gap-2 transition disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري استخلاص الإجابة المباشرة...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>تحليل واستنتاج الإجابة</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Custom optional question input */}
        {capturedImage && (
          <div className="mt-3">
            <input
              type="text"
              value={customQuestion}
              onChange={e => setCustomQuestion(e.target.value)}
              placeholder="اكتب سؤالك بوضوح (مثال: هل هذا حلال؟ هل اللباس ساتر؟ كيف أحسن وضع الظهر؟)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFCF7] border border-[#DCEBDD] focus:border-[#4FAF68] text-slate-800 text-xs focus:outline-none"
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* ANSWER-FIRST RESULT DISPLAY: 1. ANSWER -> 2. EXPLAIN -> 3. EVIDENCE -> 4. SOURCES */}
        {/* ========================================================================= */}
        {analysisResult && (
          <div className="mt-5 p-5 rounded-3xl bg-[#FAFCF7] border border-[#B7E58A] text-xs space-y-4 animate-fade-in shadow-sm">
            
            {/* Top Status */}
            <div className="flex items-center justify-between pb-2 border-b border-[#DCEBDD]">
              <span className="font-bold text-[#1b5329] flex items-center gap-1.5 text-xs">
                <Check className="w-4 h-4 text-[#4FAF68]" />
                <span>رد الكاميرا المعتمد من مَنار:</span>
              </span>
              {getStatusBadgeRender(analysisResult.statusBadge)}
            </div>

            {/* 1. DIRECT ANSWER (الإجابة أولاً - ALWAYS VISIBLE) */}
            <div className="p-4 rounded-2xl bg-[#EFF8EE] border border-[#B7E58A] space-y-1.5">
              <div className="flex items-center gap-1.5 font-extrabold text-[#1b5329] text-xs uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#4FAF68]"></span>
                <span>الإجابة</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-[#1b3823] leading-relaxed">
                {analysisResult.directAnswer}
              </div>
            </div>

            {/* 2. SHORT EXPLANATION (التوضيح وبيان العلة) */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#DCEBDD] text-slate-700 space-y-1">
              <div className="font-bold text-xs text-[#1b5329]">التوضيح:</div>
              <p className="text-xs sm:text-sm leading-relaxed">
                {analysisResult.explanation}
              </p>
            </div>

            {/* 3. EVIDENCE (الدليل الشرعي) */}
            {analysisResult.evidence && (
              <div className="p-3.5 rounded-2xl bg-white border border-[#DCEBDD] space-y-1">
                <div className="font-bold text-xs text-[#1b5329] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#4FAF68]" />
                  <span>الدليل والمعيار المعتمد:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-arabic">
                  {analysisResult.evidence}
                </p>
              </div>
            )}

            {/* Recommended Action */}
            <div className="p-3 rounded-2xl bg-white border border-[#B7E58A] text-[#1b5329] flex items-start gap-2 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#4FAF68] shrink-0 mt-0.5" />
              <div>الإجراء الموصى به: {analysisResult.recommendedAction}</div>
            </div>

            {/* MANDATORY RELIGIOUS SAFETY DISCLAIMER */}
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-2 text-[11px] leading-relaxed">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <div className="font-bold text-amber-800 mb-0.5">ضابط الأمان الشرعي:</div>
                <div>{analysisResult.importantDisclaimer}</div>
              </div>
            </div>

            {/* 4. COLLAPSIBLE TECHNICAL DETAILS (تفاصيل التحليل / OCR) */}
            <div className="pt-2 border-t border-[#DCEBDD]">
              <button
                type="button"
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#EFF8EE] border border-[#DCEBDD] text-slate-600 hover:text-[#1b3823] flex items-center justify-between text-xs font-semibold transition"
              >
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>تفاصيل التحليل والملاحظات البصرية</span>
                </div>
                {showTechnicalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showTechnicalDetails && (
                <div className="mt-2.5 p-3.5 rounded-2xl bg-white border border-[#DCEBDD] space-y-3 text-xs animate-fade-in">
                  {analysisResult.detectedText && (
                    <div>
                      <div className="font-semibold text-slate-500 mb-1">النص المستخرج عبر OCR:</div>
                      <div className="p-2.5 rounded-xl bg-[#FAFCF7] text-slate-700 font-mono text-[11px] leading-relaxed border border-[#DCEBDD]">
                        {analysisResult.detectedText}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="font-semibold text-slate-500 mb-1">الملاحظات المرئية:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {analysisResult.visualObservations.map((obs, idx) => (
                        <li key={idx}>{obs}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* 5. COLLAPSIBLE SOURCES (المصادر المعتمدة) */}
            {analysisResult.sources && analysisResult.sources.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowSources(!showSources)}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#EFF8EE] border border-[#DCEBDD] text-[#1b5329] hover:text-[#1b3823] flex items-center justify-between text-xs font-semibold transition"
                >
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#4FAF68]" />
                    <span>المصادر والمراجع المعتمدة ({analysisResult.sources.length})</span>
                  </div>
                  {showSources ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {showSources && (
                  <div className="mt-2.5 space-y-2 animate-fade-in">
                    {analysisResult.sources.map((src, i) => (
                      <div key={i} className="p-3 rounded-2xl bg-white border border-[#DCEBDD] text-xs flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#1b3823]">{src.title}</div>
                          <div className="text-[11px] text-slate-500">{src.authority} · {src.reference}</div>
                        </div>
                        {src.url && (
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-[#FAFCF7] text-[#1b5329] hover:text-[#4FAF68]"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
