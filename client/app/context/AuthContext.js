"use client";

import { authService } from "../services/authService";
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    localStorage.setItem("token", response.data.token);
    const profileResponse = await authService.getProfile();
    setUser(profileResponse.data.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const register = async (name, email, password) => {
    await authService.register(name, email, password);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
