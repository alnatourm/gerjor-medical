import React, { useState } from 'react';
import { UserAccount, LanguageCode, Doctor, Specialty, ConsultationType } from '../types';
import { TRANSLATIONS } from '../translations/translations';
import { 
  User, Mail, Lock, Phone, Globe, ShieldCheck, Check, Sparkles, 
  X, Stethoscope, LogIn, UserPlus
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: LanguageCode;
  onLoginSuccess: (user: UserAccount, newDoctor?: Doctor) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onLoginSuccess
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Standard Account Sign Up & Sign In Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState<'JO' | 'DE' | 'Other'>('JO');
  const [preferredLang, setPreferredLang] = useState<LanguageCode>(currentLang);
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');

  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (role === 'doctor' && authMode === 'register') {
        // Create clean empty Doctor profile object for the newly registered physician
        // All fields start completely empty so the physician can enter their real data.
        const createdDoctor: Doctor = {
          id: `usr-doc-${Date.now()}`,
          name: fullName.trim() || 'Dr. Physician Consultant',
          title: '',
          titleDe: '',
          titleAr: '',
          country: country === 'DE' ? 'DE' : 'JO',
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
          timeZone: (country === 'DE' ? 'Europe/Berlin' : 'Asia/Amman') as 'Europe/Berlin' | 'Asia/Amman',
          timeZoneOffsetLabel: country === 'DE' ? 'CET (Berlin) / EET (Amman +1h)' : 'EET (Amman) / CET (Berlin -1h)'
        };

        const authenticatedUser: UserAccount = {
          id: createdDoctor.id,
          fullName: createdDoctor.name,
          email,
          phone,
          role: 'doctor',
          country: country === 'DE' ? 'DE' : 'JO',
          preferredLanguage: preferredLang,
          isAuthenticated: true
        };

        onLoginSuccess(authenticatedUser, createdDoctor);
        onClose();
        return;
      }

      // Standard Login / Patient Registration Flow
      const authenticatedUser: UserAccount = {
        id: `user-${Date.now()}`,
        fullName: authMode === 'login' ? (role === 'doctor' ? 'Prof. Dr. med. Sabine Weber' : (fullName || 'Patient User')) : fullName,
        email,
        phone,
        role,
        country,
        preferredLanguage: preferredLang,
        isAuthenticated: true,
        patientProfile: role === 'patient' ? {
          fullName: fullName,
          email,
          phone,
          dob: '',
          gender: '',
          passportId: '',
          countryOfResidence: country,
          chronicConditions: [],
          allergies: [],
          pastSurgeries: '',
          currentMedications: [],
          bloodType: '',
          familyHistory: '',
          insuranceProviderName: '',
          insurancePolicyNumber: '',
          coverageRegion: 'International / Cross-Border',
          insuranceExpiry: '',
          insuranceCardUploaded: false,
          preferredLanguage: preferredLang,
          preferredContactMethod: 'Email',
          emergencyContactName: '',
          emergencyContactRelation: '',
          emergencyContactPhone: ''
        } : undefined
      };

      onLoginSuccess(authenticatedUser);
      onClose();
    }, 500);
  };

  const handleDemoSignIn = (presetUser: 'patient' | 'de_doc' | 'jo_doc') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      let demoUser: UserAccount;

      if (presetUser === 'patient') {
        demoUser = {
          id: 'usr-patient-1',
          fullName: 'Omar Al-Masmoudi',
          email: 'omar.masmoudi@example.com',
          phone: '+962 7 9123 4567',
          role: 'patient',
          country: 'JO',
          preferredLanguage: currentLang,
          isAuthenticated: true
        };
      } else if (presetUser === 'de_doc') {
        demoUser = {
          id: 'doc-de-2',
          fullName: 'Prof. Dr. med. Sabine Weber',
          email: 'sabine.weber@charite.de',
          phone: '+49 30 45050',
          role: 'doctor',
          country: 'DE',
          preferredLanguage: 'de',
          isAuthenticated: true
        };
      } else {
        demoUser = {
          id: 'usr-doc-jo-1',
          fullName: 'Dr. Layla Al-Khatib',
          email: 'layla.khatib@abdali.jo',
          phone: '+962 6 510 0000',
          role: 'doctor',
          country: 'JO',
          preferredLanguage: 'ar',
          isAuthenticated: true
        };
      }

      onLoginSuccess(demoUser);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative text-white animate-fade-in my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-teal-900/30">
            <Stethoscope className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-white font-sans">
            {authMode === 'login' ? t.loginRegisterTitle : t.registerBtn}
          </h2>

          <p className="text-xs text-slate-300">
            {authMode === 'login'
              ? t.subTitle
              : 'Sign up to access direct cross-border consultations & professional doctor portal.'}
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setAuthMode('login')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'login'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t.signInBtn}</span>
          </button>

          <button
            onClick={() => setAuthMode('register')}
            className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'register'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.registerBtn}</span>
          </button>
        </div>

        {/* Demo Quick Sign-In Presets */}
        {authMode === 'login' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2 text-xs">
            <span className="text-[11px] font-bold text-teal-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> {t.demoAccountsNotice}
            </span>

            <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => handleDemoSignIn('patient')}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-teal-500 rounded-xl text-center text-slate-200 transition-colors"
              >
                <span className="block text-white font-bold">{t.demoPatient}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSignIn('de_doc')}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500 rounded-xl text-center text-slate-200 transition-colors"
              >
                <span className="block text-white font-bold">{t.demoDocDe}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSignIn('jo_doc')}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500 rounded-xl text-center text-slate-200 transition-colors"
              >
                <span className="block text-white font-bold">{t.demoDocJo}</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Auth Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
          
          {/* Account Role Selector (Patient vs Physician) */}
          <div>
            <label className="font-semibold text-slate-200 block mb-1">{t.selectRoleLabel}</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setRole('patient');
                  if (authMode === 'login' && email.includes('charite')) {
                    setEmail('omar.masmoudi@example.com');
                  }
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  role === 'patient'
                    ? 'bg-teal-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.rolePatient}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('doctor');
                  if (authMode === 'login') {
                    setEmail('sabine.weber@charite.de');
                  }
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  role === 'doctor'
                    ? 'bg-sky-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>{t.rolePhysician}</span>
              </button>
            </div>
          </div>

          {/* Registration Form Fields - Standard Name, Email, Password, Phone, Country */}
          {authMode === 'register' && (
            <div>
              <label className="font-semibold text-slate-200 block mb-1">
                {role === 'doctor' ? 'Physician Full Name *' : t.patientName}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={role === 'doctor' ? "e.g. Dr. med. Sami Al-Mansoor" : "e.g. Omar Al-Masmoudi"}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 pl-9 text-xs text-white focus:outline-none focus:border-teal-500 font-bold"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-200 block mb-1">{t.emailLabel}</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 pl-9 text-xs text-white focus:outline-none focus:border-teal-500"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-200 block mb-1">Password *</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 pl-9 text-xs text-white focus:outline-none focus:border-teal-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          {authMode === 'register' && (
            <div>
              <label className="font-semibold text-slate-200 block mb-1">{t.patientPhone}</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+962 7 9123 4567 or +49 170 1234567"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 pl-9 text-xs text-white focus:outline-none focus:border-teal-500"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {authMode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-200 block mb-1">{t.residenceCountryLabel}</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="JO">{t.jordanFlag}</option>
                  <option value="DE">{t.germanyFlag}</option>
                  <option value="Other">🌐 Other Country</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-200 block mb-1">{t.prefPortalLangLabel}</label>
                <select
                  value={preferredLang}
                  onChange={(e) => setPreferredLang(e.target.value as LanguageCode)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="en">English (EN)</option>
                  <option value="ar">العربية (AR)</option>
                  <option value="de">Deutsch (DE)</option>
                </select>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4 hover:scale-[1.02] disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>{authMode === 'login' ? t.signInBtn : t.createAccountBtn}</span>
              </>
            )}
          </button>

          {/* Footer Note */}
          <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1 pt-2">
            <Globe className="w-3 h-3 text-teal-400" />
            <span>Jordanian & German Medical Council Compliant Gateway</span>
          </p>

        </form>
      </div>
    </div>
  );
};
