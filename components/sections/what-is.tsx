"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useId } from "react";
import { AnimatedList } from "@/components/ui/animated-list";
import { cn } from "@/lib/utils";

interface FeelingNotification {
  name: string;
  location: string;
  feeling: string;
  time: string;
}

const feelings: FeelingNotification[] = [
  {
    name: "Someone",
    location: "Tokyo, Japan",
    feeling: "peaceful",
    time: "just now",
  },
  {
    name: "Someone",
    location: "São Paulo, Brazil",
    feeling: "hopeful",
    time: "2m ago",
  },
  {
    name: "Someone",
    location: "Paris, France",
    feeling: "melancholic",
    time: "3m ago",
  },
  {
    name: "Someone",
    location: "Lagos, Nigeria",
    feeling: "grateful",
    time: "5m ago",
  },
  {
    name: "Someone",
    location: "New York, USA",
    feeling: "anxious",
    time: "6m ago",
  },
  {
    name: "Someone",
    location: "Mumbai, India",
    feeling: "tender",
    time: "8m ago",
  },
  {
    name: "Someone",
    location: "Berlin, Germany",
    feeling: "still",
    time: "10m ago",
  },
  {
    name: "Someone",
    location: "Sydney, Australia",
    feeling: "free",
    time: "12m ago",
  },
];

// Duplicate to create infinite loop effect with unique IDs
const allFeelings = feelings.flatMap((feeling, idx) => 
  [0, 1, 2].map(copy => ({
    ...feeling,
    uniqueId: `${feeling.location.replace(/[^a-z]/gi, '')}-${idx}-${copy}`
  }))
);

interface FeelingWithId extends FeelingNotification {
  uniqueId: string;
}

function FeelingItem({ name, location, feeling, time }: FeelingNotification) {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        "bg-white/[0.03] border border-white/[0.08]",
        "transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        {/* Dot indicator */}
        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-cyan-400/10">
          <div className="h-2.5 w-2.5 rounded-full bg-cyan-400/60" />
        </div>
        
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center text-base font-medium text-white/90 font-[family-name:var(--font-smooch-sans)]">
            <span className="text-sm text-white/40">{name} in </span>
            <span className="mx-1 text-white/60">{location}</span>
          </figcaption>
          <p className="text-sm font-[family-name:var(--font-smooch-sans)]">
            <span className="text-white/40">felt </span>
            <span className="text-cyan-400/80 font-medium">{feeling}</span>
          </p>
        </div>
        
        <span className="ml-auto text-xs text-white/25 font-[family-name:var(--font-smooch-sans)]">
          {time}
        </span>
      </div>
    </figure>
  );
}

export function WhatIsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="what-is-section"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center bg-zinc-950 py-24 px-6"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(34,211,238,0.08),transparent_50%)]" />
      
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="text-cyan-400/60 text-sm tracking-[0.3em] uppercase font-[family-name:var(--font-smooch-sans)] mb-4 block">
              The Concept
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-thin text-white mb-6 font-[family-name:var(--font-smooch-sans)] tracking-wide leading-tight">
              What is{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent font-medium">
                Worldfelt
              </span>
              ?
            </h2>
            <p className="text-white/50 text-lg sm:text-xl font-extralight font-[family-name:var(--font-smooch-sans)] leading-relaxed mb-8">
              A calm space where people share how they feel, visualized on a living, breathing global map. No likes, no followers — just raw, honest feelings shared anonymously.
            </p>
            
            {/* Key points */}
            <div className="space-y-4">
              {[
                "Drop a pin anywhere on Earth",
                "Share what you're feeling",
                "See you're never alone",
              ].map((text, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
                  <span className="font-[family-name:var(--font-smooch-sans)] text-lg text-white/60">
                    {text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Quote */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-10 text-white/30 text-lg font-extralight italic font-[family-name:var(--font-smooch-sans)]"
            >
              "You're never alone in how you feel"
            </motion.p>
          </motion.div>

          {/* Right side - Animated notifications */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative h-[500px] overflow-hidden"
          >
            {/* Gradient overlays for fade effect */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-zinc-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-zinc-950 to-transparent z-10 pointer-events-none" />
            
            <AnimatedList delay={2000} className="pt-4">
              {allFeelings.map((feeling) => (
                <FeelingItem key={feeling.uniqueId} {...feeling} />
              ))}
            </AnimatedList>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
