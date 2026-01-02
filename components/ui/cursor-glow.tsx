"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CursorGlow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on desktop (non-touch devices)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[3] mix-blend-screen"
      style={{
        left: mousePosition.x - 150,
        top: mousePosition.y - 150,
      }}
    >
      {/* Outer glow */}
      <div 
        className="w-[300px] h-[300px] rounded-full opacity-[0.1]"
        style={{
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.6) 0%, rgba(34, 211, 238, 0.2) 30%, transparent 70%)",
        }}
      />
      {/* Inner glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] rounded-full opacity-[0.2]"
        style={{
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(34, 211, 238, 0.5) 40%, transparent 70%)",
        }}
      />
    </div>
  );
}
