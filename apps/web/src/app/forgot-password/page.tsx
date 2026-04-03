"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post("/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success("Reset link sent if account exists!");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-app-bg overflow-hidden selection:bg-brand-primary selection:text-white">
      <div className="gradient-blur top-[-10%] left-[-10%] opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/login" className="inline-flex items-center gap-2 text-neut-500 hover:text-brand-primary font-bold transition-all mb-8">
            <ArrowLeft size={18} />
            Back to login
          </Link>
          <h1 className="startup-headline text-4xl mb-3 tracking-tight font-black">Reset password</h1>
          <p className="text-neut-500 font-medium text-lg leading-relaxed">Enter your email and we&apos;ll send you a recovery link</p>
        </div>

        <Card className="border-none shadow-startup-medium backdrop-blur-2xl bg-white/70 overflow-hidden">
          <CardContent className="p-8 md:p-12">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full h-14 text-lg font-bold rounded-2xl"
                  disabled={loading}
                >
                  {loading ? "Sending link..." : "Send Reset Link"}
                  {!loading && <Send size={18} className="ml-2" />}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-6 animate-fade-in">
                <div className="h-20 w-20 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mx-auto mb-8">
                  <Mail size={40} />
                </div>
                <h3 className="text-2xl font-bold text-neut-900">Check your inbox</h3>
                <p className="text-neut-500 font-medium">We have sent a password recovery link to your registered email address.</p>
                <div className="pt-6 border-t border-neut-100">
                  <p className="text-sm text-neut-400 mb-6">Didn&apos;t receive it?</p>
                  <Button variant="outline" className="w-full h-12 font-bold" onClick={() => setSubmitted(false)}>
                    Try another email address
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
