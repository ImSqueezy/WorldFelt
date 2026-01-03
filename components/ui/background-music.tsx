"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2 } from "lucide-react";

export function BackgroundMusic() {
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setIsMounted(true);
    
    const startMusic = async () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
        
        try {
          // Try to play immediately
          await audioRef.current.play();
        } catch (error) {
          // Autoplay blocked - silently wait for any user interaction
          const playOnInteraction = async () => {
            if (audioRef.current) {
              try {
                await audioRef.current.play();
              } catch (e) {
                // Ignore
              }
            }
          };
          
          // Listen for any interaction without blocking UI
          const events = ['click', 'touchstart', 'keydown', 'scroll'];
          const handler = () => {
            playOnInteraction();
            events.forEach(event => document.removeEventListener(event, handler));
          };
          
          events.forEach(event => document.addEventListener(event, handler, { once: true }));
        }
      }
    };

    setTimeout(startMusic, 100);
  }, []);

  if (!isMounted) return null;

  return (
    <audio
      ref={audioRef}
      loop
      autoPlay
      preload="auto"
      className="hidden"
    >
      <source src="/lost in thoughts for 1 hour.mp3" type="audio/mpeg" />
    </audio>
  );
}
