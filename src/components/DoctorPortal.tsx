import React, { useState, useMemo } from 'react';
import { Doctor, Appointment, MedicalRecord, LanguageCode, CurrencyCode, Specialty, ConsultationType } from '../types';
import { TRANSLATIONS } from '../translations/translations';
import { MOCK_DOCTORS, MOCK_APPOINTMENTS, MOCK_RECORDS } from '../data/mockData';
import { 
  Stethoscope, Calendar, Clock, Video, FileText, Sparkles, 
  User, ShieldCheck, CheckCircle2, ChevronRight, Pill, Plus, 
  Trash2, Award, Building, Globe, Search, Filter, Upload, 
  AlertCircle, Eye, Check, Phone, Mail, FileUp, Activity,
  Lock, RefreshCw, X, FileCheck, MessageSquare, Send
} from 'lucide-react';

interface DoctorPortalProps {
  currentLang: LanguageCode;
  currentCurrency: CurrencyCode;
  appointments: Appointment[];
  records: MedicalRecord[];
  doctors?: Doctor[];
  onOpenVirtualClinic: (appointment: Appointment) => void;
  onIssuePrescription?: (appointmentId: string, prescription: any) => void;
  onAddRecordToPatientVault?: (record: MedicalRecord) => void;
  currentUser?: any;
  onOpenDoctorProfile?: () => void;
}

