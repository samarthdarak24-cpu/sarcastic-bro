"use client";

import { NewNavbar } from "@/components/landing/NewNavbar";
import { NewHeroSection } from "@/components/landing/NewHeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { KeyFeaturesSection } from "@/components/landing/KeyFeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { TestimonialsCarousel } from "@/components/landing/TestimonialsCarousel";
import { BenefitsComparisonSection } from "@/components/landing/BenefitsComparisonSection";
import { NewCTASection } from "@/components/landing/NewCTASection";
import { NewFAQSection } from "@/components/landing/NewFAQSection";
import { NewFooter } from "@/components/landing/NewFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <NewNavbar />
      <NewHeroSection />
      <ProblemSection />
      <SolutionSection />
      <KeyFeaturesSection />
      <HowItWorksSection />
      <TestimonialsCarousel />
      <BenefitsComparisonSection />
      <NewCTASection />
      <NewFAQSection />
      <NewFooter />
    </div>
  );
}
