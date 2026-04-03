"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Globe, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/api";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response: any = await api.post("/auth/login", formData);
      
      if (response.success) {
        const { user, tokens } = response.data;
        login({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: tokens.accessToken,
        });
        
        toast.success("Successfully logged in!");
        
        if (user.role === "FARMER") {
          router.push("/farmer/dashboard");
        } else {
          router.push("/buyer/dashboard");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-app-bg overflow-hidden selection:bg-brand-primary selection:text-white">
      <div className="gradient-blur top-[-10%] left-[-10%] opacity-20" />
      <div className="gradient-blur bottom-[-10%] right-[-10%] opacity-10" style={{ background: 'radial-gradient(circle, var(--brand-secondary) 0%, rgba(255,255,255,0) 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
            <div className="h-12 w-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-startup-medium group-hover:scale-110 transition-transform">
              O
            </div>
            <span className="font-heading font-black text-2xl tracking-tighter text-neut-900 group-hover:text-brand-primary transition-colors">
              ODOP <span className="text-brand-primary">Connect</span>
            </span>
          </Link>
          <h1 className="startup-headline text-4xl mb-3 tracking-tight font-black">Welcome back</h1>
          <p className="text-neut-500 font-medium text-lg">Log in to your agriculture ecosystem</p>
        </div>

        <Card className="border-none shadow-startup-medium backdrop-blur-2xl bg-white/70 overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-sm font-semibold text-neut-700">Password</label>
                    <Link href="/forgot-password" title="Forgot Password" className="text-xs font-bold text-brand-primary hover:text-brand-primary/80 transition-colors">
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-14 text-lg font-bold rounded-2xl"
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Sign in to account"}
                {!loading && <ArrowRight size={20} className="ml-2" />}
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neut-200" />
                </div>
                <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest bg-transparent">
                  <span className="bg-white/50 px-4 text-neut-400">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" className="h-14 font-bold border-neut-200 rounded-2xl">
                  <Globe size={20} className="mr-2" />
                  Social
                </Button>
                <Button variant="outline" type="button" className="h-14 font-bold border-neut-200 rounded-2xl">
                  <Send size={20} className="mr-2 text-brand-secondary" />
                  OTP
                </Button>
              </div>
            </form>
          </CardContent>

          <div className="p-6 bg-neut-50/50 border-t border-neut-100 text-center">
            <p className="text-neut-500 text-sm font-medium">
              Don&apos;t have an account yet?{" "}
              <Link href="/register" className="text-brand-primary font-bold hover:text-brand-primary/80 transition-colors">
                Register for Free
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
