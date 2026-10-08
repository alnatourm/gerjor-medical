import React, { useState } from 'react';
import { Appointment, MedicalRecord, LanguageCode, CurrencyCode } from '../types';
import { TRANSLATIONS } from '../translations/translations';
import { Calendar, Clock, Video, FileText, Download, Sparkles, CheckCircle2, AlertCircle, Plus, FileCheck, Award, ExternalLink, ShieldCheck, User, Settings } from 'lucide-react';

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

  const upcomingApps = appointments.filter(a => a.status === 'upcoming');
  const pastApps = appointments.filter(a => a.status === 'completed');

  return (
    <section className="py-10 bg-slate-50 text-slate-900 min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Dashboard Title Header */}
        <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-400 bg-teal-950 border border-teal-800 px-2.5 py-0.5 rounded">
                Verified Patient Portal
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
              <span>Profile & Medical Settings</span>
            </button>

            <button
              onClick={onOpenUploadRecord}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-teal-400" />
              <span>Upload MRI/Lab</span>
            </button>

            <button
              onClick={onBookNewConsultation}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Book Appointment</span>
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
            <span>Consultations ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`pb-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'records' ? 'border-teal-600 text-teal-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Medical Vault & MRIs ({records.length})</span>
          </button>

          <button
            onClick={onOpenProfileSettings}
            className="pb-3 px-4 border-b-2 border-transparent text-slate-600 hover:text-teal-700 transition-colors flex items-center gap-2 ml-auto"
          >
            <User className="w-4 h-4 text-teal-600" />
            <span>Profile & Medical Settings ⚙️</span>
          </button>
        </div>

        {/* TAB 1: Appointments List */}
        {activeTab === 'appointments' && (
          <div className="space-y-8">
            
            {/* Upcoming Section */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                <span>{t.upcomingAppointments} ({upcomingApps.length})</span>
              </h3>

              {upcomingApps.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-xs">
                  No upcoming international consultations scheduled.
                </div>
              ) : (
                <div className="grid gap-4">
                  {upcomingApps.map(app => (
                    <div key={app.id} className="bg-white border border-slate-200 hover:border-teal-500 rounded-2xl p-6 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                            app.doctorCountry === 'DE' ? 'bg-sky-100 text-sky-800 border border-sky-200' : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}>
                            {app.doctorCountry === 'DE' ? '🇩🇪 Germany Consultation' : '🇯🇴 Jordan Consultation'}
                          </span>
                          <span className="text-xs text-slate-500">· ID: #{app.id}</span>
                        </div>

                        <h4 className="text-lg font-bold text-slate-900">{app.doctorName}</h4>
                        <p className="text-xs text-slate-600 font-medium">
                          {app.doctorSpecialty} · {app.doctorHospital}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono">
                          <span>📅 {app.date}</span>
                          <span>🇯🇴 Amman: <strong>{app.timeAmman} EET</strong></span>
                          <span>🇩🇪 Berlin: <strong>{app.timeBerlin} CET</strong></span>
                        </div>

                        {app.aiSummary && (
                          <div className="bg-teal-50 border border-teal-200/80 rounded-xl p-3 text-xs text-teal-950 flex items-start gap-2 max-w-2xl">
                            <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold block">AI Pre-Consultation Intake</span>
                              <span>{app.aiSummary}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row md:flex-col items-end justify-center gap-2 shrink-0">
                        <button
                          onClick={() => onOpenVirtualClinic(app)}
                          className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                        >
                          <Video className="w-4 h-4" />
                          <span>Enter Live Virtual Clinic</span>
                        </button>

                        <span className="text-[11px] text-slate-400 font-medium text-center">
                          Vortual Clinic opens 10 mins prior
                        </span>
                      </div>

                    </div>
                  ))}
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
                            ✓ Consultation Completed
                          </span>
                          <span className="text-xs text-slate-500">Date: {app.date}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900">{app.doctorName} ({app.doctorSpecialty})</h4>
                        <p className="text-xs text-slate-500">{app.doctorHospital}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Fee Paid</span>
                        <span className="text-sm font-bold text-slate-900">{app.totalFee} {app.currency}</span>
                      </div>
                    </div>

                    {/* Prescription Box */}
                    {app.prescription && (
                      <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3 text-xs border border-slate-800">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="font-bold text-teal-400 flex items-center gap-1.5">
                            <FileCheck className="w-4 h-4 text-teal-400" /> Issued E-Prescription
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
                          <span className="font-bold text-slate-400 block text-[10px] uppercase">Doctor Advice:</span>
                          <p>{app.prescription.notes}</p>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-[10px] text-slate-400">
                          <span>Signed: {app.prescription.doctorSignature}</span>
                          <button
                            onClick={() => alert(`Downloading official PDF prescription signed by ${app.doctorName}...`)}
                            className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Prescription PDF</span>
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
                <p className="text-xs text-slate-500">Secure 256-bit encrypted storage for X-Rays, Brain/Joint MRIs, and Blood Panel Lab Reports.</p>
              </div>

              <button
                onClick={onOpenUploadRecord}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Upload New Diagnostic File</span>
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
                        <span>Gemini AI Bilingual Medical Explanation</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{rec.aiSummary}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="text-slate-400 font-medium">Source: {rec.uploadedBy}</span>
                    <button
                      onClick={() => alert(`Accessing encrypted diagnostic DICOM/PDF viewer for ${rec.title}...`)}
                      className="text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1"
                    >
                      <span>Open File</span>
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
