import React, { useState } from 'react';
import { Doctor, ConsultationType, LanguageCode, CurrencyCode, Appointment } from '../types';
import { TRANSLATIONS } from '../translations/translations';
import { VoiceNoteRecorder } from './VoiceNoteRecorder';
import { X, Calendar, Clock, User, Mail, Phone, FileText, Sparkles, Check, ChevronRight, Upload, AlertCircle, Loader2 } from 'lucide-react';

interface BookingModalProps {
  doctor: Doctor | null;
  consultationType: ConsultationType;
  onClose: () => void;
  currentLang: LanguageCode;
  currentCurrency: CurrencyCode;
  onCompleteBooking: (appointment: Partial<Appointment>) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  doctor,
  consultationType,
  onClose,
  currentLang,
  currentCurrency,
  onCompleteBooking
}) => {
  if (!doctor) return null;
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  const [step, setStep] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-09');
  const [selectedSlot, setSelectedSlot] = useState<{ amman: string; berlin: string }>({ amman: '16:00', berlin: '15:00' });

  // Patient Info State
  const [patientName, setPatientName] = useState<string>('Omar Al-Masmoudi');
  const [patientEmail, setPatientEmail] = useState<string>('omar.masmoudi@example.com');
  const [patientPhone, setPatientPhone] = useState<string>('+962 7 9123 4567');
  const [symptoms, setSymptoms] = useState<string>('Persistent headache and blurred vision for 3 weeks following physical exertion. Brain MRI completed in September 2026.');

  // AI Intake State
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiSummaryData, setAiSummaryData] = useState<any>(null);

  const isGermanDoctor = doctor.country === 'DE';

  const availableSlots = [
    { amman: '10:00', berlin: '09:00' },
    { amman: '12:30', berlin: '11:30' },
    { amman: '15:00', berlin: '14:00' },
    { amman: '16:30', berlin: '15:30' },
    { amman: '18:00', berlin: '17:00' },
    { amman: '20:00', berlin: '19:00' }
  ];

  const formatFee = () => {
    if (currentCurrency === 'EUR') return `€${doctor.feeEur}`;
    if (currentCurrency === 'JOD') return `${doctor.feeJod} JOD`;
    return `$${doctor.feeUsd}`;
  };

  const handleGenerateAiIntake = async () => {
    setIsGeneratingAi(true);
    try {
      const response = await fetch('/api/ai/pre-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms,
          doctorName: doctor.name,
          specialty: doctor.specialty,
          targetCountry: doctor.country,
          patientLanguage: currentLang
        })
      });
      const res = await response.json();
      if (res.data) {
        setAiSummaryData(res.data);
      } else {
        setAiSummaryData({
          chiefComplaint: 'Recurrent temporal headache with reading difficulties',
          chronology: '3 weeks duration',
          clinicalSummary: 'Patient presenting with 3-week history of temporal headaches and visual disturbances. MRI uploaded for review.',
          suggestedDoctorQuestions: [
            'Is there any papilledema on fundoscopic review?',
            'How do the MRI T2 sequences correlate with current symptoms?',
            'Is prophylactic anti-migraine therapy indicated?'
          ]
        });
      }
      setStep(4);
    } catch (e) {
      console.error(e);
      setStep(4);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleFinalConfirm = () => {
    onCompleteBooking({
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorCountry: doctor.country,
      doctorHospital: doctor.hospital,
      patientName,
      patientEmail,
      patientPhone,
      consultationType,
      date: selectedDate,
      timeAmman: selectedSlot.amman,
      timeBerlin: selectedSlot.berlin,
      symptoms,
      aiSummary: aiSummaryData?.clinicalSummary || 'Pre-consultation intake completed.',
      totalFee: currentCurrency === 'EUR' ? doctor.feeEur : (currentCurrency === 'JOD' ? doctor.feeJod : doctor.feeUsd),
      currency: currentCurrency
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative my-6">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white rounded-t-2xl border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 mb-1">
            <span>{isGermanDoctor ? '🇩🇪 Germany Telemedicine' : '🇯🇴 Jordan Telemedicine'}</span>
            <span>·</span>
            <span>{consultationType === 'video' ? 'Live Video Call' : 'Cross-Border Second Opinion'}</span>
          </div>

          <h2 className="text-xl font-bold text-white">
            {t.bookingModalTitle}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Consulting <strong className="text-white">{doctor.name}</strong> ({doctor.specialty})
          </p>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-800 text-[11px] font-medium text-slate-400">
            <div className={`text-center pb-1 ${step >= 1 ? 'text-teal-400 font-bold border-b-2 border-teal-400' : ''}`}>1. Slot</div>
            <div className={`text-center pb-1 ${step >= 2 ? 'text-teal-400 font-bold border-b-2 border-teal-400' : ''}`}>2. Patient</div>
            <div className={`text-center pb-1 ${step >= 3 ? 'text-teal-400 font-bold border-b-2 border-teal-400' : ''}`}>3. Symptoms</div>
            <div className={`text-center pb-1 ${step >= 4 ? 'text-teal-400 font-bold border-b-2 border-teal-400' : ''}`}>4. Confirm</div>
          </div>
        </div>

        {/* Modal Body Steps */}
        <div className="p-6 space-y-6 text-slate-800 text-sm">
          
          {/* STEP 1: Date & Dual Time Slot Selector */}
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <span>{t.step1Slot}</span>
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min="2026-10-07"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 block">Select Dual Time Slot</label>
                  <span className="text-[11px] text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded font-medium">
                    Amman (EET) / Berlin (CET)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {availableSlots.map((slot, i) => {
                    const isSelected = selectedSlot.amman === slot.amman;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 shadow-sm'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900">🇯🇴 {slot.amman} EET</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          🇩🇪 {slot.berlin} CET
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1"
                >
                  <span>Next: Patient Info</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Patient Contact Info */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600" />
                <span>{t.step2Patient}</span>
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">{t.patientName}</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">{t.patientEmail}</label>
                  <input
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">{t.patientPhone}</label>
                  <input
                    type="text"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Back
                </button>

                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1"
                >
                  <span>Next: Medical History</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Symptoms & Medical Record Upload */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <span>{t.step3Records}</span>
              </h3>

              {/* Voice Note Recorder Integration */}
              <VoiceNoteRecorder
                currentLang={currentLang}
                label="Record Voice Symptom Note (AI Transcribed)"
                onTranscriptionComplete={(text) => {
                  setSymptoms(prev => prev ? `${prev}\n\n[Voice Note Transcribed]: ${text}` : text);
                }}
              />

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">{t.symptomsLabel}</label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={4}
                  placeholder={t.symptomsPlaceholder}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-3 font-medium focus:ring-2 focus:ring-teal-500 leading-relaxed"
                />
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer space-y-1">
                <Upload className="w-6 h-6 text-teal-600 mx-auto" />
                <span className="text-xs font-bold text-slate-800 block">{t.uploadRecord}</span>
                <span className="text-[11px] text-slate-500 block">Attached file: Brain_MRI_Sept2026_Report.pdf (14.2 MB)</span>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-teal-900">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Gemini 3.8 Flash AI Clinical Intake</span>
                  <span>{t.aiIntakeNotice}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Back
                </button>

                <button
                  onClick={handleGenerateAiIntake}
                  disabled={isGeneratingAi}
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating AI Summary...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate AI Review & Continue</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: AI Summary Preview & Final Payment Confirmation */}
          {step === 4 && (
            <div className="space-y-5">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Check className="w-5 h-5 text-teal-600" />
                <span>{t.step4Review}</span>
              </h3>

              {/* Appointment Booking Summary Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{doctor.name}</span>
                    <span className="text-slate-500">{doctor.specialty} · {doctor.hospital}</span>
                  </div>
                  <span className="text-sm font-extrabold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-lg">
                    {formatFee()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Date</span>
                    <span className="font-semibold">{selectedDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Scheduled Time</span>
                    <span className="font-semibold text-slate-900">🇯🇴 {selectedSlot.amman} EET / 🇩🇪 {selectedSlot.berlin} CET</span>
                  </div>
                </div>
              </div>

              {/* AI Clinical Summary Box */}
              {aiSummaryData && (
                <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3 text-xs border border-slate-800">
                  <div className="flex items-center gap-2 text-teal-400 font-bold border-b border-slate-800 pb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini AI Bilingual Clinical Intake Report</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Chief Complaint</span>
                    <p className="font-semibold text-teal-200">{aiSummaryData.chiefComplaint || 'Recurrent temporal headache'}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Clinical Summary for Doctor</span>
                    <p className="text-slate-300 leading-relaxed">{aiSummaryData.clinicalSummary}</p>
                  </div>

                  {aiSummaryData.suggestedDoctorQuestions && (
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase mb-1">Key Clinical Focus Areas</span>
                      <ul className="space-y-1 text-slate-300">
                        {aiSummaryData.suggestedDoctorQuestions.map((q: string, i: number) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-teal-400">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Back
                </button>

                <button
                  onClick={handleFinalConfirm}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{t.confirmBookingBtn} ({formatFee()})</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
