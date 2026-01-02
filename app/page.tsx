import { WorldfeltBackground } from "@/components/ui/worldfelt-background";
import { WorldfeltCenterText } from "@/components/ui/worldfelt-center-text";
import { WorldfeltHeader } from "@/components/ui/worldfelt-header";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";
import { WhatIsSection } from "@/components/sections/what-is";
import { ExperienceSection } from "@/components/sections/experience";
import { CTASection } from "@/components/sections/cta";

export default function Home() {
  return (
    <main className="relative">
      {/* Global scroll indicator */}
      <ScrollIndicator />

      {/* Hero Section - Full screen with map background */}
      <section id="hero" className="relative h-screen">
        <WorldfeltBackground />
        <FloatingParticles count={25} />
        <CursorGlow />
        <WorldfeltCenterText />
        <WorldfeltHeader />
      </section>

      {/* What is Worldfelt Section - Dark background only */}
      <WhatIsSection />

      {/* The Experience Section - Interactive globe preview */}
      <ExperienceSection />

      {/* Final CTA Section */}
      <CTASection />
    </main>
  );
}
