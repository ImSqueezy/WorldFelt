"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlobeMap } from "@/components/ui/globe-map";
import { GlobeHeader } from "@/components/ui/globe-header";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { AuthModal } from "@/components/ui/auth-modal";

export default function GlobePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('worldfelt_token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setShowAuthModal(true);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  const handleAuthClose = () => {
    // If not authenticated, redirect to home
    if (!isAuthenticated) {
      router.push('/');
    }
    setShowAuthModal(false);
  };

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <main className="relative h-screen w-screen overflow-hidden bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </main>
    );
  }

  // Show auth modal if not authenticated
  if (!isAuthenticated) {
    return (
      <main className="relative h-screen w-screen overflow-hidden bg-zinc-950">
        <FloatingParticles count={20} />
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={handleAuthClose}
          onSuccess={handleAuthSuccess}
          initialMode="login"
        />
      </main>
    );
  }

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
