import { LanguageCode } from '../types';

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Header & Brand
    appTitle: 'MedLink International',
    subTitle: 'Jordan & Germany Medical Portal',
    home: 'Home',
    doctors: 'AI Matched Specialists',
    myConsultations: 'My Portal & Records',
    virtualClinic: 'Live Virtual Clinic',
    travelVisa: 'Medical Visa & Transfer',
    aiAssistant: 'AI Medical Translator',
    
    // Country Select & Badges
    selectCountry: 'Select Origin',
    allCountries: 'All Hubs (JO & DE)',
    jordan: 'Jordan',
    germany: 'Germany',
    jordanFlag: '🇯🇴 Jordan',
    germanyFlag: '🇩🇪 Germany',
    ammanCenter: 'Amman Medical Hub',
    berlinCenter: 'Berlin & Munich Hub',
    
    // Hero Section
    heroTitle: 'Automated Cross-Border Specialist Assignment Between Jordan & Germany',
    heroDescription: 'No manual searching required. Submit your case or voice note, and our intelligent clinical engine automatically assigns the best-matched professor from Charité Berlin, Heidelberg, or Amman.',
    bookConsultationBtn: 'Submit Case for Matching',
    exploreDirectoryBtn: 'How Matching Works',
    trustNotice: 'Fully compliant with Jordanian Ministry of Health & German Medical Association Standards',
    
    // Quick Stats
    statDoctors: '75+ Board-Certified Consultants',
    statHospitals: '12 Premier Medical Centers',
    statTranslation: 'Real-Time Arabic / German AI Translator',
    statTimezone: 'Dual EET Amman / CET Berlin Timings',

    // Doctor Directory & Filters
    filterBySpecialty: 'Filter Specialty',
    filterByCountry: 'Doctor Country',
    filterByConsultation: 'Consultation Format',
    filterByLanguage: 'Language Spoken',
    searchPlaceholder: 'Search doctor name, hospital, condition, or keyword...',
    videoCall: 'Video Telehealth',
    secondOpinion: 'Cross-Border Second Opinion',
    recordReview: 'Diagnostic Record Review',
    yearsExp: 'years exp.',
    reviews: 'reviews',
    nextAvailableSlot: 'Next Available Slot',
    bookNow: 'Book Consultation',
    viewProfile: 'View Profile',
    fee: 'Consultation Fee',
    
    // Booking Flow
    bookingModalTitle: 'Schedule International Consultation',
    step1Slot: '1. Choose Date & Time Slot',
    step2Patient: '2. Patient Details',
    step3Records: '3. Symptoms & Diagnostic Files',
    step4Review: '4. AI Intake Review & Payment',
    ammanTime: 'Amman Time (EET)',
    berlinTime: 'Berlin Time (CET)',
    patientName: 'Full Patient Name',
    patientEmail: 'Email Address',
    patientPhone: 'Phone Number (with Country Code)',
    symptomsLabel: 'Describe your Symptoms & Medical History',
    symptomsPlaceholder: 'e.g. Chronic headaches for 3 weeks, previous MRI attached...',
    uploadRecord: 'Upload Medical Report / MRI (PDF, JPG, DICOM)',
    aiIntakeNotice: 'Gemini AI will convert your medical notes into a structured bilingual summary for the doctor.',
    confirmBookingBtn: 'Confirm Appointment',
    bookingSuccess: 'Consultation Confirmed Successfully!',

    // Virtual Clinic
    clinicTitle: 'Live Telemedicine Suite',
    clinicSubtitle: 'Encrypted Cross-Border Medical Video Consultation',
    doctorNotes: 'Doctor Clinical Notes',
    liveCaptions: 'Live AI Cross-Border Subtitles',
    captionNotice: 'Simultaneous AR / DE / EN Medical Translation Active',
    medicalViewer: 'Diagnostic Viewer (MRIs & Labs)',
    issuePrescription: 'Issue E-Prescription',
    endCall: 'End Session',
    cameraToggle: 'Camera On',
    micToggle: 'Mic Active',

    // Dashboard
    dashboardTitle: 'Patient Medical Portal',
    dashboardSubtitle: 'Manage your cross-border appointments, reports, and AI medical summaries',
    upcomingAppointments: 'Upcoming Consultations',
    pastConsultations: 'Past Consultations',
    medicalVault: 'Medical Records Vault',
    downloadPdf: 'Download Prescription PDF',
    viewAiSummary: 'View AI Medical Summary',

    // Travel & Transfer Guide
    travelTitle: 'Jordan & Germany Medical Transfer Guide',
    travelSubtitle: 'Official guidance for patients traveling between Amman, Berlin, Munich, and Heidelberg for specialized surgeries or inpatient care.',
    visaHeading: 'Medical Visa & Travel Facilitation',
    visaJordanianToDe: 'Jordanian Citizens Traveling to Germany (Schengen Medical Visa)',
    visaDeToJordan: 'German Citizens & Expats Traveling to Jordan (Medical Tourism)',
    step1HospitalLetter: 'Hospital Referral & Official Invitation Letter from Charité or Heidelberg',
    step2ProofFunds: 'Proof of Medical Insurance & Treatment Deposit Confirmation',
    step3AmbulanceFlight: 'Direct Air Ambulance or Medical Escort Arrangements',
    requestTravelAssistance: 'Request Medical Travel Escort',

    // Footer
    footerCopy: '© 2026 MedLink International Telemedicine Portal. Operating across Amman, Berlin, Heidelberg, and Munich.',
    emergencyNotice: 'If you are experiencing a life-threatening emergency, please dial 911 (Jordan) or 112 (Germany) immediately.'
  },

  ar: {
    // Header & Brand
    appTitle: 'ميدلينك الدولية',
    subTitle: 'بوابة الطب والاستشارات بين الأردن وألمانيا',
    home: 'الرئيسية',
    doctors: 'التعيين الذكي للاستشاريين',
    myConsultations: 'ملفي الطبي ومواعيدي',
    virtualClinic: 'العيادة الافتراضية المباشرة',
    travelVisa: 'الفيز والنقل الطبي الدولي',
    aiAssistant: 'المترجم الطبي الذكي',
    
    // Country Select & Badges
    selectCountry: 'اختر بلد الطبيب',
    allCountries: 'جميع الأطباء (الأردن وألمانيا)',
    jordan: 'الأردن',
    germany: 'ألمانيا',
    jordanFlag: '🇯🇴 الأردن',
    germanyFlag: '🇩🇪 ألمانيا',
    ammanCenter: 'مركز عمان الطبي المتميز',
    berlinCenter: 'مركز برلين وهايدلبرغ المتميز',
    
    // Hero Section
    heroTitle: 'التعيين الآلي للاستشاريين الطبيين بين الأردن وألمانيا',
    heroDescription: 'لا داعي للبحث اليدوي. ارفع تقاريرك الطبية أو سجل ملاحظتك الصوتية، وسيقوم نظام التقييم الطبي الذكي بتعيين الطبيب الاستشاري الأنسب لحالتك تلقائياً من الشاريتيه برلين أو عمان.',
    bookConsultationBtn: 'تقديم الحالة للتعيين الآلي',
    exploreDirectoryBtn: 'كيف يعمل التعيين الذكي',
    trustNotice: 'معتمد وفق معايير وزارة الصحة الأردنية ونقابة الأطباء الألمانية',
    
    // Quick Stats
    statDoctors: '+75 استشاري بحملة البورد الدولي',
    statHospitals: '12 مستشفى وجامعة طبية شريكة',
    statTranslation: 'ترجمة فورية بالذكاء الاصطناعي (عربي/ألماني)',
    statTimezone: 'جدولة مواعيد دقيقة بتوقيت عمان وبرلين',

    // Doctor Directory & Filters
    filterBySpecialty: 'التخصص الطبي',
    filterByCountry: 'بلد الطبيب',
    filterByConsultation: 'نوع الاستشارة',
    filterByLanguage: 'لغة التحدث',
    searchPlaceholder: 'ابحث باسم الطبيب، المستشفى، أو الحالة الطبية...',
    videoCall: 'استشارة فيديو مباشرة',
    secondOpinion: 'رأي طبي ثانٍ دولي',
    recordReview: 'تقييم التقارير والأشعة',
    yearsExp: 'سنوات خبرة',
    reviews: 'تقييم',
    nextAvailableSlot: 'أقرب موعد متاح',
    bookNow: 'احجز الاستشارة',
    viewProfile: 'الملف الشخصي',
    fee: 'رسوم الاستشارة',
    
    // Booking Flow
    bookingModalTitle: 'جدولة استشارة طبية دولية',
    step1Slot: '١. اختر التاريخ والوقت المناسب',
    step2Patient: '٢. بيانات المريض',
    step3Records: '٣. الأعراض والملفات الطبية',
    step4Review: '٤. مراجعة ملخص AI والدفع',
    ammanTime: 'توقيت عمان (الأردن)',
    berlinTime: 'توقيت برلين (ألمانيا)',
    patientName: 'اسم المريض الكامل',
    patientEmail: 'البريد الإلكتروني',
    patientPhone: 'رقم الهاتف (مع رمز الدولة)',
    symptomsLabel: 'اشرح أعراضك والتاريخ المرضي',
    symptomsPlaceholder: 'مثال: صداع متكرر منذ ثلاثة أسابيع، مرفق تقرير الرنين المغناطيسي...',
    uploadRecord: 'رفع التقارير والأشعة (PDF, JPG, DICOM)',
    aiIntakeNotice: 'سيقوم الذكاء الاصطناعي تحويل شرحك إلى ملخص طبي دقيق ومترجم للطبيب.',
    confirmBookingBtn: 'تأكيد الحجز والدفع',
    bookingSuccess: 'تم تأكيد حجز الموعد بنجاح!',

    // Virtual Clinic
    clinicTitle: 'غرفة الاتصال الطبي المباشر',
    clinicSubtitle: 'استشارة مرئية مشفرة بين الأردن وألمانيا',
    doctorNotes: 'الملاحظات المباشرة للطبيب',
    liveCaptions: 'الترجمة الفورية المباشرة',
    captionNotice: 'الترجمة الطبية الفورية (عربي / ألماني / إنجليزي) مفعلة',
    medicalViewer: 'استعراض الأشعة والتحاليل',
    issuePrescription: 'إصدار الوصفة الإلكترونية',
    endCall: 'إنهاء الجلسة',
    cameraToggle: 'الكاميرا تعمل',
    micToggle: 'المايك يعمل',

    // Dashboard
    dashboardTitle: 'بوابة المريض الطبية',
    dashboardSubtitle: 'إدارة مواعيدك الدولية، التقارير الطبية، وملخصات الذكاء الاصطناعي',
    upcomingAppointments: 'المواعيد القادمة',
    pastConsultations: 'الاستشارات السابقة',
    medicalVault: 'سجل التقارير والأشعة',
    downloadPdf: 'تحميل الوصفة الطبية (PDF)',
    viewAiSummary: 'عرض الملخص الطبي للذكاء الاصطناعي',

    // Travel & Transfer Guide
    travelTitle: 'دليل العلاج والسفر الطبي بين الأردن وألمانيا',
    travelSubtitle: 'إرشادات رسمية للمرضى الراغبين بالسفر بين عمان وبرلين وهايدلبرغ وميونخ لإجراء العمليات المعقدة أو الاستشفاء.',
    visaHeading: 'التسهيلات الطبية وتأشيرة العلاج',
    visaJordanianToDe: 'سفر المرضى الأردنيين إلى ألمانيا (تأشيرة العلاج شنغن)',
    visaDeToJordan: 'سفر المرضى من ألمانيا والأوروبيين إلى الأردن (السياحة العلاجية)',
    step1HospitalLetter: 'خطاب الدعوة الرسمي من مستشفى الشاريتيه أو جامعة هايدلبرغ',
    step2ProofFunds: 'تأكيد الضمان المالي أو التغطية التأمينية الطبية',
    step3AmbulanceFlight: 'ترتيبات الإخلاء الطبي الجوي أو المرافقة الطبية',
    requestTravelAssistance: 'طلب مرافقة أو تسهيل سفر طبي',

    // Footer
    footerCopy: '© ٢٠٢٦ ميدلينك الدولية للطب عن بعد. نعمل عبر شبكة مراكز عمان، برلين، هايدلبرغ، وميونخ.',
    emergencyNotice: 'إذا كنت تعاني من حالة طوارئ حرجة، يرجى الاتصال فوراً بالرقم 911 (الأردن) أو 112 (ألمانيا).'
  },

  de: {
    // Header & Brand
    appTitle: 'MedLink International',
    subTitle: 'Medizinisches Portal Jordanien & Deutschland',
    home: 'Startseite',
    doctors: 'KI-Spezialistenzuweisung',
    myConsultations: 'Mein Portal & Befunde',
    virtualClinic: 'Live-Videosprechstunde',
    travelVisa: 'Medizinisches Visum & Transfer',
    aiAssistant: 'KI-Medizinübersetzer',
    
    // Country Select & Badges
    selectCountry: 'Herkunft wählen',
    allCountries: 'Alle Spezialisten (JO & DE)',
    jordan: 'Jordanien',
    germany: 'Deutschland',
    jordanFlag: '🇯🇴 Jordanien',
    germanyFlag: '🇩🇪 Deutschland',
    ammanCenter: 'Medizinisches Zentrum Amman',
    berlinCenter: 'Zentrum Berlin & Heidelberg',
    
    // Hero Section
    heroTitle: 'Automatische grenzüberschreitende Facharztzuweisung zwischen Jordanien & Deutschland',
    heroDescription: 'Keine manuelle Arztsuche erforderlich. Reichen Sie Ihren Fall oder eine Sprachnotiz ein, und unser intelligentes System weist automatisch den am besten passenden Chefarzt der Charité Berlin, der Universität Heidelberg oder aus Amman zu.',
    bookConsultationBtn: 'Fall zur Zuweisung einreichen',
    exploreDirectoryBtn: 'Wie die Zuweisung funktioniert',
    trustNotice: 'Vollständig konform mit den Standards der Deutschen Bundesärztekammer & des jordanischen Gesundheitsministeriums',
    
    // Quick Stats
    statDoctors: '75+ Fachärzte & Chefärzte',
    statHospitals: '12 Führende Universitätskliniken',
    statTranslation: 'Echtzeit KI-Übersetzung (Arabisch / Deutsch)',
    statTimezone: 'Synchrone Zeiten: Amman (EET) & Berlin (CET)',

    // Doctor Directory & Filters
    filterBySpecialty: 'Fachgebiet',
    filterByCountry: 'Land des Arztes',
    filterByConsultation: 'Konsultationsart',
    filterByLanguage: 'Gesprochene Sprachen',
    searchPlaceholder: 'Arztname, Klinik, Krankheit oder Stichwort suchen...',
    videoCall: 'Live-Videosprechstunde',
    secondOpinion: 'Zweitmeinung (International)',
    recordReview: 'Befund- & MRT-Analyse',
    yearsExp: 'Jahre Erf.',
    reviews: 'Bewertungen',
    nextAvailableSlot: 'Nächster freier Termin',
    bookNow: 'Termin buchen',
    viewProfile: 'Profil ansehen',
    fee: 'Honorar',
    
    // Booking Flow
    bookingModalTitle: 'Internationale Sprechstunde buchen',
    step1Slot: '1. Datum & Uhrzeit wählen',
    step2Patient: '2. Patientendaten',
    step3Records: '3. Symptome & Befunde',
    step4Review: '4. KI-Zusammenfassung & Zahlung',
    ammanTime: 'Zeit Amman (EET)',
    berlinTime: 'Zeit Berlin (CET)',
    patientName: 'Vollständiger Name des Patienten',
    patientEmail: 'E-Mail-Adresse',
    patientPhone: 'Telefonnummer (mit Ländervorwahl)',
    symptomsLabel: 'Symptome & Krankheitsgeschichte beschreiben',
    symptomsPlaceholder: 'z.B. Chronische Kopfschmerzen seit 3 Wochen, MRT-Befund beigefügt...',
    uploadRecord: 'Befund oder MRT hochladen (PDF, JPG, DICOM)',
    aiIntakeNotice: 'Die Gemini-KI wandelt Ihre Angaben in eine strukturierte zweisprachige Zusammenfassung für den Arzt um.',
    confirmBookingBtn: 'Termin verbindlich buchen',
    bookingSuccess: 'Termin erfolgreich bestätigt!',

    // Virtual Clinic
    clinicTitle: 'Live-Telemedizin-Suite',
    clinicSubtitle: 'Verschlüsselte grenzüberschreitende Videosprechstunde',
    doctorNotes: 'Klinische Notizen des Arztes',
    liveCaptions: 'Live KI-Untertitel & Übersetzung',
    captionNotice: 'Simultane Medizinübersetzung (DE / AR / EN) aktiv',
    medicalViewer: 'Befund- & Bilddatenbetrachter',
    issuePrescription: 'E-Rezept ausstellen',
    endCall: 'Sitzung beenden',
    cameraToggle: 'Kamera an',
    micToggle: 'Mikrofon aktiv',

    // Dashboard
    dashboardTitle: 'Patienten-Portal',
    dashboardSubtitle: 'Verwalten Sie Termine, medizinische Befunde und KI-Zusammenfassungen',
    upcomingAppointments: 'Anstehende Konsultationen',
    pastConsultations: 'Vergangene Termine',
    medicalVault: 'Befund- & Rezeptarchiv',
    downloadPdf: 'Rezept als PDF herunterladen',
    viewAiSummary: 'KI-Anamnese anzeigen',

    // Travel & Transfer Guide
    travelTitle: 'Leitfaden für Medizinreisen Jordanien - Deutschland',
    travelSubtitle: 'Offizielle Informationen für Patienten zur Behandlung und Rehabilitation zwischen Amman, Berlin, Heidelberg und München.',
    visaHeading: 'Medizinisches Visum & Reiseunterstützung',
    visaJordanianToDe: 'Reise jordanischer Patienten nach Deutschland (Schengen-Visum zur Behandlung)',
    visaDeToJordan: 'Reise deutscher Patienten nach Jordanien (Medizintourismus & Spezialbehandlung)',
    step1HospitalLetter: 'Einladungsschreiben der Charité Berlin oder der Universität Heidelberg',
    step2ProofFunds: 'Nachweis der Kostenübernahme oder Krankenversicherung',
    step3AmbulanceFlight: 'Organisation von Ambulanzflügen und medizinischer Begleitung',
    requestTravelAssistance: 'Reisebegleitung anfordern',

    // Footer
    footerCopy: '© 2026 MedLink International Portal. Partnerkliniken in Amman, Berlin, Heidelberg und München.',
    emergencyNotice: 'Bei lebensbedrohlichen Notfällen wählen Sie bitte sofort 112 (Deutschland) oder 911 (Jordanien).'
  }
};
