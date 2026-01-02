"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const SECTIONS = ["hero", "what-is-section", "experience-section", "cta-section"];

export function ScrollIndicator() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { scrollYProgress } = useScroll();
  
  // Hide on last section
  const opacity = useTransform(scrollYProgress, [0, 0.85, 0.95], [1, 1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const currentIndex = Math.floor(scrollPosition / windowHeight);
      
      setCurrentSection(Math.min(currentIndex, SECTIONS.length - 1));
      
      // Hide when near the bottom
      const totalHeight = document.documentElement.scrollHeight - windowHeight;
      setIsVisible(scrollPosition < totalHeight - 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToNext = () => {
    const nextIndex = currentSection + 1;
    if (nextIndex < SECTIONS.length) {
      const nextSection = document.getElementById(SECTIONS[nextIndex]);
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (!isVisible) return null;

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ opacity }}
      transition={{ duration: 0.5 }}
      onClick={scrollToNext}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
    >
      <span className="text-white/30 text-xs tracking-[0.2em] uppercase font-[family-name:var(--font-smooch-sans)]">
        Scroll
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-6 h-6 text-white/30" />
      </motion.div>
    </motion.button>
  );
}
