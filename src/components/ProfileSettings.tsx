import React, { useState } from 'react';
import { PatientProfile, LanguageCode } from '../types';
import { TRANSLATIONS } from '../translations/translations';
import { User, Shield, HeartPulse, Globe, Check, AlertCircle, Plus, Trash2, Save, FileText, Upload, Sparkles } from 'lucide-react';

interface ProfileSettingsProps {
  profile: PatientProfile;
  onSaveProfile: (updatedProfile: PatientProfile) => void;
  currentLang: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile,
  onSaveProfile,
  currentLang,
  onLanguageChange
}) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  const [formData, setFormData] = useState<PatientProfile>({ ...profile });
  const [activeSection, setActiveSideSection] = useState<'medical' | 'insurance' | 'language' | 'personal'>('medical');
  const [showSaveSuccess, setShowSaveSuccess] = useState<boolean>(false);

  // New item input states
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setFormData(prev => ({ ...prev, chronicConditions: [...prev.chronicConditions, newCondition.trim()] }));
      setNewCondition('');
    }
  };

  const handleRemoveCondition = (index: number) => {
    setFormData(prev => ({ ...prev, chronicConditions: prev.chronicConditions.filter((_, i) => i !== index) }));
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setFormData(prev => ({ ...prev, allergies: [...prev.allergies, newAllergy.trim()] }));
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (index: number) => {
    setFormData(prev => ({ ...prev, allergies: prev.allergies.filter((_, i) => i !== index) }));
  };

  const handleAddMedication = () => {
    if (newMedication.trim()) {
      setFormData(prev => ({ ...prev, currentMedications: [...prev.currentMedications, newMedication.trim()] }));
      setNewMedication('');
    }
  };

  const handleRemoveMedication = (index: number) => {
    setFormData(prev => ({ ...prev, currentMedications: prev.currentMedications.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    if (onLanguageChange && formData.preferredLanguage !== currentLang) {
      onLanguageChange(formData.preferredLanguage);
    }
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Toast Notification */}
      {showSaveSuccess && (
        <div className="bg-emerald-900 text-white p-4 rounded-xl border border-emerald-700 shadow-lg flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Check className="w-5 h-5 text-emerald-400" />
            <span>Profile and Medical Settings Saved Successfully! Changes updated across Jordan & Germany portal systems.</span>
          </div>
          <button onClick={() => setShowSaveSuccess(false)} className="text-emerald-300 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-teal-500/20 text-teal-300 text-xs font-bold px-2.5 py-0.5 rounded border border-teal-500/30">
              Patient Medical Record Settings
            </span>
            <span className="text-xs text-slate-400">ID: JO-DE-89214</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Profile & Medical Configuration</h2>
          <p className="text-xs text-slate-300 mt-1">
            Keep your clinical history, international insurance policy, and preferred contact language up to date for doctors in Jordan and Germany.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Settings</span>
        </button>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Left Navigation Tabs */}
        <div className="md:col-span-3 space-y-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm space-y-1">
            <button
              onClick={() => setActiveSideSection('medical')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 ${
                activeSection === 'medical' ? 'bg-slate-900 text-teal-400' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <HeartPulse className="w-4 h-4 text-teal-500" />
              <span>Medical History</span>
            </button>

            <button
              onClick={() => setActiveSideSection('insurance')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 ${
                activeSection === 'insurance' ? 'bg-slate-900 text-teal-400' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4 text-teal-500" />
              <span>Insurance Provider</span>
            </button>

            <button
              onClick={() => setActiveSideSection('language')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 ${
                activeSection === 'language' ? 'bg-slate-900 text-teal-400' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Globe className="w-4 h-4 text-teal-500" />
              <span>Contact Language</span>
            </button>

            <button
              onClick={() => setActiveSideSection('personal')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2.5 ${
                activeSection === 'personal' ? 'bg-slate-900 text-teal-400' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-teal-500" />
              <span>Personal & Emergency</span>
            </button>
          </div>

          <div className="bg-teal-50 border border-teal-200/80 rounded-2xl p-4 text-xs text-teal-950 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-teal-900">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Cross-Border Synchronization</span>
            </div>
            <p className="text-[11px] leading-relaxed text-teal-900/80">
              Medical records updated here are automatically formatted into bilingual summaries for Jordanian and German specialists prior to your video appointments.
            </p>
          </div>
        </div>

        {/* Right Form Settings Content */}
        <div className="md:col-span-9 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* SECTION 1: Medical History */}
            {activeSection === 'medical' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-teal-600" />
                    <span>Medical History & Clinical Conditions</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Provide accurate background data so consulting doctors in Amman or Berlin can prescribe safe, coordinated treatments.
                  </p>
                </div>

                {/* Chronic Conditions List */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Chronic Diagnoses & Pre-Existing Conditions
                  </label>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.chronicConditions.map((cond, index) => (
                      <span key={index} className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium px-3 py-1 rounded-lg">
                        <span>{cond}</span>
                        <button type="button" onClick={() => handleRemoveCondition(index)} className="text-slate-400 hover:text-rose-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      placeholder="e.g. Hypertension, Type 2 Diabetes, Migraine..."
                      className="flex-1 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCondition}
                      className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Allergies List */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Known Allergies (Medications, Foods, Environmental)
                  </label>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.allergies.map((alg, index) => (
                      <span key={index} className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium px-3 py-1 rounded-lg">
                        <span>⚠️ {alg}</span>
                        <button type="button" onClick={() => handleRemoveAllergy(index)} className="text-rose-400 hover:text-rose-700">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      placeholder="e.g. Penicillin, Sulfa drugs, Latex, Iodine..."
                      className="flex-1 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddAllergy}
                      className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Allergy</span>
                    </button>
                  </div>
                </div>

                {/* Current Medications List */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Current Regular Medications & Dosages
                  </label>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.currentMedications.map((med, index) => (
                      <span key={index} className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-900 text-xs font-medium px-3 py-1 rounded-lg">
                        <span>💊 {med}</span>
                        <button type="button" onClick={() => handleRemoveMedication(index)} className="text-teal-500 hover:text-rose-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      placeholder="e.g. Bisoprolol 5mg once daily, Metformin 500mg..."
                      className="flex-1 bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddMedication}
                      className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Medication</span>
                    </button>
                  </div>
                </div>

                {/* Past Surgeries & Blood Type */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Blood Type</label>
                    <select
                      value={formData.bloodType}
                      onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="O+">O Positive (O+)</option>
                      <option value="A+">A Positive (A+)</option>
                      <option value="B+">B Positive (B+)</option>
                      <option value="AB+">AB Positive (AB+)</option>
                      <option value="O-">O Negative (O-)</option>
                      <option value="A-">A Negative (A-)</option>
                      <option value="B-">B Negative (B-)</option>
                      <option value="AB-">AB Negative (AB-)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Past Surgical Operations</label>
                    <input
                      type="text"
                      value={formData.pastSurgeries}
                      onChange={(e) => setFormData({ ...formData, pastSurgeries: e.target.value })}
                      placeholder="e.g. Appendectomy (2018), Knee Arthroscopy (2022)"
                      className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Family Medical History Notes</label>
                  <textarea
                    value={formData.familyHistory}
                    onChange={(e) => setFormData({ ...formData, familyHistory: e.target.value })}
                    rows={2}
                    placeholder="e.g. Maternal history of cardiac arrhythmias; paternal history of diabetes..."
                    className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}

            {/* SECTION 2: Insurance Provider */}
            {activeSection === 'insurance' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-teal-600" />
                    <span>Insurance Provider & Coverage Policy</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your Jordanian, German, or International insurance policy details for claim reimbursement or direct hospital billing.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Insurance Provider / Company Name</label>
                    <input
                      type="text"
                      value={formData.insuranceProviderName}
                      onChange={(e) => setFormData({ ...formData, insuranceProviderName: e.target.value })}
                      placeholder="e.g. Techniker Krankenkasse (TK), Allianz, Bupa Arabia, Jordan Insurance Co."
                      className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Policy / Member Insurance ID Number</label>
                    <input
                      type="text"
                      value={formData.insurancePolicyNumber}
                      onChange={(e) => setFormData({ ...formData, insurancePolicyNumber: e.target.value })}
                      placeholder="e.g. A-981240129 / JO-88129"
                      className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Coverage Scope</label>
                    <select
                      value={formData.coverageRegion}
                      onChange={(e) => setFormData({ ...formData, coverageRegion: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="International / Cross-Border">🌍 International / Cross-Border (Jordan & Germany)</option>
                      <option value="Germany Only">🇩🇪 Germany Only (GKV / PKV)</option>
                      <option value="Jordan Only">🇯🇴 Jordan Only (Ministry / Private)</option>
                      <option value="Self-Pay / Private">💵 Self-Pay / Direct Private Payment</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Policy Expiry Date</label>
                    <input
                      type="date"
                      value={formData.insuranceExpiry}
                      onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Insurance Card Upload Banner */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center bg-slate-50 space-y-2">
                  <Upload className="w-6 h-6 text-teal-600 mx-auto" />
                  <span className="text-xs font-bold text-slate-800 block">Upload Insurance Card Photo or PDF (Front & Back)</span>
                  <span className="text-[11px] text-slate-500 block">Current Status: {formData.insuranceCardUploaded ? '✅ Insurance Card Verified on File' : '⚠️ Card Not Uploaded Yet'}</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, insuranceCardUploaded: true })}
                    className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[11px] rounded-lg transition-colors"
                  >
                    {formData.insuranceCardUploaded ? 'Replace Uploaded Card' : 'Upload Card Copy'}
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 3: Preferred Contact Language & Communication */}
            {activeSection === 'language' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-teal-600" />
                    <span>Preferred Language & Communication Preferences</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Select your primary consultation and document language. AI subtitles and bilingual prescriptions will default to this language.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-2">Preferred Consultation & Portal Language</label>
                  
                  <div className="grid sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredLanguage: 'en' })}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.preferredLanguage === 'en'
                          ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-bold text-slate-900 text-sm block">🇬🇧 English</span>
                      <span className="text-[11px] text-slate-500 block">Standard International Clinical Language</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredLanguage: 'ar' })}
                      className={`p-4 rounded-xl border text-right transition-all ${
                        formData.preferredLanguage === 'ar'
                          ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-bold text-slate-900 text-sm block">🇯🇴 العربية (Arabic)</span>
                      <span className="text-[11px] text-slate-500 block">اللغة العربية مع الواجهة اليمنى</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredLanguage: 'de' })}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.preferredLanguage === 'de'
                          ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-bold text-slate-900 text-sm block">🇩🇪 Deutsch (German)</span>
                      <span className="text-[11px] text-slate-500 block">Deutsche medizinische Fachsprache</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-2">Preferred Appointment Reminders Method</label>
                  
                  <div className="grid sm:grid-cols-3 gap-3">
                    {['WhatsApp', 'Email', 'Phone Call'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setFormData({ ...formData, preferredContactMethod: method as any })}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                          formData.preferredContactMethod === method
                            ? 'bg-slate-900 text-teal-400 border-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {method === 'WhatsApp' ? '💬 WhatsApp Instant SMS' : method === 'Email' ? '📧 Email Notifications' : '📞 Direct Phone Call'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: Personal Info & Emergency Contact */}
            {activeSection === 'personal' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-teal-600" />
                    <span>Personal Info & Emergency Contact</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Official passport details required for cross-border medical referral letters and Schengen visa facilitation.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Full Name (Matching Passport)</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Passport / National ID Number</label>
                    <input
                      type="text"
                      value={formData.passportId}
                      onChange={(e) => setFormData({ ...formData, passportId: e.target.value })}
                      placeholder="e.g. P-8912401"
                      className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Country of Primary Residence</label>
                    <select
                      value={formData.countryOfResidence}
                      onChange={(e) => setFormData({ ...formData, countryOfResidence: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5 font-medium focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="JO">🇯🇴 Jordan</option>
                      <option value="DE">🇩🇪 Germany</option>
                      <option value="Other">🌍 Other International</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Emergency Next of Kin Contact</h4>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Contact Name</label>
                      <input
                        type="text"
                        value={formData.emergencyContactName}
                        onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Relationship</label>
                      <input
                        type="text"
                        value={formData.emergencyContactRelation}
                        onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Emergency Phone Number</label>
                      <input
                        type="text"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-900 rounded-xl p-2.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Save Bar */}
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save All Profile & Medical Settings</span>
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
