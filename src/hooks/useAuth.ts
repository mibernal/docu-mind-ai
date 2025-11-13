// src/hooks/useAuth.ts
import { useState, useEffect, createContext, useContext, ReactNode, useRef } from 'react';
import { apiClient } from '../lib/api';
import { User } from '../types';
import React from 'react';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  
  // 🔥 CORRECCIÓN CRÍTICA: Evitar bucles infinitos
  const hasFetchedUser = useRef(false);

  useEffect(() => {
    // Solo ejecutar si hay token y no se ha hecho la petición antes
    if (token && !hasFetchedUser.current) {
      hasFetchedUser.current = true;
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get('/auth/me');
      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // 🔥 CORRECCIÓN: Solo limpiar si es un error de autenticación
      if (error instanceof Error && error.message.includes('401')) {
        localStorage.removeItem('token');
        setToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await apiClient.post('/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      // Resetear el flag para futuras verificaciones
      hasFetchedUser.current = true;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await apiClient.post('/auth/register', { name, email, password });
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      // Resetear el flag para futuras verificaciones
      hasFetchedUser.current = true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    // Resetear el flag al hacer logout
    hasFetchedUser.current = false;
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: value },
    children
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};