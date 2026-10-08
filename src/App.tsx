import React, { useState, useEffect } from 'react';
import { CountryCode, LanguageCode, CurrencyCode, Doctor, Appointment, MedicalRecord, ConsultationType, Specialty, PatientProfile } from './types';
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
import { Footer } from './components/Footer';
import { Upload, X, Check, FileText } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('ALL');
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('EUR');

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
  const [newRecType, setNewRecType] = useState<'Lab Result' | 'MRI/CT Scan' | 'Prescription'>('MRI/CT Scan');
  const [newRecNotes, setNewRecNotes] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const [uploadedFileType, setUploadedFileType] = useState<'image' | 'pdf' | 'dicom' | 'other' | null>(null);
  const [uploadedFilePreviewUrl, setUploadedFilePreviewUrl] = useState<string | null>(null);

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

            <form onSubmit={handleSaveUploadedRecord} className="space-y-3 text-xs">
              {/* File Upload Attachment Input Box & Preview Card */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Attach File / Medical Record</label>
                
                {!uploadedFileName ? (
                  <div className="border-2 border-dashed border-teal-200 rounded-xl p-3.5 text-center bg-teal-50/50 hover:bg-teal-50 transition-colors">
                    <Upload className="w-6 h-6 text-teal-600 mx-auto mb-1" />
                    <span className="text-xs font-bold text-slate-800 block">Select DICOM, MRI, CT Scan, or PDF</span>
                    <span className="text-[10px] text-slate-500 block mb-2">Supported files: PDF, JPG, PNG, DICOM (Up to 50MB)</span>
                    
                    <input
                      type="file"
                      id="vault-file-upload-dialog"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
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
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="vault-file-upload-dialog"
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl cursor-pointer inline-block shadow-sm transition-colors"
                    >
                      Choose File from Device
                    </label>
                  </div>
                ) : (
                  /* ATTACHED FILE THUMBNAIL / PREVIEW CARD */
                  <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl p-3.5 space-y-2 relative animate-fade-in shadow-sm">
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
                <label className="font-semibold text-slate-700 block mb-1">Clinical Notes & Findings</label>
                <textarea
                  value={newRecNotes}
                  onChange={(e) => setNewRecNotes(e.target.value)}
                  placeholder="Include radiologist notes or main concerns..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
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

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onNavigate={(tab) => setCurrentTab(tab)}
      />

    </div>
  );
}

