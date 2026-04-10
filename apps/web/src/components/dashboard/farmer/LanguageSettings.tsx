import React from 'react';
import { motion } from 'framer-motion';
import { Languages, CheckCircle, Globe, MessageSquare, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LanguageSettings() {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', native: 'English', desc: 'Standard business language', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी', desc: 'उत्तर और मध्य भारत के लिए', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', desc: 'महाराष्ट्रातील शेतकऱ्यांसाठी', flag: '🚩' },
  ];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-2">
         <div className="w-20 h-20 rounded-3xl bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-4 border border-green-200">
            <Languages size={40} />
         </div>
         <h2 className="text-4xl font-black text-slate-900">Preferred Language</h2>
         <p className="text-lg text-slate-500 font-medium">Choose the language that feels most comfortable for your business.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {languages.map((lang) => (
           <motion.div
             key={lang.code}
             whileHover={{ y: -8, scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={() => changeLanguage(lang.code)}
             className={`cursor-pointer rounded-[2.5rem] p-8 border-4 transition-all relative overflow-hidden ${
               i18n.language === lang.code 
               ? 'bg-slate-900 border-green-500 shadow-2xl shadow-green-200/50 text-white' 
               : 'bg-white border-slate-100 hover:border-slate-200 shadow-lg text-slate-900'
             }`}
           >
              <div className="text-4xl mb-4">{lang.flag}</div>
              <h3 className="text-2xl font-black mb-1">{lang.native}</h3>
              <p className={`text-sm font-bold ${i18n.language === lang.code ? 'text-slate-400' : 'text-slate-500'}`}>{lang.name}</p>
              <p className={`mt-4 text-xs font-medium leading-relaxed ${i18n.language === lang.code ? 'text-slate-500' : 'text-slate-400'}`}>
                {lang.desc}
              </p>

              {i18n.language === lang.code && (
                <div className="absolute top-6 right-6">
                   <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                      <CheckCircle size={18} className="text-white" />
                   </div>
                </div>
              )}
           </motion.div>
         ))}
      </div>

      <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex items-center gap-6">
         <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-blue-500 shadow-sm shrink-0">
            <MessageSquare size={32} />
         </div>
         <div>
            <h4 className="text-xl font-black text-slate-900">Multi-language Support</h4>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Our AI Intelligence assistants and voice-commands also follow your preferred language setting. Switch anytime to refresh all interfaces.
            </p>
         </div>
      </div>

      <div className="flex items-center justify-center gap-4 text-slate-400">
         <Globe size={18} />
         <p className="text-xs font-bold uppercase tracking-[0.2em]">{t('language_system_ready') || 'Language System Ready'}</p>
      </div>
    </div>
  );
}
