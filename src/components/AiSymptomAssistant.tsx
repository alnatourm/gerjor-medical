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
        clinicalSummary: currentLang === 'ar' ? 'يصف المريض أعراضاً حادة تتطلب تقييماً استشارياً متخضصاً. يوصى بإرفاق الفحوصات والأشعة السابقة خلال استشارة الفيديو.' : (currentLang === 'de' ? 'Der Patient beschreibt akute Symptome, die eine fachärztliche Beurteilung erfordern. Relevante Befunde sollten bereitgestellt werden.' : 'Patient describes acute symptoms requiring specialist evaluation. Relevant diagnostic imaging and previous prescriptions should be provided during video consultation.'),
        keyMedicalTerms: [
          { english: 'Symptom Review', arabic: 'مراجعة الأعراض', german: 'Symptomüberprüfung' },
          { english: 'Neurological Assessment', arabic: 'تقييم عصبي', german: 'Neurologische Beurteilung' }
        ],
        suggestedDoctorQuestions: [
          currentLang === 'ar' ? 'ما هي الفحوصات الشعاعية الموصى بها؟' : 'What is the recommended diagnostic imaging?',
          currentLang === 'ar' ? 'هل هناك توصيات بخصوص الأدوية أو نمط الحياة؟' : 'Are there any lifestyle or medication adjustments required?',
          currentLang === 'ar' ? 'هل تنصح برأي طبي ثانٍ من استشاري في ألمانيا؟' : 'Is a follow-up second opinion from a German specialist advised?'
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
            <span>{t.geminiAiAssistantTag}</span>
          </div>

          <h3 className="text-xl font-bold text-white">
            {t.describeSymptomsTitle}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t.describeSymptomsDesc}
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 text-xs">
          
          <form onSubmit={handleAnalyze} className="space-y-3">
            <VoiceNoteRecorder
              currentLang={currentLang}
              label={t.recordVoiceNoteLabel}
              onTranscriptionComplete={(text) => {
                setInputPrompt(prev => prev ? `${prev}\n\n[Voice Note]: ${text}` : text);
              }}
            />

            <label className="font-bold text-slate-200 block text-xs">
              {t.enterSymptomsLabel}
            </label>

            <textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={t.symptomsInputPlaceholder}
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
                  <span>{t.processingAiTranslation}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-200" />
                  <span>{t.generateDoctorReportBtn}</span>
                </>
              )}
            </button>
          </form>

          {/* AI Result Card */}
          {analysisResult && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4 text-slate-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-teal-400 flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-teal-400" /> {t.structuredIntakeReportHeader}
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                  {t.readyForDoctorBadge}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.primaryConcernLabel}</span>
                <p className="font-semibold text-white text-xs">{analysisResult.chiefComplaint}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{t.bilingualSummaryLabel}</span>
                <p className="text-slate-300 leading-relaxed text-xs">{analysisResult.clinicalSummary}</p>
              </div>

              {analysisResult.keyMedicalTerms && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1.5">{t.translatedMedicalTermsLabel}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {analysisResult.keyMedicalTerms.map((term: any, idx: number) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 p-2 rounded-lg text-[11px] space-y-0.5">
                        <span className="font-bold text-teal-300 block">{term.english}</span>
                        <div className="text-slate-400 flex items-center justify-between text-[10px]">
                          <span>🇦🇪 {term.arabic}</span>
                          <span>🇩🇪 {term.german}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysisResult.suggestedDoctorQuestions && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">{t.recommendedDoctorQuestionsLabel}</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                    {analysisResult.suggestedDoctorQuestions.map((q: string, idx: number) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
