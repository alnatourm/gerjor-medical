import React from 'react';
import { Doctor, ConsultationType, LanguageCode, CurrencyCode } from '../types';
import { TRANSLATIONS } from '../translations/translations';
import { X, Award, GraduationCap, ShieldCheck, MapPin, Globe, Clock, Star, Video, FileCheck, CheckCircle2 } from 'lucide-react';

interface DoctorDetailModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  currentLang: LanguageCode;
  currentCurrency: CurrencyCode;
  onBook: (doctor: Doctor, type: ConsultationType) => void;
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  doctor,
  onClose,
  currentLang,
  currentCurrency,
  onBook
}) => {
  if (!doctor) return null;
  const t = TRANSLATIONS[currentLang];
  const isGerman = doctor.country === 'DE';
  const isRtl = currentLang === 'ar';

  const formatFee = () => {
    if (currentCurrency === 'EUR') return `€${doctor.feeEur}`;
    if (currentCurrency === 'JOD') return `${doctor.feeJod} JOD`;
    return `$${doctor.feeUsd}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative my-8">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Cover */}
        <div className={`p-6 text-white ${isGerman ? 'bg-gradient-to-r from-slate-900 via-sky-900 to-slate-900' : 'bg-gradient-to-r from-slate-900 via-amber-900 to-slate-900'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${isGerman ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40' : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'}`}>
              {isGerman ? '🇩🇪 Germany Medical Specialist' : '🇯🇴 Jordan Medical Specialist'}
            </span>
            <span className="text-xs text-slate-300">· {doctor.city}</span>
          </div>

          <h2 className="text-2xl font-bold">
            {currentLang === 'ar' && doctor.titleAr ? doctor.titleAr : (currentLang === 'de' && doctor.titleDe ? doctor.titleDe : doctor.name)}
          </h2>
          <p className="text-sm text-teal-300 font-medium mt-0.5">
            {doctor.title}
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-300 mt-4 border-t border-white/10 pt-3">
            <div className="flex items-center gap-1 font-bold text-amber-400">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{doctor.rating}</span>
              <span className="text-slate-300 font-normal">({doctor.reviewCount} reviews)</span>
            </div>
            <span>·</span>
            <span>{doctor.experienceYears} Years Clinical Practice</span>
            <span>·</span>
            <span>{doctor.specialty}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-slate-800 text-sm">
          
          {/* Hospital Affiliation & Timezone */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-start gap-2 text-slate-900 font-semibold">
              <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span>{currentLang === 'ar' && doctor.hospitalAr ? doctor.hospitalAr : (currentLang === 'de' && doctor.hospitalDe ? doctor.hospitalDe : doctor.hospital)}</span>
                <span className="block text-xs font-normal text-slate-500">{doctor.city}, {isGerman ? 'Germany' : 'Jordan'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Timezone: {doctor.timeZoneOffsetLabel}</span>
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">About Doctor</h4>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
              {currentLang === 'ar' && doctor.bioAr ? doctor.bioAr : (currentLang === 'de' && doctor.bioDe ? doctor.bioDe : doctor.bio)}
            </p>
          </div>

          {/* Sub-Specialties */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Key Clinical Focus</h4>
            <div className="flex flex-wrap gap-2">
              {doctor.subSpecialties.map(sub => (
                <span key={sub} className="bg-teal-50 text-teal-900 border border-teal-200/80 px-3 py-1 rounded-lg text-xs font-medium">
                  ✓ {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Education & Credentials */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-teal-600" /> Education
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {doctor.education.map((edu, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-teal-600 mt-0.5">•</span>
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" /> Board Certifications
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {doctor.certifications.map((cert, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-2 border-t border-slate-200 pt-4">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Languages Spoken</h4>
            <div className="flex items-center gap-2">
              {doctor.languages.map(lang => (
                <span key={lang} className="bg-slate-100 text-slate-800 font-semibold px-3 py-1 rounded-lg text-xs">
                  {lang === 'Arabic' ? 'العربية (Arabic)' : lang === 'German' ? 'Deutsch (German)' : 'English'}
                </span>
              ))}
            </div>
          </div>

          {/* Booking Action Box */}
          <div className="bg-slate-900 text-white rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Consultation Fee</span>
                <span className="text-2xl font-extrabold text-teal-400">{formatFee()}</span>
              </div>
              <div className="text-right text-xs text-slate-300">
                <span>Next Slot:</span>
                <span className="block font-semibold text-white">{doctor.nextAvailable}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-2 pt-2">
              {doctor.availableTypes.map(type => (
                <button
                  key={type}
                  onClick={() => {
                    onClose();
                    onBook(doctor, type);
                  }}
                  className="w-full px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {type === 'video' && <Video className="w-4 h-4" />}
                  {type === 'second_opinion' && <FileCheck className="w-4 h-4" />}
                  <span>Book {type === 'video' ? 'Live Video' : type === 'second_opinion' ? 'Second Opinion' : 'Record Review'}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
