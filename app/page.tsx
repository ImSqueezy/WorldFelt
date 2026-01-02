import { WorldfeltBackground } from "@/components/ui/worldfelt-background";
import { WorldfeltCenterText } from "@/components/ui/worldfelt-center-text";
import { WorldfeltHeader } from "@/components/ui/worldfelt-header";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { CursorGlow } from "@/components/ui/cursor-glow";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <WorldfeltBackground />
      <FloatingParticles count={25} />
      <CursorGlow />
      <WorldfeltCenterText />
      <WorldfeltHeader />

      {/* Your content goes here */}
    </div>
  );
}
