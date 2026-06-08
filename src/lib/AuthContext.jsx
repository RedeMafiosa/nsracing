import React, { createContext, useState, useContext, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);

  // 🔥 INIT AUTH (SÓ ISTO IMPORTA)
  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);

      const me = await base44.auth.me();

      setUser(me);
      setIsAuthenticated(true);
      setAuthError(null);
    } catch (e) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  useEffect(() => {
    checkUserAuth();
  }, []);

  // 🔥 LOGOUT LIMPO (SEM REDIRECT MÁGICO DO SDK)
  const logout = async () => {
    try {
      await base44.auth.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setAuthChecked(true);
      window.location.href = "/login";
    }
  };

  const navigateToLogin = () => {
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        authChecked,
        authError,
        checkUserAuth,
        logout,
        navigateToLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
