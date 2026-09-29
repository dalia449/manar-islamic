import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { SplashScreen } from './components/SplashScreen';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { CameraModal } from './components/CameraModal';

// Views
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { AiChatView } from './views/AiChatView';
import { HaramainJourneyView } from './views/HaramainJourneyView';
import { QuranView } from './views/QuranView';
import { DuasView } from './views/DuasView';
import { PrayerTimesView } from './views/PrayerTimesView';
import { QiblaView } from './views/QiblaView';
import { PrayerLearningView } from './views/PrayerLearningView';
import { TripPlannerView } from './views/TripPlannerView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { ProfileView } from './views/ProfileView';
import { PublicPagesView } from './views/PublicPagesView';

import { storageService, SEED_ACCOUNTS } from './services/storageService';
import { i18n } from './services/i18nService';
import { User, LanguageCode } from './types';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeView, setActiveView] = useState('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);

  useEffect(() => {
    const user = storageService.getCurrentUser();
    setCurrentUser(user);
    if (user?.language) {
      i18n.setLanguage(user.language);
    }
  }, []);

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: User, isNewUser?: boolean) => {
    setCurrentUser(user);
    if (isNewUser) {
      setOnboardingOpen(true);
    } else {
      if (user.role === 'ADMIN' || user.role === 'CONTENT_REVIEWER') {
        setActiveView('admin');
      } else {
        setActiveView('dashboard');
      }
    }
  };

  const handleLogout = () => {
    storageService.logout();
    setCurrentUser(null);
    setActiveView('landing');
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    i18n.setLanguage(lang);
    if (currentUser) {
      const updated = { ...currentUser, language: lang };
      storageService.setCurrentUser(updated);
      setCurrentUser(updated);
    }
  };

  // Instant login for owner admin: Dalia Al-Waqitan
  const handleSwitchDemoAdmin = () => {
    const admin = storageService.loginDemoAdmin();
    setCurrentUser(admin);
    setActiveView('admin');
  };

  return (
    <div className="min-h-screen bg-[#FAFCF7] text-slate-800 flex flex-col font-sans selection:bg-[#B7E58A] selection:text-[#1b3823]">
      
      {/* 1. SPLASH SCREEN WITH OFFICIAL LOGO & CLEAN FRESH GREEN MOTIF */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* 2. TOP HEADER NAVBAR */}
      <Navbar
        currentUser={currentUser}
        activeView={activeView}
        onNavigate={(view) => {
          if (view === 'camera') {
            setCameraModalOpen(true);
          } else {
            setActiveView(view);
          }
        }}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onLanguageChange={handleLanguageChange}
        onSwitchDemoAdmin={handleSwitchDemoAdmin}
      />

      {/* 3. MAIN ROUTED VIEW CONTENT */}
      <main className="flex-1 pb-20 lg:pb-8">
        {activeView === 'landing' && (
          <LandingView
            currentUser={currentUser}
            onNavigate={(v) => {
              if (v === 'camera') setCameraModalOpen(true);
              else setActiveView(v);
            }}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {activeView === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            onNavigate={(v) => {
              if (v === 'camera') setCameraModalOpen(true);
              else setActiveView(v);
            }}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}

        {activeView === 'ai' && (
          <AiChatView
            onOpenLiveCamera={() => setCameraModalOpen(true)}
          />
        )}

        {(activeView === 'haramain' || activeView === 'umrah' || activeView === 'hajj' || activeView === 'makkah' || activeView === 'madinah' || activeView === 'rawdah' || activeView === 'gates' || activeView === 'official-services') && (
          <HaramainJourneyView
            currentUser={currentUser}
            onNavigate={(v) => setActiveView(v)}
            initialTab={
              activeView === 'umrah' ? 'umrah' :
              activeView === 'hajj' ? 'hajj' :
              activeView === 'makkah' ? 'makkah' :
              activeView === 'madinah' ? 'madinah' :
              activeView === 'rawdah' ? 'rawdah' :
              activeView === 'gates' ? 'gates' :
              activeView === 'official-services' ? 'official' : 'umrah'
            }
          />
        )}

        {(activeView === 'quran' || activeView === 'hadith') && (
          <QuranView />
        )}

        {activeView === 'duas' && (
          <DuasView />
        )}

        {activeView === 'prayers' && (
          <PrayerTimesView />
        )}

        {activeView === 'qibla' && (
          <QiblaView />
        )}

        {activeView === 'learn-prayer' && (
          <PrayerLearningView />
        )}

        {activeView === 'planner' && (
          <TripPlannerView
            currentUser={currentUser}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}

        {activeView === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            onOpenAuth={() => handleOpenAuth('login')}
            onNavigate={(v) => setActiveView(v)}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboardView
            currentUser={currentUser}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}

        {['about', 'how-it-works', 'help', 'privacy', 'terms'].includes(activeView) && (
          <PublicPagesView
            pageId={activeView}
            onNavigate={(v) => setActiveView(v)}
          />
        )}
      </main>

      {/* 4. MOBILE BOTTOM APP BAR */}
      <MobileNav
        activeView={activeView}
        onNavigate={(view) => {
          if (view === 'camera') {
            setCameraModalOpen(true);
          } else {
            setActiveView(view);
          }
        }}
      />

      {/* 5. GLOBAL MODALS */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authInitialMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {currentUser && (
        <OnboardingModal
          user={currentUser}
          isOpen={onboardingOpen}
          onComplete={(updated) => {
            setCurrentUser(updated);
            setOnboardingOpen(false);
            setActiveView('dashboard');
          }}
        />
      )}

      <CameraModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
      />

    </div>
  );
}
