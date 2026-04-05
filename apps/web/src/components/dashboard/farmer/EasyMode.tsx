"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, Globe, Zap, Volume2, Sparkles, CheckCircle2, 
  AlertCircle, ChevronRight, ArrowRight, MessageSquare, 
  Package, Gavel, Truck, CreditCard, Activity, Cpu,
  Target, Handshake, Landmark
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";

export function EasyMode() {
  const [language, setLanguage] = useState("English");
  const [isListening, setIsListening] = useState(false);

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'Hindi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast("Listening...", { icon: "🎙️" });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      toast.success(`Command: "${transcript}"`);
      if (transcript.toLowerCase().includes('payment') || transcript.includes('पैसे')) {
         toast("Opening My Money Node...", { icon: "💰" });
      }
    };

    recognition.onerror = () => {
      toast.error("Signal Lost. Try again.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const menuItems = [
    { label: "My Crops", labelHi: "मेरी फसलें", sub: "View Stock", subHi: "स्टॉक देखें", icon: <Package />, color: "bg-brand-primary", shadow: "shadow-glow-primary" },
    { label: "Sell Hub", labelHi: "अभी बेचें", sub: "Market Access", subHi: "मंडी पहुँच", icon: <Gavel />, color: "bg-brand-secondary", shadow: "shadow-glow-secondary" },
    { label: "Logistics", labelHi: "परिवहन", sub: "Book Transport", subHi: "गाड़ी बुक करें", icon: <Truck />, color: "bg-amber-500", shadow: "shadow-amber-500/20" },
    { label: "Capital", labelHi: "मेरे पैसे", sub: "Ledger status", subHi: "हिसाब देखें", icon: <CreditCard />, color: "bg-neut-900", shadow: "shadow-neut-900/10" },
  ];

  return (
    <div className="space-y-16 animate-fade-in text-neut-900 pb-20">
      <motion.div 
         initial={{ opacity: 0, y: 40 }}
         animate={{ opacity: 1, y: 0 }}
         className="w-full max-w-[1700px] mx-auto px-6 space-y-20"
      >
         {/* 🎨 Inclusive Identity Header */}
         <div className="text-center space-y-6 pt-10">
            <Badge tone="brand" className="h-10 px-8 rounded-2xl text-xs font-black bg-brand-primary text-white shadow-glow-primary uppercase tracking-[0.2em] mb-6 border-none">
                <Sparkles size={16} className="animate-pulse" />
                Inclusive Mode Active
            </Badge>
            <h2 className="text-6xl md:text-8xl font-black text-neut-900 tracking-tighter leading-none">
              {language === 'Hindi' ? 'नमस्ते किसान साथी' : 'Hello Farmer!'}
            </h2>
            <p className="text-3xl font-bold text-neut-400 uppercase tracking-widest max-w-4xl mx-auto leading-relaxed">
                {language === 'Hindi' ? 'आज आप क्या काम करना चाहते हैं?' : 'How can we help you grow today?'}
            </p>
         </div>

         {/* 🎙️ Quantum Voice Hub */}
         <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[5rem] shadow-2xl border-4 border-neut-50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand-primary/5 opacity-40 animate-pulse pointer-events-none" />
            <div className="absolute -top-24 -right-24 opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform"><Mic size={400} /></div>
            
            <motion.button 
               onMouseDown={startVoiceInput}
               animate={{ 
                  scale: isListening ? [1, 1.1, 1] : 1,
               }}
               transition={{ repeat: isListening ? Infinity : 0, duration: 1.5 }}
               className={`h-64 w-64 rounded-[4.5rem] shadow-2xl flex items-center justify-center transition-all z-10 border-8 border-white ${
                   isListening ? "bg-error text-white shadow-glow-error" : "bg-brand-primary text-white group hover:scale-105 active:scale-95 shadow-glow-primary"
               }`}
            >
               <Mic size={100} className={isListening ? "animate-bounce" : ""} />
            </motion.button>
            <p className="mt-12 font-black text-6xl text-neut-900 tracking-tighter z-10 transition-all">
               {isListening ? "Listening..." : language === 'Hindi' ? "बोलने के लिए दबाएं" : "Hold to Speak"}
            </p>
            <p className="text-neut-300 font-black mt-6 z-10 uppercase tracking-[0.4em] text-xs">ODOP Voice AI Layer 1.0</p>
         </div>

         {/* ⚡ Strategic Accessibility Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {menuItems.map((item, i) => (
               <motion.div
                 key={item.label}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.1 }}
               >
                  <Card className={`border-none shadow-startup-soft hover:shadow-2xl transition-all group cursor-pointer p-14 overflow-hidden relative active:scale-95 bg-white rounded-[4.5rem] h-80 flex flex-col justify-center border-b-[12px] border-transparent hover:border-brand-primary`}>
                     <CardContent className="flex items-center gap-14 p-0">
                        <div className={`h-32 w-32 ${item.color} ${item.shadow} rounded-[2.5rem] flex items-center justify-center text-white group-hover:rotate-6 transition-transform shadow-lg`}>
                           {React.cloneElement(item.icon as any, { size: 64 })}
                        </div>
                         <div className="flex-1 space-y-2 text-left">
                            <h4 className="text-5xl font-black text-neut-900 tracking-tighter">{language === 'Hindi' ? item.labelHi : item.label}</h4>
                            <p className="text-xl font-bold text-neut-400 uppercase tracking-widest leading-none">{language === 'Hindi' ? item.subHi : item.sub}</p>
                         </div>
                        <ChevronRight size={60} className="text-neut-100 group-hover:text-brand-primary group-hover:translate-x-2 transition-all" />
                     </CardContent>
                  </Card>
               </motion.div>
            ))}
         </div>

         {/* 🌏 Universal Accessibility Bar */}
         <div className="flex flex-col lg:flex-row items-center justify-between gap-10 p-14 bg-neut-900 text-white rounded-[5rem] shadow-2xl border border-white/10 relative overflow-hidden">
             <div className="absolute top-0 left-0 p-12 opacity-[0.05] pointer-events-none"><Landmark size={200} /></div>
             
             <div className="flex items-center gap-8 relative z-10">
                <div className="h-20 w-20 bg-white/10 rounded-[2rem] flex items-center justify-center text-brand-primary backdrop-blur-xl border border-white/5 shadow-xl"><Globe size={40} /></div>
                <div>
                  <h4 className="text-3xl font-black tracking-tighter leading-none mb-1">Language Node</h4>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Localized Intelligence Preference</p>
                </div>
             </div>
             
             <div className="flex items-center gap-6 p-4 bg-white/5 rounded-[3rem] backdrop-blur-2xl border border-white/10 relative z-10">
                <Button 
                   variant={language === 'English' ? 'secondary' : 'ghost'} 
                   className={`h-20 px-16 rounded-[2rem] font-black text-3xl transition-all ${language === 'English' ? 'bg-white text-neut-900 shadow-2xl scale-105' : 'text-white/40 hover:text-white'}`}
                   onClick={() => { setLanguage('English'); toast.success("Language: English"); }}
                >
                   English
                </Button>
                <Button 
                   variant={language === 'Hindi' ? 'secondary' : 'ghost'} 
                   className={`h-20 px-16 rounded-[2rem] font-black text-3xl transition-all ${language === 'Hindi' ? 'bg-white text-neut-900 shadow-2xl scale-105' : 'text-white/40 hover:text-white'}`}
                   onClick={() => { setLanguage('Hindi'); toast.success("भाषा: हिन्दी"); }}
                >
                   हिन्दी
                </Button>
             </div>

             <div className="flex items-center gap-8 px-12 border-l border-white/10 h-24 relative z-10">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Audio Bridge</p>
                    <p className="font-black text-success animate-pulse tracking-tight text-xl">CONNECTED</p>
                 </div>
                 <div className="h-12 w-20 bg-success/10 rounded-full flex items-center px-2">
                     <span className="h-8 w-8 bg-success rounded-full shadow-glow-success" />
                 </div>
             </div>
         </div>
      </motion.div>
    </div>
  );
}
