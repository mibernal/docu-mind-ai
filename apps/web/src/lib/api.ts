// Cliente API para el frontend - usa fetch para comunicarse con el backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const isFormData = options.body instanceof FormData;
    const config = {
      headers: isFormData ? { ...options.headers } : {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  get(endpoint: string) {
    return this.request(endpoint);
  },

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  },

  uploadDocument(formData: FormData) {
    return this.request('/documents', {
      method: 'POST',
      headers: {},
      body: formData,
    });
  },

  getDocument(documentId: string) {
    return this.get(`/documents/${documentId}`);
  },

  getDocumentStatus(documentId: string) {
    return this.get(`/documents/${documentId}/status`);
  },

  getDocumentMetrics() {
    return this.get('/documents/metrics');
  },

  getDocuments(options?: { limit?: number; page?: number }) {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.page) params.append('page', options.page.toString());
    const query = params.toString();
    return this.get(`/documents${query ? '?' + query : ''}`);
  },
};

// Exportar tanto apiClient como api para compatibilidad
export const api = apiClient;
export default apiClient;