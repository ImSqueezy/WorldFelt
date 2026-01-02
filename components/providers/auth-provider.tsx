"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AuthModal } from "@/components/ui/auth-modal";

interface AuthContextType {
  openAuth: (mode?: "login" | "signup") => void;
  closeAuth: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("signup");

  const openAuth = (authMode: "login" | "signup" = "signup") => {
    setMode(authMode);
    setIsOpen(true);
  };

  const closeAuth = () => {
    setIsOpen(false);
  };

  return (
    <AuthContext.Provider value={{ openAuth, closeAuth }}>
      {children}
      <AuthModal isOpen={isOpen} onClose={closeAuth} initialMode={mode} />
    </AuthContext.Provider>
  );
}
