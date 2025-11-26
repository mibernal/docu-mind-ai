// src/lib/api.ts
const API_BASE_URL = 'http://localhost:3001/api';

// Interfaz para extender Error con propiedades adicionales
interface ApiError extends Error {
  status?: number;
}

class ApiClient {
  private token: string | null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Clonar la respuesta antes de leerla para evitar "body stream already read"
      const responseClone = response.clone();
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await responseClone.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // Si no se puede parsear JSON, usar texto plano
          try {
            const text = await responseClone.text();
            errorMessage = text || errorMessage;
          } catch {
            // Si no se puede leer como texto, mantener el mensaje original
          }
        }
        
        const error = new Error(errorMessage) as ApiError;
        error.status = response.status;
        throw error;
      }

      // Para respuestas vacías (204 No Content)
      if (response.status === 204) {
        return null as T;
      }

      return response.json();
    } catch (error) {
      console.error(`API request failed for ${url}:`, error);
      throw error;
    }
  }

  async get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T = any>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T = any>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async getDocuments(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }
    
    const endpoint = `/documents${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.get(endpoint);
  }

  async getDocument(id: string) {
    return this.get(`/documents/${id}`);
  }

  // MÉTODO: Obtener estado del documento
  async getDocumentStatus(id: string) {
    return this.get(`/documents/${id}/status`);
  }

  async getDocumentMetrics() {
    try {
      return await this.get<{
        stats: {
          totalDocuments: number;
          successRate: number;
          timeSaved: number;
          documentsByType: Array<{ type: string; count: number }>;
        }
      }>('/dashboard/metrics');
    } catch (error: any) {
      // Si el endpoint no existe (404), devolver datos mock
      if (error?.status === 404) {
        console.warn('Dashboard metrics endpoint not found, using mock data');
        return {
          stats: {
            totalDocuments: 0,
            successRate: 0,
            timeSaved: 0,
            documentsByType: []
          }
        };
      }
      throw error;
    }
  }

  // Métodos para plantillas
  async getTemplates() {
    return this.get<{ templates: any[] }>('/templates');
  }

  async createTemplate(templateData: any) {
    return this.post<{ template: any }>('/templates', templateData);
  }

  async uploadDocument(formData: FormData) {
    const url = `${API_BASE_URL}/documents/upload`;
    const token = this.token;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Upload failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        try {
          const text = await response.text();
          errorMessage = text || errorMessage;
        } catch {
          // Mantener el mensaje por defecto
        }
      }
      
      const error: ApiError = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }

    return response.json();
  }

  // MÉTODOS PARA PREFERENCIAS
  async setUserPreferences(data: {
    useCase: string;
    customFields?: any[];
    documentTypes?: string[];
  }) {
    return this.post('/preferences/onboarding', data);
  }

  async getUserPreferences() {
    return this.get('/preferences');
  }

  async updateUserPreferences(preferences: any) {
    return this.put<{ user: any }>('/user/preferences', { preferences });
  }

  async getPredefinedTemplates() {
    return this.get('/preferences/templates/predefined');
  }

  async addCustomField(data: {
    name: string;
    type: string;
    description?: string;
  }) {
    return this.post('/preferences/custom-fields', data);
  }

  async deleteCustomField(id: string) {
    return this.delete(`/preferences/custom-fields/${id}`);
  }

  // Métodos de autenticación
  async login(credentials: { email: string; password: string }) {
    const result = await this.post<{ token: string; user: any }>('/auth/login', credentials);
    if (result.token) {
      this.setToken(result.token);
    }
    return result;
  }

  async register(userData: { name: string; email: string; password: string }) {
    const result = await this.post<{ token: string; user: any }>('/auth/register', userData);
    if (result.token) {
      this.setToken(result.token);
    }
    return result;
  }

  async getCurrentUser() {
    return this.get<{ user: any }>('/auth/me');
  }

  // Actualizar token cuando se loguea
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Remover token al logout
  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }
}

// Exportar una instancia única de ApiClient
export const apiClient = new ApiClient();

// Función auxiliar para verificar si un error es de tipo ApiError
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof Error && 'status' in error;
};