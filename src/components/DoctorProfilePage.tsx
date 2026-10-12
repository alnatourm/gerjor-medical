import React, { useState, useEffect } from 'react';
import { Doctor, CertificateDoc, LanguageCode, CurrencyCode, Specialty, ConsultationType } from '../types';
import { TRANSLATIONS } from '../translations/translations';
import { MOCK_DOCTORS } from '../data/mockData';
import { 
  User, ShieldCheck, CheckCircle2, Award, Building, Globe, 
  Stethoscope, Camera, Clock, Plus, Trash2, Edit3, Upload, 
  FileText, X, Check, DollarSign, Languages, GraduationCap, 
  ChevronRight, AlertCircle, FileUp, Sparkles, Eye
} from 'lucide-react';

export const SPECIALTY_OPTIONS: string[] = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Oncology',
  'Pediatrics',
  'Dermatology',
  'General Surgery',
  'Gastroenterology',
  'Urology',
  'Ophthalmology',
  'Endocrinology',
  'Pulmonology / Respiratory Medicine',
  'Nephrology',
  'Rheumatology',
  'Internal Medicine',
  'Obstetrics & Gynecology',
  'ENT / Otolaryngology',
  'Psychiatry & Behavioral Health',
  'Radiology & Imaging',
  'Vascular Surgery',
  'Neurosurgery',
  'Pediatric Surgery',
  'Plastic & Reconstructive Surgery',
  'Emergency Medicine',
  'Anesthesiology & Pain Medicine',
  'Pathology',
  'Other'
];

interface DoctorProfilePageProps {
  currentUser?: any;
  currentLang: LanguageCode;
  currentCurrency: CurrencyCode;
  doctors?: Doctor[];
  onUpdateDoctor?: (updatedDoctor: Doctor) => void;
  onNavigateToPortal: () => void;
}

