"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const savedLoggedIn = localStorage.getItem("isLoggedIn");
    const savedUsername = localStorage.getItem("username");

    if (savedLoggedIn === "true" && savedUsername) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
    }
  }, []);

  const login = (username: string) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username);
    setIsLoggedIn(true);
    setUsername(username);
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
