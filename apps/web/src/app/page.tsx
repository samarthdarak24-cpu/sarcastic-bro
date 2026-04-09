"use client";

import { useEffect, useState } from "react";
import { NewNavbar } from "@/components/landing/NewNavbar";
import { EnhancedHeroSection } from "@/components/landing/EnhancedHeroSection";
import { AnimatedFeaturesSection } from "@/components/landing/AnimatedFeaturesSection";
import { AnimatedStatsSection } from "@/components/landing/AnimatedStatsSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { KeyFeaturesSection } from "@/components/landing/KeyFeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsCarousel } from "@/components/landing/TestimonialsCarousel";
import { BenefitsComparisonSection } from "@/components/landing/BenefitsComparisonSection";
import { NewCTASection } from "@/components/landing/NewCTASection";
import { NewFAQSection } from "@/components/landing/NewFAQSection";
import { NewFooter } from "@/components/landing/NewFooter";
import { PremiumChatWidget } from "@/components/chat/PremiumChatWidget";
import { PageLoadAnimation } from "@/components/animations/PageLoadAnimation";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <PageLoadAnimation showLoadingBar={true}>
      <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
        <NewNavbar />
        <EnhancedHeroSection />
        <AnimatedFeaturesSection />
        <ProblemSection />
        <SolutionSection />
        <KeyFeaturesSection />
        <HowItWorksSection />
        <TestimonialsCarousel />
        <BenefitsComparisonSection />
        <AnimatedStatsSection />
        <NewCTASection />
        <NewFAQSection />
        <NewFooter />

        {/* Premium Chat Widget */}
        <PremiumChatWidget />
      </div>
    </PageLoadAnimation>
  );
}
