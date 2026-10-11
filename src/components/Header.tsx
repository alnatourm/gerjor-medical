import React, { useState } from 'react';
import { Globe, ShieldCheck, Stethoscope, Video, User, Heart, ChevronDown, LogIn, LogOut, UserCheck } from 'lucide-react';
import { CountryCode, LanguageCode, CurrencyCode, UserAccount } from '../types';
import { TRANSLATIONS } from '../translations/translations';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedCountry: CountryCode;
  setSelectedCountry: (country: CountryCode) => void;
  currentLang: LanguageCode;
  setCurrentLang: (lang: LanguageCode) => void;
  currentCurrency: CurrencyCode;
  setCurrentCurrency: (currency: CurrencyCode) => void;
  onOpenAiAssistant: () => void;
  currentUser: UserAccount | null;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  selectedCountry,
  setSelectedCountry,
  currentLang,
  setCurrentLang,
  currentCurrency,
  setCurrentCurrency,
  onOpenAiAssistant,
  currentUser,
  onOpenAuthModal,
  onSignOut
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      {/* Top Banner Announcement */}
      <div className="bg-teal-900/80 border-b border-teal-800/60 px-4 py-1 text-xs text-teal-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-semibold text-white">
              <span>🇯🇴 Amman (EET)</span>
              <span className="text-teal-400 font-mono">16:00</span>
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1 font-semibold text-white">
              <span>🇩🇪 Berlin (CET)</span>
              <span className="text-teal-400 font-mono">15:00</span>
            </span>
            <span className="hidden md:inline text-teal-300/80 ml-2">
              · Direct Specialist Consultations & Cross-Border Telemedicine
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 text-teal-300 hover:text-white font-medium transition-colors"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {t.aiAssistant}
            </button>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 hidden sm:inline">{t.trustNotice}</span>
          </div>
        </div>
      </div>

      {/* Main 3-Zone Navbar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4" dir={isRtl ? 'rtl' : 'ltr'}>
        
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-900/30 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block font-sans">
                MedLink <span className="text-teal-400 font-light">International</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links based on User Role */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-300">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'home' ? 'bg-slate-800 text-teal-400 font-semibold' : 'hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {t.home}
          </button>

          {currentUser?.role === 'doctor' ? (
            /* DOCTOR SPECIFIC NAVBAR LINKS */
            <>
              <button
                onClick={() => setCurrentTab('doctor-profile')}
                className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  currentTab === 'doctor-profile' ? 'bg-sky-700 text-white font-bold' : 'bg-sky-950/80 text-sky-300 hover:text-white hover:bg-sky-900/60 border border-sky-800/60'
                }`}
              >
                <User className="w-4 h-4 text-sky-400" />
                <span>{t.doctorProfile}</span>
              </button>

              <button
                onClick={() => setCurrentTab('doctor-portal')}
                className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  currentTab === 'doctor-portal' ? 'bg-teal-700 text-white font-bold' : 'bg-teal-950/80 text-teal-300 hover:text-white hover:bg-teal-900/60 border border-teal-800/60'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-teal-400" />
                <span>{t.doctorPortal}</span>
              </button>

              <button
                onClick={() => setCurrentTab('virtual-clinic')}
                className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  currentTab === 'virtual-clinic' ? 'bg-teal-600 text-white font-semibold' : 'hover:text-white hover:bg-slate-800/50 text-teal-300'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>{t.liveVideoRoom}</span>
              </button>
            </>
          ) : (
            /* PATIENT SPECIFIC NAVBAR LINKS */
            <>
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  currentTab === 'dashboard' ? 'bg-slate-800 text-teal-400 font-semibold' : 'hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {t.myConsultations}
              </button>
              <button
                onClick={() => setCurrentTab('profile-settings')}
                className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  currentTab === 'profile-settings' ? 'bg-slate-800 text-teal-400 font-semibold' : 'hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <User className="w-4 h-4 text-teal-400" />
                <span>{t.patientProfile}</span>
              </button>
              <button
                onClick={() => setCurrentTab('virtual-clinic')}
                className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  currentTab === 'virtual-clinic' ? 'bg-teal-600 text-white font-semibold' : 'hover:text-white hover:bg-slate-800/50 text-teal-300'
                }`}
              >
                <Video className="w-4 h-4" />
                {t.virtualClinic}
              </button>
              <button
                onClick={() => setCurrentTab('travel-guide')}
                className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  currentTab === 'travel-guide' ? 'bg-slate-800 text-teal-400 font-semibold' : 'hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {t.travelVisa}
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Country, Language, Currency Controls & Account Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Country Selector */}
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value as CountryCode)}
              className="bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs rounded-lg px-2.5 py-1.5 pr-6 cursor-pointer focus:ring-1 focus:ring-teal-500 focus:outline-none appearance-none font-medium"
            >
              <option value="ALL">🌐 {t.allCountries}</option>
              <option value="JO">🇯🇴 {t.jordan}</option>
              <option value="DE">🇩🇪 {t.germany}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value as LanguageCode)}
              className="bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs rounded-lg px-2 py-1.5 pr-6 cursor-pointer focus:ring-1 focus:ring-teal-500 focus:outline-none appearance-none font-medium"
            >
              <option value="en">English (EN)</option>
              <option value="ar">العربية (AR)</option>
              <option value="de">Deutsch (DE)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-2.5 pointer-events-none" />
          </div>

          {/* Currency Selector */}
          <div className="relative border-l border-slate-700/80 pl-2 sm:pl-3">
            <select
              value={currentCurrency}
              onChange={(e) => setCurrentCurrency(e.target.value as CurrencyCode)}
              className="bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs rounded-lg px-2 py-1.5 cursor-pointer focus:ring-1 focus:ring-teal-500 focus:outline-none font-medium"
            >
              <option value="EUR">EUR (€)</option>
              <option value="JOD">JOD (JD)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          {/* User Account / Auth Button */}
          {currentUser && currentUser.isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm border ${
                  currentUser.role === 'doctor'
                    ? 'bg-sky-950 border-sky-500/80 text-sky-200 hover:text-white'
                    : 'bg-teal-950 border-teal-600/80 text-teal-200 hover:text-white'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-[11px] text-white ${
                  currentUser.role === 'doctor' ? 'bg-sky-600' : 'bg-teal-600'
                }`}>
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="text-left hidden sm:block max-w-[120px] truncate">
                  <span className="block truncate leading-none">{currentUser.fullName}</span>
                  <span className="text-[9px] text-teal-400 font-mono">
                    {currentUser.role === 'doctor' ? `👨‍⚕️ ${t.rolePhysician}` : `👤 ${t.rolePatient}`}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-teal-400" />
              </button>

              {/* Account Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1 animate-fade-in">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <span className="font-bold text-white block truncate">{currentUser.fullName}</span>
                    <span className="text-[10px] text-teal-400 block truncate">{currentUser.email}</span>
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wide block mt-1">
                      {currentUser.role === 'doctor' ? t.crossBorderSpecialist : t.rolePatient}
                    </span>
                  </div>

                  {currentUser.role === 'doctor' ? (
                    <>
                      <button
                        onClick={() => {
                          setCurrentTab('doctor-profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 font-medium"
                      >
                        <User className="w-4 h-4 text-sky-400" />
                        <span>{t.doctorProfile}</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentTab('doctor-portal');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 font-medium"
                      >
                        <Stethoscope className="w-4 h-4 text-teal-400" />
                        <span>{t.doctorPortal}</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentTab('virtual-clinic');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 font-medium"
                      >
                        <Video className="w-4 h-4 text-teal-400" />
                        <span>{t.virtualConsultationRoom}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setCurrentTab('profile-settings');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 font-medium"
                      >
                        <User className="w-4 h-4 text-teal-400" />
                        <span>{t.patientProfile}</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentTab('dashboard');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2 font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-teal-400" />
                        <span>{t.myConsultationsAndVault}</span>
                      </button>
                    </>
                  )}

                  <div className="border-t border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        onSignOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 flex items-center gap-2 font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.signOut}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t.signInRegister}</span>
            </button>
          )}

        </div>
      </div>

      {/* Mobile Tab Row */}
      <div className="lg:hidden bg-slate-800 border-t border-slate-700/60 px-2 py-1.5 flex items-center justify-around text-xs font-medium text-slate-300 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setCurrentTab('home')}
          className={`px-3 py-1 rounded-md ${currentTab === 'home' ? 'bg-slate-900 text-teal-400 font-bold' : ''}`}
        >
          {t.home}
        </button>
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`px-3 py-1 rounded-md ${currentTab === 'dashboard' ? 'bg-slate-900 text-teal-400 font-bold' : ''}`}
        >
          {t.myConsultations}
        </button>
        <button
          onClick={() => setCurrentTab('profile-settings')}
          className={`px-3 py-1 rounded-md ${currentTab === 'profile-settings' ? 'bg-slate-900 text-teal-400 font-bold' : ''}`}
        >
          {t.patientProfile}
        </button>
        <button
          onClick={() => setCurrentTab('virtual-clinic')}
          className={`px-3 py-1 rounded-md text-teal-300 ${currentTab === 'virtual-clinic' ? 'bg-teal-700 text-white font-bold' : ''}`}
        >
          {t.virtualClinic}
        </button>
      </div>
    </header>
  );
};

