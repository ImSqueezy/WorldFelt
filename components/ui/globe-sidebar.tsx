"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronRight, Send, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

const FEELING_OPTIONS = [
  { feeling: "peaceful", color: "#22d3ee", emoji: "🌙" },
  { feeling: "hopeful", color: "#a78bfa", emoji: "✨" },
  { feeling: "grateful", color: "#34d399", emoji: "💫" },
  { feeling: "tender", color: "#fb7185", emoji: "🌸" },
  { feeling: "calm", color: "#38bdf8", emoji: "🌊" },
  { feeling: "reflective", color: "#fbbf24", emoji: "💭" },
  { feeling: "tired", color: "#94a3b8", emoji: "🌫️" },
  { feeling: "anxious", color: "#f472b6", emoji: "🌀" },
];

const RECENT_FEELINGS = [
  { user: "someone in Tokyo", feeling: "grateful", time: "2m ago", emoji: "💫" },
  { user: "someone in Paris", feeling: "peaceful", time: "5m ago", emoji: "🌙" },
  { user: "someone in NYC", feeling: "hopeful", time: "8m ago", emoji: "✨" },
  { user: "someone in Sydney", feeling: "calm", time: "12m ago", emoji: "🌊" },
];

export function GlobeSidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const handleShare = () => {
    if (!selectedFeeling) return;
    // Handle sharing logic here
    console.log("Sharing:", { feeling: selectedFeeling, message });
    setSelectedFeeling(null);
    setMessage("");
  };

  return (
    <>
      {/* Toggle button when collapsed */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => setIsExpanded(true)}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-zinc-900/90 border border-white/[0.08] hover:bg-zinc-800/90 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white/60" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isExpanded && (
          <motion.aside
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-30 w-80"
          >
            <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-6 w-px h-12 bg-gradient-to-b from-cyan-400/30 to-transparent" />
              <div className="absolute top-6 left-0 h-px w-12 bg-gradient-to-r from-cyan-400/30 to-transparent" />
              <div className="absolute bottom-0 right-6 w-px h-12 bg-gradient-to-t from-purple-400/30 to-transparent" />
              <div className="absolute bottom-6 right-0 h-px w-12 bg-gradient-to-l from-purple-400/30 to-transparent" />

              {/* Header */}
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium font-[family-name:var(--font-smooch-sans)] text-lg">
                    How are you feeling?
                  </h3>
                  <p className="text-white/40 text-xs font-[family-name:var(--font-smooch-sans)]">
                    Share with the world
                  </p>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-white/40 rotate-180" />
                </button>
              </div>

              {/* Feeling selector */}
              <div className="p-4 border-b border-white/[0.08]">
                <div className="grid grid-cols-4 gap-2">
                  {FEELING_OPTIONS.map((option) => (
                    <motion.button
                      key={option.feeling}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedFeeling(option.feeling)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                        selectedFeeling === option.feeling
                          ? "bg-white/[0.1] border border-white/[0.15]"
                          : "hover:bg-white/[0.05]"
                      )}
                    >
                      <span className="text-xl">{option.emoji}</span>
                      <span 
                        className="text-[10px] font-[family-name:var(--font-smooch-sans)]"
                        style={{ color: selectedFeeling === option.feeling ? option.color : "rgba(255,255,255,0.5)" }}
                      >
                        {option.feeling}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Message input */}
                <AnimatePresence>
                  {selectedFeeling && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3"
                    >
                      <div className="relative">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Add a thought (optional)"
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-2.5 pr-10 text-white text-sm placeholder:text-white/30 font-[family-name:var(--font-smooch-sans)] focus:outline-none focus:border-cyan-400/50"
                        />
                        <Smile className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleShare}
                        className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium font-[family-name:var(--font-smooch-sans)] hover:from-cyan-400 hover:to-blue-400 transition-all"
                      >
                        <Send className="w-4 h-4" />
                        Share Feeling
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Recent feelings feed */}
              <div className="p-4 max-h-64 overflow-y-auto">
                <h4 className="text-white/40 text-xs uppercase tracking-wider font-[family-name:var(--font-smooch-sans)] mb-3">
                  Recent feelings nearby
                </h4>
                <div className="space-y-3">
                  {RECENT_FEELINGS.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors"
                    >
                      <span className="text-lg">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/70 text-sm font-[family-name:var(--font-smooch-sans)] truncate">
                          {item.user}
                        </p>
                        <p className="text-white/40 text-xs font-[family-name:var(--font-smooch-sans)]">
                          feeling {item.feeling} · {item.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
