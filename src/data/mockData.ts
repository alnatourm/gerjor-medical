import { Doctor, Appointment, MedicalRecord } from '../types';

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-de-1',
    name: 'Prof. Dr. med. Wilhelm von Berg',
    title: 'Senior Consultant Cardiac Surgeon',
    titleDe: 'Leitender Arzt für Herzchirurgie',
    titleAr: 'مستشار جراحة القلب والشرايين',
    country: 'DE',
    city: 'Heidelberg',
    hospital: 'Heidelberg University Hospital',
    hospitalDe: 'Universitätsklinikum Heidelberg',
    hospitalAr: 'مستشفى جامعة هايدلبرغ',
    specialty: 'Cardiology',
    subSpecialties: ['Minimally Invasive Valve Repair', 'Aortic Aneurysm Surgery', 'TAVI Procedures'],
    languages: ['German', 'English'],
    experienceYears: 24,
    rating: 4.95,
    reviewCount: 142,
    bio: 'Pioneer in minimally invasive heart valve reconstruction and complex aortic root repair. Head of Cardiovascular Surgery research group with over 150 published clinical papers.',
    bioAr: 'رائد في إعادة ترميم صمامات القلب بالقسطرة والتدخل الجراحي المحدود. رئيس فريق أبحاث جراحة القلب مع أكثر من 150 بحثاً علمياً منشوراً.',
    bioDe: 'Pionier auf dem Gebiet der minimalinvasiven Herzklappenrekonstruktion und komplexen Aortenchirurgie. Leiter der Herzchirurgischen Forschungsgruppe.',
    education: [
      'MD - Charité University Medicine Berlin (2001)',
      'Habilitation - Heidelberg University Faculty of Medicine (2009)',
      'Fellowship - Mayo Clinic Cardiac Surgery, USA'
    ],
    certifications: [
      'German Board of Cardiac Surgery (Facharzt für Herzchirurgie)',
      'European Board of Cardiothoracic Surgery (FEBTS)',
      'German Medical Council Certified Specialist'
    ],
    feeJod: 140,
    feeEur: 180,
    feeUsd: 195,
    nextAvailable: 'Today, 15:30 CET / 16:30 EET',
    availableTypes: ['video', 'second_opinion', 'record_review'],
    timeZone: 'Europe/Berlin',
    timeZoneOffsetLabel: 'CET (Berlin) / EET (Amman +1h)'
  },
  {
    id: 'doc-jo-1',
    name: 'Dr. Rania Al-Majali',
    title: 'Consultant Pediatric Cardiologist & Electrophysiologist',
    titleDe: 'Beraterin für Kinderkardiologie',
    titleAr: 'مستشارة طب وجراحة قلب الأطفال واعتلال النبض',
    country: 'JO',
    city: 'Amman',
    hospital: 'King Hussein Medical Center & Abdali Hospital',
    hospitalAr: 'مدينة الحسين الطبية ومستشفى العبدلي',
    hospitalDe: 'King Hussein Medical Center Amman',
    specialty: 'Cardiology',
    subSpecialties: ['Pediatric Congenital Heart Disease', 'Catheter Ablation', 'Pacemaker Implantation'],
    languages: ['Arabic', 'English'],
    experienceYears: 19,
    rating: 4.92,
    reviewCount: 118,
    bio: 'Renowned Jordanian pediatric cardiology consultant specialized in interventional cardiac catheterization and congenital heart defect repair in infants and teenagers.',
    bioAr: 'استشارية بارزة في طب قلب الأطفال بأعيان عمان وخبرة واسعة في قسطرة التشوهات الخلقية ومعالجة اضطرابات نبض القلب للأطفال والشباب.',
    bioDe: 'Renommierte jordanische Fachärztin für Kinderkardiologie mit Spezialisierung auf interventionelle Herzkatheteruntersuchungen.',
    education: [
      'MBBS - University of Jordan Faculty of Medicine (2005)',
      'Fellowship - Great Ormond Street Hospital for Children, London',
      'Jordanian Board in Pediatrics & Pediatric Cardiology'
    ],
    certifications: [
      'Jordan Medical Council Board in Pediatric Cardiology',
      'Arab Board of Health Specializations',
      'Fellow of the Royal College of Paediatrics (FRCPCH UK)'
    ],
    feeJod: 90,
    feeEur: 120,
    feeUsd: 130,
    nextAvailable: 'Tomorrow, 11:00 EET / 10:00 CET',
    availableTypes: ['video', 'second_opinion'],
    timeZone: 'Asia/Amman',
    timeZoneOffsetLabel: 'EET (Amman) / CET (Berlin -1h)'
  },
  {
    id: 'doc-de-2',
    name: 'Prof. Dr. med. Sabine Weber',
    title: 'Head of Neuro-Oncology & Stroke Medicine',
    titleDe: 'Chefärztin für Neuroonkologie & Schlaganfallmedizin',
    titleAr: 'رئيسة قسم أورام الأعصاب وطب السكتات الدماغية',
    country: 'DE',
    city: 'Berlin',
    hospital: 'Charité - Universitätsmedizin Berlin',
    hospitalDe: 'Charité - Universitätsmedizin Berlin',
    hospitalAr: 'مستشفى الشاريتيه الجامعي برلين',
    specialty: 'Neurology',
    subSpecialties: ['Brain Tumor Tele-Consultation', 'Multiple Sclerosis Therapy', 'Parkinson Movement Disorders'],
    languages: ['German', 'English', 'Arabic'],
    experienceYears: 26,
    rating: 4.98,
    reviewCount: 204,
    bio: 'Director of Neuro-Oncology at Charité Berlin. Specialist in complex brain tumor diagnostics, immunotherapies, and advanced stroke prevention programs.',
    bioAr: 'مديرة قسم أورام الأعصاب في مستشفى الشاريتيه برلين. متخصصة في تشخيص أورام الدماغ المعقدة والعلاج المناعي والوقاية المتقدمة من السكتات.',
    bioDe: 'Direktorin der Neuroonkologie an der Charité Berlin. Spezialistin für komplexe Hirntumordiagnostik und Immuntherapien.',
    education: [
      'MD, PhD - Ludwig Maximilian University of Munich (1998)',
      'Postdoctoral Research Fellow - Harvard Medical School Neurology Dept'
    ],
    certifications: [
      'German Board of Neurology (Facharzt für Neurologie)',
      'European Academy of Neurology Specialist Certification'
    ],
    feeJod: 155,
    feeEur: 200,
    feeUsd: 215,
    nextAvailable: 'Today, 17:00 CET / 18:00 EET',
    availableTypes: ['video', 'second_opinion', 'record_review'],
    timeZone: 'Europe/Berlin',
    timeZoneOffsetLabel: 'CET (Berlin) / EET (Amman +1h)'
  },
  {
    id: 'doc-jo-2',
    name: 'Dr. Tariq Nabulsi',
    title: 'Consultant Orthopedic & Robotic Joint Surgeon',
    titleDe: 'Berater für Orthopädie & Roboter-Gelenkchirurgie',
    titleAr: 'مستشار جراحة العظام والمفاصل واستبدال الركبة بالروبوت',
    country: 'JO',
    city: 'Amman',
    hospital: 'Jordan Hospital & Specialty Hospital Amman',
    hospitalAr: 'المستشفى الأردني والمستشفى التخصصي عمان',
    hospitalDe: 'Jordan Hospital Amman',
    specialty: 'Orthopedics',
    subSpecialties: ['Robotic Knee & Hip Arthroplasty', 'Sports Medicine ACL Repair', 'Spine Minimally Invasive Surgery'],
    languages: ['Arabic', 'English'],
    experienceYears: 20,
    rating: 4.89,
    reviewCount: 96,
    bio: 'Leading joint replacement surgeon in Amman known for robotic-assisted hip and knee surgery, sports trauma recovery, and cross-border rehabilitation protocols.',
    bioAr: 'جراح مفاصل وركبة معروف بالنموذج الروبوتي الحديث واعتلالات العمود الفقري وإصابات الرياضيين ورعاية المرضى القادمين من الخارج.',
    bioDe: 'Führender Gelenkersatz-Chirurg in Amman, bekannt für robotergestützte Hüft- und Kniechirurgie.',
    education: [
      'MBBS - Jordan University of Science and Technology (JUST) (2004)',
      'Orthopedic Surgery Residency - Royal Medical Services Jordan',
      'Fellowship - Adult Reconstruction & Trauma, Toronto General Hospital'
    ],
    certifications: [
      'Jordan Medical Council Orthopedic Surgery Board',
      'Fellow of the International College of Surgeons (FICS)',
      'AO Trauma European Faculty Member'
    ],
    feeJod: 100,
    feeEur: 130,
    feeUsd: 140,
    nextAvailable: 'Tomorrow, 14:00 EET / 13:00 CET',
    availableTypes: ['video', 'second_opinion'],
    timeZone: 'Asia/Amman',
    timeZoneOffsetLabel: 'EET (Amman) / CET (Berlin -1h)'
  },
  {
    id: 'doc-de-3',
    name: 'Dr. med. Stefan Lindner',
    title: 'Gastrointestinal & Hepato-Pancreato-Biliary Oncologist',
    titleDe: 'Facharzt für Gastrointestinale Onkologie',
    titleAr: 'استشاري أورام الجهاز الهضمي والكبد والكبد والمعدة',
    country: 'DE',
    city: 'Munich',
    hospital: 'LMU Hospital Munich (Großhadern Campus)',
    hospitalDe: 'Klinikum der Universität München (Großhadern)',
    hospitalAr: 'مستشفى جامعة لودفيغ ماكسيميليان ميونخ',
    specialty: 'Oncology',
    subSpecialties: ['Liver & Pancreatic Cancer Targeted Therapy', 'Immunotherapy Protocols', 'GI Cancer Molecular Profiling'],
    languages: ['German', 'English'],
    experienceYears: 18,
    rating: 4.93,
    reviewCount: 88,
    bio: 'Specialist in precision oncology and personalized molecular cancer therapy for gastrointestinal and hepato-pancreatic malignancies at Munich University Medical Center.',
    bioAr: 'متخصص في علاج أورام الكبد والبنطرياس والمعدة الموجه بالعلاجات الجينية والمناعية المتقدمة في ميونخ.',
    bioDe: 'Spezialist für Präzisionsonkologie und personalisierte molekulare Krebstherapie bei Magen-Darm- und Lebererkrankungen.',
    education: [
      'MD - LMU Munich Medical Faculty (2006)',
      'Oncology Fellowship - German Cancer Research Center (DKFZ) Heidelberg'
    ],
    certifications: [
      'German Board of Internal Medicine & Hematology/Oncology',
      'ESMO Certified Medical Oncologist'
    ],
    feeJod: 145,
    feeEur: 190,
    feeUsd: 205,
    nextAvailable: 'Thursday, 10:30 CET / 11:30 EET',
    availableTypes: ['video', 'second_opinion', 'record_review'],
    timeZone: 'Europe/Berlin',
    timeZoneOffsetLabel: 'CET (Berlin) / EET (Amman +1h)'
  },
  {
    id: 'doc-jo-3',
    name: 'Dr. Layla Al-Khatib',
    title: 'Consultant Dermatologist, Laser & Aesthetic Specialist',
    titleDe: 'Beraterin für Dermatologie & Lasertherapie',
    titleAr: 'مستشارة الأمراض الجلدية والعلاج بالليزر والتجميل الطبي',
    country: 'JO',
    city: 'Amman',
    hospital: 'Amman Specialty Hospital & Al-Khatib Dermatology Center',
    hospitalAr: 'المستشفى التخصصي ومركز الخطيب للجلدية',
    hospitalDe: 'Amman Specialty Hospital',
    specialty: 'Dermatology',
    subSpecialties: ['Biologic Psoriasis & Eczema Therapy', 'Skin Cancer Screening', 'Laser Reconstruction'],
    languages: ['Arabic', 'English', 'German'],
    experienceYears: 15,
    rating: 4.91,
    reviewCount: 165,
    bio: 'Trilingual dermatologist trained in Heidelberg and Amman. Expert in biologic therapies for severe skin conditions, autoimmune dermatoses, and cross-border aesthetic dermatology.',
    bioAr: 'استشارية جلدية متحدثة بالألمانية والعربية والإنجليزية مع تدريب في هايدلبرغ وعمان. خبيرة في العلاجات البيولوجية للصدفية وحب الشباب المستعصي وأورام الجلد.',
    bioDe: 'Dreisprachige Dermatologin, ausgebildet in Heidelberg und Amman. Expertin für biologische Therapien bei schweren Hauterkrankungen.',
    education: [
      'MBBS - University of Jordan (2008)',
      'Dermatology Residency - Heidelberg University Hospital Department of Dermatology',
      'Diploma in Aesthetic Medicine - London'
    ],
    certifications: [
      'Jordanian Board in Dermatology and Venereology',
      'German Board Recognition (Facharztprüfung Dermatologie)',
      'Member of the European Academy of Dermatology (EADV)'
    ],
    feeJod: 85,
    feeEur: 110,
    feeUsd: 120,
    nextAvailable: 'Today, 18:30 EET / 17:30 CET',
    availableTypes: ['video', 'record_review'],
    timeZone: 'Asia/Amman',
    timeZoneOffsetLabel: 'EET (Amman) / CET (Berlin -1h)'
  }
];

