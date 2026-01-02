"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function WorldfeltHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center"
    >
      <div className="relative mt-4 sm:mt-6">
        {/* Main nav bar */}
        <div className="px-5 sm:px-6 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm flex items-center gap-6 sm:gap-8">
          
          {/* Logo / Brand */}
          <span className="text-white/80 text-base font-extralight tracking-wide font-[family-name:var(--font-smooch-sans)]">
            World<span className="text-cyan-400/90 font-normal">felt</span>
          </span>

          {/* Separator */}
          <div className="hidden md:block w-px h-4 bg-white/10" />

          {/* Right side nav - hidden on mobile */}
          <nav className="hidden md:flex items-center gap-5">
            <motion.a
              href="#"
              whileHover={{ opacity: 0.9 }}
              className="text-white/40 text-sm font-light tracking-wide hover:text-white/70 transition-colors duration-300"
            >
              About
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ opacity: 0.9 }}
              className="text-white/40 text-sm font-light tracking-wide hover:text-white/70 transition-colors duration-300"
            >
              How it works
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ opacity: 0.9 }}
              className="px-4 py-1.5 rounded-full bg-white/[0.06] text-white/60 text-sm font-light tracking-wide hover:bg-white/[0.1] hover:text-white/80 transition-all duration-300"
            >
              Sign in
            </motion.a>
          </nav>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white/50 hover:text-white/80 transition-colors duration-300"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {mobileMenuOpen ? (
                <>
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </>
              ) : (
                <>
                  <path d="M4 8h16" />
                  <path d="M4 16h16" />
                </>
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile dropdown menu - positioned below the nav bar */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-3 rounded-2xl bg-zinc-900/95 border border-white/[0.08] backdrop-blur-md flex flex-col gap-1"
            >
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/60 text-sm font-light tracking-wide hover:text-white/90 hover:bg-white/[0.05] transition-all py-2.5 px-4 rounded-xl"
              >
                About
              </a>
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/60 text-sm font-light tracking-wide hover:text-white/90 hover:bg-white/[0.05] transition-all py-2.5 px-4 rounded-xl"
              >
                How it works
              </a>
              <div className="h-px bg-white/[0.06] my-1" />
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="text-cyan-400/80 text-sm font-light tracking-wide hover:text-cyan-300 hover:bg-white/[0.05] transition-all py-2.5 px-4 rounded-xl"
              >
                Sign in
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}