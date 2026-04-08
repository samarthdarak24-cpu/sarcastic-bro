"use client";

import { useEffect, useState } from "react";
import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewHeroSection } from "@/components/landing/NewHeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { KeyFeaturesSection } from "@/components/landing/KeyFeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsCarousel } from "@/components/landing/TestimonialsCarousel";
import { BenefitsComparisonSection } from "@/components/landing/BenefitsComparisonSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { NewCTASection } from "@/components/landing/NewCTASection";
import { NewFAQSection } from "@/components/landing/NewFAQSection";
import { NewFooter } from "@/components/landing/NewFooter";
import { PremiumChatWidget } from "@/components/chat/PremiumChatWidget";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <NewNavbar />
      <NewHeroSection />
      <ProblemSection />
      <SolutionSection />
      <KeyFeaturesSection />
      <HowItWorksSection />
      <TestimonialsCarousel />
      <BenefitsComparisonSection />
      <StatsSection />
      <NewCTASection />
      <NewFAQSection />
      <NewFooter />

      {/* Premium Chat Widget */}
      <PremiumChatWidget />
    </div>
  );
}
