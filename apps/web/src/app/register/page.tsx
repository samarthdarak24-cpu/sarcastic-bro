"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight, Globe, Tractor, Building2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "FARMER" as "FARMER" | "BUYER",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic frontend validation
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (!/[A-Z]/.test(formData.password)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }
    if (!/\d/.test(formData.password)) {
      toast.error("Password must contain at least one number");
      return;
    }

    setLoading(true);
    
    try {
      const response: any = await api.post("/auth/register", formData);
      if (response.success || response.data?.user?.id) {
        toast.success("Account created successfully!");
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Registration Error:", error);
      
      const responseData = error.response?.data;
      
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        // Handle Zod validation errors
        responseData.errors.forEach((err: { field: string; message: string }) => {
          toast.error(`${err.message}`); // Only show message for better UX
        });
      } else if (responseData?.message) {
        // Handle custom ApiError (conflict, etc.)
        toast.error(responseData.message);
      } else {
        toast.error(error.message || "Registration failed. Please check your details.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-app-bg overflow-hidden selection:bg-brand-primary selection:text-white">
      {/* Background Orbs */}
      <div className="gradient-blur top-[-10%] left-[-10%] opacity-20" />
      <div className="gradient-blur bottom-[-10%] right-[-10%] opacity-15" style={{ background: 'radial-gradient(circle, var(--brand-secondary) 0%, rgba(255,255,255,0) 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[560px] relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="h-10 w-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-startup-medium group-hover:scale-110 transition-transform">
              O
            </div>
            <span className="font-heading font-black text-xl tracking-tighter text-neut-900 group-hover:text-brand-primary transition-colors">
              ODOP <span className="text-brand-primary">Connect</span>
            </span>
          </Link>
          <h1 className="startup-headline text-4xl mb-3 tracking-tight font-black">Create account</h1>
          <p className="text-neut-500 font-medium text-lg">Join the future of agricultural trade</p>
        </div>

        <Card className="border-none shadow-startup-medium backdrop-blur-2xl bg-white/70 overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {step === 1 ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "FARMER" })}
                      className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-4 group ${
                        formData.role === "FARMER" 
                          ? "border-brand-primary bg-brand-primary/5 ring-4 ring-brand-primary/10" 
                          : "border-neut-100 bg-white hover:border-neut-200"
                      }`}
                    >
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-colors ${
                        formData.role === "FARMER" ? "bg-brand-primary text-white" : "bg-neut-50 text-neut-400 group-hover:bg-neut-100"
                      }`}>
                        <Tractor size={28} />
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-neut-900">Farmer</div>
                        <div className="text-xs text-neut-500 font-medium leading-relaxed">List products & use AI grading</div>
                      </div>
                      {formData.role === "FARMER" && <CheckCircle2 size={20} className="text-brand-primary absolute top-4 right-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "BUYER" })}
                      className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-4 group ${
                        formData.role === "BUYER" 
                          ? "border-brand-secondary bg-brand-secondary/5 ring-4 ring-brand-secondary/10" 
                          : "border-neut-100 bg-white hover:border-neut-200"
                      }`}
                    >
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-colors ${
                        formData.role === "BUYER" ? "bg-brand-secondary text-white" : "bg-neut-50 text-neut-400 group-hover:bg-neut-100"
                      }`}>
                        <Building2 size={28} />
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-neut-900">Buyer</div>
                        <div className="text-xs text-neut-500 font-medium leading-relaxed">Source directly & track orders</div>
                      </div>
                      {formData.role === "BUYER" && <CheckCircle2 size={20} className="text-brand-secondary absolute top-4 right-4" />}
                    </button>
                  </div>

                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setStep(2)}
                    className="w-full h-14 text-lg font-bold rounded-2xl"
                  >
                    Continue
                    <ArrowRight size={20} className="ml-2" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="name@company.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <Input
                      label="Password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <p className="text-xs text-neut-400 -mt-2">Min 8 characters, 1 uppercase letter, 1 number</p>

                  </div>

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full h-14 text-lg font-bold rounded-2xl"
                      disabled={loading}
                    >
                      {loading ? "Creating account..." : "Complete Registration"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="w-full h-10 text-neut-500 hover:text-neut-900"
                    >
                      Go back to type selection
                    </Button>
                  </div>
                </>
              )}

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neut-200" />
                </div>
                <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest bg-transparent">
                  <span className="bg-white/50 px-4 text-neut-400">Secure Registration</span>
                </div>
              </div>
            </form>
          </CardContent>

          <div className="p-6 bg-neut-50/50 border-t border-neut-100 text-center">
            <p className="text-neut-500 text-sm font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-primary font-bold hover:text-brand-primary/80 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
