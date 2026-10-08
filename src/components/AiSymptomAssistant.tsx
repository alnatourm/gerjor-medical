import React, { useState } from 'react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../translations/translations';
import { VoiceNoteRecorder } from './VoiceNoteRecorder';
import { Sparkles, X, Send, Bot, FileText, Globe, Check, Loader2, Stethoscope, AlertTriangle } from 'lucide-react';

interface AiSymptomAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageCode;
  onSelectDoctorToBook?: () => void;
}

export const AiSymptomAssistant: React.FC<AiSymptomAssistantProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSelectDoctorToBook
}) => {
  if (!isOpen) return null;
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAiResult] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/pre-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: inputPrompt,
          patientLanguage: currentLang
        })
      });
      const data = await response.json();
      setAiResult(data.data || {
        chiefComplaint: inputPrompt,
        chronology: 'Reported symptoms',
        clinicalSummary: 'Patient describes acute symptoms requiring specialist evaluation. Relevant diagnostic imaging and previous prescriptions should be provided during video consultation.',
        keyMedicalTerms: [
          { english: 'Symptom Review', arabic: 'مراجعة الأعراض', german: 'Symptomüberprüfung' },
          { english: 'Neurological Assessment', arabic: 'تقييم العصبي', german: 'Neurologische Beurteilung' }
        ],
        suggestedDoctorQuestions: [
          'What is the recommended diagnostic imaging?',
          'Are there any lifestyle or medication adjustments required?',
          'Is a follow-up second opinion from a German specialist advised?'
        ]
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 space-y-2">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Gemini 3.8 Flash AI Pre-Consultation Assistant</span>
          </div>

          <h3 className="text-xl font-bold text-white">
            Describe Symptoms in Any Language (AR / DE / EN)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Gemini AI will organize your health complaints into a clinical pre-consultation report translated for Jordanian & German specialists.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 text-xs">
          
          <form onSubmit={handleAnalyze} className="space-y-3">
            <VoiceNoteRecorder
              currentLang={currentLang}
              label="Record Voice Symptom Note (AI Transcribed)"
              onTranscriptionComplete={(text) => {
                setInputPrompt(prev => prev ? `${prev}\n\n[Voice Note]: ${text}` : text);
              }}
            />

            <label className="font-bold text-slate-200 block text-xs">
              Enter your current symptoms, medical questions, or history:
            </label>

            <textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="e.g. ألم في الصدر عند المشي المسافات الطويلة مع ضيق في التنفس / Ich habe seit 2 Wochen chronische Rückenschmerzen..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-3 focus:outline-none focus:border-teal-500 leading-relaxed"
            />

            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-900/30 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Processing Clinical AI Translation...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-200" />
                  <span>Generate Doctor Pre-Consultation Report</span>
                </>
              )}
            </button>
          </form>

          {/* AI Result Card */}
          {analysisResult && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4 text-slate-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-teal-400 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-teal-400" /> Structured Clinical Intake Report
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                  Ready for Doctor
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Primary Concern</span>
                <p className="font-semibold text-white text-xs">{analysisResult.chiefComplaint}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Bilingual Clinical Summary</span>
                <p className="text-slate-300 leading-relaxed text-xs">{analysisResult.clinicalSummary}</p>
              </div>

              {analysisResult.keyMedicalTerms && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1.5">Translated Medical Terms</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {analysisResult.keyMedicalTerms.map((term: any, idx: number) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 p-2 rounded-lg text-[11px] space-y-0.5">
                        <span className="text-teal-300 font-bold block">🇬🇧 {term.english}</span>
                        <span className="text-amber-300 block">🇯🇴 {term.arabic}</span>
                        <span className="text-sky-300 block">🇩🇪 {term.german}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysisResult.suggestedDoctorQuestions && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Suggested Discussion Questions for Doctor</span>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {analysisResult.suggestedDoctorQuestions.map((q: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-teal-400 font-bold">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                <button
                  onClick={() => {
                    onClose();
                    if (onSelectDoctorToBook) onSelectDoctorToBook();
                  }}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Book Consultation With This Intake</span>
                </button>
              </div>

            </div>
          )}

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>Note: This AI tool provides administrative pre-consultation intake summaries for physicians and does not replace direct medical advice from a licensed medical consultant.</span>
          </div>

        </div>

      </div>
    </div>
  );
};