export const MOCK_RECORDS: MedicalRecord[] = [
  {
    id: 'rec-101',
    title: 'Brain MRI T1/T2 Contrast Scan',
    type: 'MRI/CT Scan',
    date: '2026-09-28',
    uploadedBy: 'Patient (Omar Al-Masmoudi)',
    fileSize: '14.2 MB',
    notes: 'Brain MRI with contrast evaluating persistent left temporal headaches and focal dizziness.',
    aiSummary: 'Bilingual AI Analysis: Imaging reveals non-specific white matter hyperintensities without mass effect or acute ischemic infarction. Clinical correlation with Neurologist recommended.'
  },
  {
    id: 'rec-102',
    title: 'Comprehensive Echocardiogram & ECG Report',
    type: 'Lab Result',
    date: '2026-10-02',
    uploadedBy: 'Amman Specialty Hospital Lab',
    fileSize: '3.8 MB',
    notes: '2D Transthoracic Echocardiogram showing EF 62%, mild mitral regurgitation, normal aortic root dimension.',
    aiSummary: 'Left ventricular systolic function is preserved. No hemodynamic significance found on aortic valve.'
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    doctorId: 'doc-de-2',
    doctorName: 'Prof. Dr. med. Sabine Weber',
    doctorSpecialty: 'Neurology',
    doctorCountry: 'DE',
    doctorHospital: 'Charité - Universitätsmedizin Berlin',
    patientName: 'Omar Al-Masmoudi',
    patientEmail: 'omar.masmoudi@example.com',
    patientPhone: '+962 7 9123 4567',
    consultationType: 'video',
    date: '2026-10-08',
    timeAmman: '18:00',
    timeBerlin: '17:00',
    status: 'upcoming',
    symptoms: 'Intermittent localized temporal headaches for 3 weeks, slight morning nausea, blurred vision when reading.',
    aiSummary: 'Primary complaint: Recurrent temporal headache with visual disturbance. Medical history uploaded (Brain MRI Sept 2026). Suggested focused neurological cranial nerve review.',
    medicalRecordIds: ['rec-101'],
    totalFee: 200,
    currency: 'EUR'
  },
  {
    id: 'app-2',
    doctorId: 'doc-jo-1',
    doctorName: 'Dr. Rania Al-Majali',
    doctorSpecialty: 'Cardiology',
    doctorCountry: 'JO',
    doctorHospital: 'King Hussein Medical Center',
    patientName: 'Omar Al-Masmoudi',
    patientEmail: 'omar.masmoudi@example.com',
    patientPhone: '+962 7 9123 4567',
    consultationType: 'second_opinion',
    date: '2026-09-20',
    timeAmman: '11:00',
    timeBerlin: '10:00',
    status: 'completed',
    symptoms: 'Chest tightness following strenuous walking, palpitation episodes.',
    aiSummary: 'Evaluated Echo & Holter monitor. Reassured patient regarding mild mitral valve prolapse; advised routine follow-up in 12 months.',
    medicalRecordIds: ['rec-102'],
    prescription: {
      date: '2026-09-20',
      medicines: [
        { name: 'Bisoprolol Fumarate', dosage: '2.5 mg', frequency: 'Once daily (Morning)', duration: '30 days' },
        { name: 'Magnesium Citrate', dosage: '150 mg', frequency: 'Once daily at night', duration: '60 days' }
      ],
      notes: 'Maintain low-sodium Mediterranean diet, light cardio exercise, repeat ECG in 6 months.',
      doctorSignature: 'Dr. Rania Al-Majali, Consultant Pediatric & Adult Cardiology (JMC #4812)'
    },
    totalFee: 90,
    currency: 'JOD'
  }
];
