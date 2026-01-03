"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FloatingBubble {
  id: number;
  x: number;
  y: number;
  feeling: string;
  delay: number;
  duration: number;
  side: "left" | "right";
}

interface FloatingIcon {
  id: number;
  x: number;
  y: number;
  icon: string;
  delay: number;
  scale: number;
}

const FEELINGS = [
  "peaceful", "hopeful", "grateful", "tender", 
  "still", "free", "calm", "gentle", "warm"
];

const EMOTION_ICONS = ["✨", "💫", "🌙", "☁️", "🌊", "🍃", "💭"];

export function SideDecorations() {
  const [bubbles, setBubbles] = useState<FloatingBubble[]>([]);
  const [icons, setIcons] = useState<FloatingIcon[]>([]);

  useEffect(() => {
    const newBubbles: FloatingBubble[] = [];
    
    // Left side bubbles
    for (let i = 0; i < 4; i++) {
      newBubbles.push({
        id: i,
        x: 5 + Math.random() * 12,
        y: 20 + Math.random() * 60,
        feeling: FEELINGS[Math.floor(Math.random() * FEELINGS.length)],
        delay: Math.random() * 2,
        duration: 15 + Math.random() * 10,
        side: "left",
      });
    }
    
    // Right side bubbles
    for (let i = 4; i < 8; i++) {
      newBubbles.push({
        id: i,
        x: 83 + Math.random() * 12,
        y: 20 + Math.random() * 60,
        feeling: FEELINGS[Math.floor(Math.random() * FEELINGS.length)],
        delay: Math.random() * 2,
        duration: 15 + Math.random() * 10,
        side: "right",
      });
    }
    
    setBubbles(newBubbles);

    // Create floating icons
    const newIcons: FloatingIcon[] = [];
    for (let i = 0; i < 6; i++) {
      const isLeft = i < 3;
      newIcons.push({
        id: i,
        x: isLeft ? 3 + Math.random() * 15 : 82 + Math.random() * 15,
        y: 15 + Math.random() * 70,
        icon: EMOTION_ICONS[Math.floor(Math.random() * EMOTION_ICONS.length)],
        delay: 1 + Math.random() * 3,
        scale: 0.6 + Math.random() * 0.4,
      });
    }
    setIcons(newIcons);
  }, []);

  if (bubbles.length === 0) return null;

  return (
    <>
      {/* Left side decorative elements */}
      <div className="absolute left-0 top-0 bottom-0 w-1/4 pointer-events-none z-[7] hidden lg:block">
        {/* Vertical line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="absolute left-16 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent origin-top"
        />
        
        {/* Dots along the line */}
        {[0.3, 0.5, 0.7].map((pos, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.5 + i * 0.2 }}
            className="absolute left-16 -translate-x-1/2"
            style={{ top: `${pos * 100}%` }}
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400/30" />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              className="absolute inset-0 rounded-full bg-cyan-400/20"
            />
          </motion.div>
        ))}
        
        {/* Floating text labels */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="absolute left-8 top-[35%] -rotate-90 origin-center"
        >
          <span className="text-white/10 text-xs tracking-[0.4em] uppercase font-[family-name:var(--font-smooch-sans)]">
            feel
          </span>
        </motion.div>
      </div>

      {/* Right side decorative elements */}
      <div className="absolute right-0 top-0 bottom-0 w-1/4 pointer-events-none z-[7] hidden lg:block">
        {/* Vertical line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="absolute right-16 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-purple-400/20 to-transparent origin-top"
        />
        
        {/* Dots along the line */}
        {[0.3, 0.5, 0.7].map((pos, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.7 + i * 0.2 }}
            className="absolute right-16 translate-x-1/2"
            style={{ top: `${pos * 100}%` }}
          >
            <div className="w-2 h-2 rounded-full bg-purple-400/30" />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              className="absolute inset-0 rounded-full bg-purple-400/20"
            />
          </motion.div>
        ))}
        
        {/* Floating text labels */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="absolute right-8 top-[35%] rotate-90 origin-center"
        >
          <span className="text-white/10 text-xs tracking-[0.4em] uppercase font-[family-name:var(--font-smooch-sans)]">
            connect
          </span>
        </motion.div>
      </div>

      {/* Floating feeling bubbles */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: [0, 0.6, 0.6, 0],
            y: [20, -20, -40, -60],
          }}
          transition={{ 
            duration: bubble.duration,
            delay: bubble.delay + 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute z-[7] pointer-events-none hidden md:block"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
          }}
        >
          <div className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
            <span className="text-xs text-white/30 font-[family-name:var(--font-smooch-sans)]">
              {bubble.feeling}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Floating emotion icons */}
      {icons.map((icon) => (
        <motion.div
          key={`icon-${icon.id}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.3, 0.3, 0],
            scale: [0.5, icon.scale, icon.scale, 0.5],
            y: [0, -30, -50, -70],
          }}
          transition={{ 
            duration: 20,
            delay: icon.delay + 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute z-[6] pointer-events-none hidden lg:block text-2xl"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
          }}
        >
          {icon.icon}
        </motion.div>
      ))}

      {/* Corner decorative circles */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute top-20 left-20 w-32 h-32 rounded-full border border-cyan-400/[0.08] pointer-events-none z-[7] hidden xl:block"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 1.7 }}
        className="absolute top-32 left-32 w-20 h-20 rounded-full border border-cyan-400/[0.05] pointer-events-none z-[7] hidden xl:block"
      />
      
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 1.6 }}
        className="absolute bottom-20 right-20 w-32 h-32 rounded-full border border-purple-400/[0.08] pointer-events-none z-[7] hidden xl:block"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-32 right-32 w-20 h-20 rounded-full border border-purple-400/[0.05] pointer-events-none z-[7] hidden xl:block"
      />

      {/* Gradient orbs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute top-1/4 left-[10%] w-64 h-64 rounded-full bg-cyan-400/[0.03] blur-3xl pointer-events-none z-[4] hidden lg:block"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.3 }}
        className="absolute bottom-1/4 right-[10%] w-64 h-64 rounded-full bg-purple-400/[0.03] blur-3xl pointer-events-none z-[4] hidden lg:block"
      />

      {/* Horizontal connecting lines */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 2.5 }}
        className="absolute top-[30%] left-0 right-0 h-px bg-gradient-to-r from-cyan-400/10 via-transparent to-purple-400/10 pointer-events-none z-[3] hidden xl:block origin-left"
      />
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 2.8 }}
        className="absolute bottom-[30%] left-0 right-0 h-px bg-gradient-to-r from-purple-400/10 via-transparent to-cyan-400/10 pointer-events-none z-[3] hidden xl:block origin-right"
      />
    </>
  );
}
