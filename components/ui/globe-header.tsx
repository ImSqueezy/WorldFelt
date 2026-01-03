"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LogOut, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function GlobeHeader() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Get audio element from parent if it exists
    const audio = document.querySelector('audio') as HTMLAudioElement;
    if (audio) {
      audioRef.current = audio;
      setIsPlaying(!audio.paused);
    }
  }, []);

  const toggleMusic = () => {
    const audio = document.querySelector('audio') as HTMLAudioElement;
    if (audio) {
      if (audio.paused) {
        audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed top-0 left-0 right-0 z-30 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <span className="text-2xl font-medium text-white font-[family-name:var(--font-orbitron)] tracking-tight">
            World
          </span>
          <span className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent font-[family-name:var(--font-orbitron)] tracking-tight">
            Felt
          </span>
        </motion.div>

        {/* Center status */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-emerald-400"
            />
            <span className="text-white/40 text-sm font-[family-name:var(--font-smooch-sans)]">
              Live · <span className="text-cyan-400/70">12,847</span> feelings shared
            </span>
          </div>
        </div>

        {/* Logout and Sound buttons */}
        <div className="flex items-center gap-2">
          {/* Sound toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMusic}
            className="flex items-center justify-center w-9 h-9 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] transition-colors text-white/60 hover:text-white"
            aria-label={isPlaying ? "Mute music" : "Play music"}
          >
            {isPlaying ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </motion.button>
          
          {/* Exit button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] transition-colors text-white/60 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-[family-name:var(--font-smooch-sans)] hidden sm:block">
              Exit
            </span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
