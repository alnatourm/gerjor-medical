import React, { useState } from 'react';
import { Appointment, MedicalRecord, LanguageCode, CurrencyCode } from '../types';
import { TRANSLATIONS } from '../translations/translations';
import { Calendar, Clock, Video, FileText, Download, Sparkles, CheckCircle2, AlertCircle, Plus, FileCheck, Award, ExternalLink, ShieldCheck, User, Settings, MessageSquare, Send, X, FileUp } from 'lucide-react';

interface PatientDashboardProps {
  appointments: Appointment[];
  records: MedicalRecord[];
  currentLang: LanguageCode;
  currentCurrency: CurrencyCode;
  onOpenVirtualClinic: (app: Appointment) => void;
  onOpenUploadRecord: () => void;
  onBookNewConsultation: () => void;
  onOpenProfileSettings: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  appointments,
  records,
  currentLang,
  currentCurrency,
  onOpenVirtualClinic,
  onOpenUploadRecord,
  onBookNewConsultation,
  onOpenProfileSettings
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  const [activeTab, setActiveTab] = useState<'appointments' | 'records'>('appointments');
  const [selectedRecordForAi, setSelectedRecordForAi] = useState<MedicalRecord | null>(null);

  // Selected Case for Asynchronous Q&A Modal
  const [selectedCaseForDiscussion, setSelectedCaseForDiscussion] = useState<Appointment | null>(null);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isSendingQuestion, setIsSendingQuestion] = useState(false);

  const upcomingApps = appointments.filter(a => a.status === 'upcoming');
  const pastApps = appointments.filter(a => a.status === 'completed');

  const handleSendCaseQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !selectedCaseForDiscussion) return;

    const questionMsg = {
      id: `msg-${Date.now()}`,
      sender: 'patient' as const,
      senderName: selectedCaseForDiscussion.patientName || 'Patient',
      text: newQuestionText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...(selectedCaseForDiscussion.caseMessages || []), questionMsg];
    const updatedApp = { ...selectedCaseForDiscussion, caseMessages: updatedMessages };

    setSelectedCaseForDiscussion(updatedApp);
    setNewQuestionText('');
    setIsSendingQuestion(true);

    try {
      await fetch(`/api/appointments/${selectedCaseForDiscussion.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseMessages: updatedMessages })
      });
    } catch (err) {
      console.error('Error sending question:', err);
    } finally {
      setIsSendingQuestion(false);
    }
  };

  return (
    <section className="py-10 bg-slate-50 text-slate-900 min-h-screen relative" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Asynchronous Case Discussion & Doctor Reply Modal */}
      {selectedCaseForDiscussion && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 relative text-slate-900">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                    📋 {currentLang === 'ar' ? 'مراجعة حالة طبية وتقييم ملفات' : 'Medical Case File Review'}
                  </span>
                  <span className="text-xs text-slate-500">· ID: #{selectedCaseForDiscussion.id}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedCaseForDiscussion.doctorName}
                </h3>
                <p className="text-xs text-slate-600">
                  {selectedCaseForDiscussion.doctorSpecialty} · {selectedCaseForDiscussion.doctorHospital} ({selectedCaseForDiscussion.doctorCountry === 'DE' ? 'Germany 🇩🇪' : 'Jordan 🇯🇴'})
                </p>
              </div>

              <button
                onClick={() => setSelectedCaseForDiscussion(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Case Symptoms & AI Summary Section */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-800 block text-xs">
                {currentLang === 'ar' ? 'تفاصيل الحالة وملخص الفحص الذكي:' : 'Case Symptoms & AI Intake Summary:'}
              </span>
              <p className="text-slate-700 leading-relaxed font-medium">
                {selectedCaseForDiscussion.symptoms || 'Diagnostic reports and medical scans submitted for review.'}
              </p>

              {selectedCaseForDiscussion.aiSummary && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-teal-950 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">{t.aiPreConsultationIntake}</strong>
                    <span>{selectedCaseForDiscussion.aiSummary}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Doctor Official Written Recommendation & Opinion */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-teal-600" />
                <span>{currentLang === 'ar' ? 'الرأي الطبي الرسمي والتوصيات:' : 'Physician Official Written Opinion & Recommendations:'}</span>
              </h4>

              {selectedCaseForDiscussion.doctorOpinion ? (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 space-y-3 text-xs text-emerald-950 shadow-sm">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                    <span className="font-extrabold text-emerald-900 text-sm">
                      {selectedCaseForDiscussion.doctorName} ({currentLang === 'ar' ? 'تقرير مكتوب' : 'Official Response'})
                    </span>
                    <span className="text-[10px] text-emerald-700 font-mono">
                      {selectedCaseForDiscussion.doctorOpinionDate || selectedCaseForDiscussion.date}
                    </span>
                  </div>
                  <p className="leading-relaxed font-medium text-slate-800 whitespace-pre-line">
                    {selectedCaseForDiscussion.doctorOpinion}
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <strong className="block text-amber-950 font-bold">
                      {currentLang === 'ar' ? 'الحالة قيد المراجعة من قبل الطبيب' : 'Case Under Review by Physician'}
                    </strong>
                    <span>
                      {currentLang === 'ar'
                        ? `يقوم الطبيب (${selectedCaseForDiscussion.doctorName}) بمراجعة ملفاتك وتقريرك الطبي حالياً. سيظهر الرأي الطبي والتوصيات المكتوبة فور اعتمادها هنا.`
                        : `Dr. ${selectedCaseForDiscussion.doctorName} is reviewing your diagnostic files and medical records. Written recommendations will appear here upon completion.`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Patient <-> Doctor Interactive Q&A Thread */}
            <div className="space-y-4 border-t border-slate-200 pt-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <span>{currentLang === 'ar' ? 'الأسئلة والمناقشات المباشرة حول الحالة:' : 'Case Q&A & Follow-up Discussion:'}</span>
              </h4>

              {/* Messages List */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-h-60 overflow-y-auto space-y-3 text-xs">
                {(!selectedCaseForDiscussion.caseMessages || selectedCaseForDiscussion.caseMessages.length === 0) ? (
                  <p className="text-slate-400 text-center py-4 text-xs">
                    {currentLang === 'ar'
                      ? 'لا توجد أسئلة سابقة. يمكنك كتابة استفسارك أو سؤالك للطبيب أدناه حول التقرير.'
                      : 'No questions sent yet. You can type follow-up questions to your doctor regarding your case files below.'}
                  </p>
                ) : (
                  selectedCaseForDiscussion.caseMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-2xl max-w-lg ${
                        msg.sender === 'patient'
                          ? 'bg-teal-600 text-white ml-auto text-right'
                          : 'bg-white border border-slate-200 text-slate-900 mr-auto'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1 text-[10px] opacity-80 font-bold">
                        <span>{msg.senderName}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed text-xs">{msg.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Send Question Form */}
              <form onSubmit={handleSendCaseQuestion} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder={currentLang === 'ar' ? 'اكتب استفسارك أو سؤالك للطبيب حول الحالة...' : 'Type follow-up question regarding your case files...'}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-500 shadow-sm"
                />
                <button
                  type="submit"
                  disabled={isSendingQuestion || !newQuestionText.trim()}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{currentLang === 'ar' ? 'إرسال السؤال' : 'Send'}</span>
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Dashboard Title Header */}
        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-400 bg-teal-950 border border-teal-800 px-2.5 py-0.5 rounded">
                {t.verifiedPatientPortal}
              </span>
              <span className="text-xs text-slate-400">ID: JO-DE-89214</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {t.dashboardTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {t.dashboardSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenProfileSettings}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4" />
              <span>{t.profileAndMedicalSettings}</span>
            </button>

            <button
              onClick={onOpenUploadRecord}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-teal-400" />
              <span>{t.uploadMriLabBtn}</span>
            </button>

            <button
              onClick={onBookNewConsultation}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>{t.bookAppointmentBtn}</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 text-sm font-bold flex-wrap">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'appointments' ? 'border-teal-600 text-teal-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t.consultationsCount} ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'records' ? 'border-teal-600 text-teal-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t.medicalVaultCount} ({records.length})</span>
          </button>

          <button
            onClick={onOpenProfileSettings}
            className="pb-3 px-4 border-b-2 border-transparent text-slate-600 hover:text-teal-700 transition-colors flex items-center gap-2 ml-auto"
          >
            <User className="w-4 h-4 text-teal-600" />
            <span>{t.profileAndMedicalSettings} ⚙️</span>
          </button>
        </div>

        {/* TAB 1: Appointments & Cases List */}
        {activeTab === 'appointments' && (
          <div className="space-y-8">
            
            {/* Upcoming / Active Section */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                <span>{t.upcomingAppointments} ({upcomingApps.length})</span>
              </h3>

              {upcomingApps.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-xs">
                  {t.noUpcomingConsultations}
                </div>
              ) : (
                <div className="grid gap-4">
                  {upcomingApps.map(app => {
                    const isCaseReview = app.consultationType === 'second_opinion' || app.consultationType === 'record_review';

                    return (
                      <div key={app.id} className="bg-white border border-slate-200 hover:border-teal-500 rounded-2xl p-6 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                              app.doctorCountry === 'DE' ? 'bg-sky-100 text-sky-800 border border-sky-200' : 'bg-amber-100 text-amber-900 border border-amber-200'
                            }`}>
                              {app.doctorCountry === 'DE' ? t.germanyConsultationBadge : t.jordanConsultationBadge}
                            </span>

                            <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                              isCaseReview
                                ? 'bg-teal-100 text-teal-900 border border-teal-200'
                                : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                            }`}>
                              {isCaseReview
                                ? (currentLang === 'ar' ? '📋 تقييم حالة طبية' : '📋 Medical Case File Review')
                                : (currentLang === 'ar' ? '🎥 استشارة فيديو مباشرة' : '🎥 Live Video Consultation')}
                            </span>

                            <span className="text-xs text-slate-500">· ID: #{app.id}</span>
                          </div>

                          <h4 className="text-lg font-bold text-slate-900">{app.doctorName}</h4>
                          <p className="text-xs text-slate-600 font-medium">
                            {app.doctorSpecialty} · {app.doctorHospital}
                          </p>

                          {/* Show timing for video call vs date submitted for case review */}
                          {isCaseReview ? (
                            <div className="flex items-center gap-3 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono">
                              <span>📄 {currentLang === 'ar' ? 'تاريخ رفع الملف:' : 'Submitted On:'} <strong>{app.date}</strong></span>
                              <span className="text-teal-700 font-bold">
                                {app.doctorOpinion ? (currentLang === 'ar' ? '✅ تم إرسال الرأي الطبي' : '✅ Written Opinion Ready') : (currentLang === 'ar' ? '⏳ قيد المراجعة الطبية' : '⏳ Case Under Review')}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono flex-wrap">
                              <span>📅 {app.date}</span>
                              <span>🇯🇴 Amman: <strong>{app.timeAmman} EET</strong></span>
                              <span>🇩🇪 Berlin: <strong>{app.timeBerlin} CET</strong></span>
                            </div>
                          )}

                          {app.aiSummary && (
                            <div className="bg-teal-50 border border-teal-200/80 rounded-xl p-3 text-xs text-teal-950 flex items-start gap-2 max-w-2xl">
                              <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold block">{t.aiPreConsultationIntake}</span>
                                <span>{app.aiSummary}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons: Video Call (for live video) vs Case Discussion (for case upload) */}
                        <div className="flex flex-col sm:flex-row md:flex-col items-end justify-center gap-2 shrink-0">
                          {isCaseReview ? (
                            <button
                              onClick={() => setSelectedCaseForDiscussion(app)}
                              className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>{currentLang === 'ar' ? 'عرض التقرير وطرح الأسئلة' : 'View Doctor Reply & Q&A'}</span>
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => onOpenVirtualClinic(app)}
                                className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                              >
                                <Video className="w-4 h-4" />
                                <span>{t.enterLiveVirtualClinic}</span>
                              </button>

                              <span className="text-[11px] text-slate-400 font-medium text-center">
                                {t.virtualClinicOpenNotice}
                              </span>
                            </>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Past Consultations Section */}
            <div className="space-y-4 border-t border-slate-200 pt-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{t.pastConsultations} ({pastApps.length})</span>
              </h3>

              <div className="grid gap-4">
                {pastApps.map(app => (
                  <div key={app.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            {t.consultationCompletedBadge}
                          </span>
                          <span className="text-xs text-slate-500">Date: {app.date}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">{app.doctorName} ({app.doctorSpecialty})</h4>
                        <p className="text-xs text-slate-500">{app.doctorHospital}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">{t.feePaidLabel}</span>
                        <span className="text-sm font-bold text-slate-900">{app.totalFee} {app.currency}</span>
                      </div>
                    </div>

                    {/* Prescription Box */}
                    {app.prescription && (
                      <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3 text-xs border border-slate-800">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="font-bold text-teal-400 flex items-center gap-1.5">
                            <FileCheck className="w-4 h-4 text-teal-400" /> {t.issuedEPrescription}
                          </span>
                          <span className="text-[10px] text-slate-400">{app.prescription.date}</span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2">
                          {app.prescription.medicines.map((med, i) => (
                            <div key={i} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                              <span className="font-bold text-white block">{med.name} ({med.dosage})</span>
                              <span className="text-[10px] text-slate-400 block">{med.frequency} · {med.duration}</span>
                            </div>
                          ))}
                        </div>

                        <div className="text-[11px] text-slate-300">
                          <span className="font-bold text-slate-400 block text-[10px] uppercase">{t.doctorAdviceLabel}</span>
                          <p>{app.prescription.notes}</p>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-[10px] text-slate-400">
                          <span>{t.signedByLabel} {app.prescription.doctorSignature}</span>
                          <button
                            onClick={() => alert(`Downloading official PDF prescription signed by ${app.doctorName}...`)}
                            className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{t.downloadPrescriptionPdfBtn}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Medical Vault */}
        {activeTab === 'records' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t.medicalVault}</h3>
                <p className="text-xs text-slate-500">{t.medicalVaultSubtitle}</p>
              </div>

              <button
                onClick={onOpenUploadRecord}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{t.uploadNewDiagnosticFileBtn}</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {records.map(rec => (
                <div key={rec.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0 border border-teal-100">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                          {rec.type}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{rec.title}</h4>
                        <span className="text-xs text-slate-500">Uploaded: {rec.date} · {rec.fileSize}</span>
                      </div>
                    </div>
                  </div>

                  {rec.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                      {rec.notes}
                    </p>
                  )}

                  {rec.aiSummary && (
                    <div className="bg-slate-900 text-white rounded-xl p-3 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-teal-400 font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t.aiBilingualExplanation}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{rec.aiSummary}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="text-slate-400 font-medium">{t.sourceLabel} {rec.uploadedBy}</span>
                    <button
                      onClick={() => alert(`Accessing encrypted diagnostic DICOM/PDF viewer for ${rec.title}...`)}
                      className="text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1"
                    >
                      <span>{t.openFileBtn}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
