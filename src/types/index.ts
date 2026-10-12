export type CountryCode = 'JO' | 'DE' | 'ALL';
export type LanguageCode = 'en' | 'ar' | 'de';
export type CurrencyCode = 'JOD' | 'EUR' | 'USD';

export type Specialty = 
  | 'Cardiology' 
  | 'Neurology' 
  | 'Orthopedics' 
  | 'Oncology' 
  | 'Pediatrics' 
  | 'Dermatology' 
  | 'General Surgery'
  | 'Gastroenterology'
  | 'Urology'
  | 'Ophthalmology'
  | 'Other'
  | (string & {});

export type ConsultationType = 'video' | 'second_opinion' | 'record_review';

export interface CertificateDoc {
  id: string;
  title: string;
  issuingBody: string;
  year: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: 'pdf' | 'image' | 'doc';
  issueDate?: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  titleDe?: string;
  titleAr?: string;
  country: 'JO' | 'DE';
  city: string;
  hospital: string;
  hospitalAr?: string;
  hospitalDe?: string;
  specialty: Specialty;
  subSpecialties: string[];
  languages: ('Arabic' | 'German' | 'English' | string)[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  bio: string;
  bioAr?: string;
  bioDe?: string;
  education: string[];
  certifications: string[];
  certificateDocs?: CertificateDoc[];
  feeJod: number;
  feeEur: number;
  feeUsd: number;
  feeFileReviewEur?: number;
  feeFileReviewJod?: number;
  avatarUrl?: string;
  nextAvailable: string;
  availableTypes: ConsultationType[];
  timeZone: 'Asia/Amman' | 'Europe/Berlin';
  timeZoneOffsetLabel: string;
  isValidated?: boolean;
  validationStatus?: 'pending' | 'verified' | 'rejected';
  validationNotes?: string;
}

export interface TimeSlot {
  id: string;
  date: string; // YYYY-MM-DD
  timeAmman: string; // e.g., "16:00"
  timeBerlin: string; // e.g., "15:00"
  timeUtc: string;
  isAvailable: boolean;
}

export interface MedicalRecord {
  id: string;
  patientId?: string;
  doctorId?: string;
  title: string;
  type: 'Lab Result' | 'Doctor Report' | 'Photo / Scan' | 'MRI/CT Scan' | 'Prescription' | 'Doctor Summary' | 'Referral Letter';
  date: string;
  uploadedBy: string;
  patientName?: string;
  patientEmail?: string;
  fileSize?: string;
  notes?: string;
  aiSummary?: string;
  language?: LanguageCode;
  fileUrl?: string;
  fileName?: string;
  fileDataUrl?: string;
}

export interface Appointment {
  id: string;
  patientId?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: Specialty;
  doctorCountry: 'JO' | 'DE';
  doctorHospital: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  consultationType: ConsultationType;
  date: string;
  timeAmman: string;
  timeBerlin: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'in_progress';
  symptoms?: string;
  aiSummary?: string;
  medicalRecordIds?: string[];
  prescription?: {
    date: string;
    medicines: { name: string; dosage: string; frequency: string; duration: string }[];
    notes: string;
    doctorSignature: string;
  };
  doctorOpinion?: string;
  doctorOpinionDate?: string;
  caseMessages?: Array<{
    id: string;
    sender: 'patient' | 'doctor';
    senderName: string;
    text: string;
    timestamp: string;
  }>;
  totalFee: number;
  currency: CurrencyCode;
}

export interface PatientProfile {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  passportId: string;
  countryOfResidence: 'JO' | 'DE' | 'Other';
  
  // Medical History
  chronicConditions: string[];
  allergies: string[];
  pastSurgeries: string;
  currentMedications: string[];
  bloodType: string;
  familyHistory: string;

  // Insurance Provider
  insuranceProviderName: string;
  insurancePolicyNumber: string;
  coverageRegion: 'Jordan Only' | 'Germany Only' | 'International / Cross-Border' | 'Self-Pay / Private';
  insuranceExpiry: string;
  insuranceCardUploaded: boolean;

  // Contact & Language Preferences
  preferredLanguage: LanguageCode;
  preferredContactMethod: 'WhatsApp' | 'Email' | 'Phone Call';
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
  country: 'JO' | 'DE' | 'Other';
  preferredLanguage: LanguageCode;
  isAuthenticated: boolean;
  avatarUrl?: string;
  patientProfile?: PatientProfile;
  isDoctorValidated?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'doctor' | 'patient' | 'system' | 'ai';
  senderName: string;
  originalText: string;
  originalLang: LanguageCode;
  translatedText?: Record<LanguageCode, string>;
  timestamp: string;
}