export const DoctorPortal: React.FC<DoctorPortalProps> = ({
  currentLang,
  appointments = MOCK_APPOINTMENTS,
  records = MOCK_RECORDS,
  doctors = MOCK_DOCTORS,
  onOpenVirtualClinic,
  onIssuePrescription,
  onAddRecordToPatientVault,
  currentUser,
  onOpenDoctorProfile
}) => {
  const isRtl = currentLang === 'ar';
  const t = TRANSLATIONS[currentLang];

  // Auto-detect physician from currentUser
  const defaultDoc = useMemo(() => {
    if (currentUser && currentUser.role === 'doctor') {
      const exactMatch = doctors.find(d => 
        d.id === currentUser.id ||
        d.name.toLowerCase().trim() === currentUser.fullName.toLowerCase().trim()
      );
      if (exactMatch) return exactMatch;

      // Return newly registered doctor profile
      return {
        id: currentUser.id,
        name: currentUser.fullName || 'Dr. Physician Consultant',
        title: '',
        titleDe: '',
        titleAr: '',
        country: (currentUser.country === 'DE' ? 'DE' : 'JO') as 'DE' | 'JO',
        city: '',
        hospital: '',
        hospitalAr: '',
        hospitalDe: '',
        specialty: 'Cardiology' as Specialty,
        subSpecialties: [],
        languages: [],
        experienceYears: 0,
        rating: 5.0,
        reviewCount: 0,
        bio: '',
        bioAr: '',
        bioDe: '',
        education: [],
        certifications: [],
        certificateDocs: [],
        feeJod: 0,
        feeEur: 0,
        feeUsd: 0,
        feeFileReviewEur: 0,
        feeFileReviewJod: 0,
        avatarUrl: '',
        nextAvailable: '',
        availableTypes: ['video', 'second_opinion', 'record_review'] as ConsultationType[],
        timeZone: (currentUser.country === 'DE' ? 'Europe/Berlin' : 'Asia/Amman') as 'Europe/Berlin' | 'Asia/Amman',
        timeZoneOffsetLabel: currentUser.country === 'DE' ? 'CET (Berlin) / EET (Amman +1h)' : 'EET (Amman) / CET (Berlin -1h)'
      };
    }
    return doctors[0] || {
      id: currentUser?.id || 'doc-new',
      name: currentUser?.fullName || 'Dr. Medical Consultant',
      title: '',
      titleDe: '',
      titleAr: '',
      country: (currentUser?.country === 'DE' ? 'DE' : 'JO') as 'DE' | 'JO',
      city: '',
      hospital: '',
      hospitalAr: '',
      hospitalDe: '',
      specialty: 'Cardiology' as Specialty,
      subSpecialties: [],
      languages: [],
      experienceYears: 0,
      rating: 5.0,
      reviewCount: 0,
      bio: '',
      bioAr: '',
      bioDe: '',
      education: [],
      certifications: [],
      certificateDocs: [],
      feeJod: 0,
      feeEur: 0,
      feeUsd: 0,
      feeFileReviewEur: 0,
      feeFileReviewJod: 0,
      avatarUrl: '',
      nextAvailable: '',
      availableTypes: ['video', 'second_opinion', 'record_review'] as ConsultationType[],
      timeZone: 'Asia/Amman',
      timeZoneOffsetLabel: 'EET (Amman)'
    };
  }, [currentUser, doctors]);

  const [activeDoctor, setActiveDoctor] = useState<Doctor>(defaultDoc);
  
  // Sync if defaultDoc changes
  React.useEffect(() => {
    setActiveDoctor(defaultDoc);
  }, [defaultDoc]);

  // Appointments for active doctor
  const doctorAppointments = useMemo(() => {
    return appointments.filter(a => a.doctorId === activeDoctor.id || a.doctorCountry === activeDoctor.country);
  }, [appointments, activeDoctor]);

  // Roster Search and Status Filter
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed' | 'in_progress'>('all');

  const filteredAppointments = useMemo(() => {
    return doctorAppointments.filter(app => {
      const matchesSearch = app.patientName.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
                            app.patientPhone.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
                            app.patientEmail.toLowerCase().includes(patientSearchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [doctorAppointments, patientSearchQuery, statusFilter]);

  // Selected Patient State for Isolated View
  const [selectedApp, setSelectedApp] = useState<Appointment>(filteredAppointments[0] || doctorAppointments[0] || appointments[0]);

  // Update selected patient if list changes and previous selection is invalid
  React.useEffect(() => {
    if (filteredAppointments.length > 0 && (!selectedApp || !filteredAppointments.some(a => a.id === selectedApp.id))) {
      setSelectedApp(filteredAppointments[0]);
    }
  }, [filteredAppointments]);

  // Selected Patient Isolated Tabs: 'summary' | 'vault' | 'prescription' | 'history'
  const [patientDetailTab, setPatientDetailTab] = useState<'summary' | 'vault' | 'prescription' | 'history'>('summary');

  // Filtered Isolated Records for Selected Patient ONLY
  const selectedPatientRecords = useMemo(() => {
    if (!selectedApp) return [];
    return records.filter(r => 
      (r.patientName && r.patientName.toLowerCase() === selectedApp.patientName.toLowerCase()) ||
      (r.patientEmail && r.patientEmail.toLowerCase() === selectedApp.patientEmail.toLowerCase()) ||
      (selectedApp.medicalRecordIds && selectedApp.medicalRecordIds.includes(r.id)) ||
      r.uploadedBy.toLowerCase().includes(selectedApp.patientName.toLowerCase())
    );
  }, [records, selectedApp]);

  // Filtered Isolated Prescriptions for Selected Patient ONLY
  const selectedPatientPrescriptions = useMemo(() => {
    if (!selectedApp) return [];
    return appointments
      .filter(a => a.patientEmail.toLowerCase() === selectedApp.patientEmail.toLowerCase() && a.prescription)
      .map(a => ({
        appointmentId: a.id,
        date: a.prescription!.date || a.date,
        medicines: a.prescription!.medicines,
        notes: a.prescription!.notes,
        doctorSignature: a.prescription!.doctorSignature,
        doctorName: a.doctorName
      }));
  }, [appointments, selectedApp]);

  // E-Prescription Creator Form State for Selected Patient
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFreq, setMedFreq] = useState('');
  const [medDuration, setMedDuration] = useState('');
  const [prescNotes, setPrescNotes] = useState('');
  const [medicinesList, setMedicinesList] = useState<Array<{ name: string; dosage: string; frequency: string; duration: string }>>([]);
  const [prescIssuedSuccess, setPrescIssuedSuccess] = useState(false);

  // New Record Upload Modal for Selected Patient Vault
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);
  const [newVaultTitle, setNewVaultTitle] = useState('');
  const [newVaultType, setNewVaultType] = useState<'Lab Result' | 'Doctor Report' | 'Photo / Scan' | 'MRI/CT Scan' | 'Prescription'>('Doctor Report');
  const [newVaultNotes, setNewVaultNotes] = useState('');
  const [newVaultFileName, setNewVaultFileName] = useState('');

  // Doctor Written Opinion & Case Q&A Reply State
  const [doctorOpinionInput, setDoctorOpinionInput] = useState('');
  const [doctorReplyText, setDoctorReplyText] = useState('');
  const [isSavingOpinion, setIsSavingOpinion] = useState(false);
  const [opinionSaveSuccess, setOpinionSaveSuccess] = useState(false);

  // Keep doctorOpinionInput in sync with selectedApp
  React.useEffect(() => {
    if (selectedApp) {
      setDoctorOpinionInput(selectedApp.doctorOpinion || '');
    }
  }, [selectedApp]);

  const handleSaveDoctorOpinion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorOpinionInput.trim() || !selectedApp) return;

    setIsSavingOpinion(true);
    setOpinionSaveSuccess(false);

    const opinionDate = new Date().toISOString().split('T')[0];

    try {
      await fetch(`/api/appointments/${selectedApp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorOpinion: doctorOpinionInput.trim(),
          doctorOpinionDate: opinionDate,
          status: 'completed'
        })
      });

      selectedApp.doctorOpinion = doctorOpinionInput.trim();
      selectedApp.doctorOpinionDate = opinionDate;
      selectedApp.status = 'completed';
      setOpinionSaveSuccess(true);
      setTimeout(() => setOpinionSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Error saving doctor opinion:', err);
    } finally {
      setIsSavingOpinion(false);
    }
  };

  const handleSendDoctorMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorReplyText.trim() || !selectedApp) return;

    const newReply = {
      id: `msg-${Date.now()}`,
      sender: 'doctor' as const,
      senderName: `Dr. ${activeDoctor.name}`,
      text: doctorReplyText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMsgs = [...(selectedApp.caseMessages || []), newReply];
    selectedApp.caseMessages = updatedMsgs;
    setDoctorReplyText('');

    try {
      await fetch(`/api/appointments/${selectedApp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseMessages: updatedMsgs })
      });
    } catch (err) {
      console.error('Error sending doctor message:', err);
    }
  };

  const handleAddMedicine = () => {
    if (medName.trim() && medDosage.trim()) {
      setMedicinesList(prev => [...prev, {
        name: medName.trim(),
        dosage: medDosage.trim(),
        frequency: medFreq.trim() || 'Once daily',
        duration: medDuration.trim() || '30 days'
      }]);
      setMedName('');
      setMedDosage('');
      setMedFreq('');
      setMedDuration('');
    }
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicinesList(prev => prev.filter((_, i) => i !== index));
  };

  const handleIssueFinalPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    const newPrescription = {
      date: new Date().toISOString().split('T')[0],
      medicines: medicinesList,
      notes: prescNotes,
      doctorSignature: `${activeDoctor.name}, ${activeDoctor.title || 'Consultant'} (${activeDoctor.hospital || 'MedLink Partner Hospital'})`
    };

    try {
      await fetch(`/api/appointments/${selectedApp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'completed',
          prescription: newPrescription
        })
      });
    } catch (err) {
      console.error('Error saving prescription to server:', err);
    }

    if (onIssuePrescription) {
      onIssuePrescription(selectedApp.id, newPrescription);
    }

    setPrescIssuedSuccess(true);
    setTimeout(() => setPrescIssuedSuccess(false), 5000);
  };

  const handleSaveVaultRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVaultTitle.trim() || !selectedApp) return;

    const newRecord: MedicalRecord = {
      id: `rec-${Date.now()}`,
      patientId: selectedApp.patientId || selectedApp.patientEmail,
      doctorId: activeDoctor.id,
      title: newVaultTitle.trim(),
      type: newVaultType,
      date: new Date().toISOString().split('T')[0],
      uploadedBy: `Dr. ${activeDoctor.name}`,
      patientName: selectedApp.patientName,
      patientEmail: selectedApp.patientEmail,
      fileSize: '5.2 MB',
      notes: newVaultFileName ? `Attached Document: ${newVaultFileName}\n${newVaultNotes}` : newVaultNotes,
      aiSummary: `Doctor Consult Summary issued by ${activeDoctor.name} for ${selectedApp.patientName}`
    };

    try {
      await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      });
    } catch (err) {
      console.error('Error adding record to patient vault:', err);
    }

    if (onAddRecordToPatientVault) {
      onAddRecordToPatientVault(newRecord);
    }

    setIsAddRecordModalOpen(false);
    setNewVaultTitle('');
    setNewVaultNotes('');
    setNewVaultFileName('');
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 text-slate-900" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Doctor Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shrink-0 border border-teal-400/30">
              {activeDoctor.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span>{activeDoctor.country === 'DE' ? t.germanySpecialist : t.jordanSpecialist}</span>
                </span>

                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{t.videoClinicActive}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white">{activeDoctor.name}</h1>
              <p className="text-xs font-semibold text-teal-300">{activeDoctor.title}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>{activeDoctor.hospital} · {activeDoctor.city}</span>
              </p>
            </div>
          </div>

          {/* Quick Doctor Profile Switcher */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 shrink-0 max-w-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.activeDoctorProfile}
              </span>
              {onOpenDoctorProfile && (
                <button
                  type="button"
                  onClick={onOpenDoctorProfile}
                  className="text-[11px] text-teal-400 hover:text-teal-300 font-bold underline flex items-center gap-1"
                >
                  <User className="w-3 h-3" />
                  <span>{t.editDoctorProfilePage}</span>
                </button>
              )}
            </div>
            
            <select
              value={activeDoctor.id}
              onChange={(e) => {
                const doc = doctors.find(d => d.id === e.target.value);
                if (doc) setActiveDoctor(doc);
              }}
              className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-bold rounded-xl p-2.5 cursor-pointer focus:outline-none focus:border-teal-500"
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.country === 'DE' ? '🇩🇪' : '🇯🇴'} {d.name} ({d.specialty})
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Doctor Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80 pt-5 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">{t.assignedPatientsToday}</span>
            <span className="text-lg font-extrabold text-white">{doctorAppointments.length} {t.rolePatient}s</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">{t.pendingCaseFiles}</span>
            <span className="text-lg font-extrabold text-teal-400">
              {doctorAppointments.filter(a => a.status === 'upcoming').length}
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">{t.medicalBoardLicense}</span>
            <span className="text-xs font-bold text-emerald-400 block truncate" title={activeDoctor.certifications[0]}>
              {activeDoctor.certifications[0] || 'Verified Specialist'}
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] block">{t.synchronizedTimings}</span>
            <span className="text-xs font-mono font-bold text-teal-300">
              🇯🇴 EET Amman / 🇩🇪 CET Berlin
            </span>
          </div>
        </div>

      </div>

      {/* PATIENT ISOLATION WORKSPACE */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 cols): Assigned Patient Roster & Search */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              <span>{t.assignedPatients} ({doctorAppointments.length})</span>
            </h2>
            <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Isolated Patient Data Mode
            </span>
          </div>

          {/* Search Bar & Status Filter */}
          <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm text-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search patient name, phone, or email..."
                value={patientSearchQuery}
                onChange={(e) => setPatientSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({doctorAppointments.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('upcoming')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === 'upcoming' ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-800 hover:bg-teal-100'
                }`}
              >
                Upcoming
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  statusFilter === 'completed' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Patient Cards Roster */}
          <div className="space-y-3">
            {filteredAppointments.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-500 text-xs">
                {t.noPatientsAssigned}
              </div>
            ) : (
              filteredAppointments.map(app => (
                <div
                  key={app.id}
                  onClick={() => {
                    setSelectedApp(app);
                    setPatientDetailTab('summary');
                  }}
                  className={`bg-white border-2 rounded-2xl p-4 shadow-sm cursor-pointer transition-all space-y-3 ${
                    selectedApp?.id === app.id
                      ? 'border-teal-600 ring-2 ring-teal-500/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded">
                          🎯 {t.bestClinicalMatch}
                        </span>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded uppercase">
                          {app.consultationType.replace('_', ' ')}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">{app.patientName}</h3>
                      <span className="text-xs text-slate-500 block">{app.patientPhone}</span>
                    </div>

                    <span className="text-xs font-mono font-bold text-teal-700 bg-slate-100 px-2.5 py-1 rounded shrink-0">
                      🇯🇴 {app.timeAmman} / 🇩🇪 {app.timeBerlin}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    "{app.symptoms || t.directSpecialistBanner}"
                  </p>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Status: <strong className="text-teal-700 uppercase">{app.status}</strong></span>
                    <span className="text-teal-600 font-bold flex items-center gap-1">
                      View Patient File <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (7 cols): Isolated Patient Profile & Medical Vault */}
        {selectedApp && (
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            
            {/* Patient Identity Bar */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 relative overflow-hidden shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-500 text-slate-950 font-extrabold flex items-center justify-center text-xl shrink-0">
                    {selectedApp.patientName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">{t.patientCaseIntake}</span>
                      <span className="text-xs text-slate-400 font-mono">ID: #{selectedApp.id}</span>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Private Vault
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white">{selectedApp.patientName}</h2>
                  </div>
                </div>

                {selectedApp.consultationType === 'video' ? (
                  <button
                    onClick={() => onOpenVirtualClinic(selectedApp)}
                    className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-2 shrink-0 hover:scale-105"
                  >
                    <Video className="w-4 h-4 text-slate-950" />
                    <span>{t.enterLiveVirtualClinicRoom}</span>
                  </button>
                ) : (
                  <span className="px-3.5 py-2 bg-teal-950 text-teal-300 border border-teal-800/80 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0">
                    <FileText className="w-4 h-4 text-teal-400" />
                    <span>📋 Asynchronous Case Review & Q&A</span>
                  </span>
                )}
              </div>

              {/* Patient Contact & Clinical Specs Grid */}
              <div className="grid sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">{t.patientEmail}</span>
                  <strong className="text-teal-200 font-mono truncate block">{selectedApp.patientEmail}</strong>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">{t.patientPhone}</span>
                  <strong className="text-teal-200 font-mono block">{selectedApp.patientPhone}</strong>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">{t.fee}</span>
                  <strong className="text-teal-300 font-bold">{selectedApp.totalFee} {selectedApp.currency}</strong>
                </div>
              </div>
            </div>

            {/* Selected Patient Sub-Tabs Bar */}
            <div className="flex border-b border-slate-200 gap-1 overflow-x-auto text-xs font-bold">
              <button
                onClick={() => setPatientDetailTab('summary')}
                className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  patientDetailTab === 'summary'
                    ? 'border-teal-600 text-teal-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Clinical Brief</span>
              </button>

              <button
                onClick={() => setPatientDetailTab('vault')}
                className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  patientDetailTab === 'vault'
                    ? 'border-teal-600 text-teal-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{selectedApp.patientName}'s Vault</span>
                <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full text-[10px]">
                  {selectedPatientRecords.length}
                </span>
              </button>

              <button
                onClick={() => setPatientDetailTab('prescription')}
                className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  patientDetailTab === 'prescription'
                    ? 'border-teal-600 text-teal-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Pill className="w-4 h-4" />
                <span>E-Prescriptions</span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px]">
                  {selectedPatientPrescriptions.length}
                </span>
              </button>

              <button
                onClick={() => setPatientDetailTab('history')}
                className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                  patientDetailTab === 'history'
                    ? 'border-teal-600 text-teal-700 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Appointments History</span>
              </button>
            </div>

            {/* TAB CONTENT 1: AI Clinical Brief & Symptoms */}
            {patientDetailTab === 'summary' && (
              <div className="space-y-4 animate-fade-in text-xs">
                {/* Gemini Pre-Consultation Summary */}
                <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2 font-bold text-teal-300">
                      <Sparkles className="w-4 h-4 text-teal-400" />
                      <span>{t.geminiClinicalBrief} for {selectedApp.patientName}</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {t.readyForDoctor}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {selectedApp.aiSummary || t.heroDescription}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs">
                    <span className="text-[11px] font-bold text-slate-400 block">{t.trilingualTerminology}</span>
                    <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                      <div><span className="text-teal-400 font-bold block">EN:</span> Temporal Headache</div>
                      <div><span className="text-teal-400 font-bold block">AR:</span> صداع صدغي متكرر</div>
                      <div><span className="text-teal-400 font-bold block">DE:</span> Schläfenkopfschmerz</div>
                    </div>
                  </div>
                </div>

                {/* Patient Reported Symptoms */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">{t.patientSymptomStatement}</label>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 leading-relaxed font-medium">
                    "{selectedApp.symptoms || t.directSpecialistBanner}"
                  </div>
                </div>

                {/* Doctor Official Written Opinion & Recommendations Editor */}
                <form onSubmit={handleSaveDoctorOpinion} className="space-y-3 bg-teal-50/60 border border-teal-200 p-4 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-teal-950 text-xs flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-teal-600" />
                      <span>Issue Official Medical Opinion & Recommendations for {selectedApp.patientName}:</span>
                    </label>
                    {opinionSaveSuccess && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                        ✓ Opinion Submitted to Patient
                      </span>
                    )}
                  </div>

                  <textarea
                    rows={4}
                    required
                    value={doctorOpinionInput}
                    onChange={(e) => setDoctorOpinionInput(e.target.value)}
                    placeholder="Enter official medical findings, diagnosis, recommendations, and next steps for the patient..."
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-teal-500 leading-relaxed shadow-sm"
                  />

                  <button
                    type="submit"
                    disabled={isSavingOpinion || !doctorOpinionInput.trim()}
                    className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSavingOpinion ? 'Saving...' : 'Submit Official Opinion to Patient'}</span>
                  </button>
                </form>

                {/* Patient Case Q&A Messages & Reply Box */}
                <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                    <span>Patient Case Q&A & Follow-up Discussion ({selectedApp.caseMessages?.length || 0}):</span>
                  </span>

                  {/* Messages List */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2 text-xs">
                    {(!selectedApp.caseMessages || selectedApp.caseMessages.length === 0) ? (
                      <p className="text-slate-400 text-center py-2 text-xs">
                        No questions sent by patient for this case yet.
                      </p>
                    ) : (
                      selectedApp.caseMessages.map(msg => (
                        <div
                          key={msg.id}
                          className={`p-2.5 rounded-xl max-w-md ${
                            msg.sender === 'doctor'
                              ? 'bg-teal-600 text-white ml-auto'
                              : 'bg-slate-100 text-slate-900 mr-auto'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-0.5 text-[10px] opacity-80 font-bold">
                            <span>{msg.senderName}</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <p className="leading-relaxed text-xs">{msg.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Reply Form */}
                  <form onSubmit={handleSendDoctorMessage} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={doctorReplyText}
                      onChange={(e) => setDoctorReplyText(e.target.value)}
                      placeholder={`Reply to ${selectedApp.patientName}'s questions...`}
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 shadow-sm"
                    />
                    <button
                      type="submit"
                      disabled={!doctorReplyText.trim()}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </form>
                </div>

              </div>
            )}

            {/* TAB CONTENT 2: ISOLATED MEDICAL VAULT FOR THIS USER ONLY */}
            {patientDetailTab === 'vault' && (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Medical Records for {selectedApp.patientName}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Strictly isolated patient records, MRIs, and diagnostic lab reports for {selectedApp.patientEmail}.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddRecordModalOpen(true)}
                    className="px-3 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow flex items-center gap-1.5 text-xs shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload to Vault</span>
                  </button>
                </div>

                {selectedPatientRecords.length === 0 ? (
                  <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                    <FileText className="w-10 h-10 text-slate-400 mx-auto" />
                    <p className="font-bold text-slate-700">No medical records uploaded for {selectedApp.patientName} yet.</p>
                    <p className="text-slate-500 text-[11px]">Click "Upload to Vault" above to attach lab results, doctor reports, or MRI scans for this user.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedPatientRecords.map(rec => (
                      <div key={rec.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="bg-teal-100 text-teal-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                            {rec.type}
                          </span>
                          <span className="text-slate-400 font-mono text-[11px]">{rec.date} · {rec.uploadedBy}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{rec.title}</h4>
                        <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                          {rec.aiSummary || rec.notes || 'No extra clinical notes provided.'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 3: ISOLATED E-PRESCRIPTIONS FOR THIS USER ONLY */}
            {patientDetailTab === 'prescription' && (
              <div className="space-y-6 animate-fade-in text-xs">
                
                {/* Active/Past Prescriptions for this Patient */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                    Issued Prescriptions for {selectedApp.patientName}
                  </h3>

                  {selectedPatientPrescriptions.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-[11px]">
                      No digital prescriptions issued for {selectedApp.patientName} yet. Use the form below to compose and sign a prescription.
                    </div>
                  ) : (
                    selectedPatientPrescriptions.map((p, idx) => (
                      <div key={idx} className="bg-teal-50/70 border border-teal-200 p-4 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between text-teal-900 font-bold">
                          <span className="flex items-center gap-1">
                            <Pill className="w-4 h-4 text-teal-600" />
                            Digital E-Prescription
                          </span>
                          <span className="text-slate-500 font-mono text-[11px]">{p.date}</span>
                        </div>

                        <div className="space-y-1.5">
                          {p.medicines.map((m: { name: string; dosage: string; frequency: string; duration: string }, mIdx: number) => (
                            <div key={mIdx} className="bg-white p-2.5 rounded-xl border border-teal-100 flex items-center justify-between font-medium">
                              <div>
                                <strong className="text-slate-900 block">{m.name} ({m.dosage})</strong>
                                <span className="text-slate-500 text-[11px]">{m.frequency} · {m.duration}</span>
                              </div>
                              <span className="text-teal-700 font-bold text-[10px] bg-teal-50 px-2 py-0.5 rounded">Rx Verified</span>
                            </div>
                          ))}
                        </div>

                        <p className="text-slate-700 text-[11px]"><strong>Doctor Notes:</strong> {p.notes}</p>
                        <div className="text-[10px] font-mono text-teal-800 border-t border-teal-200 pt-1.5 flex justify-between">
                          <span>Signed by: {p.doctorSignature}</span>
                          <span>Digital Signature Verified ✓</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Form: Issue New Digital E-Prescription */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-xs">
                      Issue New Digital E-Prescription for {selectedApp.patientName}
                    </h4>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Doctor Authorized
                    </span>
                  </div>

                  {prescIssuedSuccess && (
                    <div className="bg-emerald-900 text-white p-3.5 rounded-xl border border-emerald-700 flex items-center gap-2 font-bold animate-fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Digital E-Prescription issued and saved to {selectedApp.patientName}'s profile!</span>
                    </div>
                  )}

                  <form onSubmit={handleIssueFinalPrescription} className="space-y-4">
                    <div className="space-y-2">
                      <label className="font-bold text-slate-800 block">Medication List:</label>
                      {medicinesList.map((m, i) => (
                        <div key={i} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs font-medium">
                          <div className="flex items-center gap-2">
                            <Pill className="w-4 h-4 text-teal-600" />
                            <div>
                              <strong className="text-slate-900 block">{m.name} ({m.dosage})</strong>
                              <span className="text-slate-500 text-[11px]">{m.frequency} · {m.duration}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicine(i)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {/* Add Medicine Controls */}
                      <div className="grid sm:grid-cols-4 gap-2 bg-white p-3 rounded-xl border border-slate-200">
                        <input
                          type="text"
                          placeholder="Medicine Name"
                          value={medName}
                          onChange={(e) => setMedName(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <input
                          type="text"
                          placeholder="Dosage (e.g. 5mg)"
                          value={medDosage}
                          onChange={(e) => setMedDosage(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <input
                          type="text"
                          placeholder="Frequency"
                          value={medFreq}
                          onChange={(e) => setMedFreq(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddMedicine}
                          className="bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg py-2 flex items-center justify-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-slate-800 block mb-1">Doctor Clinical Instructions & Notes</label>
                      <textarea
                        value={prescNotes}
                        onChange={(e) => setPrescNotes(e.target.value)}
                        rows={2}
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
                      />
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Issue & Sign E-Prescription</span>
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            )}

            {/* TAB CONTENT 4: APPOINTMENTS HISTORY FOR THIS USER */}
            {patientDetailTab === 'history' && (
              <div className="space-y-3 animate-fade-in text-xs">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                  All Appointments for {selectedApp.patientName}
                </h3>

                {appointments
                  .filter(a => a.patientEmail.toLowerCase() === selectedApp.patientEmail.toLowerCase())
                  .map(a => (
                    <div key={a.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{a.doctorSpecialty} Consultation ({a.consultationType})</span>
                        <span className="text-[11px] text-slate-500 block">{a.date} · 🇯🇴 {a.timeAmman} / 🇩🇪 {a.timeBerlin}</span>
                        <span className="text-[11px] text-teal-700 font-semibold">{a.doctorName} ({a.doctorHospital})</span>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        a.status === 'upcoming' ? 'bg-teal-100 text-teal-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {a.status}
                      </span>
                    </div>
                  ))}
              </div>
            )}

          </div>
        )}

      </div>

      {/* MODAL: Upload Record to Selected Patient Vault */}
      {isAddRecordModalOpen && selectedApp && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-teal-800 text-sm">
                <FileUp className="w-5 h-5 text-teal-600" />
                <span>Upload Medical File for {selectedApp.patientName}</span>
              </div>
              <button onClick={() => setIsAddRecordModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVaultRecord} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Document Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Brain MRI Radiology Report / Post-Op Clinical Summary"
                  value={newVaultTitle}
                  onChange={(e) => setNewVaultTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Document Category</label>
                <select
                  value={newVaultType}
                  onChange={(e) => setNewVaultType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="Doctor Report">🩺 Doctor / Specialist Clinical Report</option>
                  <option value="Lab Result">🧪 Lab / Blood Work Test Result</option>
                  <option value="MRI/CT Scan">🔬 Radiology MRI / CT Scan DICOM</option>
                  <option value="Photo / Scan">📷 Photo / Symptom Image Scan</option>
                  <option value="Prescription">💊 Digital Prescription</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Select File from Device</label>
                <label className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer block space-y-1">
                  <Upload className="w-6 h-6 text-teal-600 mx-auto" />
                  <span className="text-xs font-bold text-slate-700 block">Click to attach document</span>
                  <span className="text-[10px] text-slate-400 block">PDF, DICOM, PNG, JPG (Max 50MB)</span>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setNewVaultFileName(e.target.files[0].name);
                      }
                    }}
                    className="hidden"
                  />
                </label>

                {newVaultFileName && (
                  <div className="mt-2 bg-teal-50 text-teal-900 p-2 rounded-xl text-[11px] font-mono border border-teal-200">
                    📎 File Attached: {newVaultFileName}
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Clinical Notes & AI Summary</label>
                <textarea
                  placeholder="Enter medical findings, dosage recommendations, or follow-up instructions..."
                  value={newVaultNotes}
                  onChange={(e) => setNewVaultNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRecordModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow"
                >
                  Save to {selectedApp.patientName}'s Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
