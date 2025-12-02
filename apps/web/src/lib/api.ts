// apps/web/src/lib/api.ts
const DEFAULT_API = (import.meta.env.VITE_API_URL as string) || '/api'; // usar proxy por defecto

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
      ? { ...(options.headers || {}), ...authHeader } // don't set Content-Type for FormData
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
      // fallo de red (server caído, CORS, conexión rehusada, etc.)
      const err = new Error(`Network error or server unreachable: ${fetchErr.message}`);
      (err as any).status = 0;
      throw err;
    }

    if (!response.ok) {
      // intenta leer cuerpo de error si hay uno
      let bodyText = '';
      try {
        bodyText = await response.text();
      } catch (e) {
        /* ignore */
      }
      const msg = `HTTP error! status: ${response.status} ${response.statusText}${bodyText ? ' - ' + bodyText : ''}`;
      const err: any = new Error(msg);
      err.status = response.status;
      throw err;
    }

    // 204 No Content
    if (response.status === 204) return null;

    // intentar parsear JSON, si no es JSON devolver texto
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

  uploadDocument(formData: FormData) {
    return this.request('documents', {
      method: 'POST',
      // DO NOT set Content-Type - browser sets the boundary for FormData
      body: formData,
    });
  },

  getDocument(documentId: string) {
    return this.get(`documents/${documentId}`);
  },

  getDocumentStatus(documentId: string) {
    return this.get(`documents/${documentId}/status`);
  },

  getDocumentMetrics() {
    return this.get('documents/metrics');
  },

  getDocuments(options?: { limit?: number; page?: number }) {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.page) params.append('page', options.page.toString());
    const query = params.toString();
    return this.get(`documents${query ? '?' + query : ''}`);
  },
};

export const api = apiClient;
export default apiClient;
