import React from 'react';
import { Doctor, CountryCode, LanguageCode, CurrencyCode } from '../types';
import { TRANSLATIONS } from '../translations/translations';
import { Sparkles, ShieldCheck, Award, CheckCircle2, Stethoscope, ArrowRight, Building, Clock, FileUp, Globe2, Lock } from 'lucide-react';

interface DoctorDirectoryProps {
  doctors?: Doctor[];
  selectedCountry: CountryCode;
  setSelectedCountry: (c: CountryCode) => void;
  currentLang: LanguageCode;
  currentCurrency: CurrencyCode;
  onSelectDoctor?: (doctor: Doctor) => void;
  onBookDoctor?: (doctor: Doctor, consultationType: any) => void;
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({
  selectedCountry,
  currentLang
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  return (
    <section className="py-12 bg-slate-50 text-slate-900 min-h-[50vh]" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-900 border border-teal-200 px-3.5 py-1 rounded-full text-xs font-extrabold">
            <Sparkles className="w-4 h-4 text-teal-700" />
            <span>Automated Clinical Triage & Assignment System</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Automated Cross-Border Specialist Assignment
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed">
            Patients do not browse or select individual doctors. To guarantee objective clinical precision, our system evaluates your diagnostic records and automatically assigns the highest-rated medical board specialist in Germany or Jordan.
          </p>
        </div>

        {/* Accredited Partner Hospitals Framework (No Doctor Lists) */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* GERMANY ACCREDITED MEDICAL HUBS */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🇩🇪</span>
                <div>
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block">German Hospital Network</span>
                  <h3 className="text-xl font-bold text-white">University Medical Centers in Germany</h3>
                </div>
              </div>
              <ShieldCheck className="w-6 h-6 text-sky-400" />
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
                <Building className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm">Charité - Universitätsmedizin Berlin</strong>
                  <span className="text-slate-400">Department of Neuro-Oncology, Stroke Medicine, and Molecular Biology</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
                <Building className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm">Universitätsklinikum Heidelberg</strong>
                  <span className="text-slate-400">Department of Cardiovascular Surgery and Minimally Invasive Valve Repair</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
                <Building className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm">Klinikum der Universität München (LMU)</strong>
                  <span className="text-slate-400">Center for Gastrointestinal & Hepato-Pancreato-Biliary Oncology</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-sky-300 border-t border-slate-800">
              <span>Certification: German Medical Council (Facharzt)</span>
              <span className="font-bold">Automated Case Match</span>
            </div>
          </div>

          {/* JORDAN ACCREDITED MEDICAL HUBS */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-xl space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🇯🇴</span>
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">Jordan Hospital Network</span>
                  <h3 className="text-xl font-bold text-white">Premier Specialty Centers in Amman</h3>
                </div>
              </div>
              <Award className="w-6 h-6 text-amber-400" />
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
                <Building className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm">King Hussein Medical Center (KHMC)</strong>
                  <span className="text-slate-400">Pediatric Congenital Heart Center & Electrophysiology Wing</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
                <Building className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm">Amman Specialty Hospital & Abdali Center</strong>
                  <span className="text-slate-400">Robotic Joint Replacement, Orthopedics, and Laser Dermatology</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
                <Building className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm">Jordan Hospital Medical Complex</strong>
                  <span className="text-slate-400">Spine Surgery & Advanced Rehabilitation Protocols</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-amber-300 border-t border-slate-800">
              <span>Certification: Jordan Medical Council Board</span>
              <span className="font-bold">Automated Case Match</span>
            </div>
          </div>

        </div>

        {/* System Assurance Banner */}
        <div className="bg-teal-950/80 border border-teal-800 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block">Clinical Protocol Assurance</span>
            <h4 className="text-base font-bold text-white">How cases are assigned internally:</h4>
            <p className="text-xs text-teal-200">
              Once you submit your symptoms, voice note, or medical files, the system routes your case to the registered Chief On-Call Specialist in Germany or Jordan based on sub-specialty match and immediate availability.
            </p>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl transition-colors shrink-0 shadow-lg"
          >
            Start Case Submission
          </button>
        </div>

      </div>
    </section>
  );
};
