import { createContext, useState, useEffect, useRef, ReactNode } from 'react';
import { apiClient } from "../lib/api";
import { User } from "../types";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const hasFetchedUser = useRef(false);

  useEffect(() => {
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
      const response = await apiClient.get('/auth/me');
      
      // VERIFICAR LA ESTRUCTURA DE LA RESPUESTA
      if (response && response.user) {
        setUser(response.user);
      } else if (response && response.data) {
        // Si la API usa response.data
        setUser(response.data.user || response.data);
      } else {
        console.error('Estructura de respuesta inesperada:', response);
        throw new Error('Estructura de respuesta inesperada');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // Limpiar token si hay error de autenticación
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/auth/login', { email, password });
      
      // VERIFICAR Y ADAPTAR A LA ESTRUCTURA REAL DE LA API
      let authToken, userData;
      
      if (response && response.token) {
        authToken = response.token;
        userData = response.user;
      } else if (response && response.data) {
        authToken = response.data.token;
        userData = response.data.user;
      } else {
        throw new Error('Estructura de respuesta inesperada');
      }

      if (!authToken) {
        throw new Error('No se recibió token de autenticación');
      }

      setToken(authToken);
      setUser(userData);
      localStorage.setItem('token', authToken);
      hasFetchedUser.current = true;
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-lanzar el error para manejarlo en el componente
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/auth/register', { 
        name, 
        email, 
        password 
      });

      // VERIFICAR Y ADAPTAR A LA ESTRUCTURA REAL DE LA API
      let authToken, userData;
      
      if (response && response.token) {
        authToken = response.token;
        userData = response.user;
      } else if (response && response.data) {
        authToken = response.data.token;
        userData = response.data.user;
      } else {
        throw new Error('Estructura de respuesta inesperada');
      }

      if (!authToken) {
        throw new Error('No se recibió token de autenticación');
      }

      setToken(authToken);
      setUser(userData);
      localStorage.setItem('token', authToken);
      hasFetchedUser.current = true;
    } catch (error) {
      console.error('Registration error:', error);
      throw error; // Re-lanzar el error para manejarlo en el componente
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};