//src\lib\api.ts
const API_BASE_URL = 'http://localhost:3001/api';

// Interfaz para extender Error con propiedades adicionales
interface ApiError extends Error {
  status?: number;
}

class ApiClient {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Si no se puede parsear JSON, usar texto plano
          const text = await response.text();
          errorMessage = text || errorMessage;
        }
        
        const error = new Error(errorMessage) as any;
        error.status = response.status;
        throw error;
      }

      // Para respuestas vacías (204 No Content)
      if (response.status === 204) {
        return null;
      }

      return response.json();
    } catch (error) {
      console.error(`API request failed for ${url}:`, error);
      throw error;
    }
  }

  async get(endpoint: string) {
    return this.request(endpoint);
  }

  async post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, {
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

  // NUEVO MÉTODO: Obtener estado del documento
  async getDocumentStatus(id: string) {
    return this.get(`/documents/${id}/status`);
  }

  async getDocumentMetrics() {
    return this.get('/documents/metrics');
  }

  async uploadDocument(formData: FormData) {
    const url = `${API_BASE_URL}/documents/upload`;
    const token = localStorage.getItem('token');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // No Content-Type para FormData, el navegador lo establece automáticamente
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Upload failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      
      // Crear error con propiedad status
      const error: ApiError = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }

    return response.json();
  }

    // NUEVOS MÉTODOS PARA PREFERENCIAS
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

  async updateUserPreferences(data: {
    useCase: string;
    customFields?: any[];
  }) {
    return this.put('/preferences', data);
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
}

// CORRECCIÓN: Exportar la instancia de ApiClient para que sea utilizada
export const apiClient = new ApiClient();

// Función auxiliar para verificar si un error es de tipo ApiError
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof Error && 'status' in error;
};