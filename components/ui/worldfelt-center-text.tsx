"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ScrollVelocityRow } from "@/components/ui/scroll-based-velocity";
import { ShinyButton } from "@/components/ui/shiny-button";

const PHRASES = [
  { text: "Today felt ", feeling: "heavy", color: "text-purple-400" },
  { text: "Today felt ", feeling: "still", color: "text-cyan-400" },
  { text: "Some days feel ", feeling: "tender", color: "text-rose-400" },
  { text: "Today felt ", feeling: "far away", color: "text-amber-400" },
  { text: "Today felt like ", feeling: "enough", color: "text-emerald-400" },
];

// Animated counter component
function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = Math.floor(target * 0.7); // Start from 70% of target
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (target - startValue) * eased);
      
      setCount(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    const timer = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 2500); // Delay start
    
    return () => clearTimeout(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
}

// Typing text component with colored feelings
function TypingText({ className }: { className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPhrase = PHRASES[currentIndex];
  const fullText = currentPhrase.text + currentPhrase.feeling;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < fullText.length) {
          setDisplayText(fullText.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % PHRASES.length);
        }
      }
    }, isDeleting ? 40 : 80);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, fullText]);

  // Split the display text into prefix and feeling parts
  const prefixLength = currentPhrase.text.length;
  const prefixPart = displayText.slice(0, Math.min(displayText.length, prefixLength));
  const feelingPart = displayText.length > prefixLength ? displayText.slice(prefixLength) : "";

  return (
    <span className={className}>
      <span className="text-white/60">{prefixPart}</span>
      <span className={currentPhrase.color}>{feelingPart}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[2px] h-[1em] bg-cyan-400/60 ml-1 align-middle"
      />
    </span>
  );
}

export function WorldfeltCenterText() {
  return (
    <>
      {/* Full screen dark overlay to make text pop */}
      <div className="absolute inset-0 z-[5] bg-black/60" />
      
      {/* Stronger radial gradient for center focus */}
      <div className="absolute inset-0 z-[6] bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,transparent_20%,rgba(0,0,0,0.8)_100%)]" />

      {/* Top scrolling text - now at bottom, goes left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2 }}
        className="absolute bottom-32 sm:bottom-40 left-0 right-0 z-10 pointer-events-none"
      >
        <ScrollVelocityRow
          baseVelocity={-2}
          className="opacity-[0.3]"
        >
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight font-[family-name:var(--font-smooch-sans)] tracking-[0.15em] mx-10 text-cyan-300">
            breathe
          </span>
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight mx-6 text-white/30">✦</span>
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight font-[family-name:var(--font-smooch-sans)] tracking-[0.15em] mx-10 text-purple-300">
            reflect
          </span>
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight mx-6 text-white/30">✦</span>
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight font-[family-name:var(--font-smooch-sans)] tracking-[0.15em] mx-10 text-rose-300">
            belong
          </span>
          <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight mx-6 text-white/30">✦</span>
        </ScrollVelocityRow>
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="relative text-center px-6 max-w-4xl">
          {/* Main title - World appears first, then felt */}
          <h1 className="mb-3 sm:mb-4">
            {/* World - appears first */}
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="inline-block text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-thin text-white tracking-[-0.02em] font-[family-name:var(--font-smooch-sans)]"
            >
              World
            </motion.span>
            
            {/* felt - appears after with cyan gradient */}
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="inline-block text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-medium bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent tracking-[-0.02em] ml-3 sm:ml-4 md:ml-6"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              felt
            </motion.span>
          </h1>

          {/* Static tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
            className="text-xl sm:text-2xl md:text-3xl font-extralight text-white/70 tracking-wide mb-4 sm:mb-5 font-[family-name:var(--font-smooch-sans)]"
          >
            The world is feeling something
          </motion.p>

          {/* Typing text with colored feelings */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="mb-6 sm:mb-8 h-10"
          >
            <TypingText 
              className="text-lg sm:text-xl md:text-2xl font-light tracking-wide font-[family-name:var(--font-smooch-sans)]"
            />
          </motion.div>

          {/* Shiny Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="pointer-events-auto"
          >
            <ShinyButton className="font-[family-name:var(--font-smooch-sans)]">
              Start
            </ShinyButton>
          </motion.div>

          {/* Stats counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.8 }}
            className="mt-8 sm:mt-10"
          >
            <p className="text-white/40 text-sm sm:text-base font-light tracking-wide font-[family-name:var(--font-smooch-sans)]">
              <span className="text-cyan-400/70 font-normal">
                <AnimatedCounter target={12847} duration={2.5} />
              </span>
              {" "}feelings shared today
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom scrolling text - goes right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2.5 }}
        className="absolute bottom-20 sm:bottom-24 left-0 right-0 z-10 pointer-events-none"
      >
        <ScrollVelocityRow
          baseVelocity={3}
          className="opacity-[0.3]"
        >
          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight font-[family-name:var(--font-smooch-sans)] tracking-[0.2em] mx-12 text-amber-300">
            feel together
          </span>
          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight mx-8 text-white/20">•</span>
          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight font-[family-name:var(--font-smooch-sans)] tracking-[0.2em] mx-12 text-emerald-300">
            share moments
          </span>
          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight mx-8 text-white/20">•</span>
          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight font-[family-name:var(--font-smooch-sans)] tracking-[0.2em] mx-12 text-blue-300">
            connect globally
          </span>
          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight mx-8 text-white/20">•</span>
        </ScrollVelocityRow>
      </motion.div>
    </>
  );
}
