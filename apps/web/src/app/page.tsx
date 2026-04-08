"use client";

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
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <NewNavbar />
      
      {/* Quick Access to Stream Chat - TEMPORARY FOR TESTING */}
      <div className="bg-blue-50 border-b border-blue-200 p-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-blue-800 mb-2">🚀 <strong>NEW:</strong> Stream AI Chat is now live!</p>
          <a 
            href="/simple-stream-chat" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Stream AI Chat →
          </a>
        </div>
      </div>
      
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
    </div>
  );
}
