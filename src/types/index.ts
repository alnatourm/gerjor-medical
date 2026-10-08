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
  | 'Ophthalmology';

export type ConsultationType = 'video' | 'second_opinion' | 'record_review';

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
  languages: ('Arabic' | 'German' | 'English')[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  bio: string;
  bioAr?: string;
  bioDe?: string;
  education: string[];
  certifications: string[];
  feeJod: number;
  feeEur: number;
  feeUsd: number;
  avatarUrl?: string;
  nextAvailable: string;
  availableTypes: ConsultationType[];
  timeZone: 'Asia/Amman' | 'Europe/Berlin';
  timeZoneOffsetLabel: string;
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
  title: string;
  type: 'Lab Result' | 'MRI/CT Scan' | 'Prescription' | 'Doctor Summary' | 'Referral Letter';
  date: string;
  uploadedBy: string;
  fileSize?: string;
  notes?: string;
  aiSummary?: string;
  language?: LanguageCode;
}

export interface Appointment {
  id: string;
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

export interface ChatMessage {
  id: string;
  sender: 'doctor' | 'patient' | 'system' | 'ai';
  senderName: string;
  originalText: string;
  originalLang: LanguageCode;
  translatedText?: Record<LanguageCode, string>;
  timestamp: string;
}
