export interface User {
  id: string;
  email: string;
  name: string;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  defaultTemplate?: string;
  preferredAIEngine: 'gemini' | 'openai' | 'fallback';
  confidenceThreshold: number;
  autoExport: boolean;
  exportFormat: 'json' | 'csv' | 'excel';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}
