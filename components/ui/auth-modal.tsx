"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: "login" | "signup";
}

export function AuthModal({ isOpen, onClose, onSuccess, initialMode = "signup" }: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    username: "",
    passcode: "",
  });

  // Reset form and sync mode when modal opens/closes or initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setFormData({ username: "", passcode: "" });
      setShowPassword(false);
      setError("");
    }
  }, [isOpen, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: formData.username, 
          passcode: formData.passcode 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        setIsLoading(false);
        return;
      }

      // Save token and username
      localStorage.setItem("worldfelt_token", data.token);
      localStorage.setItem("worldfelt_username", data.user.username);
      localStorage.setItem("worldfelt_auth", JSON.stringify({ user: data.user.username, userId: data.user.id }));
      setIsLoading(false);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
        router.push("/globe");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6"
          >
            <div className="relative bg-zinc-950 border border-white/[0.08] rounded-3xl p-8 shadow-2xl overflow-hidden">
              {/* Decorative gradient orbs */}
              <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-cyan-400/[0.05] blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-purple-400/[0.05] blur-3xl pointer-events-none" />
              
              {/* Decorative corner lines */}
              <div className="absolute top-0 left-8 w-px h-16 bg-gradient-to-b from-cyan-400/20 to-transparent" />
              <div className="absolute top-8 left-0 h-px w-16 bg-gradient-to-r from-cyan-400/20 to-transparent" />
              <div className="absolute bottom-0 right-8 w-px h-16 bg-gradient-to-t from-purple-400/20 to-transparent" />
              <div className="absolute bottom-8 right-0 h-px w-16 bg-gradient-to-l from-purple-400/20 to-transparent" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5 text-white/40" />
              </button>

              {/* Header */}
              <div className="text-center mb-8 relative">
                {/* Floating sparkles */}
                <motion.span
                  animate={{ 
                    y: [0, -5, 0],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-2 left-1/4 text-xs text-cyan-400/40"
                >
                  ✦
                </motion.span>
                <motion.span
                  animate={{ 
                    y: [0, -4, 0],
                    opacity: [0.2, 0.5, 0.2]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -top-1 right-1/4 text-[10px] text-purple-400/40"
                >
                  ✦
                </motion.span>
                
                <h2 className="text-3xl font-thin text-white font-[family-name:var(--font-smooch-sans)] tracking-wide mb-2">
                  {mode === "login" ? "Welcome back" : "Join"}{" "}
                  <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent font-medium">
                    Worldfelt
                  </span>
                </h2>
                <p className="text-white/40 text-sm font-[family-name:var(--font-smooch-sans)]">
                  {mode === "login" 
                    ? "Share how you feel with the world" 
                    : "Start sharing your feelings globally"
                  }
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-[family-name:var(--font-smooch-sans)] text-center"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Username field */}
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username (at least 3 characters)"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength={3}
                    className={cn(
                      "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl",
                      "pl-12 pr-4 py-3.5 text-white placeholder:text-white/30",
                      "font-[family-name:var(--font-smooch-sans)] text-base",
                      "focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.05]",
                      "transition-all duration-200"
                    )}
                  />
                </div>

                {/* Passcode field */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="passcode"
                    placeholder="Passcode (at least 4 characters)"
                    value={formData.passcode}
                    onChange={handleChange}
                    required
                    minLength={4}
                    className={cn(
                      "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl",
                      "pl-12 pr-12 py-3.5 text-white placeholder:text-white/30",
                      "font-[family-name:var(--font-smooch-sans)] text-base",
                      "focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.05]",
                      "transition-all duration-200"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Forgot password (login only) */}
                {mode === "login" && (
                  <div className="text-right">
                    <button
                      type="button"
                      className="text-sm text-cyan-400/70 hover:text-cyan-400 font-[family-name:var(--font-smooch-sans)] transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full relative overflow-hidden rounded-xl py-3.5 mt-6",
                    "bg-gradient-to-r from-cyan-500 to-blue-500",
                    "text-white font-medium font-[family-name:var(--font-smooch-sans)]",
                    "tracking-wide text-base",
                    "hover:from-cyan-400 hover:to-blue-400",
                    "focus:outline-none focus:ring-2 focus:ring-cyan-400/50",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "transition-all duration-200",
                    "flex items-center justify-center gap-2"
                  )}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      {mode === "login" ? "Sign In" : "Create Account"}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Switch mode */}
              <p className="text-center mt-6 text-white/40 text-sm font-[family-name:var(--font-smooch-sans)]">
                {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
