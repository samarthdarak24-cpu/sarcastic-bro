"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  Globe, 
  Zap, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  ArrowRight,
  MessageSquare,
  Package,
  Gavel,
  Truck,
  CreditCard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      // Simulating action based on command
      if (transcript.toLowerCase().includes('payment') || transcript.includes('पैसे')) {
         toast("Opening My Money...", { icon: "💰" });
      }
    };

    recognition.onerror = () => {
      toast.error("Speech recognition error.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const menuItems = [
    { label: "My Crops", labelHi: "मेरी फसलें", sub: "View inventory", subHi: "स्टॉक देखें", icon: <Package />, color: "bg-brand-primary" },
    { label: "Sell Now", labelHi: "अभी बेचें", sub: "Market listings", subHi: "मंडी में बेचें", icon: <Gavel />, color: "bg-success" },
    { label: "Transport", labelHi: "परिवहन", sub: "Book a truck", subHi: "गाड़ी बुक करें", icon: <Truck />, color: "bg-amber-500" },
    { label: "My Money", labelHi: "मेरे पैसे", sub: "Balance & history", subHi: "बैलेंस और हिसाब", icon: <CreditCard />, color: "bg-error" },
  ];

  return (
    <div className="space-y-10 animate-fade-in text-neut-900 border-neut-200 min-h-[700px] flex flex-col items-center py-6 px-6">
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="w-full max-w-5xl space-y-14"
        >
           {/* High-Contrast Header */}
           <div className="text-center space-y-4">
              <Badge tone="brand" className="h-10 px-6 rounded-2xl text-lg font-black bg-brand-primary text-white shadow-lg animate-pulse mb-4">EASY MODE ACTIVE</Badge>
              <h2 className="text-5xl md:text-7xl font-black text-neut-900 tracking-tighter">
                {language === 'Hindi' ? 'नमस्ते किसान भाई' : 'Hello Farmer!'}
              </h2>
              <p className="text-2xl font-bold text-neut-500">{language === 'Hindi' ? 'आज आप क्या करना चाहते हैं?' : 'What would you like to do today?'}</p>
           </div>

           {/* Voice Command Hub */}
           <div className="flex flex-col items-center justify-center p-14 bg-white rounded-[4rem] shadow-startup-medium border-4 border-brand-primary/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-brand-primary/5 opacity-40 animate-pulse pointer-events-none" />
              <motion.button 
                 onMouseDown={startVoiceInput}
                 animate={{ 
                    scale: isListening ? [1, 1.2, 1] : 1,
                    boxShadow: isListening ? "0 0 80px rgba(255, 69, 58, 0.4)" : "0 20px 40px rgba(10, 132, 255, 0.2)"
                 }}
                 transition={{ repeat: isListening ? Infinity : 0, duration: 1.5 }}
                 className={`h-48 w-48 rounded-[4.5rem] shadow-2xl flex items-center justify-center transition-all z-10 ${
                     isListening ? "bg-error text-white" : "bg-brand-primary text-white group hover:scale-105 active:scale-95"
                 }`}
              >
                 <Mic size={86} className={isListening ? "animate-bounce" : ""} />
              </motion.button>
              <p className="mt-10 font-black text-4xl text-neut-900 tracking-tight z-10">
                 {isListening ? "Listening..." : language === 'Hindi' ? "बोलने के लिए दबाएं" : "Press to Speak"}
              </p>
              <p className="text-neut-400 font-bold mt-4 z-10 uppercase tracking-widest text-sm">SIMULATED VOICE AI ACTIVE</p>
           </div>

           {/* Giant Quick Actions Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {menuItems.map((item) => (
                 <Card key={item.label} className="border-none shadow-startup-soft hover:shadow-startup-medium transition-all group cursor-pointer p-10 overflow-hidden relative active:scale-95 border-b-8 border-transparent hover:border-brand-primary bg-white rounded-[3.5rem]">
                    <CardContent className="flex items-center gap-10">
                       <div className={`h-24 w-24 ${item.color} rounded-[2rem] flex items-center justify-center text-white shadow-lg shadow-neut-900/10 group-hover:rotate-6 transition-transform`}>
                          {React.cloneElement(item.icon as any, { size: 48 })}
                       </div>
                        <div className="flex-1">
                           <h4 className="text-4xl font-black text-neut-900 tracking-tighter">{language === 'Hindi' ? item.labelHi : item.label}</h4>
                           <p className="text-lg font-bold text-neut-400 uppercase tracking-widest mt-1">{language === 'Hindi' ? item.subHi : item.sub}</p>
                        </div>
                       <ChevronRight size={40} className="text-neut-200 group-hover:translate-x-2 transition-transform" />
                    </CardContent>
                 </Card>
              ))}
           </div>

           {/* Language & Accessibility Bar */}
           <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-neut-900 text-white rounded-[3.5rem] shadow-startup-soft border border-white/10">
               <div className="flex items-center gap-6">
                  <div className="h-16 w-16 bg-white/10 rounded-3xl flex items-center justify-center text-brand-primary"><Globe size={32} /></div>
                  <div>
                    <h4 className="text-2xl font-black tracking-tight leading-none mb-1">Select Language</h4>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">LOCALIZATION PREFERENCE</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-2 bg-white/5 rounded-[2rem]">
                  <Button 
                     variant={language === 'English' ? 'secondary' : 'ghost'} 
                     className={`h-16 px-10 rounded-2xl font-black text-xl ${language === 'English' ? 'bg-white text-neut-900' : 'text-white'}`}
                     onClick={() => { setLanguage('English'); toast("Language set to English"); }}
                  >
                     English
                  </Button>
                  <Button 
                     variant={language === 'Hindi' ? 'secondary' : 'ghost'} 
                     className={`h-16 px-10 rounded-2xl font-black text-xl ${language === 'Hindi' ? 'bg-white text-neut-900' : 'text-white'}`}
                     onClick={() => { setLanguage('Hindi'); toast("भाषा हिन्दी चुनी गई"); }}
                  >
                     हिन्दी
                  </Button>
               </div>
               <div className="flex items-center gap-6 px-10 border-l border-white/10 h-16">
                   <div className="text-right">
                      <p className="text-xs font-black text-white/40 uppercase mb-1">Speaker</p>
                      <p className="font-bold text-success">Active</p>
                   </div>
                   <Switch checked={true} />
               </div>
           </div>
        </motion.div>
    </div>
  );
}
