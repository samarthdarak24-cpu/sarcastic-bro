"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, RefreshCw, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function OTPVerificationPage() {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1]; // Only take the last character
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { otp: otpValue });
      toast.success("Verification successful!");
      // Redirect based on current user or session logic
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-app-bg overflow-hidden selection:bg-brand-primary selection:text-white">
      <div className="gradient-blur top-[-10%] left-[-10%] opacity-15" />
      <div className="gradient-blur bottom-[-10%] right-[-10%] opacity-10" style={{ background: 'radial-gradient(circle, var(--brand-secondary) 0%, rgba(255,255,255,0) 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="text-center mb-10">
          <div className="h-14 w-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mx-auto mb-8 shadow-startup-soft">
            <Smartphone size={32} />
          </div>
          <h1 className="startup-headline text-4xl mb-3 tracking-tight font-black">OTP Verification</h1>
          <p className="text-neut-500 font-medium text-lg leading-relaxed">We&apos;ve sent a unique 6-digit code to your registered device</p>
        </div>

        <Card className="border-none shadow-startup-medium backdrop-blur-2xl bg-white/70 overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="flex justify-between items-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-16 md:w-14 md:h-20 glass-card text-center text-3xl font-black text-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-primary/20 focus:border-brand-primary transition-all rounded-2xl border-2 border-neut-100"
                  />
                ))}
              </div>

              <div className="space-y-6">
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full h-14 text-lg font-bold rounded-2xl"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                  {!loading && <ShieldCheck size={20} className="ml-2" />}
                </Button>

                <div className="text-center">
                  <p className="text-neut-400 text-xs font-bold uppercase tracking-widest mb-4">Didn&apos;t get the code?</p>
                  <Button variant="outline" type="button" className="h-12 w-full font-bold border-neut-100 text-neut-600 rounded-2xl">
                    <RefreshCw size={18} className="mr-2" />
                    Resend Code
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
          <div className="p-6 bg-neut-50/50 border-t border-neut-100 text-center">
            <Link href="/login" className="text-neut-500 text-sm font-bold hover:text-brand-primary transition-colors">
              I want to use my password instead
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
