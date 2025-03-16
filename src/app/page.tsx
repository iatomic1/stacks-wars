import HeroSection from "@/components/landing-page/hero-section";
import Description from "@/components/landing-page/description";
import Community from "@/components/landing-page/community";
import Roadmap from "@/components/landing-page/roadmap";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col mx-auto">
      <main className="flex-1">
        <HeroSection />

        <Description />

        <Roadmap />

        <Community />
      </main>
    </div>
  );
}
