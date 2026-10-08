import React from 'react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../translations/translations';
import { Plane, ShieldCheck, FileCheck, Landmark, HeartHandshake, Award, Building, PhoneCall, ChevronRight } from 'lucide-react';

interface MedicalTravelGuideProps {
  currentLang: LanguageCode;
  onBookSpecialist: () => void;
}

export const MedicalTravelGuide: React.FC<MedicalTravelGuideProps> = ({
  currentLang,
  onBookSpecialist
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  return (
    <section className="py-10 bg-slate-50 text-slate-900 min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header Title */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-semibold">
            <Plane className="w-4 h-4 text-teal-400" />
            <span>Cross-Border Inpatient Care & Transfer Protocol</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t.travelTitle}
          </h2>

          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            {t.travelSubtitle}
          </p>
        </div>

        {/* 2 Main Transfer Corridors: Jordan -> Germany & Germany -> Jordan */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Corridor 1: Jordanian Patients to Germany */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇯🇴 ➔ 🇩🇪</span>
                  <h3 className="font-bold text-slate-900 text-base">{t.visaJordanianToDe}</h3>
                </div>
                <span className="bg-sky-100 text-sky-900 font-bold text-[10px] px-2.5 py-0.5 rounded border border-sky-200">
                  Schengen Medical
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                For patients seeking complex cardiovascular surgery, neuro-oncology, or organ transplants at Charité Berlin, LMU Munich, or Heidelberg University Hospital.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-700">
                  <FileCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">{t.step1HospitalLetter}</span>
                    <span>Issued within 24h following your video tele-consultation with the German Chief Physician.</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-700">
                  <Landmark className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">{t.step2ProofFunds}</span>
                    <span>Official cost estimate for German Embassy in Amman visa appointment.</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-700">
                  <Plane className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">{t.step3AmbulanceFlight}</span>
                    <span>Airport pickup in Frankfurt / Berlin / Munich with German medical escort.</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onBookSpecialist}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 mt-4"
            >
              <span>Consult German Chief Physician</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Corridor 2: European/German Patients to Jordan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🇩🇪 ➔ 🇯🇴</span>
                  <h3 className="font-bold text-slate-900 text-base">{t.visaDeToJordan}</h3>
                </div>
                <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2.5 py-0.5 rounded border border-amber-200">
                  Amman Medical Hub
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Jordan is a top-ranked medical tourism hub in the Middle East, offering world-class robotic orthopedics, pediatric cardiology, and Dead Sea wellness rehabilitation.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-700">
                  <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">JCI & Royal Certified Hospitals in Amman</span>
                    <span>King Hussein Cancer Center, Abdali Hospital, and Specialty Hospital Amman.</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-700">
                  <Building className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Fast Visa on Arrival for German Citizens</span>
                    <span>EU and German citizens receive immediate visa upon arrival at Queen Alia International Airport (AMM).</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-700">
                  <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Dead Sea Post-Operative Rehabilitation</span>
                    <span>Specialized climate and therapeutic Dead Sea mineral recovery packages.</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onBookSpecialist}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 mt-4"
            >
              <span>Consult Jordanian Specialist</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Emergency Transfer Assistance Callout */}
        <div className="bg-teal-900 text-white rounded-2xl p-6 border border-teal-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block">24/7 International Medical Desk</span>
            <h4 className="text-lg font-bold text-white">Need Urgent Air Ambulance or Medical Referral Letter?</h4>
            <p className="text-xs text-teal-200">Our cross-border medical coordinators in Amman and Berlin assist with emergency air transports and hospital transfers.</p>
          </div>

          <button
            onClick={() => alert('Connecting to MedLink 24/7 Cross-Border Emergency Desk (+962 6 500 9000 / +49 30 2000 8000)...')}
            className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-2 shadow-lg"
          >
            <PhoneCall className="w-4 h-4 text-teal-700" />
            <span>Contact 24/7 Medical Desk</span>
          </button>
        </div>

      </div>
    </section>
  );
};
