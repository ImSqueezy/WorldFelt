"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export function AuthModal({ isOpen, onClose, initialMode = "signup" }: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Reset form and sync mode when modal opens/closes or initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setFormData({ name: "", email: "", password: "" });
      setShowPassword(false);
      setError("");
    }
  }, [isOpen, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Test credentials: test / test
    if (formData.email === "test" && formData.password === "test") {
      // Save auth to localStorage
      localStorage.setItem("worldfelt_auth", JSON.stringify({ user: "Test User", email: "test" }));
      setIsLoading(false);
      onClose();
      router.push("/globe");
    } else if (mode === "signup") {
      // For signup, just accept any credentials for testing
      localStorage.setItem("worldfelt_auth", JSON.stringify({ user: formData.name || "User", email: formData.email }));
      setIsLoading(false);
      onClose();
      router.push("/globe");
    } else {
      setError("Invalid credentials. Use test / test to login.");
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
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

                {/* Name field (signup only) */}
                <AnimatePresence mode="wait">
                  {mode === "signup" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input
                          type="text"
                          name="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          className={cn(
                            "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl",
                            "pl-12 pr-4 py-3.5 text-white placeholder:text-white/30",
                            "font-[family-name:var(--font-smooch-sans)] text-base",
                            "focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.05]",
                            "transition-all duration-200"
                          )}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email field */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type={mode === "login" ? "text" : "email"}
                    name="email"
                    placeholder={mode === "login" ? "Username (try: test)" : "Email address"}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={cn(
                      "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl",
                      "pl-12 pr-4 py-3.5 text-white placeholder:text-white/30",
                      "font-[family-name:var(--font-smooch-sans)] text-base",
                      "focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.05]",
                      "transition-all duration-200"
                    )}
                  />
                </div>

                {/* Password field */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={mode === "login" ? "Password (try: test)" : "Password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
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

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-white/30 text-xs font-[family-name:var(--font-smooch-sans)]">or</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>

              {/* Social login */}
              <button
                type="button"
                className={cn(
                  "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl",
                  "py-3.5 text-white/70 font-[family-name:var(--font-smooch-sans)]",
                  "hover:bg-white/[0.06] hover:border-white/[0.12]",
                  "transition-all duration-200",
                  "flex items-center justify-center gap-3"
                )}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

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

              {/* Terms (signup only) */}
              {mode === "signup" && (
                <p className="text-center mt-4 text-white/25 text-xs font-[family-name:var(--font-smooch-sans)] leading-relaxed">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="text-cyan-400/70 hover:text-cyan-400">Terms</a>
                  {" "}and{" "}
                  <a href="#" className="text-cyan-400/70 hover:text-cyan-400">Privacy Policy</a>
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
