"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type NavItem = "map" | "share" | "me";

interface NavButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}

function NavButton({ isActive, onClick, label, children }: NavButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      className={`
        relative p-3.5 rounded-2xl transition-all duration-300 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
        ${isActive 
          ? "text-cyan-300" 
          : "text-white/35 hover:text-white/60 hover:bg-white/[0.04]"
        }
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {/* Active indicator - gradient glow behind */}
      {isActive && (
        <motion.div
          layoutId="activeGlow"
          className="absolute inset-0 rounded-2xl bg-gradient-to-b from-cyan-400/20 to-cyan-400/5 border border-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      
      {/* Icon */}
      <span className="relative z-10">{children}</span>
      
      {/* Tooltip on hover */}
      <span className="
        absolute -top-9 left-1/2 -translate-x-1/2
        px-3 py-1.5 rounded-lg
        text-[11px] font-medium text-white/80 bg-white/[0.08] backdrop-blur-xl border border-white/[0.1]
        opacity-0 group-hover:opacity-100
        pointer-events-none transition-opacity duration-200
        whitespace-nowrap shadow-lg
      ">
        {label}
      </span>
    </motion.button>
  );
}

// Minimal, calm icons
function MapIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function ShareFeelIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M17.66 17.66l1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M4.93 19.07l1.41-1.41" />
      <path d="M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

interface WorldfeltNavProps {
  className?: string;
}

export function WorldfeltNav({ className }: WorldfeltNavProps) {
  const [active, setActive] = useState<NavItem>("map");

  return (
    <motion.nav
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut", delay: 0.5 }}
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        ${className || ""}
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="
        flex items-center gap-1 px-2 py-2
        bg-white/[0.04] backdrop-blur-md
        border border-white/[0.06]
        rounded-2xl
        shadow-[0_4px_24px_rgba(0,0,0,0.15)]
      ">
        <NavButton
          isActive={active === "map"}
          onClick={() => setActive("map")}
          label="Map"
        >
          <MapIcon />
        </NavButton>

        <NavButton
          isActive={active === "share"}
          onClick={() => setActive("share")}
          label="Share feeling"
        >
          <ShareFeelIcon />
        </NavButton>

        <NavButton
          isActive={active === "me"}
          onClick={() => setActive("me")}
          label="Me"
        >
          <MeIcon />
        </NavButton>
      </div>
    </motion.nav>
  );
}

export default WorldfeltNav;
