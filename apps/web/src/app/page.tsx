"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, ShieldCheck, BarChart3, CloudUpload, MessageSquare, Briefcase, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";

const features = [
  {
    title: "AI Quality Grading",
    description: "Instant product scoring and defect detection using advanced computer vision.",
    icon: ShieldCheck,
    color: "text-brand-primary",
    bg: "bg-brand-primary/10",
  },
  {
    title: "Direct Sourcing",
    description: "Connect buyers directly with vetted producers, eliminating middleman costs.",
    icon: Leaf,
    color: "text-brand-primary",
    bg: "bg-brand-primary/10"
  },
  {
    title: "Instant Logistics",
    description: "Streamlined transport matching for agricultural goods across clusters.",
    icon: Globe,
    color: "text-brand-secondary",
    bg: "bg-brand-secondary/10"
  }
];

const stats = [
  { value: "450k+", label: "Farmers Empowered" },
  { value: "₹1,200Cr", label: "Monthly GMV" },
  { value: "98.5%", label: "Quality Accuracy" },
  { value: "20+", label: "Product Categories" }
];

const steps = [
  { title: "Register & Verify", description: "Complete KYC to join the trusted global network." },
  { title: "List or Request", description: "Producers list products, buyers create RFQs and Tenders." },
  { title: "Smart Matching", description: "AI matches the best quality products with the right requirements." },
  { title: "Direct Trade", description: "Seamless payments and verified logistics for every transaction." }
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen font-sans selection:bg-brand-primary selection:text-white overflow-hidden">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="gradient-blur top-0 right-0" />
        <div className="gradient-blur bottom-0 left-0" style={{ background: 'radial-gradient(circle, var(--brand-secondary) 0%, rgba(255,255,255,0) 70%)', opacity: 0.1 }} />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-wider"
          >
            <Globe size={14} />
            Smart Agri Marketplace for Farmers & Buyers
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="startup-headline text-5xl md:text-8xl mb-8 tracking-tight font-black"
          >
            Grow with <span className="text-brand-primary">Confidence</span>.<br /> 
            Trade with <span className="text-brand-secondary">Trust</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto text-neut-500 text-lg md:text-xl mb-12 leading-relaxed font-medium"
          >
            The world-class portal for ODOP products. Direct sourcing, AI-driven quality assurance, and real-time supply chain intelligence for the modern agricultural ecosystem.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/register?role=FARMER">
              <Button size="lg" variant="primary" className="w-full sm:w-auto h-16 px-12 text-lg rounded-full shadow-lg hover:shadow-brand-primary/20">
                For Farmers
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link href="/register?role=BUYER">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto h-16 px-12 text-lg rounded-full shadow-lg hover:shadow-brand-secondary/20">
                For Buyers
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-24 relative px-4"
          >
            <div className="w-full aspect-[2/1.3] max-w-5xl mx-auto rounded-[3rem] bg-white border-[12px] border-white shadow-startup-medium overflow-hidden relative group">
              {/* Browser Header */}
              <div className="h-14 bg-neut-100 border-b border-neut-200 flex items-center px-6 gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-error" />
                  <div className="h-3 w-3 rounded-full bg-warning" />
                  <div className="h-3 w-3 rounded-full bg-success" />
                </div>
                <div className="h-6 w-96 bg-white rounded-lg mx-6 border border-neut-200" />
              </div>

              {/* Mock Dashboard Layout */}
              <div className="flex h-[calc(100%-3.5rem)] bg-neut-50">
                {/* Sidebar - High Contrast Dark */}
                <div className="w-20 bg-neut-900 flex flex-col items-center py-8 gap-8">
                  <div className="h-12 w-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
                    <BarChart3 size={24} />
                  </div>
                  {[Globe, Leaf, Briefcase, MessageSquare].map((Icon, i) => (
                    <div key={i} className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer">
                      <Icon size={20} />
                    </div>
                  ))}
                  <div className="mt-auto h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-white/40">
                    <div className="h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-8 space-y-8 overflow-y-auto">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-brand-primary">ODOP Connect Live Hub</div>
                      <div className="text-3xl font-black text-neut-900 tracking-tight">Varanasi Region <span className="text-neut-400 font-medium tracking-normal text-xl ml-2">#8842</span></div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-12 px-6 bg-brand-primary text-white rounded-2xl flex items-center font-black text-sm shadow-lg shadow-brand-primary/20">New Listing</div>
                      <div className="h-12 w-12 bg-white border-2 border-neut-200 rounded-2xl flex items-center justify-center text-neut-900">
                        <CloudUpload size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { l: "ODOP Price Index", v: "₹42,500", s: "+12.4%", b: "border-brand-primary", c: "text-brand-primary" },
                      { l: "AI Quality Score", v: "98.5%", s: "Elite", b: "border-brand-secondary", c: "text-brand-secondary" },
                      { l: "Global RFQs", v: "1,240", s: "Urgent", b: "border-warning", c: "text-warning" }
                    ].map((card, i) => (
                      <div key={i} className={`p-6 bg-white rounded-[2rem] border border-neut-200 shadow-startup-soft ${card.b} border-l-8 group-hover:translate-y-[-4px] transition-all`}>
                        <div className="text-[10px] font-black uppercase tracking-widest text-neut-400 mb-4">{card.l}</div>
                        <div className="flex items-baseline gap-2">
                          <div className="text-3xl font-black text-neut-900 tracking-tighter">{card.v}</div>
                          <div className={`text-[10px] font-black uppercase ${card.c}`}>{card.s}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-5 gap-6 h-48">
                    <div className="col-span-3 bg-white rounded-[2rem] border border-neut-200 p-8 flex flex-col group/chart shadow-startup-soft">
                      <div className="flex justify-between items-center mb-8">
                        <div className="text-xs font-black uppercase tracking-widest text-neut-900">Demand: Varanasi Silk</div>
                        <Badge tone="brand">High Accuracy</Badge>
                      </div>
                      <div className="flex-1 flex items-end gap-3 px-2">
                        {[30, 50, 45, 90, 65, 80, 55, 75, 40, 85].map((h, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 0.5 + (i * 0.05), duration: 0.8, ease: "circOut" }}
                            className="flex-1 bg-brand-primary rounded-t-lg shadow-lg shadow-brand-primary/10 group-hover/chart:bg-brand-primary/80 transition-all"
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="col-span-2 bg-neut-900 text-white rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl">
                      <div className="relative z-10 space-y-4">
                        <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-success border border-white/10">
                          <ShieldCheck size={28} />
                        </div>
                        <div className="space-y-1">
                          <div className="text-base font-black tracking-tight">AI Pest Detection</div>
                          <div className="text-[10px] text-success font-black uppercase tracking-widest flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-success" />
                            Secure & Pure
                          </div>
                        </div>
                      </div>
                      <div className="relative z-10 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "95%" }}
                          transition={{ delay: 1, duration: 1 }}
                          className="h-full bg-success shadow-lg shadow-success/40" 
                        />
                      </div>
                      <div className="absolute top-[-20%] right-[-20%] h-48 w-48 bg-brand-primary/20 rounded-full blur-[60px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Visual Elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-8 h-44 w-44 bg-white border border-neut-200 rounded-[3rem] shadow-2xl p-6 hidden lg:flex flex-col items-center justify-center z-20 gap-3"
            >
              <div className="h-12 w-12 bg-success/10 rounded-2xl flex items-center justify-center text-success">
                <Leaf size={28} />
              </div>
              <div className="text-center font-black">
                <div className="text-[10px] uppercase tracking-widest text-neut-400">Status</div>
                <div className="text-sm text-neut-900">Sustainable Verified</div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 -left-12 h-40 w-40 bg-white border border-neut-200 rounded-[3rem] shadow-2xl p-6 hidden lg:flex flex-col items-center justify-center z-20 gap-3"
            >
              <div className="h-12 w-12 bg-brand-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
                <Globe size={24} />
              </div>
              <div className="text-center font-black">
                <div className="text-[10px] uppercase tracking-widest text-neut-400">Trade</div>
                <div className="text-sm text-neut-900">Export Ready L3</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-neut-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black text-brand-primary mb-2">{stat.value}</div>
                <div className="text-neut-500 font-bold text-sm uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <h2 className="startup-headline text-4xl md:text-6xl mb-6">Revolutionary Technology</h2>
          <p className="max-w-2xl mx-auto text-neut-500 text-lg">Next-generation features designed to modernize the agricultural supply chain from end to end.</p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none bg-neut-50 hover:bg-white hover:shadow-startup-medium transition-all group">
                <CardContent className="p-8">
                  <div className={`h-14 w-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon size={28} />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-4 text-neut-900">{feature.title}</h3>
                  <p className="text-neut-500 text-sm leading-relaxed font-medium">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 bg-neut-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none bg-grid" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="startup-headline text-4xl md:text-6xl mb-6 text-white">How it works</h2>
            <p className="max-w-2xl mx-auto text-neut-400">Our seamless platform streamlines every step of the agriculture trade.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-[2rem] bg-white/5 border border-white/10 relative group"
              >
                <div className="text-5xl font-black text-white/10 mb-8 group-hover:text-brand-primary/20 transition-colors">0{i+1}</div>
                <h3 className="font-heading font-bold text-xl mb-4">{step.title}</h3>
                <p className="text-neut-400 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-[3rem] bg-neut-900 p-12 relative overflow-hidden text-white"
            >
              <div className="relative z-10">
                <div className="h-12 w-12 bg-brand-primary rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-brand-primary/20">
                  <MessageSquare size={24} />
                </div>
                <div className="text-xl md:text-2xl font-medium mb-12 leading-relaxed opacity-90">
                  &quot;The AI-driven quality grading for our **Varanasi Silk** has been a game changer. Buyers now trust our products instantly, and we&apos;ve seen a 35% increase in direct export orders.&quot;
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-brand-primary/20 border-2 border-brand-primary flex items-center justify-center font-black text-brand-primary">RL</div>
                  <div>
                    <div className="font-bold text-lg">Rajesh L.</div>
                    <div className="text-sm text-neut-400 font-medium">Master Weaver, Varanasi Cluster</div>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 h-64 w-64 bg-brand-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-[3rem] bg-brand-primary p-12 relative overflow-hidden text-white shadow-2xl shadow-brand-primary/20"
            >
              <div className="relative z-10">
                <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                  <Globe size={24} />
                </div>
                <div className="text-xl md:text-2xl font-medium mb-12 leading-relaxed">
                  &quot;Sourcing **Lucknow Chikan** embroidery used to take weeks of negotiation. With ODOP Connect, we verify quality in seconds and close trades with smart contracts.&quot;
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-white/20 border-2 border-white flex items-center justify-center font-black">SP</div>
                  <div>
                    <div className="font-bold text-lg">Sarah P.</div>
                    <div className="text-sm text-white/70 font-medium">Global Sourcing Head, LuxAgri</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-64 w-64 bg-white/10 rounded-full blur-[100px] -ml-32 -mb-32" />
            </motion.div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
