"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n";
import toast from "react-hot-toast";

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const { i18n, t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleLangChange = (lng: string) => setCurrentLang(lng);
    i18n.on("languageChanged", handleLangChange);
    return () => { i18n.off("languageChanged", handleLangChange); };
  }, [i18n]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const current = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    setCurrentLang(code);
    setOpen(false);
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
    toast.success(`${lang?.flag} ${lang?.nativeLabel}`, { duration: 2000 });
    
    // Force a full re-render by dispatching a custom event
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: code }));
  };

  return (
    <div className="relative" ref={containerRef} style={{ zIndex: 9999 }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }}
        className="flex items-center gap-2 h-9 px-3 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
        type="button"
      >
        <Globe size={14} className="text-slate-400" />
        <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">
          {current.flag} {current.code.toUpperCase()}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-11 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden py-1"
            style={{ zIndex: 99999 }}
          >
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 py-2 border-b border-slate-50">
              {t('language_switcher.select')}
            </p>
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                type="button"
                onClick={(e) => { e.stopPropagation(); handleChange(lang.code); }}
                className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                  currentLang === lang.code ? 'bg-emerald-50' : ''
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <p className="text-sm font-black text-slate-900">{lang.nativeLabel}</p>
                  <p className="text-[10px] text-slate-400">{lang.label}</p>
                </div>
                {currentLang === lang.code && (
                  <Check size={14} className="text-emerald-500" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
