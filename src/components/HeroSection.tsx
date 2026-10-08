import React from 'react';
import { Search, Shield, Globe, Award, Sparkles, Video, FileText, Clock, ArrowRight } from 'lucide-react';
import { CountryCode, LanguageCode, CurrencyCode, Specialty } from '../types';
import { TRANSLATIONS } from '../translations/translations';

interface HeroSectionProps {
  onSearchDoctors: (searchQuery: string, specialty?: Specialty, country?: CountryCode) => void;
  selectedCountry: CountryCode;
  setSelectedCountry: (c: CountryCode) => void;
  currentLang: LanguageCode;
  currentCurrency: CurrencyCode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearchDoctors,
  selectedCountry,
  setSelectedCountry,
  currentLang
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';
  const [query, setQuery] = React.useState('');
  const [selectedSpecialty, setSelectedSpecialty] = React.useState<Specialty | ''>('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchDoctors(query, selectedSpecialty || undefined, selectedCountry);
  };

  const specialtiesList: Specialty[] = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Oncology',
    'Pediatrics',
    'Dermatology',
    'General Surgery'
  ];

  return (
    <section className="relative bg-slate-900 text-white overflow-hidden pt-8 pb-16 border-b border-slate-800" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Background ambient radial glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Country Flag Hub Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-6">
          <button
            onClick={() => setSelectedCountry('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedCountry === 'ALL'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <span>🌐 {t.allCountries}</span>
          </button>
          
          <button
            onClick={() => setSelectedCountry('JO')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedCountry === 'JO'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <span>🇯🇴 {t.ammanCenter}</span>
          </button>

          <button
            onClick={() => setSelectedCountry('DE')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedCountry === 'DE'
                ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
            }`}
          >
            <span>🇩🇪 {t.berlinCenter}</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Hero Text & Search */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs text-teal-300">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Real-Time Arabic / German AI Telemedicine Portal</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-sans">
              {t.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {t.heroDescription}
            </p>

            {/* Automated Matching System Callout Box (No Manual Doctor Search) */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 shadow-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Automated Doctor Matching Engine</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Patients do not manually select doctors. Select your target country (Jordan or Germany) in Step 1 above, submit your case or voice note, and the system will automatically assign the best-matched specialist.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <span>Start Automated Doctor Matching</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Specialty Overview List */}
            <div className="space-y-2 pt-1">
              <span className="text-xs text-slate-400 font-medium block">Covered Medical Specialties:</span>
              <div className="flex flex-wrap gap-2">
                {specialtiesList.map(spec => (
                  <span
                    key={spec}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800/80 border border-slate-700/80 text-slate-300"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Key Value Cards / Real-Time AI Feature Banner */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Real-time AI Translation Feature Banner */}
            <div className="bg-gradient-to-br from-teal-950/80 to-slate-900/90 border border-teal-800/60 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-600/30 flex items-center justify-center text-teal-300 shrink-0 border border-teal-500/30">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Trilingual Real-Time AI Consultation</h3>
                  <span className="text-xs text-teal-300">Arabic · German · English</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Speak naturally in Arabic or German during live video consultations. Integrated Gemini AI performs real-time clinical medical term translation and generates instant post-consultation reports.
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-teal-400 font-medium">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-emerald-400" /> Encrypted & HIPAA Compliant
                </span>
                <span className="text-slate-400">Live Captions</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
