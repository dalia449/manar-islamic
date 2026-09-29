import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Bookmark, 
  FileText, 
  MapPin, 
  Settings, 
  Trash2, 
  Plus, 
  Save, 
  Compass, 
  LogOut, 
  CheckCircle,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { storageService, SavedItem, UserNote } from '../services/storageService';
import { User, TripPlan } from '../types';

interface ProfileViewProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onNavigate: (view: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onOpenAuth, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'notes' | 'settings'>('saved');

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4 font-sans text-slate-800">
        <div className="w-16 h-16 rounded-full bg-[#EFF8EE] text-[#4FAF68] flex items-center justify-center mx-auto border border-[#B7E58A]">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-arabic text-[#1b3823]">الملف الشخصي والملاحظات</h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          يرجى تسجيل الدخول للوصول إلى أدعيتك المحفوظة، وملاحظاتك الشخصية لرحلة العمرة والحج، وإعدادات حسابك.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 rounded-2xl bg-[#4FAF68] hover:bg-[#3d9654] text-white font-bold text-xs shadow transition"
        >
          تسجيل الدخول إلى مَنار
        </button>
      </div>
    );
  }

  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => storageService.getSavedItems(currentUser.id));
  const [notes, setNotes] = useState<UserNote[]>(() => storageService.getUserNotes(currentUser.id));

  // Note creation form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState<UserNote['category']>('reflection');
  const [showNoteForm, setShowNoteForm] = useState(false);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;
    const added = storageService.saveNote({
      userId: currentUser.id,
      title: noteTitle.trim(),
      content: noteContent.trim(),
      category: noteCategory
    });
    setNotes([added, ...notes]);
    setNoteTitle('');
    setNoteContent('');
    setShowNoteForm(false);
  };

  const handleDeleteNote = (id: string) => {
    storageService.deleteNote(id);
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleRemoveSaved = (item: SavedItem) => {
    storageService.toggleSaveItem({
      userId: currentUser.id,
      type: item.type,
      title: item.title,
      content: item.content
    });
    setSavedItems(storageService.getSavedItems(currentUser.id));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans text-slate-800">
      
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBDD] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-right">
          <div className="w-16 h-16 rounded-full bg-[#4FAF68] text-white font-bold text-2xl flex items-center justify-center shadow">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-bold font-arabic text-[#1b3823]">{currentUser.name}</h1>
              <span className="text-[10px] bg-[#EFF8EE] text-[#1b5329] px-2.5 py-0.5 rounded-full border border-[#B7E58A] uppercase font-mono font-bold">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{currentUser.email}</p>
            <div className="text-[11px] text-slate-600 mt-0.5">
              <span>{currentUser.city}، {currentUser.country}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-center text-xs">
          <div className="px-4 py-2.5 rounded-2xl bg-[#EFF8EE] border border-[#DDF3DF]">
            <div className="text-slate-500">العناصر المحفوظة</div>
            <span className="text-[#1b5329] font-bold font-mono text-base">{savedItems.length}</span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-[#EFF8EE] border border-[#DDF3DF]">
            <div className="text-slate-500">الملاحظات</div>
            <span className="text-[#1b5329] font-bold font-mono text-base">{notes.length}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#DCEBDD] pb-2 text-xs font-semibold">
        {[
          { id: 'saved', label: 'المحفوظات والمفضلة', icon: Bookmark },
          { id: 'notes', label: 'خواطر وملاحظات الحرمين', icon: FileText },
          { id: 'settings', label: 'إعدادات الحساب والمواقيت', icon: Settings },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === t.id
                ? 'bg-[#4FAF68] text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-[#1b3823] hover:bg-[#EFF8EE]'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* 1. SAVED ITEMS */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#DCEBDD] text-slate-500 text-xs">
              <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p>لم تقم بحفظ أي آيات أو أحاديث أو أدعية حتى الآن.</p>
              <button 
                onClick={() => onNavigate('quran')}
                className="mt-3 px-4 py-2 rounded-xl bg-[#EFF8EE] text-[#1b5329] font-bold hover:bg-[#DDF3DF]"
              >
                تصفح القرآن الكريم
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-5 border border-[#DCEBDD] shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFF8EE] text-[#1b5329] font-semibold border border-[#DDF3DF]">
                        {item.type}
                      </span>
                      <button
                        onClick={() => handleRemoveSaved(item)}
                        className="text-slate-400 hover:text-red-500"
                        title="إزالة من المحفوظات"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="font-bold text-sm text-[#1b3823] mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{item.content}</p>
                  </div>
                  {item.reference && (
                    <div className="mt-3 pt-2 border-t border-[#EFF8EE] text-[10px] text-slate-400">
                      المرجع: {item.reference}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#1b3823]">ملاحظاتك الإيمانية والشخصية</h3>
            <button
              onClick={() => setShowNoteForm(!showNoteForm)}
              className="px-3.5 py-1.5 rounded-xl bg-[#4FAF68] hover:bg-[#3d9654] text-white text-xs font-bold flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة ملاحظة</span>
            </button>
          </div>

          {showNoteForm && (
            <form onSubmit={handleAddNote} className="bg-white rounded-2xl p-5 border border-[#B7E58A] shadow-sm space-y-3 text-xs animate-fade-in">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">عنوان الملاحظة</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="مثال: دعاء خاص عند الملتزم أو ترتيب حقيبة الإحرام"
                  className="w-full p-2.5 rounded-xl bg-[#FAFCF7] border border-[#DCEBDD] focus:outline-none focus:border-[#4FAF68]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">نص الملاحظة</label>
                <textarea
                  required
                  rows={3}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="اكتب ما تحب تذكره في الحرم أو أثناء طوافك وسعيك..."
                  className="w-full p-2.5 rounded-xl bg-[#FAFCF7] border border-[#DCEBDD] focus:outline-none focus:border-[#4FAF68]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value as any)}
                  className="p-2 rounded-xl bg-[#FAFCF7] border border-[#DCEBDD] text-xs font-semibold text-[#1b3823]"
                >
                  <option value="reflection">خواطر وتأملات إيمانية</option>
                  <option value="hajj_umrah">مناسك الحج والعمرة</option>
                  <option value="prayer">صلوات وأدعية</option>
                  <option value="general">عام</option>
                </select>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#4FAF68] text-white font-bold"
                  >
                    حفظ
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNoteForm(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {notes.map((n) => (
              <div key={n.id} className="bg-white rounded-2xl p-4 border border-[#DCEBDD] shadow-sm flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#1b3823] text-sm">{n.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFF8EE] text-[#1b5329]">
                      {n.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{n.content}</p>
                  <div className="text-[10px] text-slate-400 mt-2 font-mono">
                    {new Date(n.createdAt).toLocaleDateString('ar-SA')}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteNote(n.id)}
                  className="text-slate-400 hover:text-red-500"
                  title="حذف الملاحظة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 border border-[#DCEBDD] shadow-sm space-y-4 text-xs max-w-xl">
          <h3 className="font-bold text-sm text-[#1b3823]">تفضيلات الحساب والمواقيت</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">طريقة حساب مواقيت الصلاة</label>
              <select
                defaultValue={currentUser.preferences.prayerCalculationMethod}
                className="w-full p-2.5 rounded-xl bg-[#FAFCF7] border border-[#DCEBDD] text-xs font-semibold"
              >
                <option value="UmmAlQura">تقويم أم القرى (المملكة العربية السعودية)</option>
                <option value="MWL">رابطة العالم الإسلامي (Muslim World League)</option>
                <option value="Egyptian">الهيئة المصرية العامة للمساحة</option>
                <option value="Karachi">جامعة العلوم الإسلامية بكراتشي</option>
                <option value="ISNA">الجمعية الإسلامية لأمريكا الشمالية (ISNA)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">المذهب الفقهي لحساب صلاة العصر</label>
              <select
                defaultValue={currentUser.preferences.asrJuristic}
                className="w-full p-2.5 rounded-xl bg-[#FAFCF7] border border-[#DCEBDD] text-xs font-semibold"
              >
                <option value="standard">الجمهور (المالكية والشافعية والحنابلة)</option>
                <option value="hanafi">المذهب الحنفي</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => alert('تم حفظ تفضيلاتك بنجاح.')}
                className="w-full py-2.5 rounded-xl bg-[#4FAF68] hover:bg-[#3d9654] text-white font-bold"
              >
                حفظ التفضيلات
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
