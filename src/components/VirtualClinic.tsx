import React, { useState, useEffect } from 'react';
import { LanguageCode, CurrencyCode, Appointment, MedicalRecord } from '../types';
import { TRANSLATIONS } from '../translations/translations';
import { Video, VideoOff, Mic, MicOff, Globe, Sparkles, FileText, Send, Clock, ShieldCheck, Check, Download, AlertCircle, Maximize2, RefreshCw } from 'lucide-react';

interface VirtualClinicProps {
  currentLang: LanguageCode;
  currentCurrency: CurrencyCode;
  appointment?: Appointment | null;
  onCloseRoom: () => void;
}

export const VirtualClinic: React.FC<VirtualClinicProps> = ({
  currentLang,
  currentCurrency,
  appointment,
  onCloseRoom
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isTranslating, setIsTranslating] = useState<boolean>(true);
  
  // Tab state inside virtual clinic
  const [activeSideTab, setActiveSideTab] = useState<'captions' | 'notes' | 'records' | 'prescription'>('captions');

  // Simulated Live Subtitles
  const [captions, setCaptions] = useState<Array<{ sender: string; original: string; translatedAr: string; translatedDe: string; translatedEn: string; time: string }>>([
    {
      sender: 'Prof. Dr. med. Sabine Weber (Berlin)',
      original: 'Guten Tag Herr Al-Masmoudi. Ich habe Ihren MRT-Befund aus Amman geprüft.',
      translatedAr: 'مساء الخير أستاذ عمر. لقد راجعت تقرير الرنين المغناطيسي الصادر من عمان.',
      translatedDe: 'Guten Tag Herr Al-Masmoudi. Ich habe Ihren MRT-Befund aus Amman geprüft.',
      translatedEn: 'Good day Mr. Al-Masmoudi. I have reviewed your MRI scan from Amman.',
      time: '15:02:10'
    },
    {
      sender: 'Patient (Omar Al-Masmoudi)',
      original: 'أهلاً دكتورة. أردت التأكد من عدم وجود أي خطورة بالنسبة للصداع التوتر المتكرر.',
      translatedAr: 'أهلاً دكتورة. أردت التأكد من عدم وجود أي خطورة بالنسبة للصداع التوتر المتكرر.',
      translatedDe: 'Hallo Frau Doktor. Ich wollte sicherstellen, dass keine Gefahr bezüglich der Kopfschmerzen besteht.',
      translatedEn: 'Hello Doctor. I wanted to verify there is no acute risk regarding the recurrent headaches.',
      time: '15:02:45'
    }
  ]);

  const [newMessage, setNewMessage] = useState<string>('');
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);

  // Live Clinical Prescription Generator
  const [rxMeds, setRxMeds] = useState([
    { name: 'Topiramate', dosage: '25 mg', frequency: 'Once daily at bedtime', duration: '30 days' },
    { name: 'Magnesium Orotate', dosage: '500 mg', frequency: 'Twice daily with meals', duration: '60 days' }
  ]);
  const [rxNotes, setRxNotes] = useState('Maintain regular sleep schedule, stay hydrated, repeat neurology evaluation in 6 weeks.');
  const [rxIssued, setRxIssued] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userText = newMessage.trim();
    setNewMessage('');
    setIsSendingMessage(true);

    try {
      const response = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: userText,
          sourceLang: currentLang,
          targetLangs: ['en', 'ar', 'de']
        })
      });
      const data = await response.json();
      const translations = data.translations || {};

      setCaptions(prev => [
        ...prev,
        {
          sender: currentLang === 'ar' ? 'أنت (المريض)' : (currentLang === 'de' ? 'Sie (Patient)' : 'You (Patient)'),
          original: userText,
          translatedAr: translations.ar || userText,
          translatedDe: translations.de || userText,
          translatedEn: translations.en || userText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <section className="bg-slate-950 text-white min-h-screen py-6 px-4 sm:px-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Telehealth Room Top Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">{t.telehealthRoomTitle}</span>
                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                  {t.encrypted256}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Dr. {appointment?.doctorName || 'Prof. Dr. med. Sabine Weber'} (Charité Berlin) & Patient Omar Al-Masmoudi
              </p>
            </div>
          </div>

          {/* Clocks */}
          <div className="flex items-center gap-3 text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 font-mono">
            <div className="flex items-center gap-1.5">
              <span>🇯🇴 Amman:</span>
              <span className="text-teal-400 font-bold">16:15:30 EET</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span>🇩🇪 Berlin:</span>
              <span className="text-sky-400 font-bold">15:15:30 CET</span>
            </div>
          </div>

          <button
            onClick={onCloseRoom}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            {t.endCall}
          </button>
        </div>

        {/* Main Grid: Video Stream Left, Interactive Clinical Drawer Right */}
        <div className="grid lg:grid-cols-12 gap-4">
          
          {/* Video Stream Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Primary Doctor Video Viewport */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl aspect-video relative overflow-hidden shadow-2xl flex flex-col justify-between p-4">
              
              {/* Doctor Overlay Badge Top */}
              <div className="flex items-center justify-between z-10">
                <div className="bg-slate-950/80 backdrop-blur border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                  <div>
                    <span className="text-xs font-bold text-white block">Prof. Dr. med. Sabine Weber</span>
                    <span className="text-[10px] text-slate-400">Department of Neuro-Oncology · Berlin 🇩🇪</span>
                  </div>
                </div>

                <div className="bg-teal-950/80 border border-teal-800 text-teal-300 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>{t.realtimeAiTranslatorActive}</span>
                </div>
              </div>

              {/* Simulated HD Doctor Video Room Backdrop */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
                <div className="text-center space-y-3 p-6 max-w-md">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-sky-500 to-indigo-700 mx-auto flex items-center justify-center text-white text-3xl font-extrabold shadow-2xl ring-4 ring-sky-500/20">
                    SW
                  </div>
                  <div>
                    <span className="text-base font-bold text-white block">Prof. Dr. med. Sabine Weber</span>
                    <span className="text-xs text-slate-400">{t.hdEncryptedStream}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1 rounded-full font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{t.doctorConnectedBerlin}</span>
                  </div>
                </div>
              </div>

              {/* Self View Floating Camera PIP */}
              <div className="absolute bottom-4 right-4 w-40 h-28 bg-slate-950 border-2 border-slate-700 rounded-xl overflow-hidden shadow-2xl z-20 flex flex-col items-center justify-center p-2 text-center">
                <div className="w-10 h-10 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center text-xs mb-1">
                  OA
                </div>
                <span className="text-[10px] font-bold text-slate-200">Omar (Patient)</span>
                <span className="text-[9px] text-teal-400">{t.patientLocationAmman}</span>
              </div>

              {/* Bottom Controls Bar */}
              <div className="z-10 flex items-center justify-center gap-3 bg-slate-950/80 backdrop-blur border border-slate-800/80 p-2.5 rounded-2xl max-w-md mx-auto">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3 rounded-xl transition-all ${
                    isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
                  }`}
                  title={t.toggleMic}
                >
                  {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-3 rounded-xl transition-all ${
                    isVideoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
                  }`}
                  title={t.toggleCamera}
                >
                  {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setIsTranslating(!isTranslating)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isTranslating ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>{t.aiSubtitlesBtn} ({isTranslating ? 'ON' : 'OFF'})</span>
                </button>
              </div>

            </div>

            {/* Live Captions Display under video */}
            {isTranslating && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-bold text-teal-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> {t.captionNotice}
                  </span>
                  <span>{t.activeLangView}: <strong className="text-white uppercase">{currentLang}</strong></span>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {captions.map((cap, i) => (
                    <div key={i} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-teal-300">{cap.sender}</span>
                        <span>{cap.time}</span>
                      </div>
                      <p className="text-slate-200 font-medium">
                        {currentLang === 'ar' ? cap.translatedAr : (currentLang === 'de' ? cap.translatedDe : cap.translatedEn)}
                      </p>
                      <p className="text-[10px] text-slate-500 italic">
                        {t.originalLabel}: "{cap.original}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Clinical Workspace Column (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
            
            <div>
              {/* Side Drawer Tab Selector */}
              <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold text-slate-400 mb-4">
                <button
                  onClick={() => setActiveSideTab('captions')}
                  className={`py-1.5 rounded-lg transition-colors ${activeSideTab === 'captions' ? 'bg-teal-600 text-white' : 'hover:text-white'}`}
                >
                  {t.subtitlesTab}
                </button>
                <button
                  onClick={() => setActiveSideTab('notes')}
                  className={`py-1.5 rounded-lg transition-colors ${activeSideTab === 'notes' ? 'bg-teal-600 text-white' : 'hover:text-white'}`}
                >
                  {t.notesTab}
                </button>
                <button
                  onClick={() => setActiveSideTab('records')}
                  className={`py-1.5 rounded-lg transition-colors ${activeSideTab === 'records' ? 'bg-teal-600 text-white' : 'hover:text-white'}`}
                >
                  {t.mriLabsTab}
                </button>
                <button
                  onClick={() => setActiveSideTab('prescription')}
                  className={`py-1.5 rounded-lg transition-colors ${activeSideTab === 'prescription' ? 'bg-teal-600 text-white' : 'hover:text-white'}`}
                >
                  {t.eprescriptionTab}
                </button>
              </div>

              {/* TAB 1: Chat & Translation Input */}
              {activeSideTab === 'captions' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t.trilingualChatHeader}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {t.trilingualChatDesc}
                  </p>

                  <form onSubmit={handleSendMessage} className="space-y-2 pt-2">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={t.typeMessagePlaceholder}
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                    <button
                      type="submit"
                      disabled={isSendingMessage || !newMessage.trim()}
                      className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{t.sendBtn}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: Live Clinical Notes */}
              {activeSideTab === 'notes' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t.doctorNotes}</h4>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-300">
                    <p>• Patient presents with recurrent tension headache (duration: 3 weeks).</p>
                    <p>• Amman MRI scan evaluated: No intracranial lesions, ventricular size within normal limits.</p>
                    <p>• Recommendation: Conservative management, prophylactic Topiramate therapy.</p>
                  </div>
                </div>
              )}

              {/* TAB 3: Diagnostic Viewer */}
              {activeSideTab === 'records' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t.medicalViewer}</h4>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-bold text-white">Amman Brain MRI (DICOM)</span>
                      <span className="text-[10px] text-teal-400">PDF / DICOM</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Uploaded 3 days ago · ABDALI HOSPITAL AMMAN</p>
                    <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Open Fullscreen Viewer</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: Digital E-Prescription */}
              {activeSideTab === 'prescription' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t.eprescriptionTab}</h4>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-3 text-xs">
                    {rxMeds.map((med, i) => (
                      <div key={i} className="border-b border-slate-800 pb-2">
                        <span className="font-bold text-white block">{med.name} ({med.dosage})</span>
                        <span className="text-slate-400 text-[11px] block">{med.frequency} · {med.duration}</span>
                      </div>
                    ))}
                    <button
                      onClick={() => setRxIssued(true)}
                      className={`w-full py-2 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
                        rxIssued ? 'bg-emerald-600 text-white' : 'bg-teal-600 hover:bg-teal-500 text-white'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{rxIssued ? 'Prescription Issued & Signed ✓' : 'Issue Official Cross-Border Prescription'}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
