import { HeroSection } from "@/components/landing/hero-section";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-obsidian">
      <HeroSection />
      <DashboardPreview />
      <FeaturesGrid />
      <LandingFooter />
    </main>
  );
}
