import React, { useState, useEffect } from 'react';
import { CountryCode, LanguageCode, CurrencyCode, Doctor, Appointment, MedicalRecord, ConsultationType, Specialty, PatientProfile, UserAccount } from './types';
import { MOCK_DOCTORS, MOCK_APPOINTMENTS, MOCK_RECORDS } from './data/mockData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { BookingModal } from './components/BookingModal';
import { VirtualClinic } from './components/VirtualClinic';
import { PatientDashboard } from './components/PatientDashboard';
import { ProfileSettings } from './components/ProfileSettings';
import { CountrySelectionFlow } from './components/CountrySelectionFlow';
import { MedicalTravelGuide } from './components/MedicalTravelGuide';
import { AiSymptomAssistant } from './components/AiSymptomAssistant';
import { DoctorPortal } from './components/DoctorPortal';
import { DoctorProfilePage } from './components/DoctorProfilePage';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { Upload, X, Check, FileText, Sparkles, Loader2, ScanLine, CheckCircle2, Camera, FlaskConical } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('ALL');
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('EUR');

  // Authenticated User State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>({
    id: 'usr-patient-1',
    fullName: 'Omar Al-Masmoudi',
    email: 'omar.masmoudi@example.com',
    phone: '+962 7 9123 4567',
    role: 'patient',
    country: 'JO',
    preferredLanguage: 'en',
    isAuthenticated: true
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Patient Profile State
  const [patientProfile, setPatientProfile] = useState<PatientProfile>({
    fullName: 'Omar Al-Masmoudi',
    email: 'omar.masmoudi@example.com',
    phone: '+962 7 9123 4567',
    dob: '1988-05-14',
    gender: 'Male',
    passportId: 'P-9812401',
    countryOfResidence: 'JO',
    
    // Medical History
    chronicConditions: ['Tension Headaches', 'Mild Hypertension'],
    allergies: ['Penicillin', 'Iodine Contrast (Mild)'],
    pastSurgeries: 'Appendectomy (2018)',
    currentMedications: ['Bisoprolol Fumarate 2.5mg', 'Magnesium Citrate 150mg'],
    bloodType: 'O+',
    familyHistory: 'Maternal history of cardiac arrhythmia; paternal history of diabetes.',

    // Insurance Provider
    insuranceProviderName: 'Techniker Krankenkasse (TK) / Allianz Global Health',
    insurancePolicyNumber: 'TK-981240129-DE',
    coverageRegion: 'International / Cross-Border',
    insuranceExpiry: '2027-12-31',
    insuranceCardUploaded: true,

    // Preferred Language & Communication
    preferredLanguage: 'en',
    preferredContactMethod: 'WhatsApp',
    emergencyContactName: 'Fatima Al-Masmoudi',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '+962 7 9876 5432'
  });

  // Modals and Drawers
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingType, setBookingType] = useState<ConsultationType>('video');
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [isUploadRecordOpen, setIsUploadRecordOpen] = useState<boolean>(false);

  // App State Stores
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [records, setRecords] = useState<MedicalRecord[]>(MOCK_RECORDS);

  // Selected Active Appointment for Virtual Clinic Call
  const [activeClinicAppointment, setActiveClinicAppointment] = useState<Appointment | null>(MOCK_APPOINTMENTS[0]);

  // Handle Search from Hero redirects to Gateway Flow
  const handleHeroSearch = (query: string, specialty?: Specialty, country?: CountryCode) => {
    if (country) setSelectedCountry(country);
    setCurrentTab('home');
  };

  // Handle Complete Booking
  const handleCompleteBooking = (newApp: Partial<Appointment>) => {
    const fullAppointment: Appointment = {
      id: `app-${Date.now()}`,
      doctorId: newApp.doctorId || 'doc-de-2',
      doctorName: newApp.doctorName || 'Prof. Dr. med. Sabine Weber',
      doctorSpecialty: newApp.doctorSpecialty || 'Neurology',
      doctorCountry: newApp.doctorCountry || 'DE',
      doctorHospital: newApp.doctorHospital || 'Charité Berlin',
      patientName: newApp.patientName || 'Omar Al-Masmoudi',
      patientEmail: newApp.patientEmail || 'omar.masmoudi@example.com',
      patientPhone: newApp.patientPhone || '+962 7 9123 4567',
      consultationType: newApp.consultationType || 'video',
      date: newApp.date || '2026-10-10',
      timeAmman: newApp.timeAmman || '16:00',
      timeBerlin: newApp.timeBerlin || '15:00',
      status: 'upcoming',
      symptoms: newApp.symptoms,
      aiSummary: newApp.aiSummary,
      totalFee: newApp.totalFee || 180,
      currency: newApp.currency || 'EUR'
    };

    setAppointments(prev => [fullAppointment, ...prev]);
    setActiveClinicAppointment(fullAppointment);
    setBookingDoctor(null);
    setCurrentTab('dashboard');
  };

  // Upload Record State
  const [newRecTitle, setNewRecTitle] = useState('');
  const [newRecType, setNewRecType] = useState<'Lab Result' | 'Doctor Report' | 'Photo / Scan' | 'MRI/CT Scan' | 'Prescription'>('Lab Result');
  const [newRecNotes, setNewRecNotes] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const [uploadedFileType, setUploadedFileType] = useState<'image' | 'pdf' | 'dicom' | 'other' | null>(null);
  const [uploadedFilePreviewUrl, setUploadedFilePreviewUrl] = useState<string | null>(null);
  const [uploadedFileObj, setUploadedFileObj] = useState<File | null>(null);

  // AI OCR State
  const [isOcrScanning, setIsOcrScanning] = useState<boolean>(false);
  const [ocrSuccessMessage, setOcrSuccessMessage] = useState<string | null>(null);

  // Run AI OCR on uploaded file
  const runOcrOnSelectedFile = async (fileToScan?: File) => {
    const targetFile = fileToScan || uploadedFileObj;
    setIsOcrScanning(true);
    setOcrSuccessMessage(null);

    try {
      let base64Image = '';
      let mimeType = targetFile?.type || 'image/jpeg';
      let fileName = targetFile?.name || uploadedFileName || 'Medical Report';

      if (targetFile) {
        base64Image = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const res = reader.result as string;
            resolve(res.includes(',') ? res.split(',')[1] : res);
          };
          reader.readAsDataURL(targetFile);
        });
      }

      const response = await fetch('/api/ai/ocr-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image, mimeType, fileName })
      });

      const data = await response.json();
      if (data.extractedNotes) {
        setNewRecNotes(data.extractedNotes);
        setOcrSuccessMessage('✨ Text automatically parsed & extracted from document by Gemini AI OCR!');
      }
    } catch (err) {
      console.error('OCR Error:', err);
    } finally {
      setIsOcrScanning(false);
    }
  };

  const handleSaveUploadedRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecTitle.trim()) return;

    const newRecord: MedicalRecord = {
      id: `rec-${Date.now()}`,
      title: newRecTitle,
      type: newRecType,
      date: new Date().toISOString().split('T')[0],
      uploadedBy: 'Patient Upload',
      fileSize: uploadedFileSize || '14.2 MB',
      notes: uploadedFileName ? `Attached File: ${uploadedFileName}\n${newRecNotes}` : newRecNotes,
      aiSummary: 'Bilingual AI Intake Analysis: Attached report processed for Jordanian and German doctor review.'
    };

    setRecords(prev => [newRecord, ...prev]);
    setIsUploadRecordOpen(false);
    setNewRecTitle('');
    setNewRecNotes('');
    setUploadedFileName('');
    setUploadedFileSize('');
    setUploadedFileType(null);
    setUploadedFilePreviewUrl(null);
    setUploadedFileObj(null);
    setOcrSuccessMessage(null);
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between ${currentLang === 'ar' ? 'rtl' : 'ltr'}`}>
      
      {/* Top Navbar */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        currentCurrency={currentCurrency}
        setCurrentCurrency={setCurrentCurrency}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSignOut={() => setCurrentUser(null)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        
        {currentTab === 'home' && (
          <>
            {/* Step 1 & 2 Primary Direct Gateway Flow: Country Corridor -> Upload Case or Ask for Appointment -> Automated Doctor Assignment */}
            <CountrySelectionFlow
              currentLang={currentLang}
              currentCurrency={currentCurrency}
              onSelectCountryAndPath={(country, path, doc) => {
                setSelectedCountry(country);
                if (doc) setBookingDoctor(doc);
              }}
              onCompleteBooking={handleCompleteBooking}
            />

            <HeroSection
              onSearchDoctors={handleHeroSearch}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              currentLang={currentLang}
              currentCurrency={currentCurrency}
            />
          </>
        )}

        {currentTab === 'dashboard' && (
          <PatientDashboard
            appointments={appointments}
            records={records}
            currentLang={currentLang}
            currentCurrency={currentCurrency}
            onOpenVirtualClinic={(app) => {
              setActiveClinicAppointment(app);
              setCurrentTab('virtual-clinic');
            }}
            onOpenUploadRecord={() => setIsUploadRecordOpen(true)}
            onBookNewConsultation={() => setCurrentTab('home')}
            onOpenProfileSettings={() => setCurrentTab('profile-settings')}
          />
        )}

        {currentTab === 'profile-settings' && (
          <div className="py-10 px-4 sm:px-6 max-w-7xl mx-auto">
            <ProfileSettings
              profile={patientProfile}
              onSaveProfile={(updated) => {
                setPatientProfile(updated);
              }}
              currentLang={currentLang}
              onLanguageChange={(newLang) => setCurrentLang(newLang)}
            />
          </div>
        )}

        {currentTab === 'doctor-profile' && (
          <DoctorProfilePage
            currentUser={currentUser}
            currentLang={currentLang}
            currentCurrency={currentCurrency}
            doctors={doctors}
            onUpdateDoctor={(updatedDoc) => {
              setDoctors(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
            }}
            onNavigateToPortal={() => setCurrentTab('doctor-portal')}
          />
        )}

        {currentTab === 'doctor-portal' && (
          <DoctorPortal
            currentUser={currentUser}
            currentLang={currentLang}
            currentCurrency={currentCurrency}
            appointments={appointments}
            records={records}
            doctors={doctors}
            onOpenVirtualClinic={(app) => {
              setActiveClinicAppointment(app);
              setCurrentTab('virtual-clinic');
            }}
            onIssuePrescription={(appId, newPrescription) => {
              setAppointments(prev => prev.map(a => a.id === appId ? { ...a, prescription: newPrescription } : a));
            }}
            onAddRecordToPatientVault={(newRecord) => {
              setRecords(prev => [newRecord, ...prev]);
            }}
            onOpenDoctorProfile={() => setCurrentTab('doctor-profile')}
          />
        )}

        {currentTab === 'virtual-clinic' && (
          <VirtualClinic
            currentLang={currentLang}
            currentCurrency={currentCurrency}
            appointment={activeClinicAppointment}
            onCloseRoom={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'travel-guide' && (
          <MedicalTravelGuide
            currentLang={currentLang}
            onBookSpecialist={() => setCurrentTab('home')}
          />
        )}

      </main>

      {/* Booking Flow Modal */}
      <BookingModal
        doctor={bookingDoctor}
        consultationType={bookingType}
        onClose={() => setBookingDoctor(null)}
        currentLang={currentLang}
        currentCurrency={currentCurrency}
        onCompleteBooking={handleCompleteBooking}
      />

      {/* AI Pre-consultation Symptom Assistant Drawer */}
      <AiSymptomAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        currentLang={currentLang}
        onSelectDoctorToBook={() => {
          setIsAiAssistantOpen(false);
          setCurrentTab('home');
        }}
      />

      {/* Upload Medical Record Modal */}
      {isUploadRecordOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setIsUploadRecordOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Upload className="w-5 h-5 text-teal-600" />
              <span>Upload Medical Document / MRI</span>
            </div>

            <form onSubmit={handleSaveUploadedRecord} className="space-y-3.5 text-xs">
              {/* Document Category Selection Pills */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">1. Select Document Category:</label>
                <div className="grid grid-cols-3 gap-1.5 font-semibold text-[11px]">
                  <button
                    type="button"
                    onClick={() => setNewRecType('Lab Result')}
                    className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                      newRecType === 'Lab Result'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20 font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <FlaskConical className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">🧪 Lab Report</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewRecType('Doctor Report')}
                    className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                      newRecType === 'Doctor Report'
                        ? 'bg-sky-50 border-sky-500 text-sky-800 ring-2 ring-sky-500/20 font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="truncate">🩺 Doctor Report</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewRecType('Photo / Scan')}
                    className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                      newRecType === 'Photo / Scan'
                        ? 'bg-purple-50 border-purple-500 text-purple-800 ring-2 ring-purple-500/20 font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Camera className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="truncate">📷 Upload Photo</span>
                  </button>
                </div>
              </div>

              {/* File Upload Attachment Input Box & Preview Card */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">2. Attach File or Photo:</label>
                
                {!uploadedFileName ? (
                  <div className="border-2 border-dashed border-teal-200 rounded-2xl p-4 text-center bg-teal-50/40 hover:bg-teal-50 transition-colors space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      {newRecType === 'Lab Result' && <FlaskConical className="w-6 h-6 text-emerald-600" />}
                      {newRecType === 'Doctor Report' && <FileText className="w-6 h-6 text-sky-600" />}
                      {newRecType === 'Photo / Scan' && <Camera className="w-6 h-6 text-purple-600" />}
                      {newRecType === 'MRI/CT Scan' && <Upload className="w-6 h-6 text-teal-600" />}
                    </div>

                    <span className="text-xs font-bold text-slate-800 block">
                      {newRecType === 'Lab Result' && 'Upload Lab Results / Blood Work / Pathology Report'}
                      {newRecType === 'Doctor Report' && 'Upload Doctor Report / Clinical Diagnosis Note'}
                      {newRecType === 'Photo / Scan' && 'Upload Photo of Medical Report, Symptoms or Prescription'}
                      {newRecType === 'MRI/CT Scan' && 'Upload MRI, CT Scan or DICOM Medical Image'}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Supported: PDF, JPG, PNG, DICOM (Up to 50MB)</span>
                    
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <input
                        type="file"
                        id="vault-file-upload-dialog"
                        accept={newRecType === 'Photo / Scan' ? 'image/*' : 'application/pdf,image/*,.dicom,.doc,.docx'}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setUploadedFileObj(file);
                            setUploadedFileName(file.name);
                            setUploadedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
                            
                            if (file.type.startsWith('image/')) {
                              setUploadedFileType('image');
                              setUploadedFilePreviewUrl(URL.createObjectURL(file));
                            } else if (file.type.includes('pdf')) {
                              setUploadedFileType('pdf');
                              setUploadedFilePreviewUrl(null);
                            } else {
                              setUploadedFileType('dicom');
                              setUploadedFilePreviewUrl(null);
                            }

                            if (!newRecTitle) {
                              setNewRecTitle(file.name.replace(/\.[^/.]+$/, ""));
                            }

                            // Auto-trigger Gemini OCR text parsing
                            runOcrOnSelectedFile(file);
                          }
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="vault-file-upload-dialog"
                        className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl cursor-pointer inline-flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-white" />
                        <span>Choose File from Device</span>
                      </label>

                      {/* Photo Camera Capture direct action */}
                      <input
                        type="file"
                        id="vault-photo-camera-capture"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setNewRecType('Photo / Scan');
                            setUploadedFileObj(file);
                            setUploadedFileName(file.name);
                            setUploadedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
                            setUploadedFileType('image');
                            setUploadedFilePreviewUrl(URL.createObjectURL(file));
                            if (!newRecTitle) setNewRecTitle('Medical Photo Scan');
                            runOcrOnSelectedFile(file);
                          }
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="vault-photo-camera-capture"
                        className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl cursor-pointer inline-flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5 text-white" />
                        <span>Take Photo</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  /* ATTACHED FILE THUMBNAIL / PREVIEW CARD WITH OCR TRIGGER */
                  <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl p-3.5 space-y-2.5 relative animate-fade-in shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                        <Check className="w-4 h-4 text-emerald-600 bg-emerald-200 rounded-full p-0.5" />
                        <span>File Attached Successfully</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFileName('');
                          setUploadedFileSize('');
                          setUploadedFileType(null);
                          setUploadedFilePreviewUrl(null);
                          setUploadedFileObj(null);
                          setOcrSuccessMessage(null);
                        }}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                      >
                        Remove / Change File
                      </button>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-emerald-200">
                      {/* Image Thumbnail or File Type Icon */}
                      {uploadedFileType === 'image' && uploadedFilePreviewUrl ? (
                        <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                          <img
                            src={uploadedFilePreviewUrl}
                            alt="Attached Document Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold shrink-0 border border-teal-200">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-slate-900 text-xs block truncate" title={uploadedFileName}>
                          {uploadedFileName}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
                            {uploadedFileSize || '14.2 MB'}
                          </span>
                          <span className="text-emerald-600 font-semibold uppercase text-[10px]">
                            {uploadedFileType === 'image' ? 'Image File' : (uploadedFileType === 'pdf' ? 'PDF Document' : 'DICOM Scan')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI OCR Scan Action Button & Progress */}
                    <div className="pt-1 flex items-center justify-between border-t border-emerald-200/80">
                      <button
                        type="button"
                        onClick={() => runOcrOnSelectedFile()}
                        disabled={isOcrScanning}
                        className="px-3 py-1.5 bg-teal-700 hover:bg-teal-600 disabled:opacity-60 text-white font-bold text-[11px] rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        {isOcrScanning ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Gemini OCR Extracting Text...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                            <span>Re-scan with Gemini Medical OCR</span>
                          </>
                        )}
                      </button>

                      <span className="text-[10px] text-teal-800 font-semibold flex items-center gap-1">
                        <ScanLine className="w-3.5 h-3.5 text-teal-600" />
                        Auto-OCR Enabled
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={newRecTitle}
                  onChange={(e) => setNewRecTitle(e.target.value)}
                  placeholder="e.g. Lumbar Spine MRI Scan / Lab Blood Panel"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={newRecType}
                  onChange={(e) => setNewRecType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="MRI/CT Scan">MRI / CT Scan Imaging</option>
                  <option value="Lab Result">Lab / Blood Test Result</option>
                  <option value="Prescription">Prescription / Medication List</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 block">Clinical Notes & Findings</label>
                  {isOcrScanning && (
                    <span className="text-[10px] text-teal-600 font-bold flex items-center gap-1 animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" /> Gemini AI Parsing Image Text...
                    </span>
                  )}
                </div>

                {ocrSuccessMessage && (
                  <div className="mb-2 p-2 bg-emerald-100/90 border border-emerald-300 text-emerald-900 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{ocrSuccessMessage}</span>
                  </div>
                )}

                <textarea
                  value={newRecNotes}
                  onChange={(e) => setNewRecNotes(e.target.value)}
                  placeholder="Include radiologist notes or main concerns... (Auto-filled by AI OCR when document image is attached)"
                  rows={5}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadRecordOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-sm"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Authentication Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentLang={currentLang}
        onLoginSuccess={(user, newDoctor) => {
          if (newDoctor) {
            setDoctors(prev => [newDoctor, ...prev]);
          }
          setCurrentUser(user);
          if (user.patientProfile) {
            setPatientProfile(user.patientProfile);
          }
          if (user.role === 'doctor') {
            setCurrentTab('doctor-profile');
          } else {
            setCurrentTab('dashboard');
          }
        }}
      />

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onNavigate={(tab) => setCurrentTab(tab)}
      />

    </div>
  );
}

