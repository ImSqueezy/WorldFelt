"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShinyButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ShinyButton({
  children,
  className,
  onClick,
  disabled,
}: ShinyButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative px-16 sm:px-20 md:px-24 py-4 rounded-full",
        "bg-white/[0.03] backdrop-blur-sm",
        "border border-white/[0.08]",
        "text-white/70 text-base sm:text-lg font-light tracking-[0.2em] uppercase",
        "hover:bg-white/[0.06] hover:border-white/[0.12] hover:text-white/90",
        "transition-all duration-500 ease-out",
        className
      )}
    >
      {/* Subtle shine effect */}
      <span className="absolute inset-0 rounded-full overflow-hidden">
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut",
          }}
        />
      </span>
      <span className="relative">{children}</span>
    </motion.button>
  );
}
