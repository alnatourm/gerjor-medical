import React, { useState } from 'react';
import { CountryCode, LanguageCode, CurrencyCode, Doctor, Specialty, Appointment } from '../types';
import { TRANSLATIONS } from '../translations/translations';
import { MOCK_DOCTORS } from '../data/mockData';
import { VoiceNoteRecorder } from './VoiceNoteRecorder';
import { Globe, FileUp, Calendar, ArrowRight, CheckCircle2, Sparkles, ShieldCheck, Stethoscope, Clock, Award, Building, User, ChevronRight, Upload, Loader2, ArrowLeft, Camera, FlaskConical, FileText, Image as ImageIcon, X, Check, Plus } from 'lucide-react';

interface CountrySelectionFlowProps {
  currentLang: LanguageCode;
  currentCurrency: CurrencyCode;
  doctors?: Doctor[];
  currentUser?: any;
  onSelectCountryAndPath: (country: 'DE' | 'JO', path: 'upload_case' | 'book_appointment', doctor?: Doctor) => void;
  onCompleteBooking: (app: Partial<Appointment>) => void;
}

export const CountrySelectionFlow: React.FC<CountrySelectionFlowProps> = ({
  currentLang,
  currentCurrency,
  doctors = [],
  currentUser,
  onSelectCountryAndPath,
  onCompleteBooking
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  // Step 1: Choose Country ('DE' or 'JO' or null)
  const [selectedCountry, setSelectedCountry] = useState<'DE' | 'JO' | null>(null);

  // Step 2: Choose Path ('upload_case' or 'book_appointment' or null)
  const [selectedPath, setSelectedPath] = useState<'upload_case' | 'book_appointment' | null>(null);

  // Step 3: Selected Specialty filter for doctors
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | 'ALL'>('ALL');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Case File Upload Form State
  const [caseTitle, setCaseTitle] = useState('');
  const [caseSymptoms, setCaseSymptoms] = useState('');
  const [patientQuestionsList, setPatientQuestionsList] = useState<string[]>(['']);
  const [fileName, setFileName] = useState('');
  const [isAnalyzingFile, setIsAnalyzingFile] = useState(false);
  const [aiTriageResult, setAiTriageResult] = useState<any>(null);

  const handleAddQuestionField = () => {
    setPatientQuestionsList(prev => [...prev, '']);
  };

  const handleRemoveQuestionField = (index: number) => {
    setPatientQuestionsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuestionFieldChange = (index: number, val: string) => {
    setPatientQuestionsList(prev => prev.map((q, i) => i === index ? val : q));
  };

  // Appointment Slot State
  const [selectedDate, setSelectedDate] = useState('2026-10-10');
  const [selectedSlot, setSelectedSlot] = useState({ amman: '16:00', berlin: '15:00' });
  const [patientName, setPatientName] = useState(currentUser?.fullName || '');
  const [patientEmail, setPatientEmail] = useState(currentUser?.email || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');

  // Keep patient details in sync with logged in user
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.fullName) setPatientName(currentUser.fullName);
      if (currentUser.email) setPatientEmail(currentUser.email);
      if (currentUser.phone) setPatientPhone(currentUser.phone);
    }
  }, [currentUser]);

  const [isSuccessSubmitted, setIsSuccessSubmitted] = useState(false);

  // Filtered doctors for chosen country from dynamic database
  const countryDoctors = doctors.filter(d => d.country === selectedCountry);

  // Document Attachment Categories: 'lab_report' | 'doctor_report' | 'photo' | 'mri'
  const [uploadCategory, setUploadCategory] = useState<'lab_report' | 'doctor_report' | 'photo' | 'mri'>('lab_report');
  const [attachedFilesList, setAttachedFilesList] = useState<Array<{ id: string; name: string; category: string; size: string; previewUrl?: string }>>([]);

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>, categoryOverride?: 'lab_report' | 'doctor_report' | 'photo' | 'mri') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const cat = categoryOverride || uploadCategory;
      const newFile = {
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        category: cat,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      };
      setAttachedFilesList(prev => [...prev, newFile]);
      setFileName(file.name);
    }
  };

  const removeAttachedFile = (idToRemove: string) => {
    setAttachedFilesList(prev => prev.filter(f => f.id !== idToRemove));
    if (attachedFilesList.length <= 1) setFileName('');
  };

  const handleRunAiCaseTriage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzingFile(true);

    try {
      const response = await fetch('/api/ai/pre-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: caseSymptoms || caseTitle,
          targetCountry: selectedCountry,
          patientLanguage: currentLang
        })
      });
      const data = await response.json();
      setAiTriageResult(data.data || {
        chiefComplaint: caseTitle || 'Complex Medical Review Request',
        clinicalSummary: currentLang === 'ar'
          ? `تم رفع الحالة الطبية لتقييم المجلس الطبي في ${selectedCountry === 'DE' ? 'ألمانيا' : 'الأردن'}. تم تعيين المراجعة بأولوية عالية.`
          : (currentLang === 'de'
            ? `Fall für die Bewertung des Medizinalausschusses in ${selectedCountry === 'DE' ? 'Deutschland' : 'Jordanien'} eingereicht. Hohe Priorität zugewiesen.`
            : `Case submitted for ${selectedCountry === 'DE' ? 'German' : 'Jordanian'} medical board evaluation. High priority review assigned.`),
        keyMedicalTerms: [
          { english: 'Diagnostic Evaluation', arabic: 'تقييم تشخيصي', german: 'Diagnostische Auswertung' }
        ],
        suggestedDoctorQuestions: [
          'Are previous DICOM MRI/CT scans fully rendered?',
          'Is an urgent cross-border video consultation recommended?'
        ]
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingFile(false);
    }
  };

  const handleFinalSubmitCase = () => {
    const doc = selectedDoctor || countryDoctors[0];

    const validQuestions = patientQuestionsList.map(q => q.trim()).filter(Boolean);

    const initialCaseMessages = validQuestions.map((qText, idx) => ({
      id: `msg-${Date.now()}-${idx}`,
      sender: 'patient' as const,
      senderName: patientName || currentUser?.fullName || 'Patient',
      text: qText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    const formattedQuestionsText = validQuestions.length > 0 
      ? `\n\n[Patient Specific Questions]:\n` + validQuestions.map((q, i) => `Q${i + 1}: ${q}`).join('\n')
      : '';

    onCompleteBooking({
      doctorId: doc ? doc.id : 'doc-general-board',
      doctorName: doc ? doc.name : (selectedCountry === 'DE' ? 'German Specialist Medical Board' : 'Jordanian Specialist Medical Board'),
      doctorSpecialty: doc ? doc.specialty : (selectedSpecialty !== 'ALL' ? selectedSpecialty : 'Neurology'),
      doctorCountry: doc ? doc.country : (selectedCountry || 'DE'),
      doctorHospital: doc ? doc.hospital : (selectedCountry === 'DE' ? 'Charité University Network Berlin' : 'Amman Medical Center'),
      patientName: patientName || currentUser?.fullName || 'Patient User',
      patientEmail: patientEmail || currentUser?.email || 'patient@example.com',
      patientPhone: patientPhone || currentUser?.phone || '',
      consultationType: selectedPath === 'upload_case' ? 'second_opinion' : 'video',
      date: selectedDate,
      timeAmman: selectedSlot.amman,
      timeBerlin: selectedSlot.berlin,
      symptoms: `${caseSymptoms || caseTitle}${formattedQuestionsText}`,
      caseMessages: initialCaseMessages,
      aiSummary: aiTriageResult?.clinicalSummary || 'Medical case file uploaded for specialist review.',
      totalFee: doc ? (currentCurrency === 'EUR' ? doc.feeEur : (currentCurrency === 'JOD' ? doc.feeJod : doc.feeUsd)) : 150,
      currency: currentCurrency
    });
    setIsSuccessSubmitted(true);
  };

  const resetFlow = () => {
    setSelectedCountry(null);
    setSelectedPath(null);
    setSelectedDoctor(null);
    setAiTriageResult(null);
    setIsSuccessSubmitted(false);
  };

  return (
    <section className="py-12 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Background Glow Effects */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-8">
        
        {/* Step Indicator Wizard Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3.5 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>{t.crossBorderGatewayTag}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-sans">
            {t.directCareTitle}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.directCareSubtitle}
          </p>

          {/* Flow Stepper Bar */}
          <div className="flex items-center justify-center gap-3 pt-4 text-xs font-bold">
            <button 
              onClick={resetFlow} 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                selectedCountry === null 
                  ? 'bg-teal-500 text-slate-950 font-extrabold ring-2 ring-teal-400/40 shadow-lg' 
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <span>{t.step1ChooseLocation}</span>
              {selectedCountry && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <span className="text-slate-600">{isRtl ? '⬅' : '➔'}</span>

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              selectedCountry !== null && selectedPath === null
                ? 'bg-teal-500 text-slate-950 font-extrabold ring-2 ring-teal-400/40 shadow-lg'
                : (selectedPath !== null ? 'bg-slate-800 text-teal-300' : 'bg-slate-800/50 text-slate-500')
            }`}>
              <span>{t.step2UploadOrAppointment}</span>
              {selectedPath && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </div>

            {selectedPath && (
              <>
                <span className="text-slate-600">{isRtl ? '⬅' : '➔'}</span>
                <div className="bg-teal-500 text-slate-950 font-extrabold px-3 py-1.5 rounded-full shadow-lg">
                  {t.step3SpecialistReview}
                </div>
              </>
            )}
          </div>
        </div>

        {/* STEP 1: CHOOSE COUNTRY CONSULTANCY (GERMANY 🇩🇪 OR JORDAN 🇯🇴) */}
        {selectedCountry === null && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <h2 className="text-center text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.step1Header}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              
              {/* GERMANY CONSULTANCY CARD */}
              <div 
                onClick={() => setSelectedCountry('DE')}
                className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 hover:border-sky-400 rounded-3xl p-8 shadow-2xl transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden space-y-6"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">🇩🇪</span>
                    <div>
                      <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block">{t.germanConsultancyBadge}</span>
                      <h3 className="text-2xl font-extrabold text-white group-hover:text-sky-300 transition-colors">
                        {t.consultDoctorsInGermany}
                      </h3>
                    </div>
                  </div>

                  <span className="p-2 rounded-xl bg-sky-500/20 text-sky-300 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
                    <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.germanConsultancyDesc}
                </p>

                <div className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{t.germanFeature1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{t.germanFeature2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{t.germanFeature3}</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-slate-950 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-sky-900/30">
                  <span>{t.selectGermanConsultancyBtn}</span>
                  <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* JORDAN CONSULTANCY CARD */}
              <div 
                onClick={() => setSelectedCountry('JO')}
                className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 hover:border-amber-400 rounded-3xl p-8 shadow-2xl transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden space-y-6"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">🇯🇴</span>
                    <div>
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">{t.jordanConsultancyBadge}</span>
                      <h3 className="text-2xl font-extrabold text-white group-hover:text-amber-300 transition-colors">
                        {t.consultDoctorsInJordan}
                      </h3>
                    </div>
                  </div>

                  <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                    <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.jordanConsultancyDesc}
                </p>

                <div className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{t.jordanFeature1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{t.jordanFeature2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{t.jordanFeature3}</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30">
                  <span>{t.selectJordanConsultancyBtn}</span>
                  <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* STEP 2: CHOOSE ACTION PATH (UPLOAD CASE FILE vs ASK FOR APPOINTMENT) */}
        {selectedCountry !== null && selectedPath === null && (
          <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            
            <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedCountry === 'DE' ? '🇩🇪' : '🇯🇴'}</span>
                <div>
                  <span className="text-xs font-bold text-teal-300 block">{t.activeSelectedCorridor}</span>
                  <span className="text-sm font-bold text-white">
                    {selectedCountry === 'DE' ? t.germanyCorridorTitle : t.jordanCorridorTitle}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedCountry(null)}
                className="text-xs font-semibold text-slate-400 hover:text-white underline"
              >
                {t.changeCountryBtn}
              </button>
            </div>

            <h2 className="text-center text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.step2Header}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              
              {/* PATH A: UPLOAD CASE FILE FOR REVIEW */}
              <div
                onClick={() => setSelectedPath('upload_case')}
                className="bg-slate-800 border-2 border-slate-700 hover:border-teal-400 rounded-2xl p-6 shadow-xl hover:bg-slate-800/90 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold border border-teal-500/30 group-hover:scale-105 transition-transform">
                    <FileUp className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                    {t.uploadMedicalCaseTitle}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t.uploadMedicalCaseDesc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-teal-400 font-bold">
                  <span>{t.fastCaseReviewBadge}</span>
                  <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* PATH B: ASK FOR DIRECT APPOINTMENT */}
              <div
                onClick={() => setSelectedPath('book_appointment')}
                className="bg-slate-800 border-2 border-slate-700 hover:border-teal-400 rounded-2xl p-6 shadow-xl hover:bg-slate-800/90 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold border border-sky-500/30 group-hover:scale-105 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                    {t.askForAppointmentTitle}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t.askForAppointmentDesc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-sky-400 font-bold">
                  <span>{t.directDoctorSchedulingBadge}</span>
                  <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </div>
              </div>

            </div>

          </div>
        )}

        {/* STEP 3A: UPLOAD CASE FORM & AI TRIAGE */}
        {selectedCountry !== null && selectedPath === 'upload_case' && !isSuccessSubmitted && (
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedPath(null)} className="text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1">
                  <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} /> {t.backBtn}
                </button>
                <span className="text-slate-600">|</span>
                <span className="text-xs font-bold text-teal-400">
                  {selectedCountry === 'DE' ? `🇩🇪 ${t.germanMedicalBoardCaseReview}` : `🇯🇴 ${t.jordanSpecialistCaseReview}`}
                </span>
              </div>

              <span className="text-xs text-slate-400">{t.step3Of3}</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">{t.uploadDiagnosticCaseTitle}</h2>
              <p className="text-xs text-slate-300">
                {t.uploadDiagnosticCaseDesc}
              </p>
            </div>

            <form onSubmit={handleRunAiCaseTriage} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1">{t.caseTitleLabel}</label>
                <input
                  type="text"
                  required
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder={t.caseTitlePlaceholder}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Voice Note Recorder Integration */}
              <VoiceNoteRecorder
                currentLang={currentLang}
                label={t.recordVoiceNoteLabel}
                onTranscriptionComplete={(text) => {
                  setCaseSymptoms(prev => prev ? `${prev}\n\n[${t.recordVoiceNoteLabel}]: ${text}` : text);
                }}
              />

              <div>
                <label className="font-bold text-slate-200 block mb-1">{t.detailedSymptomsLabel}</label>
                <textarea
                  required
                  value={caseSymptoms}
                  onChange={(e) => setCaseSymptoms(e.target.value)}
                  rows={3}
                  placeholder={t.detailedSymptomsPlaceholder}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-teal-500 leading-relaxed"
                />
              </div>

              {/* Dynamic List of Specific Questions for the Specialist */}
              <div className="space-y-2.5 bg-slate-900/60 p-4 rounded-2xl border border-teal-800/80">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-teal-300 text-xs block">
                    ❓ {currentLang === 'ar' ? 'أسئلتك المحددة للطبيب حول الحالة والتقارير المرفقة:' : 'Specific Questions for the Specialist Physician:'}
                  </label>
                  <button
                    type="button"
                    onClick={handleAddQuestionField}
                    className="px-3 py-1 bg-teal-600/30 hover:bg-teal-600/50 text-teal-300 border border-teal-500/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 text-teal-400" />
                    <span>{currentLang === 'ar' ? 'إضافة سؤال آخر' : 'Add Question'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {patientQuestionsList.map((qText, index) => (
                    <div key={index} className="flex items-center gap-2 animate-fade-in">
                      <span className="text-teal-400 font-bold text-xs shrink-0 w-6 text-center">
                        Q{index + 1}
                      </span>
                      <input
                        type="text"
                        value={qText}
                        onChange={(e) => handleQuestionFieldChange(index, e.target.value)}
                        placeholder={
                          index === 0
                            ? (currentLang === 'ar' ? 'مثال: ماذا تبين نتيجة صورة الرنين المغناطيسي المرفقة؟' : 'e.g., What does this attached MRI scan indicate?')
                            : (currentLang === 'ar' ? 'مثال: هل هناك حاجة لتنفيذ إجراء جراحي؟' : 'e.g., Do I need surgical intervention or alternative therapy?')
                        }
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-teal-500 shadow-sm"
                      />
                      {patientQuestionsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestionField(index)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors border border-slate-700 shrink-0"
                          title="Remove Question"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Document Category Selector & Upload Options */}
              <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80">
                <label className="font-bold text-slate-200 block text-xs">
                  {t.selectUploadTypeLabel}
                </label>

                {/* Document Type Selector Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: Report for Lab */}
                  <button
                    type="button"
                    onClick={() => setUploadCategory('lab_report')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all text-xs ${
                      uploadCategory === 'lab_report'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/20 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <FlaskConical className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-white text-xs">{t.labReportBadge}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight">
                        {currentLang === 'ar' ? 'نتائج فحص الدم والتحاليل المخبرية' : 'Blood work, pathology, urine & lab test results'}
                      </span>
                    </div>
                  </button>

                  {/* Option 2: Report from Doctor */}
                  <button
                    type="button"
                    onClick={() => setUploadCategory('doctor_report')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all text-xs ${
                      uploadCategory === 'doctor_report'
                        ? 'bg-sky-950/80 border-sky-500 text-sky-200 ring-2 ring-sky-500/20 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <FileText className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-white text-xs">{t.doctorReportBadge}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight">
                        {currentLang === 'ar' ? 'التقرير الطبي وملخص تشخيص الطبيب' : 'Specialist clinical notes, diagnosis & discharge letter'}
                      </span>
                    </div>
                  </button>

                  {/* Option 3: Upload Photo */}
                  <button
                    type="button"
                    onClick={() => setUploadCategory('photo')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all text-xs ${
                      uploadCategory === 'photo'
                        ? 'bg-purple-950/80 border-purple-500 text-purple-200 ring-2 ring-purple-500/20 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Camera className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-white text-xs">{t.photoBadge}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5 leading-tight">
                        {currentLang === 'ar' ? 'صورة تقرير ورقي أو الفحص الظاهري' : 'Clear photo of paper report, note or affected area'}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Upload Action Box */}
                <div className="border-2 border-dashed border-slate-700 rounded-2xl p-5 text-center bg-slate-950/70 hover:border-teal-500 transition-colors space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    {uploadCategory === 'lab_report' && <FlaskConical className="w-6 h-6 text-emerald-400" />}
                    {uploadCategory === 'doctor_report' && <FileText className="w-6 h-6 text-sky-400" />}
                    {uploadCategory === 'photo' && <Camera className="w-6 h-6 text-purple-400" />}
                    {uploadCategory === 'mri' && <Upload className="w-6 h-6 text-teal-400" />}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-white block">
                      {uploadCategory === 'lab_report' && t.uploadLabReportOption}
                      {uploadCategory === 'doctor_report' && t.uploadDoctorReportOption}
                      {uploadCategory === 'photo' && t.uploadPhotoOption}
                      {uploadCategory === 'mri' && t.uploadMriOption}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{t.uploadDropzoneSupported}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    {/* Choose File Button */}
                    <input
                      type="file"
                      id="case-file-upload-input"
                      accept={uploadCategory === 'photo' ? 'image/*' : 'application/pdf,image/*,.dicom,.doc,.docx'}
                      onChange={(e) => handleSimulatedFileUpload(e, uploadCategory)}
                      className="hidden"
                    />
                    <label
                      htmlFor="case-file-upload-input"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs rounded-xl cursor-pointer inline-flex items-center gap-1.5 border border-slate-700 shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5 text-teal-400" />
                      <span>{t.chooseFileBtn}</span>
                    </label>

                    {/* Camera Photo Capture Direct Action Button */}
                    <input
                      type="file"
                      id="case-photo-camera-capture"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handleSimulatedFileUpload(e, 'photo')}
                      className="hidden"
                    />
                    <label
                      htmlFor="case-photo-camera-capture"
                      className="px-4 py-2 bg-purple-900/60 hover:bg-purple-800 text-purple-200 font-bold text-xs rounded-xl cursor-pointer inline-flex items-center gap-1.5 border border-purple-700/60 shadow-sm"
                    >
                      <Camera className="w-3.5 h-3.5 text-purple-300" />
                      <span>{t.uploadPhotoActionBtn}</span>
                    </label>
                  </div>
                </div>

                {/* Display List of Attached Files with Badges */}
                {attachedFilesList.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-300 block">
                      {currentLang === 'ar' ? 'الملفات المرفقة لتقرير الحالة:' : 'Attached Diagnostic Files & Reports:'} ({attachedFilesList.length})
                    </span>

                    <div className="grid gap-2">
                      {attachedFilesList.map(item => (
                        <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-3 animate-fade-in">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {item.previewUrl ? (
                              <img src={item.previewUrl} alt="Preview" className="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0 bg-slate-900" />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 text-teal-400">
                                {item.category === 'lab_report' && <FlaskConical className="w-4 h-4 text-emerald-400" />}
                                {item.category === 'doctor_report' && <FileText className="w-4 h-4 text-sky-400" />}
                                {item.category === 'photo' && <Camera className="w-4 h-4 text-purple-400" />}
                                {item.category === 'mri' && <Upload className="w-4 h-4 text-teal-400" />}
                              </div>
                            )}

                            <div className="min-w-0">
                              <span className="text-xs font-bold text-white block truncate" title={item.name}>
                                {item.name}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <span className={`px-1.5 py-0.2 rounded font-semibold ${
                                  item.category === 'lab_report' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                                  item.category === 'doctor_report' ? 'bg-sky-950 text-sky-300 border border-sky-800' :
                                  item.category === 'photo' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                                  'bg-slate-800 text-teal-300 border border-slate-700'
                                }`}>
                                  {item.category === 'lab_report' && t.labReportBadge}
                                  {item.category === 'doctor_report' && t.doctorReportBadge}
                                  {item.category === 'photo' && t.photoBadge}
                                  {item.category === 'mri' && t.mriBadge}
                                </span>
                                <span>{item.size}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeAttachedFile(item.id)}
                            className="p-1 rounded-lg hover:bg-rose-950 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isAnalyzingFile}
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAnalyzingFile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.analyzingCaseWithAi}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-teal-200" />
                    <span>{t.analyzeCaseAndMatchBtn}</span>
                  </>
                )}
              </button>
            </form>

            {/* AI Triage & Specialist Selection Result */}
            {aiTriageResult && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-teal-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> {t.aiCaseTriageReport}
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">{t.readyStatus}</span>
                </div>

                <p className="text-slate-300 leading-relaxed">{aiTriageResult.clinicalSummary}</p>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 block">{t.recommendedSpecialistsForCase}</span>
                    <span className="text-[11px] text-teal-400 font-semibold">
                      {countryDoctors.length} {countryDoctors.length === 1 ? 'Specialist Available' : 'Specialists Available'} in {selectedCountry === 'DE' ? 'Germany 🇩🇪' : 'Jordan 🇯🇴'}
                    </span>
                  </div>
                  
                  {countryDoctors.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {countryDoctors.map((doc, idx) => {
                        const isSelected = selectedDoctor?.id === doc.id || (!selectedDoctor && idx === 0);
                        return (
                          <div
                            key={doc.id}
                            onClick={() => setSelectedDoctor(doc)}
                            className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all relative ${
                              isSelected
                                ? 'bg-teal-950/90 border-teal-500 ring-2 ring-teal-500/30'
                                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {idx === 0 && (
                              <span className="absolute top-2 right-2 bg-teal-500 text-slate-950 font-extrabold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                                ✨ Top AI Match
                              </span>
                            )}
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-white text-sm block">{doc.name}</span>
                            </div>
                            <span className="text-slate-300 text-[11px] font-medium block">{doc.title || doc.specialty} · {doc.hospital}</span>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
                              <span className="text-teal-400 text-[10px] font-bold">{t.nextSlotLabel} {doc.nextAvailable || 'Today'}</span>
                              <span className="text-white font-extrabold text-xs">
                                {currentCurrency === 'EUR' ? `€${doc.feeEur}` : (currentCurrency === 'JOD' ? `${doc.feeJod} JOD` : `$${doc.feeUsd}`)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs flex items-center gap-2">
                      <span className="text-teal-400 font-bold">ℹ️</span>
                      <span>No individual physicians registered in {selectedCountry === 'DE' ? 'Germany 🇩🇪' : 'Jordan 🇯🇴'} yet. Your case will be assigned to the Medical Board Queue until a specialist accepts it.</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleFinalSubmitCase}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.submitCaseToBtn} {selectedDoctor ? selectedDoctor.name : (countryDoctors[0]?.name || (selectedCountry === 'DE' ? 'German Medical Board' : 'Jordanian Medical Board'))}</span>
                </button>
              </div>
            )}

          </div>
        )}

        {/* STEP 3B: ASK FOR APPOINTMENT (SPECIALTY SELECT & CASE BRIEF -> AUTOMATED ASSIGNMENT) */}
        {selectedCountry !== null && selectedPath === 'book_appointment' && !isSuccessSubmitted && (
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedPath(null)} className="text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1">
                  <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} /> {t.backBtn}
                </button>
                <span className="text-slate-600">|</span>
                <span className="text-xs font-bold text-sky-400">
                  {selectedCountry === 'DE' ? `🇩🇪 ${t.germanMedicalCorridorAppointment}` : `🇯🇴 ${t.jordanMedicalCorridorAppointment}`}
                </span>
              </div>

              <span className="text-xs text-slate-400">{t.step3Of3}</span>
            </div>

            {/* PHASE 1: IF DOCTOR HAS NOT BEEN ASSIGNED YET -> CHOOSE SPECIALTY & BRIEF CASE */}
            {!selectedDoctor ? (
              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold px-3 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>{t.specialtyTriageTag}</span>
                  </div>

                  <h2 className="text-xl font-bold text-white">{t.selectRequiredSpecialtyTitle}</h2>
                  <p className="text-xs text-slate-300">
                    {t.selectRequiredSpecialtyDesc}
                  </p>
                </div>

                {/* Specialty Selection Grid */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">{t.selectMedicalSpecialtyLabel}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      { name: 'Neurology', label: t.neurologyLabel, desc: t.neurologyDesc },
                      { name: 'Cardiology', label: t.cardiologyLabel, desc: t.cardiologyDesc },
                      { name: 'Orthopedics', label: t.orthopedicsLabel, desc: t.orthopedicsDesc },
                      { name: 'Oncology', label: t.oncologyLabel, desc: t.oncologyDesc },
                      { name: 'Pediatrics', label: t.pediatricsLabel, desc: t.pediatricsDesc },
                      { name: 'Dermatology', label: t.dermatologyLabel, desc: t.dermatologyDesc }
                    ].map(spec => (
                      <button
                        key={spec.name}
                        type="button"
                        onClick={() => setSelectedSpecialty(spec.name as Specialty)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedSpecialty === spec.name
                            ? 'bg-teal-950 border-teal-500 ring-2 ring-teal-500/30 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="block text-white font-bold">{spec.label}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{spec.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Case Brief & File / Voice Note Input */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-slate-200 block">{t.briefSummaryAndAttachLabel}</label>

                  {/* Voice Note Recorder Integration */}
                  <VoiceNoteRecorder
                    currentLang={currentLang}
                    label={t.recordVoiceNoteLabel}
                    onTranscriptionComplete={(text) => {
                      setCaseSymptoms(prev => prev ? `${prev}\n\n[Voice Note]: ${text}` : text);
                    }}
                  />

                  {/* File Attachment Drop Zone */}
                  <div className="border-2 border-dashed border-slate-700 rounded-2xl p-4 text-center bg-slate-900/60 hover:border-teal-500 transition-colors">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Upload className="w-5 h-5 text-teal-400" />
                      <span className="text-xs font-bold text-white">{t.attachMedicalFileOptional}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mb-2">{t.attachPdfReportsDesc}</span>
                    
                    <input
                      type="file"
                      id="appointment-file"
                      onChange={handleSimulatedFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="appointment-file"
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs rounded-xl cursor-pointer inline-block border border-slate-700 transition-colors"
                    >
                      {fileName ? `${t.fileSelectedPrefix} ${fileName}` : t.attachFileRecordBtn}
                    </label>
                  </div>

                  <textarea
                    required
                    value={caseSymptoms}
                    onChange={(e) => setCaseSymptoms(e.target.value)}
                    rows={3}
                    placeholder={t.briefSymptomsPlaceholder}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-teal-500 leading-relaxed"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const specToMatch = selectedSpecialty === 'ALL' ? 'Neurology' : selectedSpecialty;
                    const matchedDoc = countryDoctors.find(d => d.specialty === specToMatch) || countryDoctors[0] || MOCK_DOCTORS[0];
                    setSelectedDoctor(matchedDoc);
                  }}
                  className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t.assignBestMatchedSpecialistBtn} {selectedCountry === 'DE' ? 'Germany 🇩🇪' : 'Jordan 🇯🇴'}</span>
                </button>
              </div>
            ) : (
              /* PHASE 2: SYSTEM ASSIGNED DOCTOR SHOWCASE & BOOKING CONFIRMATION */
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.specialistAssignedSuccess}</span>
                  </div>

                  <h2 className="text-xl font-bold text-white">{t.assignedSpecialistHeader} ({t[selectedDoctor.specialty] || selectedDoctor.specialty})</h2>
                  <p className="text-xs text-slate-300">
                    {t.assignedSpecialistDesc} <strong>{selectedDoctor.country === 'DE' ? t.germany : t.jordan}</strong>.
                  </p>
                </div>

                {/* ASSIGNED DOCTOR CARD */}
                <div className="bg-slate-900 border-2 border-teal-500 rounded-2xl p-6 space-y-4 relative overflow-hidden shadow-xl">
                  
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded">
                          {t.bestClinicalMatchBadge} ({t[selectedDoctor.specialty] || selectedDoctor.specialty})
                        </span>
                        <span className="text-xs text-slate-400">
                          {selectedDoctor.country === 'DE' ? '🇩🇪 Germany' : '🇯🇴 Jordan'} · {selectedDoctor.city}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white">{selectedDoctor.name}</h3>
                      <p className="text-xs font-semibold text-teal-300">{selectedDoctor.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{selectedDoctor.hospital}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 block uppercase">{t.consultationFeeTitle}</span>
                      <span className="text-lg font-extrabold text-teal-400">
                        {currentCurrency === 'EUR' ? `€${selectedDoctor.feeEur}` : (currentCurrency === 'JOD' ? `${selectedDoctor.feeJod} JOD` : `$${selectedDoctor.feeUsd}`)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                    {selectedDoctor.bio}
                  </p>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-300 font-medium">
                      <span>{t.assignedAppointmentDate}</span>
                      <strong className="text-white">Saturday, Oct 10, 2026</strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-300 font-mono">
                      <span>{t.synchronizedTimings}</span>
                      <strong className="text-teal-400">🇯🇴 {selectedDoctor.country === 'DE' ? '16:00 EET' : '11:00 EET'} / 🇩🇪 {selectedDoctor.country === 'DE' ? '15:00 CET' : '10:00 CET'}</strong>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDoctor(null)}
                      className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                    >
                      {t.changeSpecialtyBtn}
                    </button>

                    <button
                      type="button"
                      onClick={handleFinalSubmitCase}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.confirmAndBookAppointmentBtn} ({selectedDoctor.name})</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* STEP SUCCESS CONFIRMATION */}
        {isSuccessSubmitted && (
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-extrabold text-white">
              {selectedPath === 'upload_case' ? t.caseSubmittedSuccessfully : t.appointmentRequestConfirmed}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
              {t.registeredNotification}
            </p>

            <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl text-xs space-y-2 text-slate-300 text-left max-w-md mx-auto" dir={isRtl ? 'rtl' : 'ltr'}>
              <div className="flex justify-between">
                <span className="text-slate-400">{t.consultancyHubLabel}</span>
                <span className="font-bold text-white">{selectedCountry === 'DE' ? '🇩🇪 Germany' : '🇯🇴 Jordan'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t.scheduledTimeLabel}</span>
                <span className="font-bold text-teal-400">🇯🇴 {selectedSlot.amman} EET / 🇩🇪 {selectedSlot.berlin} CET</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t.patientLabel}</span>
                <span className="font-bold text-white">{patientName} ({patientPhone})</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={resetFlow}
                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-colors"
              >
                {t.startAnotherRequestBtn}
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
