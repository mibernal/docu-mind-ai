//apps\web\src\lib\api.ts
const DEFAULT_API = (import.meta.env.VITE_API_URL as string) || '/api';

let authHeader: Record<string, string> = {};

export function setAuthToken(token?: string | null) {
  if (token) {
    authHeader['Authorization'] = `Bearer ${token}`;
  } else {
    delete authHeader['Authorization'];
  }
}

function joinUrl(base: string, endpoint: string) {
  const b = base.replace(/\/$/, '');
  const e = endpoint.replace(/^\//, '');
  return `${b}/${e}`;
}

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = joinUrl(DEFAULT_API, endpoint);

    const isFormData = options.body instanceof FormData;
    const headers = isFormData
      ? { ...(options.headers || {}), ...authHeader }
      : {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
          ...authHeader,
        };

    const config: RequestInit = {
      ...options,
      headers,
    };

    let response: Response;
    try {
      response = await fetch(url, config);
    } catch (fetchErr: any) {
      const err = new Error(
        `Network error or server unreachable: ${fetchErr.message}`
      );
      (err as any).status = 0;
      throw err;
    }

    if (!response.ok) {
      let bodyText = '';
      try {
        bodyText = await response.text();
      } catch (_) {}

      const msg = `HTTP error! status: ${response.status} ${response.statusText}${
        bodyText ? ' - ' + bodyText : ''
      }`;
      const err: any = new Error(msg);
      err.status = response.status;
      throw err;
    }

    if (response.status === 204) return null;

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    }

    return response.text();
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

    deleteDocument(id: string) {
    return this.delete(`/documents/${id}`);
  },


  // MÉTODOS ESPECÍFICOS PARA DOCUMENTOS
  getDocumentMetrics() {
    return this.get('/documents/metrics');
  },

  getDocuments(options?: { 
  page?: number; 
  limit?: number; 
  type?: string; 
  status?: string; 
  search?: string 
}) {
  const params = new URLSearchParams();
  if (options?.page) params.append('page', String(options.page));
  if (options?.limit) params.append('limit', String(options.limit));
  if (options?.type && options.type !== 'all') params.append('type', options.type);
  if (options?.status && options.status !== 'all') params.append('status', options.status);
  if (options?.search) params.append('search', options.search);
  
  const query = params.toString();
  return this.get(`/documents${query ? '?' + query : ''}`);
},

  getDocument(id: string) {
    return this.get(`/documents/${id}`);
  },

  getDocumentStatus(id: string) {
    return this.get(`/documents/${id}/status`);
  },

  uploadDocument(formData: FormData) {
    return this.request('/documents/upload', {
      method: 'POST',
      body: formData,
    });
  },

  // MÉTODOS PARA PLANTILLAS
  getTemplates() {
    return this.get('/templates');
  },

  createTemplate(data: any) {
    return this.post('/templates', data);
  },

  updateTemplate(id: string, data: any) {
    return this.put(`/templates/${id}`, data);
  },

  deleteTemplate(id: string) {
    return this.delete(`/templates/${id}`);
  },

  // MÉTODOS PARA USUARIO
  getUserProfile() {
    return this.get('/users/profile');
  },

  updateUserPreferences(data: any) {
    return this.put('/users/preferences', data);
  },

  // ONBOARDING / PREFERENCIAS
  updateOnboarding(data: any) {
    // Si quieres actualizar las preferencias existentes
    return this.put('/users/preferences', data);
  },

  // Registro inicial (onboarding) — crear preferencias
  createOnboarding(data: any) {
    return this.post('/users/preferences/onboarding', data);
  },


  // MÉTODOS DE AUTENTICACIÓN
  login(email: string, password: string) {
    return this.post('/auth/login', { email, password });
  },

  register(name: string, email: string, password: string) {
    return this.post('/auth/register', { name, email, password });
  },

  verifyEmail(token: string) {
    return this.get(`/auth/verify-email?token=${token}`);
  },

  forgotPassword(email: string) {
    return this.post('/auth/forgot-password', { email });
  },

  resetPassword(token: string, password: string) {
    return this.post('/auth/reset-password', { token, password });
  },

  logout() {
    return this.post('/auth/logout', {});
  },
};

export default apiClient;
export const api = apiClient;