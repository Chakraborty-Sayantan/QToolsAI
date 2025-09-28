import { Navbar } from "@/components/landing/Navbar"
import { HeroSection } from "@/components/landing/HeroSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { NewToolsSection } from "@/components/landing/NewToolsSection"
import { FeatureRequestSection } from "@/components/landing/FeatureRequestSection";
import { CTASection } from "@/components/landing/CTASection"
import { Footer } from "@/components/landing/Footer"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
         <NewToolsSection />
         <FeatureRequestSection /> 
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
