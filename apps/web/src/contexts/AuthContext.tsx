//apps\web\src\contexts\AuthContext.tsx
import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from 'react';
import apiClient, { setAuthToken } from '@/lib/api';
import { User } from '../types';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [isLoading, setIsLoading] = useState(true);
  const hasFetchedUser = useRef(false);

  // 🔥 aplicar token al cargar
  useEffect(() => {
    setAuthToken(token || undefined);
  }, [token]);

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

      if (response?.user) {
        setUser(response.user);
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      setTokenState(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/auth/login', { email, password });

      const authToken = response?.token;
      const userData = response?.user;

      if (!authToken) throw new Error('Auth token missing');

      setTokenState(authToken);
      localStorage.setItem('token', authToken);
      setAuthToken(authToken);

      setUser(userData);
      hasFetchedUser.current = true;
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
        password,
      });

      const authToken = response?.token;
      const userData = response?.user;

      if (!authToken) throw new Error('Auth token missing');

      setTokenState(authToken);
      localStorage.setItem('token', authToken);
      setAuthToken(authToken);

      setUser(userData);
      hasFetchedUser.current = true;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    setTokenState(null);
    setAuthToken(undefined);
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
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};