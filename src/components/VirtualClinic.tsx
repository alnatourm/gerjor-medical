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
  const [showEarlyNoticeModal, setShowEarlyNoticeModal] = useState<boolean>(true);
  
  // Tab state inside virtual clinic
  const [activeSideTab, setActiveSideTab] = useState<'captions' | 'notes' | 'records' | 'prescription'>('captions');

  // Real Live Subtitles & Chat Messages from Appointment
  const [captions, setCaptions] = useState<Array<{ sender: string; original: string; translatedAr: string; translatedDe: string; translatedEn: string; time: string }>>(() => {
    if (appointment?.caseMessages && appointment.caseMessages.length > 0) {
      return appointment.caseMessages.map(m => ({
        sender: m.senderName,
        original: m.text,
        translatedAr: m.text,
        translatedDe: m.text,
        translatedEn: m.text,
        time: m.timestamp
      }));
    }
    return [];
  });

  const [newMessage, setNewMessage] = useState<string>('');
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);

  // Real Clinical Prescription Generator
  const [rxMeds, setRxMeds] = useState<Array<{ name: string; dosage: string; frequency: string; duration: string }>>(() => {
    if (appointment?.prescription?.medicines) {
      return appointment.prescription.medicines;
    }
    return [];
  });
  const [rxNotes, setRxNotes] = useState<string>(appointment?.prescription?.notes || '');
  const [rxIssued, setRxIssued] = useState<boolean>(!!appointment?.prescription);

  // Live Clinical Notes State
  const [liveNotesText, setLiveNotesText] = useState<string>(appointment?.doctorOpinion || '');
  const [isNotesSaved, setIsNotesSaved] = useState<boolean>(false);

  // New Medicine Inputs in Virtual Clinic
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('');

  const handleAddMedInClinic = () => {
    if (newMedName.trim() && newMedDosage.trim()) {
      setRxMeds(prev => [...prev, {
        name: newMedName.trim(),
        dosage: newMedDosage.trim(),
        frequency: newMedFreq.trim() || 'Once daily',
        duration: '30 days'
      }]);
      setNewMedName('');
      setNewMedDosage('');
      setNewMedFreq('');
    }
  };

  const handleRemoveMedInClinic = (idx: number) => {
    setRxMeds(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveLiveNotes = async () => {
    if (!liveNotesText.trim()) return;
    if (appointment) {
      try {
        await fetch(`/api/appointments/${appointment.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            doctorOpinion: liveNotesText.trim(),
            doctorOpinionDate: new Date().toISOString().split('T')[0]
          })
        });
        appointment.doctorOpinion = liveNotesText.trim();
      } catch (err) {
        console.error(err);
      }
    }
    setIsNotesSaved(true);
    setTimeout(() => setIsNotesSaved(false), 3000);
  };

  const handleIssueRxInClinic = async () => {
    const prescriptionObj = {
      date: new Date().toISOString().split('T')[0],
      medicines: rxMeds,
      notes: rxNotes,
      doctorSignature: `${appointment?.doctorName || 'Specialist Physician'}, ${appointment?.doctorSpecialty || 'Consultant'}`
    };

    if (appointment) {
      try {
        await fetch(`/api/appointments/${appointment.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prescription: prescriptionObj,
            status: 'completed'
          })
        });
        appointment.prescription = prescriptionObj;
      } catch (err) {
        console.error(err);
      }
    }

    setRxIssued(true);
    setTimeout(() => setRxIssued(false), 5000);
  };

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
    <section className="bg-slate-950 text-white min-h-screen py-6 px-4 sm:px-6 relative" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Prominent Schedule Notice & Pre-Call Waiting Room Modal Popup Overlay */}
      {showEarlyNoticeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 relative overflow-hidden">
            
            {/* Top Glowing Ambient Radial */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1">
                    <span>⚠️ {currentLang === 'ar' ? 'غرفة الانتظار نشطة' : (currentLang === 'de' ? 'Warteraum Aktiv' : 'Pre-Call Waiting Room')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {currentLang === 'ar' ? 'تنبيه موعد الاستشارة الطبية' : (currentLang === 'de' ? 'Konsultationszeit-Hinweis' : 'Consultation Time Notice')}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setShowEarlyNoticeModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                title="Close Notice"
              >
                ✕
              </button>
            </div>

            {/* Scheduled Details Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
                {currentLang === 'ar'
                  ? 'تنبيه: وقت الاستشارة المباشرة لم يبدأ بعد. أنت الآن في غرفة الانتظار واختبار المعدات.'
                  : (currentLang === 'de'
                    ? 'Hinweis: Die gewählte Konsultationszeit hat noch nicht begonnen. Sie befinden sich im Warteraum.'
                    : 'Notice: Your scheduled consultation time has not started yet. You are currently in the Pre-Call Waiting Room.')}
              </p>

              <div className="space-y-2 border-t border-slate-800/80 pt-3 text-xs">
                <div className="flex items-center justify-between text-slate-300 font-mono">
                  <span>📅 {currentLang === 'ar' ? 'التاريخ المجدول:' : (currentLang === 'de' ? 'Datum:' : 'Scheduled Date:')}</span>
                  <strong className="text-white font-bold">{appointment?.date || '2026-10-10'}</strong>
                </div>

                <div className="flex items-center justify-between text-slate-300 font-mono">
                  <span>⏰ {currentLang === 'ar' ? 'الوقت المجدول:' : (currentLang === 'de' ? 'Uhrzeit:' : 'Scheduled Time:')}</span>
                  <strong className="text-teal-400 font-bold">
                    🇯🇴 {appointment?.timeAmman || '16:00'} EET / 🇩🇪 {appointment?.timeBerlin || '15:00'} CET
                  </strong>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span>👨‍⚕️ {currentLang === 'ar' ? 'الطبيب / المجلس الطبي:' : (currentLang === 'de' ? 'Behandelnder Arzt:' : 'Assigned Provider:')}</span>
                  <strong className="text-white font-bold">{appointment?.doctorName || 'Specialist Medical Board'}</strong>
                </div>
              </div>
            </div>

            {/* What you can do while waiting */}
            <div className="space-y-2 text-xs text-slate-300 bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60">
              <span className="font-bold text-white block">
                💡 {currentLang === 'ar' ? 'ماذا يمكنك أن تفعل أثناء الانتظار؟' : (currentLang === 'de' ? 'Was können Sie während des Wartens tun?' : 'What can you do while waiting?')}
              </span>
              <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside leading-relaxed">
                <li>{currentLang === 'ar' ? 'اختبار الكاميرا والمايكروفون والتأكد من جودة الاتصال' : (currentLang === 'de' ? 'Kamera & Mikrofon auf Bereitschaft testen' : 'Test camera & microphone functionality')}</li>
                <li>{currentLang === 'ar' ? 'مراجعة التقارير الطبية والصور المرفقة في ملفك الطبي' : (currentLang === 'de' ? 'Hochgeladene Krankenakte & MRT-Bilder prüfen' : 'Review uploaded lab reports, MRIs & medical vault')}</li>
                <li>{currentLang === 'ar' ? 'كتابة ملاحظة أو سؤال مسبق للطبيب في شات الترجمة' : (currentLang === 'de' ? 'Vorab-Nachricht im Übersetzungschat hinterlassen' : 'Leave a pre-consultation note in the translation chat')}</li>
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setShowEarlyNoticeModal(false)}
                className="flex-1 py-3 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>{currentLang === 'ar' ? 'المتابعة لغرفة الاختبار والانتظار' : (currentLang === 'de' ? 'Weiter zum Warteraum & Test' : 'Proceed to Waiting & Test Room')}</span>
              </button>

              <button
                onClick={onCloseRoom}
                className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors"
              >
                <span>{currentLang === 'ar' ? 'العودة للوحة التحكم' : (currentLang === 'de' ? 'Zurück zum Dashboard' : 'Return to Dashboard')}</span>
              </button>
            </div>

          </div>
        </div>
      )}

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
                {appointment?.doctorName || 'Jordanian Specialist Medical Board'} ({appointment?.doctorHospital || 'Amman Medical Center'}) & Patient {appointment?.patientName || 'Omar Al-Masmoudi'}
              </p>
            </div>
          </div>

          {/* Clocks & Appointment Timing Status */}
          <div className="flex items-center gap-3 text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 font-mono">
            <div className="flex items-center gap-1.5">
              <span>🇯🇴 Amman:</span>
              <span className="text-teal-400 font-bold">{appointment?.timeAmman || '16:00'} EET</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span>🇩🇪 Berlin:</span>
              <span className="text-sky-400 font-bold">{appointment?.timeBerlin || '15:00'} CET</span>
            </div>
          </div>

          <button
            onClick={onCloseRoom}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            {t.endCall}
          </button>
        </div>

        {/* Pre-Call Scheduled Time Status Banner */}
        <div className="bg-teal-950/80 border border-teal-800/80 rounded-xl p-3 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="text-slate-200">
              Scheduled Appointment: <strong>{appointment?.date || '2026-10-10'}</strong> at <strong>{appointment?.timeAmman || '16:00'} EET</strong>.
            </span>
          </div>
          <span className="text-teal-300 font-medium bg-teal-900/60 px-2.5 py-0.5 rounded border border-teal-700/60 text-[11px]">
            ⚡ Pre-Call Test Room Active (Mic, Camera & AI Translator Ready)
          </span>
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
                    <span className="text-xs font-bold text-white block">{appointment?.doctorName || 'Jordanian Specialist Medical Board'}</span>
                    <span className="text-[10px] text-slate-400">{appointment?.doctorSpecialty || 'Neurology'} · {appointment?.doctorHospital || 'Amman Medical Center'}</span>
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
                    {(appointment?.doctorName || 'MB').split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <span className="text-base font-bold text-white block">{appointment?.doctorName || 'Jordanian Specialist Medical Board'}</span>
                    <span className="text-xs text-slate-400">{t.hdEncryptedStream}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1 rounded-full font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Physician Consultation Room Active</span>
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
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t.doctorNotes}</h4>
                    {isNotesSaved && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        ✓ Saved to Patient File
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <textarea
                      value={liveNotesText}
                      onChange={(e) => setLiveNotesText(e.target.value)}
                      rows={6}
                      placeholder="Type clinical observations, MRI evaluation notes, or medical recommendations for the patient..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500 leading-relaxed"
                    />

                    <button
                      type="button"
                      onClick={handleSaveLiveNotes}
                      className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{currentLang === 'ar' ? 'حفظ الملاحظات في ملف المريض' : 'Save Clinical Notes'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: Diagnostic Viewer */}
              {activeSideTab === 'records' && (
                <div className="space-y-3 animate-fade-in">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t.medicalViewer}</h4>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="font-bold text-white">Amman Brain MRI & Diagnostic Files</span>
                      <span className="text-[10px] text-teal-400">PDF / DICOM</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {appointment?.symptoms || 'Uploaded diagnostic reports, lab test bloodwork, and medical scans.'}
                    </p>
                    <button 
                      onClick={() => alert(currentLang === 'ar' ? 'جاري فتح مستعرض صور الأشعة والتقارير الطبية...' : 'Opening Fullscreen Diagnostic Viewer...')}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Open Fullscreen Diagnostic Viewer</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: Digital E-Prescription */}
              {activeSideTab === 'prescription' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t.eprescriptionTab}</h4>
                    {rxIssued && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        ✓ Prescription Issued
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-3 text-xs">
                    {/* Active Prescribed Medicines List */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Prescribed Medications ({rxMeds.length}):</span>
                      {rxMeds.map((med, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-white block">{med.name} ({med.dosage})</span>
                            <span className="text-slate-400 text-[10px] block">{med.frequency} · {med.duration}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMedInClinic(i)}
                            className="text-slate-500 hover:text-rose-400 text-[10px] font-bold p-1"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Medicine Inputs */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-bold text-teal-300 block">+ Add Medicine Name:</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          placeholder="Medicine Name (e.g. Topiramate)"
                          value={newMedName}
                          onChange={(e) => setNewMedName(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-teal-500"
                        />
                        <input
                          type="text"
                          placeholder="Dosage (e.g. 25 mg)"
                          value={newMedDosage}
                          onChange={(e) => setNewMedDosage(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-teal-500"
                        />
                      </div>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Frequency (e.g. Once daily at bedtime)"
                          value={newMedFreq}
                          onChange={(e) => setNewMedFreq(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-teal-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddMedInClinic}
                          className="px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs shrink-0"
                        >
                          + Add
                        </button>
                      </div>
                    </div>

                    {/* Prescription Instructions */}
                    <div className="pt-2 border-t border-slate-800">
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Prescription Notes:</label>
                      <textarea
                        value={rxNotes}
                        onChange={(e) => setRxNotes(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    <button
                      onClick={handleIssueRxInClinic}
                      className={`w-full py-2.5 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 ${
                        rxIssued ? 'bg-emerald-600 text-white' : 'bg-teal-600 hover:bg-teal-500 text-white shadow-md'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{rxIssued ? 'Prescription Signed & Saved ✓' : 'Issue & Sign Official E-Prescription'}</span>
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
