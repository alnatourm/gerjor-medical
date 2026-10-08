import React from 'react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../translations/translations';
import { Stethoscope, ShieldCheck, Heart, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

interface FooterProps {
  currentLang: LanguageCode;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onNavigate }) => {
  const t = TRANSLATIONS[currentLang];
  const isRtl = currentLang === 'ar';

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Footer Medical Emergency Banner */}
      <div className="bg-slate-900 border-b border-slate-800 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 text-rose-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span>{t.emergencyNotice}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-300 font-mono">
            <span>🇯🇴 Jordan: <strong>911</strong></span>
            <span>🇩🇪 Germany: <strong>112</strong></span>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="font-bold text-base tracking-tight">MedLink International</span>
          </div>

          <p className="text-slate-400 leading-relaxed text-xs">
            Connecting patients with premier medical specialists across Amman, Berlin, Heidelberg, and Munich. Real-time trilingual AI translation and dual timezone tele-clinic.
          </p>

          <div className="flex items-center gap-2 pt-2 text-[11px] text-teal-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>GDPR & Jordanian Health Privacy Compliant</span>
          </div>
        </div>

        {/* Column 2: Amman Hub */}
        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Amman Medical Hub 🇯🇴</h4>
          <p className="text-slate-400 text-xs">King Hussein Medical Center & Abdali Hospital Annex</p>
          <p className="text-slate-500 text-[11px]">Zahran Street, Abdali Medical District, Amman, Jordan</p>
          <p className="text-teal-400 font-mono text-[11px] pt-1">Tel: +962 6 500 9000</p>
        </div>

        {/* Column 3: Germany Hub */}
        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">German Medical Hub 🇩🇪</h4>
          <p className="text-slate-400 text-xs">Charité Berlin & Heidelberg University Campus</p>
          <p className="text-slate-500 text-[11px]">Charitéplatz 1, 10117 Berlin / Im Neuenheimer Feld, Heidelberg</p>
          <p className="text-sky-400 font-mono text-[11px] pt-1">Tel: +49 30 2000 8000</p>
        </div>

        {/* Column 4: Quick Portal Navigation */}
        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Portal Services</h4>
          <ul className="space-y-1.5 text-slate-300">
            <li>
              <button onClick={() => onNavigate('doctors')} className="hover:text-teal-400 transition-colors">
                Specialists Directory
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('virtual-clinic')} className="hover:text-teal-400 transition-colors">
                Live Video Telehealth
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('travel-guide')} className="hover:text-teal-400 transition-colors">
                Medical Visa & Transfer Assistance
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('dashboard')} className="hover:text-teal-400 transition-colors">
                Patient Medical Vault & Prescriptions
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-4 px-4 sm:px-6 text-center text-slate-500 text-[11px]">
        <p>{t.footerCopy}</p>
      </div>
    </footer>
  );
};
