"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import { ShinyButton } from "@/components/ui/shiny-button";

// Generate dots on client side only
function AnimatedDots({ isInView }: { isInView: boolean }) {
  const [dots, setDots] = useState<{ id: string; x: number; y: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate random positions on client only
    setDots(
      [...Array(20)].map((_, i) => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2,
      }))
    );
  }, []);

  if (dots.length === 0) return null;

  return (
    <>
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute w-1 h-1 rounded-full bg-cyan-400/20"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
          }}
          initial={{ opacity: 0 }}
          animate={isInView ? { 
            opacity: [0, 0.5, 0],
            scale: [0, 1, 0],
          } : {}}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            delay: dot.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </>
  );
}

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const router = useRouter();

  return (
    <section 
      id="cta-section"
      ref={ref}
      className="relative min-h-[80vh] flex items-center justify-center bg-zinc-950 py-24 px-6 overflow-hidden"
    >
      {/* Subtle gradient from top */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(34,211,238,0.08),transparent_50%)]" />
      
      {/* Animated background dots */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatedDots isInView={isInView} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Small label */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-cyan-400/60 text-sm tracking-[0.3em] uppercase font-[family-name:var(--font-smooch-sans)] mb-6 block"
        >
          Join the feeling
        </motion.span>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-thin text-white mb-6 font-[family-name:var(--font-smooch-sans)] tracking-wide leading-tight"
        >
          The world is waiting to hear{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent font-medium">
            how you feel
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-white/40 text-lg sm:text-xl font-extralight font-[family-name:var(--font-smooch-sans)] leading-relaxed mb-10 max-w-xl mx-auto"
        >
          Drop a pin. Share a feeling. Connect with souls across the globe who feel just like you.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <ShinyButton 
            onClick={() => router.push("/globe")}
            className="font-[family-name:var(--font-smooch-sans)]"
          >
            Start Feeling
          </ShinyButton>
        </motion.div>

        {/* Trust text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 text-white/25 text-sm font-[family-name:var(--font-smooch-sans)]"
        >
          No account needed · Anonymous · Free forever
        </motion.p>
      </div>
    </section>
  );
}