export const DoctorProfilePage: React.FC<DoctorProfilePageProps> = ({
  currentUser,
  currentLang,
  doctors = MOCK_DOCTORS,
  onUpdateDoctor,
  onNavigateToPortal
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  // Auto-detect active physician
  const defaultDoc = React.useMemo(() => {
    if (currentUser && currentUser.role === 'doctor') {
      const exactMatch = doctors.find(d => 
        d.id === currentUser.id ||
        d.name.toLowerCase().trim() === currentUser.fullName.toLowerCase().trim()
      );
      if (exactMatch) return exactMatch;

      // Clean empty doctor profile for a newly registered physician
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

  const [doctor, setDoctor] = useState<Doctor>(defaultDoc);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  // Synchronize state when defaultDoc changes
  useEffect(() => {
    setDoctor(defaultDoc);
  }, [defaultDoc]);

  // Certificate Modal / Drawer State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCertIndex, setEditingCertIndex] = useState<number | null>(null);
  const [certTitle, setCertTitle] = useState('');
  const [certIssuingBody, setCertIssuingBody] = useState('');
  const [certYear, setCertYear] = useState(new Date().getFullYear().toString());
  const [certFileName, setCertFileName] = useState('');
  const [certFilePreview, setCertFilePreview] = useState<string | null>(null);
  const [certFileType, setCertFileType] = useState<'pdf' | 'image' | 'doc'>('pdf');

  // Preview Certificate Document Modal
  const [previewingCert, setPreviewingCert] = useState<CertificateDoc | null>(null);

  // New Language Modal State
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [customLanguage, setCustomLanguage] = useState('');

  // New Education Modal State
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [newEduText, setNewEduText] = useState('');

  // New SubSpecialty Modal State
  const [isSubSpecModalOpen, setIsSubSpecModalOpen] = useState(false);
  const [newSubSpecText, setNewSubSpecText] = useState('');

  // Ensure certificateDocs array is initialized
  const certDocsList: CertificateDoc[] = doctor.certificateDocs && doctor.certificateDocs.length > 0
    ? doctor.certificateDocs
    : (doctor.certifications && doctor.certifications.length > 0
      ? doctor.certifications.map((c, i) => ({
          id: `cert-${i}`,
          title: c,
          issuingBody: doctor.country === 'DE' ? 'German Medical Association (Ärztekammer)' : 'Jordanian Medical Council (JMC)',
          year: new Date().getFullYear().toString(),
          fileName: `${c.replace(/[^a-zA-Z0-9]/g, '_')}_verified.pdf`,
          fileType: 'pdf'
        }))
      : []
    );

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto sync USD fee: 1 EUR ~ 1.08 USD, 1 JOD ~ 1.41 USD
    const updatedFeeUsd = Math.round(doctor.feeEur * 1.08);

    const updatedDoctor: Doctor = {
      ...doctor,
      feeUsd: updatedFeeUsd,
      certifications: certDocsList.map(cd => cd.title),
      certificateDocs: certDocsList
    };

    setDoctor(updatedDoctor);

    try {
      const res = await fetch(`/api/doctors/${updatedDoctor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDoctor)
      });
      const data = await res.json();
      if (data.doctor && onUpdateDoctor) {
        onUpdateDoctor(data.doctor);
      } else if (onUpdateDoctor) {
        onUpdateDoctor(updatedDoctor);
      }
    } catch (err) {
      console.error('Error persisting doctor profile to server:', err);
      if (onUpdateDoctor) {
        onUpdateDoctor(updatedDoctor);
      }
    }

    setIsSavedSuccess(true);
    setTimeout(() => setIsSavedSuccess(false), 4000);
  };

  // Certificate Actions
  const handleOpenCertModal = (index?: number) => {
    if (index !== undefined && certDocsList[index]) {
      const target = certDocsList[index];
      setEditingCertIndex(index);
      setCertTitle(target.title);
      setCertIssuingBody(target.issuingBody);
      setCertYear(target.year);
      setCertFileName(target.fileName || '');
      setCertFilePreview(target.fileUrl || null);
      setCertFileType(target.fileType || 'pdf');
    } else {
      setEditingCertIndex(null);
      setCertTitle('');
      setCertIssuingBody(doctor.country === 'DE' ? 'German Medical Association (Ärztekammer Berlin)' : 'Jordanian Medical Council (JMC Amman)');
      setCertYear(new Date().getFullYear().toString());
      setCertFileName('');
      setCertFilePreview(null);
      setCertFileType('pdf');
    }
    setIsCertModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertFileName(file.name);
      if (file.type.includes('pdf')) setCertFileType('pdf');
      else if (file.type.includes('image')) setCertFileType('image');
      else setCertFileType('doc');

      const reader = new FileReader();
      reader.onloadend = () => {
        setCertFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim()) return;

    const newDoc: CertificateDoc = {
      id: editingCertIndex !== null && certDocsList[editingCertIndex] 
        ? certDocsList[editingCertIndex].id 
        : `cert-${Date.now()}`,
      title: certTitle.trim(),
      issuingBody: certIssuingBody.trim() || 'Verified Medical Board',
      year: certYear.trim() || new Date().getFullYear().toString(),
      fileName: certFileName || `${certTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      fileUrl: certFilePreview || undefined,
      fileType: certFileType,
      issueDate: new Date().toISOString().split('T')[0]
    };

    let updatedList: CertificateDoc[];
    if (editingCertIndex !== null) {
      updatedList = [...certDocsList];
      updatedList[editingCertIndex] = newDoc;
    } else {
      updatedList = [newDoc, ...certDocsList];
    }

    const updatedDoctor = {
      ...doctor,
      certifications: updatedList.map(c => c.title),
      certificateDocs: updatedList
    };

    setDoctor(updatedDoctor);
    if (onUpdateDoctor) onUpdateDoctor(updatedDoctor);

    setIsCertModalOpen(false);
  };

  const handleDeleteCertificate = (index: number) => {
    const updatedList = certDocsList.filter((_, i) => i !== index);
    const updatedDoctor = {
      ...doctor,
      certifications: updatedList.map(c => c.title),
      certificateDocs: updatedList
    };
    setDoctor(updatedDoctor);
    if (onUpdateDoctor) onUpdateDoctor(updatedDoctor);
  };

  // Spoken Language Actions
  const AVAILABLE_LANGUAGES = ['Arabic', 'German', 'English', 'French', 'Spanish', 'Turkish', 'Italian', 'Russian'];

  const handleToggleLanguage = (langName: string) => {
    let updatedLangs: string[];
    if (doctor.languages.includes(langName)) {
      if (doctor.languages.length <= 1) return; // Keep at least 1 language
      updatedLangs = doctor.languages.filter(l => l !== langName);
    } else {
      updatedLangs = [...doctor.languages, langName];
    }
    const updated = { ...doctor, languages: updatedLangs };
    setDoctor(updated);
    if (onUpdateDoctor) onUpdateDoctor(updated);
  };

  const handleAddCustomLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLanguage.trim() && !doctor.languages.includes(customLanguage.trim())) {
      const updatedLangs = [...doctor.languages, customLanguage.trim()];
      const updated = { ...doctor, languages: updatedLangs };
      setDoctor(updated);
      if (onUpdateDoctor) onUpdateDoctor(updated);
      setCustomLanguage('');
      setIsLangModalOpen(false);
    }
  };

  // Education Actions
  const handleAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEduText.trim()) {
      const updatedEdu = [...doctor.education, newEduText.trim()];
      const updated = { ...doctor, education: updatedEdu };
      setDoctor(updated);
      if (onUpdateDoctor) onUpdateDoctor(updated);
      setNewEduText('');
      setIsEduModalOpen(false);
    }
  };

  const handleDeleteEducation = (index: number) => {
    const updatedEdu = doctor.education.filter((_, i) => i !== index);
    const updated = { ...doctor, education: updatedEdu };
    setDoctor(updated);
    if (onUpdateDoctor) onUpdateDoctor(updated);
  };

  // SubSpecialty Actions
  const handleAddSubSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubSpecText.trim()) {
      const updatedSub = [...doctor.subSpecialties, newSubSpecText.trim()];
      const updated = { ...doctor, subSpecialties: updatedSub };
      setDoctor(updated);
      if (onUpdateDoctor) onUpdateDoctor(updated);
      setNewSubSpecText('');
      setIsSubSpecModalOpen(false);
    }
  };

  const handleDeleteSubSpecialty = (index: number) => {
    const updatedSub = doctor.subSpecialties.filter((_, i) => i !== index);
    const updated = { ...doctor, subSpecialties: updatedSub };
    setDoctor(updated);
    if (onUpdateDoctor) onUpdateDoctor(updated);
  };

  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1594824813566-7885a63ed11d?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
  ];

  return (
    <div className="py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-6 animate-fade-in text-slate-900" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Doctor Profile Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-sky-800/60 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-sky-500/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative group">
              {doctor.avatarUrl ? (
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-teal-400 shadow-xl bg-slate-800"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-teal-400/80 bg-slate-800/90 flex flex-col items-center justify-center text-teal-300 shadow-xl">
                  <User className="w-8 h-8 text-teal-400" />
                  <span className="text-[9px] font-bold text-teal-300 mt-1">Upload Photo</span>
                </div>
              )}

              <input
                type="file"
                id="doctor-avatar-file-upload-input"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const updated = { ...doctor, avatarUrl: reader.result as string };
                      setDoctor(updated);
                      if (onUpdateDoctor) onUpdateDoctor(updated);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />

              <label
                htmlFor="doctor-avatar-file-upload-input"
                className="absolute -bottom-2 -right-2 bg-teal-600 hover:bg-teal-500 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                title="Upload Profile Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </label>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  {t.doctorProfile}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">{doctor.name}</h1>
              <p className="text-xs sm:text-sm text-sky-200 font-medium">
                {doctor.title || doctor.specialty || 'Medical Specialist Consultant (Complete Profile Below)'}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-slate-300 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-teal-400" />
                  {doctor.hospital || 'Hospital / Clinic Affiliation Not Set'}
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-teal-400" />
                  {doctor.city ? `${doctor.city}, ` : ''}{doctor.country === 'DE' ? `🇩🇪 ${t.germany}` : `🇯🇴 ${t.jordan}`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Quick Switch Active Doctor Dropdown for testing */}
            <select
              value={doctor.id}
              onChange={(e) => {
                const found = doctors.find(d => d.id === e.target.value);
                if (found) setDoctor(found);
              }}
              className="bg-slate-950 border border-slate-700 text-white text-xs font-bold rounded-xl p-3 cursor-pointer focus:outline-none focus:border-teal-500"
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.country === 'DE' ? '🇩🇪' : '🇯🇴'} {d.name} {d.specialty ? `(${d.specialty})` : ''}
                </option>
              ))}
            </select>

            <button
              onClick={onNavigateToPortal}
              className="px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-105 shrink-0"
            >
              <Stethoscope className="w-4 h-4 text-slate-950" />
              <span>{t.doctorPortal} →</span>
            </button>
          </div>
        </div>

        {/* Avatar Preset Selector */}
        {isEditingAvatar && (
          <div className="mt-6 pt-4 border-t border-sky-800/80 animate-fade-in space-y-3">
            <p className="text-xs font-bold text-sky-300">{t.chooseAvatarPreset}</p>
            <div className="flex items-center gap-3">
              {AVATAR_PRESETS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const updated = { ...doctor, avatarUrl: url };
                    setDoctor(updated);
                    if (onUpdateDoctor) onUpdateDoctor(updated);
                    setIsEditingAvatar(false);
                  }}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                    doctor.avatarUrl === url ? 'border-teal-400 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="Preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Save Success Banner */}
      {isSavedSuccess && (
        <div className="bg-emerald-900/90 text-white p-4 rounded-2xl border border-emerald-500 flex items-center gap-3 font-bold text-xs shadow-lg animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-extrabold text-emerald-200">{t.profileUpdatedSuccess}</p>
            <p className="text-[11px] text-emerald-300/90 font-normal">{t.profileUpdatedSuccessSub}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Form Editor & Credentials */}
      <div className="grid lg:grid-cols-12 gap-6">

        {/* Left Column (8 cols): Primary Clinical & Price Settings */}
        <div className="lg:col-span-8 space-y-6">

          {/* Form 1: Basic Clinical Information */}
          <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600" />
                <h2 className="text-base font-bold text-slate-900">{t.physicianProfileTitle}</h2>
              </div>
              <span className="text-xs font-semibold text-slate-400">1. {t.physicianProfileTitle}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">{t.fullPhysicianName} *</label>
                <input
                  type="text"
                  value={doctor.name}
                  onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
                  placeholder="e.g. Dr. Full Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">{t.medicalSpecialtyTitle}</label>
                <select
                  value={
                    SPECIALTY_OPTIONS.includes(doctor.specialty) 
                      ? doctor.specialty 
                      : (SPECIALTY_OPTIONS.includes(doctor.title) ? doctor.title : 'Other')
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'Other') {
                      setDoctor({ ...doctor, specialty: 'Other' as Specialty, title: 'Medical Specialist' });
                    } else {
                      setDoctor({ ...doctor, specialty: val as Specialty, title: val });
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                >
                  <option value="">-- Select Medical Specialty --</option>
                  {SPECIALTY_OPTIONS.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>

                {(!SPECIALTY_OPTIONS.slice(0, -1).includes(doctor.specialty) && !SPECIALTY_OPTIONS.slice(0, -1).includes(doctor.title)) || doctor.specialty === 'Other' ? (
                  <div className="mt-2 space-y-1 animate-fade-in">
                    <label className="text-[11px] font-bold text-teal-700 block">
                      Custom Medical Specialty / Sub-specialty Title:
                    </label>
                    <input
                      type="text"
                      value={doctor.title}
                      onChange={(e) => setDoctor({ ...doctor, title: e.target.value, specialty: (e.target.value || 'Other') as Specialty })}
                      placeholder="Type your custom medical specialty..."
                      className="w-full bg-white border border-teal-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-teal-500 focus:outline-none shadow-sm"
                    />
                  </div>
                ) : null}
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">{t.affiliatedHospital}</label>
                <input
                  type="text"
                  value={doctor.hospital}
                  onChange={(e) => setDoctor({ ...doctor, hospital: e.target.value })}
                  placeholder="e.g. King Hussein Medical Center or Charité Berlin"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">City / Clinic Location</label>
                <input
                  type="text"
                  value={doctor.city}
                  onChange={(e) => setDoctor({ ...doctor, city: e.target.value })}
                  placeholder={doctor.country === 'DE' ? "e.g. Berlin, Munich" : "e.g. Amman, Aqaba"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 font-semibold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Price & Fee Structure Management */}
            <div className="pt-3 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 block">
                    {t.telemedicineRatesTitle}
                  </span>
                </div>
                <span className="bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {t.dualConsultationRatesBadge}
                </span>
              </div>

              {/* Rate 1: Live Video Consultation Fee */}
              <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📹</span>
                    <span className="font-extrabold text-teal-950 text-xs">{t.liveVideoRateTitle}</span>
                  </div>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                    {t.scheduledVideoCallBadge}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {t.liveVideoRateEur}
                    </label>
                    <input
                      type="number"
                      value={doctor.feeEur || ''}
                      onChange={(e) => setDoctor({ ...doctor, feeEur: Number(e.target.value) })}
                      placeholder="e.g. 150"
                      className="w-full bg-white border border-teal-200 rounded-xl p-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {t.liveVideoRateJod}
                    </label>
                    <input
                      type="number"
                      value={doctor.feeJod || ''}
                      onChange={(e) => setDoctor({ ...doctor, feeJod: Number(e.target.value) })}
                      placeholder="e.g. 110"
                      className="w-full bg-white border border-teal-200 rounded-xl p-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Rate 2: Diagnostic File Review Fee */}
              <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📄</span>
                    <span className="font-extrabold text-sky-950 text-xs">{t.fileReviewRateTitle}</span>
                  </div>
                  <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
                    {t.asynchronousMriBadge}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {t.fileReviewRateEur}
                    </label>
                    <input
                      type="number"
                      value={doctor.feeFileReviewEur || ''}
                      onChange={(e) => setDoctor({ ...doctor, feeFileReviewEur: Number(e.target.value) })}
                      placeholder="e.g. 100"
                      className="w-full bg-white border border-sky-200 rounded-xl p-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {t.fileReviewRateJod}
                    </label>
                    <input
                      type="number"
                      value={doctor.feeFileReviewJod || ''}
                      onChange={(e) => setDoctor({ ...doctor, feeFileReviewJod: Number(e.target.value) })}
                      placeholder="e.g. 75"
                      className="w-full bg-white border border-sky-200 rounded-xl p-2.5 text-slate-900 font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1 text-xs">
                {t.clinicalBioLabel}
              </label>
              <textarea
                value={doctor.bio}
                onChange={(e) => setDoctor({ ...doctor, bio: e.target.value })}
                placeholder="Write your professional medical biography, clinical qualifications, hospital background, and expertise..."
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="font-bold text-slate-800 block mb-1 text-xs">
                {t.nextAvailableSlotsLabel}
              </label>
              <input
                type="text"
                value={doctor.nextAvailable}
                onChange={(e) => setDoctor({ ...doctor, nextAvailable: e.target.value })}
                placeholder="e.g. Tomorrow at 15:00 (Synchronous Tele-consultation)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">{t.changesApplyNotice}</span>
              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.saveProfileChangesBtn}</span>
              </button>
            </div>
          </form>

          {/* Sub-Specialties Management Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">Sub-Specialties & Clinical Focus</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSubSpecModalOpen(true)}
                className="px-3 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 text-xs font-bold rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Sub-Specialty</span>
              </button>
            </div>

            {doctor.subSpecialties.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-slate-500 text-xs font-medium">
                No sub-specialties or focus tags added yet. Click <span className="font-bold text-teal-700">+ Add Sub-Specialty</span> to enter your areas of clinical focus.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {doctor.subSpecialties.map((sub, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-2 text-slate-800 font-bold">
                    <span>{sub}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSubSpecialty(idx)}
                      className="text-slate-400 hover:text-rose-600 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (4 cols): Certificates Upload/Manage, Spoken Languages & Education */}
        <div className="lg:col-span-4 space-y-6">

          {/* Certificates & Diplomas Management Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">Medical Certificates & Diplomas</h3>
              </div>
              <button
                type="button"
                onClick={() => handleOpenCertModal()}
                className="px-3 py-1 bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200 text-[11px] font-bold rounded-lg flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Certificate</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              Upload medical certificates, Facharzt diplomas, or fellowship qualifications to display on your profile.
            </p>

            {/* List of Doctor's Certificates */}
            {certDocsList.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-slate-500 text-xs font-medium">
                No board licenses or certificates added yet. Click <span className="font-bold text-emerald-700">+ Upload Certificate</span> to upload your diploma or medical license.
              </div>
            ) : (
              <div className="space-y-3">
                {certDocsList.map((cert, index) => (
                  <div key={cert.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 block leading-tight font-bold">{cert.title}</strong>
                          <span className="text-[11px] text-slate-500 block">{cert.issuingBody} ({cert.year})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setPreviewingCert(cert)}
                          className="text-slate-500 hover:text-teal-600 p-1 bg-white rounded border border-slate-200"
                          title="View / Preview Certificate Document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenCertModal(index)}
                          className="text-slate-500 hover:text-sky-600 p-1 bg-white rounded border border-slate-200"
                          title="Edit Certificate"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCertificate(index)}
                          className="text-slate-400 hover:text-rose-600 p-1 bg-white rounded border border-slate-200"
                          title="Delete Certificate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {cert.fileName && (
                      <div className="flex items-center gap-1.5 text-[10px] bg-emerald-100/80 text-emerald-900 px-2 py-1 rounded-md border border-emerald-200 font-mono">
                        <ShieldCheck className="w-3 h-3 text-emerald-700 shrink-0" />
                        <span className="truncate">{cert.fileName}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Languages Spoken Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">{t.crossBorderConsultationLangs}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLangModalOpen(true)}
                className="px-2.5 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 text-[11px] font-bold rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Language</span>
              </button>
            </div>

            <div className="space-y-2">
              {AVAILABLE_LANGUAGES.map((lang) => {
                const isSpoken = doctor.languages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleToggleLanguage(lang)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      isSpoken 
                        ? 'bg-teal-50 border-teal-300 text-teal-900' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span>{lang}</span>
                    {isSpoken ? (
                      <span className="bg-teal-600 text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">+ Click to enable</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Education & Fellowships Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">{t.educationFellowships}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEduModalOpen(true)}
                className="px-2.5 py-1 bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 text-[11px] font-bold rounded-lg flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Education</span>
              </button>
            </div>

            {doctor.education.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-slate-500 text-xs font-medium">
                No education degrees or fellowships added yet. Click <span className="font-bold text-sky-700">+ Add Education</span> to enter your qualifications.
              </div>
            ) : (
              <ul className="space-y-2">
                {doctor.education.map((edu, index) => (
                  <li key={index} className="flex items-start justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800 text-[11px]">
                    <div className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <span>{edu}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteEducation(index)}
                      className="text-slate-400 hover:text-rose-600 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

      </div>

      {/* MODAL 1: Upload / Edit Certificate Modal */}
      {isCertModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-teal-700 font-extrabold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>{editingCertIndex !== null ? 'Edit Medical Certificate' : 'Upload Medical Board Certificate'}</span>
              </div>
              <button onClick={() => setIsCertModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCertificate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Certificate / License Title *</label>
                <input
                  type="text"
                  placeholder="e.g. German Board of Cardiac Surgery (Facharzt für Herzchirurgie)"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none font-bold"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Issuing Board / University</label>
                  <input
                    type="text"
                    placeholder="e.g. Ärztekammer Berlin / Jordan Medical Council"
                    value={certIssuingBody}
                    onChange={(e) => setCertIssuingBody(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Year Obtained</label>
                  <input
                    type="text"
                    value={certYear}
                    onChange={(e) => setCertYear(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Certificate Document Upload Dropzone */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Upload Diploma Document (PDF / Image / Scan)</label>
                <label className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer block space-y-2">
                  <FileUp className="w-7 h-7 text-teal-600 mx-auto" />
                  <span className="text-xs font-bold text-slate-700 block">Click or Drag & Drop Diploma File</span>
                  <span className="text-[11px] text-slate-400 block">PDF, JPG, PNG (Max 20MB)</span>
                  <input type="file" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" className="hidden" />
                </label>

                {certFileName && (
                  <div className="mt-2 bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-center justify-between text-xs text-teal-950 font-mono">
                    <span className="truncate">📎 {certFileName}</span>
                    <span className="text-teal-700 font-bold uppercase text-[10px]">{certFileType}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCertModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Certificate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Preview Certificate Drawer */}
      {previewingCert && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">{previewingCert.title}</h3>
              </div>
              <button onClick={() => setPreviewingCert(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs text-teal-300">
                <span>Issuing Authority: <strong>{previewingCert.issuingBody}</strong></span>
                <span>Year: <strong>{previewingCert.year}</strong></span>
              </div>

              {previewingCert.fileUrl ? (
                previewingCert.fileType === 'image' ? (
                  <img src={previewingCert.fileUrl} alt="Certificate Document" className="w-full max-h-80 object-contain rounded-xl border border-slate-700" />
                ) : (
                  <div className="p-8 bg-slate-950 text-center rounded-xl border border-slate-800 space-y-3">
                    <FileText className="w-12 h-12 text-teal-400 mx-auto" />
                    <p className="text-xs font-mono text-slate-300">{previewingCert.fileName || 'Verified Medical Board PDF Diploma.pdf'}</p>
                    <a
                      href={previewingCert.fileUrl}
                      download={previewingCert.fileName || 'certificate.pdf'}
                      className="inline-block px-5 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow"
                    >
                      Download Official Board Document
                    </a>
                  </div>
                )
              ) : (
                <div className="p-8 bg-slate-950 text-center rounded-xl border border-slate-800 space-y-2">
                  <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-200">Official Board License Record Verified</p>
                  <p className="text-[11px] text-slate-400">Registered with {previewingCert.issuingBody}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button onClick={() => setPreviewingCert(null)} className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Custom Language */}
      {isLangModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Add Spoken Language</h3>
              <button onClick={() => setIsLangModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomLanguage} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Language Name</label>
                <input
                  type="text"
                  placeholder="e.g. French, Spanish, Russian, Turkish"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsLangModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-teal-600 text-white font-bold rounded-xl">
                  Add Language
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Add Education */}
      {isEduModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Add Education / Fellowship</h3>
              <button onClick={() => setIsEduModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEducation} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Degree / Training Title & University</label>
                <input
                  type="text"
                  placeholder="e.g. MD - Charité University Medicine Berlin (2008)"
                  value={newEduText}
                  onChange={(e) => setNewEduText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsEduModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-sky-600 text-white font-bold rounded-xl">
                  Add Degree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Add Sub-Specialty */}
      {isSubSpecModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Add Sub-Specialty Focus</h3>
              <button onClick={() => setIsSubSpecModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubSpecialty} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Sub-Specialty Title</label>
                <input
                  type="text"
                  placeholder="e.g. Minimally Invasive Valve Repair"
                  value={newSubSpecText}
                  onChange={(e) => setNewSubSpecText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsSubSpecModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-teal-600 text-white font-bold rounded-xl">
                  Add Focus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
