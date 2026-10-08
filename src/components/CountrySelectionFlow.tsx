import React, { useState } from 'react';
import { CountryCode, LanguageCode, CurrencyCode, Doctor, ConsultationType, Specialty, Appointment } from '../types';
import { TRANSLATIONS } from '../translations/translations';
import { MOCK_DOCTORS } from '../data/mockData';
import { VoiceNoteRecorder } from './VoiceNoteRecorder';
import { Globe, FileUp, Calendar, ArrowRight, CheckCircle2, Sparkles, ShieldCheck, Stethoscope, Clock, Award, Building, User, ChevronRight, Upload, Loader2, ArrowLeft } from 'lucide-react';

interface CountrySelectionFlowProps {
  currentLang: LanguageCode;
  currentCurrency: CurrencyCode;
  onSelectCountryAndPath: (country: 'DE' | 'JO', path: 'upload_case' | 'book_appointment', doctor?: Doctor) => void;
  onCompleteBooking: (app: Partial<Appointment>) => void;
}

export const CountrySelectionFlow: React.FC<CountrySelectionFlowProps> = ({
  currentLang,
  currentCurrency,
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
  const [fileName, setFileName] = useState('');
  const [isAnalyzingFile, setIsAnalyzingFile] = useState(false);
  const [aiTriageResult, setAiTriageResult] = useState<any>(null);

  // Appointment Slot State
  const [selectedDate, setSelectedDate] = useState('2026-10-10');
  const [selectedSlot, setSelectedSlot] = useState({ amman: '16:00', berlin: '15:00' });
  const [patientName, setPatientName] = useState('Omar Al-Masmoudi');
  const [patientEmail, setPatientEmail] = useState('omar.masmoudi@example.com');
  const [patientPhone, setPatientPhone] = useState('+962 7 9123 4567');

  const [isSuccessSubmitted, setIsSuccessSubmitted] = useState(false);

  // Filtered doctors for chosen country
  const countryDoctors = MOCK_DOCTORS.filter(d => d.country === selectedCountry);
  const displayDoctors = selectedSpecialty === 'ALL' 
    ? countryDoctors 
    : countryDoctors.filter(d => d.specialty === selectedSpecialty);

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
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
        clinicalSummary: `Case submitted for ${selectedCountry === 'DE' ? 'German' : 'Jordanian'} medical board evaluation. High priority review assigned.`,
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
    onCompleteBooking({
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialty: doc.specialty,
      doctorCountry: doc.country,
      doctorHospital: doc.hospital,
      patientName,
      patientEmail,
      patientPhone,
      consultationType: selectedPath === 'upload_case' ? 'second_opinion' : 'video',
      date: selectedDate,
      timeAmman: selectedSlot.amman,
      timeBerlin: selectedSlot.berlin,
      symptoms: caseSymptoms || caseTitle,
      aiSummary: aiTriageResult?.clinicalSummary || 'Medical case file uploaded for specialist review.',
      totalFee: currentCurrency === 'EUR' ? doc.feeEur : (currentCurrency === 'JOD' ? doc.feeJod : doc.feeUsd),
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
            <span>Cross-Border Direct Medical Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight font-sans">
            Direct Specialist Medical Care Between Jordan & Germany
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Follow our 2-step direct gateway: Select your preferred consultancy country corridor, then upload your medical case or request an appointment directly.
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
              <span>1. Choose Consultancy Location</span>
              {selectedCountry && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <span className="text-slate-600">➔</span>

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              selectedCountry !== null && selectedPath === null
                ? 'bg-teal-500 text-slate-950 font-extrabold ring-2 ring-teal-400/40 shadow-lg'
                : (selectedPath !== null ? 'bg-slate-800 text-teal-300' : 'bg-slate-800/50 text-slate-500')
            }`}>
              <span>2. Upload File or Request Appointment</span>
              {selectedPath && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </div>

            {selectedPath && (
              <>
                <span className="text-slate-600">➔</span>
                <div className="bg-teal-500 text-slate-950 font-extrabold px-3 py-1.5 rounded-full shadow-lg">
                  3. Specialist Review
                </div>
              </>
            )}
          </div>
        </div>

        {/* STEP 1: CHOOSE COUNTRY CONSULTANCY (GERMANY 🇩🇪 OR JORDAN 🇯🇴) */}
        {selectedCountry === null && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <h2 className="text-center text-xs font-bold uppercase tracking-wider text-slate-400">
              STEP 1: SELECT YOUR CONSULTANCY COUNTRY CORRIDOR
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
                      <span className="text-xs font-bold text-sky-400 uppercase tracking-widest block">German Consultancy</span>
                      <h3 className="text-2xl font-extrabold text-white group-hover:text-sky-300 transition-colors">
                        Consult Doctors in Germany
                      </h3>
                    </div>
                  </div>

                  <span className="p-2 rounded-xl bg-sky-500/20 text-sky-300 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Direct access to leading professors, chief physicians, and research directors at <strong>Charité University Medicine Berlin</strong>, <strong>Heidelberg University Clinics</strong>, and <strong>LMU Munich Hospital</strong>.
                </p>

                <div className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Neuro-oncology, Complex Cardiac & GI Cancer Specialists</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>German Medical Council Certified (Facharzt / Professor)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Real-time German-Arabic-English AI live translation</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-slate-950 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-sky-900/30">
                  <span>Select German Consultancy 🇩🇪</span>
                  <ChevronRight className="w-4 h-4" />
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
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">Jordan Consultancy</span>
                      <h3 className="text-2xl font-extrabold text-white group-hover:text-amber-300 transition-colors">
                        Consult Doctors in Jordan
                      </h3>
                    </div>
                  </div>

                  <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Consult top Middle Eastern specialists and surgeons at <strong>King Hussein Medical Center</strong>, <strong>Amman Specialty Hospital</strong>, and <strong>Abdali Medical Center</strong> in Amman.
                </p>

                <div className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Pediatric Cardiology, Robotic Orthopedics & Laser Dermatology</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Jordan Medical Council & UK Royal College Board Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Synchronous Amman (EET) / European (CET) Scheduling</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30">
                  <span>Select Jordan Consultancy 🇯🇴</span>
                  <ChevronRight className="w-4 h-4" />
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
                  <span className="text-xs font-bold text-teal-300 block">Active Selected Corridor</span>
                  <span className="text-sm font-bold text-white">
                    {selectedCountry === 'DE' ? 'Germany Consultancy (Berlin, Heidelberg, Munich)' : 'Jordan Consultancy (Amman Medical Hub)'}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedCountry(null)}
                className="text-xs font-semibold text-slate-400 hover:text-white underline"
              >
                Change Country
              </button>
            </div>

            <h2 className="text-center text-xs font-bold uppercase tracking-wider text-slate-400">
              STEP 2: WHAT WOULD YOU LIKE TO DO NEXT?
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
                    Upload Your Medical Case File
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Upload Brain MRIs, X-Rays, Lab Reports, or CT scans. Gemini 3.8 Flash AI will analyze your case and match you with 3 expert {selectedCountry === 'DE' ? 'German' : 'Jordanian'} consultants.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-teal-400 font-bold">
                  <span>Fast Case Review (24h)</span>
                  <ChevronRight className="w-4 h-4" />
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
                    Ask for an Appointment
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Browse doctors from {selectedCountry === 'DE' ? 'Germany' : 'Jordan'}, view live dual-timezone time slots, and schedule a video consultation or second opinion call directly.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-sky-400 font-bold">
                  <span>Direct Doctor Scheduling</span>
                  <ChevronRight className="w-4 h-4" />
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
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <span className="text-slate-600">|</span>
                <span className="text-xs font-bold text-teal-400">
                  {selectedCountry === 'DE' ? '🇩🇪 German Medical Board Case Review' : '🇯🇴 Jordan Specialist Case Review'}
                </span>
              </div>

              <span className="text-xs text-slate-400">Step 3 of 3</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Upload Diagnostic Case File & History</h2>
              <p className="text-xs text-slate-300">
                Attach your medical reports, MRIs, or lab results. AI will translate medical terms and structure the intake for {selectedCountry === 'DE' ? 'German' : 'Jordanian'} doctors.
              </p>
            </div>

            <form onSubmit={handleRunAiCaseTriage} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-200 block mb-1">Case Title or Main Complaint</label>
                <input
                  type="text"
                  required
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder="e.g. Brain MRI Second Opinion / Cardiac Valve Review Request"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Voice Note Recorder Integration */}
              <VoiceNoteRecorder
                currentLang={currentLang}
                label="Record Voice Symptom Note (AI Transcribed)"
                onTranscriptionComplete={(text) => {
                  setCaseSymptoms(prev => prev ? `${prev}\n\n[Voice Note Transcribed]: ${text}` : text);
                }}
              />

              <div>
                <label className="font-bold text-slate-200 block mb-1">Detailed Symptoms & Medical History</label>
                <textarea
                  required
                  value={caseSymptoms}
                  onChange={(e) => setCaseSymptoms(e.target.value)}
                  rows={3}
                  placeholder="Describe onset, duration, previous treatments, and specific questions..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-teal-500 leading-relaxed"
                />
              </div>

              {/* Upload Drop Zone */}
              <div className="border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center bg-slate-900/60 hover:border-teal-500 transition-colors">
                <Upload className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                <span className="text-xs font-bold text-white block">Upload Medical Reports / MRI DICOM / PDF</span>
                <span className="text-[11px] text-slate-400 block mb-3">Supported: PDF, JPG, PNG, DICOM (Max 50MB)</span>
                
                <input
                  type="file"
                  id="case-file"
                  onChange={handleSimulatedFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="case-file"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs rounded-xl cursor-pointer inline-block border border-slate-700"
                >
                  {fileName ? `File Selected: ${fileName}` : 'Choose File from Device'}
                </label>
              </div>

              <button
                type="submit"
                disabled={isAnalyzingFile}
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAnalyzingFile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Case with Gemini 3.8 AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-teal-200" />
                    <span>Analyze Case & Match {selectedCountry === 'DE' ? 'German' : 'Jordanian'} Doctors</span>
                  </>
                )}
              </button>
            </form>

            {/* AI Triage & Specialist Selection Result */}
            {aiTriageResult && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-teal-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> AI Case Triage Report
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">Ready</span>
                </div>

                <p className="text-slate-300 leading-relaxed">{aiTriageResult.clinicalSummary}</p>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="font-bold text-slate-200 block">Recommended {selectedCountry === 'DE' ? 'German' : 'Jordanian'} Specialists for Your Case:</span>
                  
                  <div className="grid sm:grid-cols-2 gap-3">
                    {countryDoctors.slice(0, 2).map(doc => (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoctor(doc)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedDoctor?.id === doc.id
                            ? 'bg-teal-950 border-teal-500 ring-2 ring-teal-500/20'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-bold text-white block">{doc.name}</span>
                        <span className="text-slate-400 text-[11px] block">{doc.specialty} · {doc.hospital}</span>
                        <span className="text-teal-400 text-[10px] font-bold mt-1 block">Next Slot: {doc.nextAvailable}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleFinalSubmitCase}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Case to {selectedDoctor ? selectedDoctor.name : countryDoctors[0]?.name}</span>
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
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <span className="text-slate-600">|</span>
                <span className="text-xs font-bold text-sky-400">
                  {selectedCountry === 'DE' ? '🇩🇪 German Medical Corridor Appointment' : '🇯🇴 Jordan Medical Corridor Appointment'}
                </span>
              </div>

              <span className="text-xs text-slate-400">Step 3 of 3</span>
            </div>

            {/* PHASE 1: IF DOCTOR HAS NOT BEEN ASSIGNED YET -> CHOOSE SPECIALTY & BRIEF CASE */}
            {!selectedDoctor ? (
              <div className="space-y-6">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold px-3 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>Specialty Triage & Case Brief</span>
                  </div>

                  <h2 className="text-xl font-bold text-white">Select Required Specialty & Brief Your Case</h2>
                  <p className="text-xs text-slate-300">
                    Choose the required medical specialty and brief your symptoms or condition. Our clinical engine will automatically assign the best-matched {selectedCountry === 'DE' ? 'German' : 'Jordanian'} consultant.
                  </p>
                </div>

                {/* Specialty Selection Grid */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">1. Select Medical Specialty Needed:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      { name: 'Neurology', label: '🧠 Neurology (Brain/Nerves)', desc: 'Headaches, Stroke, Tumors' },
                      { name: 'Cardiology', label: '🫀 Cardiology (Heart)', desc: 'Valve, Surgery, Arrhythmia' },
                      { name: 'Orthopedics', label: '🦴 Orthopedics (Joints/Spine)', desc: 'Knee, Hip, Spinal Care' },
                      { name: 'Oncology', label: '🎗️ Oncology (Cancer Care)', desc: 'Molecular & Targeted Therapy' },
                      { name: 'Pediatrics', label: '👶 Pediatrics (Children)', desc: 'Child & Congenital Care' },
                      { name: 'Dermatology', label: '🩺 Dermatology (Skin)', desc: 'Skin, Laser, Biologics' }
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
                  <label className="text-xs font-bold text-slate-200 block">2. Brief Summary & Attach Medical Files / Voice Note:</label>

                  {/* Voice Note Recorder Integration */}
                  <VoiceNoteRecorder
                    currentLang={currentLang}
                    label="Record Voice Symptom Note (AI Transcribed)"
                    onTranscriptionComplete={(text) => {
                      setCaseSymptoms(prev => prev ? `${prev}\n\n[Voice Note]: ${text}` : text);
                    }}
                  />

                  {/* File Attachment Drop Zone */}
                  <div className="border-2 border-dashed border-slate-700 rounded-2xl p-4 text-center bg-slate-900/60 hover:border-teal-500 transition-colors">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Upload className="w-5 h-5 text-teal-400" />
                      <span className="text-xs font-bold text-white">Attach Medical File / MRI Scan (Optional)</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mb-2">Attach PDF reports, lab results, or imaging scans</span>
                    
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
                      {fileName ? `Attached: ${fileName}` : '📎 Attach File / Medical Record'}
                    </label>
                  </div>

                  <textarea
                    required
                    value={caseSymptoms}
                    onChange={(e) => setCaseSymptoms(e.target.value)}
                    rows={3}
                    placeholder="Briefly describe your symptoms, duration, or main questions for the appointment..."
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
                  <span>Assign Best-Matched Specialist in {selectedCountry === 'DE' ? 'Germany 🇩🇪' : 'Jordan 🇯🇴'}</span>
                </button>
              </div>
            ) : (
              /* PHASE 2: SYSTEM ASSIGNED DOCTOR SHOWCASE & BOOKING CONFIRMATION */
              <div className="space-y-5 animate-fade-in">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Specialist Successfully Assigned By System</span>
                  </div>

                  <h2 className="text-xl font-bold text-white">Assigned {selectedDoctor.specialty} Specialist</h2>
                  <p className="text-xs text-slate-300">
                    Based on your selected specialty (<strong>{selectedDoctor.specialty}</strong>) and case brief, the system has automatically assigned the highest-rated consultant in {selectedDoctor.country === 'DE' ? 'Germany' : 'Jordan'}.
                  </p>
                </div>

                {/* ASSIGNED DOCTOR CARD */}
                <div className="bg-slate-900 border-2 border-teal-500 rounded-2xl p-6 space-y-4 relative overflow-hidden shadow-xl">
                  
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded">
                          🎯 99% Best Clinical Match ({selectedDoctor.specialty})
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
                      <span className="text-[10px] text-slate-400 block uppercase">Consultation Fee</span>
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
                      <span>Assigned Appointment Date:</span>
                      <strong className="text-white">Saturday, Oct 10, 2026</strong>
                    </div>

                    <div className="flex items-center justify-between text-slate-300 font-mono">
                      <span>Synchronized Timings:</span>
                      <strong className="text-teal-400">🇯🇴 {selectedDoctor.country === 'DE' ? '16:00 EET' : '11:00 EET'} / 🇩🇪 {selectedDoctor.country === 'DE' ? '15:00 CET' : '10:00 CET'}</strong>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDoctor(null)}
                      className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                    >
                      Change Specialty
                    </button>

                    <button
                      type="button"
                      onClick={handleFinalSubmitCase}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Book Appointment ({selectedDoctor.name})</span>
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
              {selectedPath === 'upload_case' ? 'Medical Case Submitted Successfully!' : 'Appointment Request Confirmed!'}
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
              Your request for <strong>{selectedCountry === 'DE' ? 'German Consultancy (Berlin / Heidelberg)' : 'Jordan Consultancy (Amman)'}</strong> with <strong>{selectedDoctor?.name || 'Selected Specialist'}</strong> has been registered.
            </p>

            <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl text-xs space-y-2 text-slate-300 text-left max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Consultancy Hub:</span>
                <span className="font-bold text-white">{selectedCountry === 'DE' ? '🇩🇪 Germany' : '🇯🇴 Jordan'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scheduled Time:</span>
                <span className="font-bold text-teal-400">🇯🇴 {selectedSlot.amman} EET / 🇩🇪 {selectedSlot.berlin} CET</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patient:</span>
                <span className="font-bold text-white">{patientName} ({patientPhone})</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={resetFlow}
                className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Start Another Request
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
