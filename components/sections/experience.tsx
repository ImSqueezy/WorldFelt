"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// Mini globe component with floating feelings
function MiniGlobe() {
  const [feelings, setFeelings] = useState<{ id: number; x: number; y: number; feeling: string; opacity: number }[]>([]);
  
  const feelingWords = ["peaceful", "hopeful", "tender", "grateful", "still", "free", "melancholic", "anxious"];
  
  useEffect(() => {
    let id = 0;
    
    const addFeeling = () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * 40;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.6; // Flatten for perspective
      
      const newFeeling = {
        id: id++,
        x,
        y,
        feeling: feelingWords[Math.floor(Math.random() * feelingWords.length)],
        opacity: 1,
      };
      
      setFeelings(prev => [...prev.slice(-8), newFeeling]);
    };
    
    // Add initial feelings
    for (let i = 0; i < 4; i++) {
      setTimeout(() => addFeeling(), i * 500);
    }
    
    const interval = setInterval(addFeeling, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px]">
      {/* Globe glow */}
      <div className="absolute inset-0 rounded-full bg-cyan-400/5 blur-3xl" />
      
      {/* Globe outline */}
      <div className="absolute inset-8 sm:inset-12 rounded-full border border-cyan-400/20">
        {/* Latitude lines */}
        <div className="absolute top-1/4 left-0 right-0 h-px bg-cyan-400/10" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400/15" />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-cyan-400/10" />
        
        {/* Longitude lines */}
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-cyan-400/10" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-400/15" />
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-cyan-400/10" />
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400/40" />
      </div>
      
      {/* Rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 sm:inset-8 rounded-full border border-dashed border-cyan-400/10"
      />
      
      {/* Floating feelings */}
      {feelings.map((feeling) => (
        <motion.div
          key={feeling.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.8, 0.8, 0], scale: [0, 1, 1, 0.8] }}
          transition={{ duration: 4, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 pointer-events-none"
          style={{
            x: feeling.x,
            y: feeling.y,
          }}
        >
          <div className="px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-sm">
            <span className="text-xs sm:text-sm text-cyan-400/80 font-[family-name:var(--font-smooch-sans)]">
              {feeling.feeling}
            </span>
          </div>
        </motion.div>
      ))}
      
      {/* Pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ 
            scale: [1, 1.5, 2],
            opacity: [0.3, 0.1, 0],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: "easeOut"
          }}
          className="absolute inset-8 sm:inset-12 rounded-full border border-cyan-400/30"
        />
      ))}
    </div>
  );
}

export function ExperienceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="experience-section"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center bg-zinc-950 py-24 px-6 overflow-hidden"
    >
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(34,211,238,0.05),transparent_60%)]" />
      
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex items-center justify-center order-2 lg:order-1"
          >
            <MiniGlobe />
          </motion.div>

          {/* Right side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="order-1 lg:order-2"
          >
            <span className="text-cyan-400/60 text-sm tracking-[0.3em] uppercase font-[family-name:var(--font-smooch-sans)] mb-4 block">
              The Experience
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-thin text-white mb-6 font-[family-name:var(--font-smooch-sans)] tracking-wide leading-tight">
              Watch feelings{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent font-medium">
                bloom
              </span>
            </h2>
            <p className="text-white/50 text-lg sm:text-xl font-extralight font-[family-name:var(--font-smooch-sans)] leading-relaxed mb-8">
              Every moment, someone somewhere shares how they feel. Watch as emotions ripple across the globe in real-time.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {[
                { value: "147", label: "Countries" },
                { value: "24/7", label: "Always On" },
                { value: "∞", label: "Connections" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl font-light text-cyan-400/80 font-[family-name:var(--font-smooch-sans)]">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-white/30 font-[family-name:var(--font-smooch-sans)] tracking-wide">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Description points */}
            <div className="space-y-3">
              {[
                "Real-time feelings from around the world",
                "Anonymous and judgment-free",
                "Connect through shared emotions",
              ].map((text, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-1 h-1 rounded-full bg-cyan-400/50" />
                  <span className="font-[family-name:var(--font-smooch-sans)] text-white/50">
                    {text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
