import React from 'react';
import { Globe, ShieldCheck, Stethoscope, Video, User, Heart, ChevronDown } from 'lucide-react';
import { CountryCode, LanguageCode, CurrencyCode } from '../types';
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
  onOpenAiAssistant
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

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

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-300">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'home' ? 'bg-slate-800 text-teal-400 font-semibold' : 'hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {t.home}
          </button>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'dashboard' ? 'bg-slate-800 text-teal-400 font-semibold' : 'hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {t.myConsultations}
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
        </nav>

        {/* Zone 3: Country, Language, Currency Controls & Primary Action */}
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
          onClick={() => setCurrentTab('virtual-clinic')}
          className={`px-3 py-1 rounded-md text-teal-300 ${currentTab === 'virtual-clinic' ? 'bg-teal-700 text-white font-bold' : ''}`}
        >
          {t.virtualClinic}
        </button>
        <button
          onClick={() => setCurrentTab('travel-guide')}
          className={`px-3 py-1 rounded-md ${currentTab === 'travel-guide' ? 'bg-slate-900 text-teal-400 font-bold' : ''}`}
        >
          {t.travelVisa}
        </button>
      </div>
    </header>
  );
};
