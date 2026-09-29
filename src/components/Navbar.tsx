import React, { useState } from 'react';
import { 
  Compass, 
  BookOpen, 
  MapPin, 
  Camera, 
  ShieldCheck, 
  User as UserIcon, 
  Menu, 
  X, 
  Sparkles, 
  Clock, 
  Heart,
  Globe,
  ChevronDown,
  LogOut,
  Sliders,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { User, UserRole, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, i18n } from '../services/i18nService';
import { storageService } from '../services/storageService';

interface NavbarProps {
  currentUser: User | null;
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
  onLanguageChange: (lang: LanguageCode) => void;
  onSwitchDemoAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeView,
  onNavigate,
  onOpenAuth,
  onLogout,
  onLanguageChange,
  onSwitchDemoAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const currentLang = i18n.getLanguage();
  const currentLangInfo = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#DCEBDD] text-slate-800 shadow-sm transition-all font-sans">
      
      {/* Top Utility Announcement Bar with Saudi Identity & Verified Admin Status */}
      <div className="bg-[#EFF8EE] border-b border-[#DDF3DF] text-xs py-1 px-4 sm:px-8 flex justify-between items-center text-[#1b5329]">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#4FAF68] animate-pulse"></span>
          <span className="font-semibold">ابتكار تقني سعودي 🇸🇦 | صُمم وطُوّر في المملكة العربية السعودية</span>
          <span className="hidden md:inline text-slate-300">·</span>
          <span className="hidden md:inline text-slate-600">منصة مَنار الرقمية المعتمدة لعلوم الشريعة والرحلة إلى الحرمين الشريفين</span>
        </div>
        
        {/* Right Status / Authenticated User Display */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white border border-[#B7E58A] text-[#1b5329] font-medium flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4FAF68]"></span>
                <span>{currentUser.name}</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#4FAF68] text-white font-bold uppercase tracking-wider">
                {currentUser.role}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-600 hidden sm:inline">أهلاً بقاصدي بيت الله الحرام</span>
              {/* Demo Admin Quick Login for Testing and Review */}
              <button
                onClick={onSwitchDemoAdmin}
                className="px-2.5 py-0.5 rounded-full bg-white hover:bg-[#DDF3DF] border border-[#B7E58A] text-[#1b5329] font-bold transition flex items-center gap-1 shadow-sm"
                title="الدخول كمسؤول النظام المعتمد: داليا ال وقيتان"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#4FAF68]" />
                <span>دخول داليا ال وقيتان (Demo Admin)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand & Logo (Using the official attached MANAR logo asset) */}
        <div 
          onClick={() => handleNav(currentUser ? 'dashboard' : 'landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          {/* OFFICIAL ATTACHED LOGO ASSET */}
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm border border-[#DCEBDD] p-0.5 group-hover:scale-105 transition shrink-0 flex items-center justify-center">
            <img 
              src="/assets/manar-logo.jpeg" 
              alt="MANAR Logo | شعار منار" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-arabic font-extrabold text-2xl text-[#1b3823] tracking-wide group-hover:text-[#4FAF68] transition">
                مَنار
              </span>
              <span className="text-[#8BCF70] font-light">|</span>
              <span className="font-sans font-bold text-sm tracking-widest text-[#308346]">
                MANAR
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              دليلك الموثوق للإيمان والحرمين
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold">
          <button
            onClick={() => handleNav(currentUser ? 'dashboard' : 'landing')}
            className={`px-3 py-2 rounded-xl transition ${
              activeView === 'landing' || activeView === 'dashboard'
                ? 'bg-[#EFF8EE] text-[#1b5329] font-bold border border-[#B7E58A]'
                : 'text-slate-600 hover:text-[#1b3823] hover:bg-[#FAFCF7]'
            }`}
          >
            {currentUser ? 'لوحة المتابعة' : 'الرئيسية'}
          </button>

          <button
            onClick={() => handleNav('ai')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeView === 'ai'
                ? 'bg-[#4FAF68] text-white font-bold shadow-sm'
                : 'text-slate-600 hover:text-[#1b3823] hover:bg-[#FAFCF7]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8BCF70]" />
            <span>اسأل مَنار (AI)</span>
          </button>

          <button
            onClick={() => handleNav('haramain')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              ['haramain', 'umrah', 'hajj', 'makkah', 'madinah', 'rawdah', 'gates'].includes(activeView)
                ? 'bg-[#EFF8EE] text-[#1b5329] font-bold border border-[#B7E58A]'
                : 'text-slate-600 hover:text-[#1b3823] hover:bg-[#FAFCF7]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#4FAF68]" />
            <span>رحلة الحرمين</span>
          </button>

          <button
            onClick={() => handleNav('quran')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeView === 'quran' || activeView === 'hadith'
                ? 'bg-[#EFF8EE] text-[#1b5329] font-bold border border-[#B7E58A]'
                : 'text-slate-600 hover:text-[#1b3823] hover:bg-[#FAFCF7]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#4FAF68]" />
            <span>القرآن والحديث</span>
          </button>

          <button
            onClick={() => handleNav('duas')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeView === 'duas'
                ? 'bg-[#EFF8EE] text-[#1b5329] font-bold border border-[#B7E58A]'
                : 'text-slate-600 hover:text-[#1b3823] hover:bg-[#FAFCF7]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[#4FAF68]" />
            <span>الأذكار</span>
          </button>

          <button
            onClick={() => handleNav('prayers')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeView === 'prayers'
                ? 'bg-[#EFF8EE] text-[#1b5329] font-bold border border-[#B7E58A]'
                : 'text-slate-600 hover:text-[#1b3823] hover:bg-[#FAFCF7]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#4FAF68]" />
            <span>المواقيت</span>
          </button>

          <button
            onClick={() => handleNav('qibla')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeView === 'qibla'
                ? 'bg-[#EFF8EE] text-[#1b5329] font-bold border border-[#B7E58A]'
                : 'text-slate-600 hover:text-[#1b3823] hover:bg-[#FAFCF7]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#4FAF68]" />
            <span>القبلة</span>
          </button>

          <button
            onClick={() => handleNav('camera')}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              activeView === 'camera'
                ? 'bg-[#EFF8EE] text-[#1b5329] font-bold border border-[#B7E58A]'
                : 'text-slate-600 hover:text-[#1b3823] hover:bg-[#FAFCF7]'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-[#4FAF68]" />
            <span>الكاميرا</span>
          </button>

          {/* Secure Admin Portal Link - Only shown to Authorized ADMIN or CONTENT_REVIEWER */}
          {currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'CONTENT_REVIEWER') && (
            <button
              onClick={() => handleNav('admin')}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 font-bold transition ${
                activeView === 'admin'
                  ? 'bg-[#1b5329] text-white shadow-sm'
                  : 'bg-[#EFF8EE] text-[#1b5329] border border-[#B7E58A] hover:bg-[#DDF3DF]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#4FAF68]" />
              <span>لوحة الإدارة</span>
            </button>
          )}
        </nav>

        {/* Right Action Tools: Language, Auth & Profile */}
        <div className="flex items-center gap-3">
          
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FAFCF7] border border-[#DCEBDD] hover:border-[#8BCF70] text-xs text-slate-700 transition"
              title="تغيير اللغة"
            >
              <Globe className="w-3.5 h-3.5 text-[#4FAF68]" />
              <span className="font-semibold">{currentLangInfo.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-[#DCEBDD] rounded-2xl shadow-xl p-2 z-50 text-xs animate-fade-in">
                <div className="text-[10px] text-slate-400 font-semibold px-2 py-1 border-b border-[#EFF8EE]">
                  اللغات المعتمدة (9 Languages)
                </div>
                <div className="max-h-60 overflow-y-auto mt-1 space-y-1">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-right px-3 py-2 rounded-xl flex items-center justify-between transition ${
                        currentLang === lang.code
                          ? 'bg-[#EFF8EE] text-[#1b5329] font-bold'
                          : 'text-slate-600 hover:bg-[#FAFCF7]'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Login State */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#EFF8EE] hover:bg-[#DDF3DF] border border-[#B7E58A] transition text-xs font-semibold text-[#1b5329]"
              >
                <div className="w-7 h-7 rounded-full bg-[#4FAF68] text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[150px] truncate">{currentUser.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white border border-[#DCEBDD] rounded-2xl shadow-2xl p-2 z-50 text-xs animate-fade-in">
                  <div className="p-2.5 border-b border-[#EFF8EE]">
                    <div className="font-bold text-[#1b3823] text-sm">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFF8EE] text-[#1b5329] font-bold font-mono border border-[#B7E58A]">
                        {currentUser.role}
                      </span>
                      {currentUser.role === 'ADMIN' && (
                        <span className="text-[10px] text-[#308346] font-semibold">
                          مالك المنصة المعتمد
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="py-1 space-y-1">
                    <button
                      onClick={() => handleNav('profile')}
                      className="w-full text-right px-3 py-2 rounded-xl text-slate-700 hover:bg-[#FAFCF7] flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-[#4FAF68]" />
                      <span>الملف الشخصي والملاحظات</span>
                    </button>

                    <button
                      onClick={() => handleNav('planner')}
                      className="w-full text-right px-3 py-2 rounded-xl text-slate-700 hover:bg-[#FAFCF7] flex items-center gap-2"
                    >
                      <Compass className="w-3.5 h-3.5 text-[#4FAF68]" />
                      <span>مخطط رحلة الحرمين</span>
                    </button>

                    {/* Only show Admin Dashboard if authorized */}
                    {(currentUser.role === 'ADMIN' || currentUser.role === 'CONTENT_REVIEWER') && (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full text-right px-3 py-2 rounded-xl text-[#1b5329] bg-[#EFF8EE] hover:bg-[#DDF3DF] font-bold flex items-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#4FAF68]" />
                        <span>لوحة التحكم الإدارية</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-right px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-500" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#EFF8EE] text-[#1b5329] border border-[#B7E58A] font-bold text-xs transition shadow-sm"
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="hidden sm:flex px-4 py-2 rounded-xl bg-[#4FAF68] hover:bg-[#3d9654] text-white font-bold text-xs shadow-sm transition"
              >
                إنشاء حساب
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#FAFCF7] border border-[#DCEBDD] text-slate-700 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#DCEBDD] bg-white px-4 py-4 space-y-2 text-xs font-semibold animate-fade-in shadow-xl">
          <button
            onClick={() => handleNav(currentUser ? 'dashboard' : 'landing')}
            className="w-full text-right p-3 rounded-xl hover:bg-[#EFF8EE] text-slate-800 flex items-center justify-between"
          >
            <span>{currentUser ? 'لوحة المتابعة' : 'الرئيسية'}</span>
          </button>

          <button
            onClick={() => handleNav('ai')}
            className="w-full text-right p-3 rounded-xl bg-[#EFF8EE] text-[#1b5329] flex items-center justify-between font-bold"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4FAF68]" />
              <span>اسأل مَنار (AI)</span>
            </div>
            <span className="text-[10px] bg-[#4FAF68] text-white px-2 py-0.5 rounded">معتمد</span>
          </button>

          <button
            onClick={() => handleNav('haramain')}
            className="w-full text-right p-3 rounded-xl hover:bg-[#EFF8EE] text-slate-800 flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-[#4FAF68]" />
            <span>رحلة الحرمين الشريفين</span>
          </button>

          <button
            onClick={() => handleNav('quran')}
            className="w-full text-right p-3 rounded-xl hover:bg-[#EFF8EE] text-slate-800 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-[#4FAF68]" />
            <span>القرآن والحديث الشريف</span>
          </button>

          <button
            onClick={() => handleNav('duas')}
            className="w-full text-right p-3 rounded-xl hover:bg-[#EFF8EE] text-slate-800 flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-[#4FAF68]" />
            <span>الأدعية والمسبحة</span>
          </button>

          <button
            onClick={() => handleNav('prayers')}
            className="w-full text-right p-3 rounded-xl hover:bg-[#EFF8EE] text-slate-800 flex items-center gap-2"
          >
            <Clock className="w-4 h-4 text-[#4FAF68]" />
            <span>مواقيت الصلاة وتقويم أم القرى</span>
          </button>

          <button
            onClick={() => handleNav('qibla')}
            className="w-full text-right p-3 rounded-xl hover:bg-[#EFF8EE] text-slate-800 flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#4FAF68]" />
            <span>اتجاه القبلة</span>
          </button>

          <button
            onClick={() => handleNav('camera')}
            className="w-full text-right p-3 rounded-xl hover:bg-[#EFF8EE] text-slate-800 flex items-center gap-2"
          >
            <Camera className="w-4 h-4 text-[#4FAF68]" />
            <span>كاميرا التعرف المباشر</span>
          </button>

          {currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'CONTENT_REVIEWER') && (
            <button
              onClick={() => handleNav('admin')}
              className="w-full text-right p-3 rounded-xl bg-[#1b5329] text-white flex items-center gap-2 font-bold"
            >
              <ShieldCheck className="w-4 h-4 text-[#8BCF70]" />
              <span>لوحة الإدارة (مصرح)</span>
            </button>
          )}

          {!currentUser && (
            <div className="pt-3 border-t border-[#DCEBDD] space-y-2">
              <button
                onClick={() => { setMobileMenuOpen(false); if (onSwitchDemoAdmin) onSwitchDemoAdmin(); }}
                className="w-full py-2.5 rounded-xl bg-[#EFF8EE] border border-[#B7E58A] text-[#1b5329] font-bold text-center flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#4FAF68]" />
                <span>دخول داليا ال وقيتان (Demo Admin)</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth('login'); }}
                  className="py-2.5 rounded-xl border border-[#B7E58A] text-[#1b5329] font-bold text-center"
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth('register'); }}
                  className="py-2.5 rounded-xl bg-[#4FAF68] text-white font-bold text-center"
                >
                  إنشاء حساب
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </header>
  );
};
