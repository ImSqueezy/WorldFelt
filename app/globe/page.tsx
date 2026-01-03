"use client";

import { GlobeMap } from "@/components/ui/globe-map";
import { GlobeHeader } from "@/components/ui/globe-header";
import { FloatingParticles } from "@/components/ui/floating-particles";

export default function GlobePage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-zinc-950">
      {/* Floating particles for atmosphere */}
      <FloatingParticles count={20} />
      
      {/* Globe Map */}
      <GlobeMap />
      
      {/* Header */}
      <GlobeHeader />
    </main>
  );
}
