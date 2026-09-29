import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  BookOpen, 
  MapPin, 
  ExternalLink, 
  Sliders, 
  History, 
  Check, 
  X, 
  Edit, 
  Plus, 
  Search, 
  AlertTriangle,
  Lock,
  Sparkles,
  MessageSquare,
  Star,
  CheckCircle2
} from 'lucide-react';
import { storageService, SEED_ACCOUNTS } from '../services/storageService';
import { User, GateInfo, VerifiedSource, OfficialServiceLink, AdminLog, FeedbackItem, UserRole } from '../types';

interface AdminDashboardViewProps {
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ currentUser, onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'feedback' | 'gates' | 'sources' | 'services' | 'safety' | 'users' | 'logs'>('overview');
  
  // Data lists
  const [usersList, setUsersList] = useState<User[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('manar_users') || JSON.stringify(SEED_ACCOUNTS));
    } catch {
      return SEED_ACCOUNTS;
    }
  });

  const [sourcesList, setSourcesList] = useState<VerifiedSource[]>(() => storageService.getSources());
  const [gatesList, setGatesList] = useState<GateInfo[]>(() => storageService.getGates());
  const [servicesList, setServicesList] = useState<OfficialServiceLink[]>(() => storageService.getOfficialServices());
  const [logsList, setLogsList] = useState<AdminLog[]>(() => storageService.getAdminLogs());
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(() => storageService.getFeedback());

  // AI Safety Controls State
  const [requireCitations, setRequireCitations] = useState(true);
  const [prohibitFatwas, setProhibitFatwas] = useState(true);
  const [abstentionThreshold, setAbstentionThreshold] = useState(85);

  // Edit Gate State
  const [editingGate, setEditingGate] = useState<GateInfo | null>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Access Control: ONLY users with role === 'ADMIN' or 'CONTENT_REVIEWER' can access
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'CONTENT_REVIEWER')) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5 font-sans">
        <div className="w-16 h-16 rounded-full bg-[#EFF8EE] text-[#1b5329] flex items-center justify-center mx-auto border border-[#B7E58A]">
          <Lock className="w-8 h-8 text-[#4FAF68]" />
        </div>
        <h2 className="text-2xl font-bold font-arabic text-[#1b3823]">
          منطقة الإدارة والرقابة الشرعية المقيدة
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          هذه الصفحة مخصصة فقط لمدير النظام المعتمد (<strong className="text-[#1b5329]">داليا ال وقيتان</strong>) والمراجعين الشرعيين المخولين. لا يمكن للمستخدم العادي ترقية نفسه.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 rounded-2xl bg-[#4FAF68] hover:bg-[#3d9654] text-white font-bold text-xs shadow-md transition"
        >
          تسجيل الدخول بحساب الإدارة
        </button>
      </div>
    );
  }

  const handleToggleGateOpen = (gate: GateInfo) => {
    const updated: GateInfo = { ...gate, isOpen: !gate.isOpen };
    storageService.updateGate(updated, currentUser.name);
    setGatesList(storageService.getGates());
    setLogsList(storageService.getAdminLogs());
    showNotice(`تم تحديث حالة البوابة رقم ${gate.gateNumber}`);
  };

  const handleSaveGateEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGate) return;
    storageService.updateGate(editingGate, currentUser.name);
    setGatesList(storageService.getGates());
    setLogsList(storageService.getAdminLogs());
    setEditingGate(null);
    showNotice(`تم حفظ تعديلات البوابة: ${editingGate.nameArabic}`);
  };

  const handleToggleSourceVerify = (source: VerifiedSource) => {
    const updated: VerifiedSource = { ...source, isVerified: !source.isVerified };
    storageService.updateSource(updated, currentUser.name);
    setSourcesList(storageService.getSources());
    setLogsList(storageService.getAdminLogs());
    showNotice(`تم تعديل حالة توثيق المصدر: ${source.name}`);
  };

  const handleRoleChange = (targetUserId: string, newRole: UserRole) => {
    const res = storageService.updateUserRole(currentUser, targetUserId, newRole);
    if (res.success) {
      setUsersList(JSON.parse(localStorage.getItem('manar_users') || '[]'));
      setLogsList(storageService.getAdminLogs());
      showNotice(res.message);
    } else {
      alert(res.message);
    }
  };

  const handleMarkFeedbackDone = (id: string) => {
    storageService.markFeedbackReviewed(currentUser, id);
    setFeedbackList(storageService.getFeedback());
    showNotice('تم وضع علامة تمت المراجعة على الملاحظة.');
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-800 font-sans">
      
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EFF8EE] via-white to-[#EFF8EE] border border-[#DCEBDD] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden p-1 bg-white border border-[#DCEBDD] shadow shrink-0 flex items-center justify-center">
              <img
                src="/assets/manar-logo.jpeg"
                alt="MANAR Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF3DF] text-[#1b5329] text-xs font-semibold mb-2 border border-[#B7E58A]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4FAF68]" />
                <span>لوحة التحكم والتدقيق الشرعي المعتمدة</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-arabic text-[#1b3823]">
                إدارة المنصة والرقابة الشرعية
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                إدارة بوابات الحرمين، المصادر الموثقة، مراجعة التقييمات، ومراقبة أمان الذكاء الاصطناعي
              </p>
            </div>
          </div>

          <div className="text-left bg-white p-3 rounded-2xl border border-[#DCEBDD] text-xs shadow-sm">
            <div className="text-slate-500 text-[10px]">المسؤول الحالي:</div>
            <div className="font-bold text-[#1b3823]">{currentUser.name}</div>
            <div className="inline-block mt-1 px-2 py-0.5 rounded bg-[#4FAF68] text-white text-[10px] font-bold">
              {currentUser.role}
            </div>
          </div>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-2xl bg-[#EFF8EE] border border-[#B7E58A] text-[#1b5329] text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#4FAF68]" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#DCEBDD] text-xs font-semibold no-scrollbar">
        {[
          { id: 'overview', name: 'نظرة عامة ومؤشرات' },
          { id: 'feedback', name: `التقييمات والملاحظات (${feedbackList.length})` },
          { id: 'gates', name: 'إدارة بوابات الحرمين' },
          { id: 'sources', name: 'المصادر والمراجع الشرعية' },
          { id: 'services', name: 'روابط الخدمات الرسمية ونسك' },
          { id: 'safety', name: 'ضوابط سلامة الذكاء الاصطناعي' },
          { id: 'users', name: 'المستخدمون والصلاحيات' },
          { id: 'logs', name: 'سجل التدقيق (Audit Logs)' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2.5 rounded-2xl whitespace-nowrap transition font-bold ${
              activeTab === t.id
                ? 'bg-[#4FAF68] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#1b3823] hover:bg-[#EFF8EE]'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'البوابات الموثقة', val: gatesList.length, sub: 'المسجد الحرام والنبوي' },
              { label: 'المراجع المعتمدة', val: sourcesList.length, sub: 'هيئات ومجامع رسمية' },
              { label: 'التقييمات الواردة', val: feedbackList.length, sub: 'آراء المستخدمين' },
              { label: 'سجلات التدقيق', val: logsList.length, sub: 'عمليات النظام الموثقة' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-[#DCEBDD] shadow-sm text-center space-y-1">
                <div className="text-xs text-slate-500">{stat.label}</div>
                <span className="text-3xl font-extrabold text-[#1b5329] font-mono">{stat.val}</span>
                <div className="text-[10px] text-slate-400">{stat.sub}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#DCEBDD] shadow-sm space-y-4">
            <h3 className="font-bold text-[#1b3823] text-sm">أحدث العمليات الإدارية المسجلة</h3>
            <div className="space-y-2">
              {logsList.slice(0, 4).map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-[#FAFCF7] border border-[#DCEBDD] text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#1b5329]">{log.action}: </span>
                    <span className="text-slate-700">{log.targetContent}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString('ar-SA')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. FEEDBACK & RATING REVIEW (SECTION 13) */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-3xl p-6 border border-[#DCEBDD] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#1b3823] text-base">ملاحظات وتقييمات زوار مَنار</h3>
              <p className="text-xs text-slate-500">متابعة تجربة المستخدم وحل المشاكل المبلغ عنها</p>
            </div>
            <span className="text-xs bg-[#EFF8EE] text-[#1b5329] px-3 py-1 rounded-full font-bold">
              إجمالي التقييمات: {feedbackList.length}
            </span>
          </div>

          <div className="space-y-3 mt-4">
            {feedbackList.map((fb) => (
              <div 
                key={fb.id} 
                className={`p-4 rounded-2xl border transition ${
                  fb.hasProblem ? 'bg-red-50/50 border-red-200' : 'bg-[#FAFCF7] border-[#DCEBDD]'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-[#4FAF68]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < fb.rating ? 'fill-[#4FAF68]' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="font-bold text-xs text-[#1b3823]">{fb.userName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({fb.userEmail})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#DCEBDD] font-semibold text-slate-600">
                      {fb.category}
                    </span>
                    {fb.reviewedByAdmin ? (
                      <span className="text-[10px] text-[#1b5329] font-bold bg-[#DDF3DF] px-2 py-0.5 rounded-full">
                        تمت المراجعة ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkFeedbackDone(fb.id)}
                        className="text-[10px] bg-[#4FAF68] hover:bg-[#3d9654] text-white px-2 py-0.5 rounded font-bold"
                      >
                        تحديد كمراجَع
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mb-2">
                  "{fb.comment}"
                </p>

                {fb.hasProblem && fb.problemDescription && (
                  <div className="p-2.5 rounded-xl bg-red-100/60 border border-red-200 text-xs text-red-800">
                    <strong className="block mb-0.5">المشكلة المبلغ عنها:</strong>
                    <span>{fb.problemDescription}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. GATES MANAGEMENT (EDITABLE BY ADMIN) */}
      {activeTab === 'gates' && (
        <div className="bg-white rounded-3xl p-6 border border-[#DCEBDD] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-[#1b3823] text-base">دليل وتحديث بوابات الحرمين الشريفين</h3>
              <p className="text-xs text-slate-500">بيانات الأبواب قابلة للتعديل والتحديث المباشر لحفظ الدقة</p>
            </div>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن بوابة أو رقم..."
                className="w-full pl-3 pr-8 py-2 rounded-xl bg-[#FAFCF7] border border-[#DCEBDD] text-xs focus:outline-none focus:border-[#4FAF68]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
            </div>
          </div>

          {editingGate && (
            <form onSubmit={handleSaveGateEdit} className="p-4 rounded-2xl bg-[#EFF8EE] border border-[#B7E58A] space-y-3 text-xs animate-fade-in">
              <div className="font-bold text-[#1b5329]">تعديل بيانات البوابة: {editingGate.nameArabic}</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">الاسم بالعربية</label>
                  <input
                    type="text"
                    value={editingGate.nameArabic}
                    onChange={(e) => setEditingGate({ ...editingGate, nameArabic: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#DCEBDD]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">رقم البوابة</label>
                  <input
                    type="text"
                    value={editingGate.gateNumber}
                    onChange={(e) => setEditingGate({ ...editingGate, gateNumber: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#DCEBDD]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">الموقع والمحاذاة</label>
                  <input
                    type="text"
                    value={editingGate.locationArea}
                    onChange={(e) => setEditingGate({ ...editingGate, locationArea: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#DCEBDD]"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#4FAF68] text-white font-bold"
                >
                  حفظ التعديلات
                </button>
                <button
                  type="button"
                  onClick={() => setEditingGate(null)}
                  className="px-4 py-2 rounded-xl bg-white text-slate-700 border border-[#DCEBDD]"
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {gatesList
              .filter(g => g.nameArabic.includes(searchQuery) || String(g.gateNumber).includes(searchQuery))
              .map((gate) => (
                <div key={gate.id} className="p-4 rounded-2xl bg-[#FAFCF7] border border-[#DCEBDD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[#EFF8EE] text-[#1b5329] font-bold font-mono text-xs flex items-center justify-center border border-[#B7E58A]">
                        {gate.gateNumber}
                      </span>
                      <span className="font-bold text-[#1b3823] text-sm">{gate.nameArabic}</span>
                      <span className="text-xs text-slate-500 font-sans">({gate.nameEnglish})</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      <span>الموقع: {gate.locationArea}</span> · 
                      <span>المسجد: {gate.mosque === 'haram' ? 'المسجد الحرام' : 'المسجد النبوي'}</span> · 
                      <span>كراسي متحركة: {gate.accessibility.wheelchairRamp ? 'نعم ✓' : 'لا'}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      المصدر: {gate.officialSource} · آخر تدقيق: {gate.lastVerifiedDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleGateOpen(gate)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        gate.isOpen ? 'bg-[#DDF3DF] text-[#1b5329] border border-[#B7E58A]' : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {gate.isOpen ? 'مفتوحة الآن' : 'مغلقة مؤقتاً'}
                    </button>
                    <button
                      onClick={() => setEditingGate(gate)}
                      className="p-2 rounded-xl bg-white border border-[#DCEBDD] text-slate-600 hover:text-[#1b3823]"
                      title="تعديل بيانات البوابة"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. VERIFIED SOURCES */}
      {activeTab === 'sources' && (
        <div className="bg-white rounded-3xl p-6 border border-[#DCEBDD] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#1b3823] text-base">المصادر والمراجع الشرعية المعتمدة</h3>
              <p className="text-xs text-slate-500">معايير مجمع الملك فهد ومجامع وهيئات كبار العلماء</p>
            </div>
          </div>

          <div className="space-y-3">
            {sourcesList.map((src) => (
              <div key={src.id} className="p-4 rounded-2xl bg-[#FAFCF7] border border-[#DCEBDD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-sm text-[#1b3823]">{src.name}</div>
                  <div className="text-xs text-[#308346] font-medium">{src.authority}</div>
                  <p className="text-[11px] text-slate-600 mt-1 max-w-2xl">{src.description}</p>
                </div>
                <button
                  onClick={() => handleToggleSourceVerify(src)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
                    src.isVerified ? 'bg-[#DDF3DF] text-[#1b5329] border border-[#B7E58A]' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {src.isVerified ? 'معتمد وموثق ✓' : 'قيد المراجعة'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. OFFICIAL SERVICES */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-3xl p-6 border border-[#DCEBDD] shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-[#1b3823] text-base">الروابط الحكومية والخدمات الرسمية</h3>
            <p className="text-xs text-slate-500">توجيه مباشر للجهات الرسمية مع التزام تام بإخلاء المسؤولية</p>
          </div>
          <div className="space-y-3">
            {servicesList.map((svc) => (
              <div key={svc.id} className="p-4 rounded-2xl bg-[#FAFCF7] border border-[#DCEBDD] flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-[#1b3823]">{svc.titleArabic}</h4>
                  <div className="text-[11px] text-slate-600">{svc.descriptionArabic}</div>
                  <div className="text-[10px] text-[#308346] mt-1 font-semibold">{svc.disclaimer}</div>
                </div>
                <a
                  href={svc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#DCEBDD] hover:border-[#4FAF68] text-[#1b5329] text-xs font-bold flex items-center gap-1 shrink-0"
                >
                  <span>فتح الرابط الرسمي</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. AI SAFETY CONTROLS */}
      {activeTab === 'safety' && (
        <div className="bg-white rounded-3xl p-6 border border-[#DCEBDD] shadow-sm space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 pb-2 border-b border-[#DCEBDD]">
            <ShieldCheck className="w-5 h-5 text-[#4FAF68]" />
            <h3 className="font-bold text-[#1b3823] text-base">معايير السلامة الشرعية والذكاء الاصطناعي</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EFF8EE] border border-[#DDF3DF]">
              <div>
                <div className="font-bold text-[#1b3823]">إلزامية الاستشهاد بالأدلة والمصادر</div>
                <div className="text-[11px] text-slate-600 mt-0.5">منع أي إجابة لا تتضمن نصاً قرآنياً أو حديثاً معتمداً</div>
              </div>
              <input
                type="checkbox"
                checked={requireCitations}
                onChange={(e) => setRequireCitations(e.target.checked)}
                className="w-4 h-4 rounded text-[#4FAF68] focus:ring-[#4FAF68]"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EFF8EE] border border-[#DDF3DF]">
              <div>
                <div className="font-bold text-[#1b3823]">حظر الإفتاء التلقائي في النوازل المعاصرة</div>
                <div className="text-[11px] text-slate-600 mt-0.5">الإحالة الفورية إلى هيئة كبار العلماء ومجمع الفقه</div>
              </div>
              <input
                type="checkbox"
                checked={prohibitFatwas}
                onChange={(e) => setProhibitFatwas(e.target.checked)}
                className="w-4 h-4 rounded text-[#4FAF68] focus:ring-[#4FAF68]"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#EFF8EE] border border-[#DDF3DF] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#1b3823]">عتبة التوقف عند الشك وعدم التأكد:</span>
                <span className="text-[#1b5329] font-mono font-bold">{abstentionThreshold}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="99"
                value={abstentionThreshold}
                onChange={(e) => setAbstentionThreshold(Number(e.target.value))}
                className="w-full accent-[#4FAF68]"
              />
            </div>

            <button
              onClick={() => showNotice('تم تطبيق معايير السلامة الشرعية للذكاء الاصطناعي بنجاح.')}
              className="w-full py-3 rounded-2xl bg-[#4FAF68] hover:bg-[#3d9654] text-white font-bold shadow-sm transition"
            >
              حفظ وتطبيق الضوابط
            </button>
          </div>
        </div>
      )}

      {/* 7. USERS & PERMISSION CONTROLS (SECTION 11) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-[#DCEBDD] shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-[#1b3823] text-base">إدارة المستخدمين وضبط الصلاحيات (RBAC)</h3>
            <p className="text-xs text-slate-500">
              الصلاحيات مقيدة تماماً؛ لا يمكن للمستخدم العادي ترقية حسابه بنفسه إلا بموافقة إدارية
            </p>
          </div>

          <div className="space-y-3">
            {usersList.map((usr) => (
              <div key={usr.id} className="p-4 rounded-2xl bg-[#FAFCF7] border border-[#DCEBDD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1b3823]">{usr.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({usr.email})</span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    الدولة: {usr.country} · تاريخ التسجيل: {usr.createdAt.split('T')[0]}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">الصلاحية:</span>
                  <select
                    value={usr.role}
                    disabled={usr.email === 'dalia@manar.sa'}
                    onChange={(e) => handleRoleChange(usr.id, e.target.value as UserRole)}
                    className="p-1.5 rounded-xl bg-white border border-[#DCEBDD] text-xs font-bold text-[#1b3823] disabled:opacity-60"
                  >
                    <option value="USER">USER (مستخدم عادي)</option>
                    <option value="CONTENT_REVIEWER">CONTENT_REVIEWER (مراجع شرعي)</option>
                    <option value="ADMIN">ADMIN (مسؤول نظام)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-3xl p-6 border border-[#DCEBDD] shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-[#1b3823] text-base">سجل تدقيق العمليات (Audit Logs)</h3>
            <p className="text-xs text-slate-500">سجل غير قابل للتعديل يوثق جميع التغييرات الإدارية والشرعية</p>
          </div>

          <div className="space-y-2">
            {logsList.map((log) => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-[#FAFCF7] border border-[#DCEBDD] text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1b5329]">{log.adminName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleString('ar-SA')}
                  </span>
                </div>
                <div className="text-slate-800 font-medium">{log.action}: {log.targetContent}</div>
                <div className="text-[11px] text-slate-500">{log.details}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
