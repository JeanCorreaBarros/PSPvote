// API service to handle all fetch requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}

async function apiCall<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

// Votantes endpoints
export const votantesApi = {
  getAll: () => apiCall('/votantes'),
  getById: (id: number) => apiCall(`/votantes/${id}`),
  create: (data: any) => apiCall('/votantes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/votantes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/votantes/${id}`, { method: 'DELETE' }),
}

// Puestos endpoints
export const puestosApi = {
  getAll: () => apiCall('/puestos'),
  getById: (id: number) => apiCall(`/puestos/${id}`),
  create: (data: any) => apiCall('/puestos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/puestos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/puestos/${id}`, { method: 'DELETE' }),
}

// Registro de votos endpoints
export const votosApi = {
  getAll: () => apiCall('/votos'),
  getById: (id: number) => apiCall(`/votos/${id}`),
  create: (data: any) => apiCall('/votos', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => apiCall(`/votos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall(`/votos/${id}`, { method: 'DELETE' }),
}

// Reportes endpoints
export const reportesApi = {
  getResumen: () => apiCall('/reportes/resumen'),
  getPorPuesto: () => apiCall('/reportes/por-puesto'),
  getPorGenero: () => apiCall('/reportes/por-genero'),
  getPorEdad: () => apiCall('/reportes/por-edad'),
  exportarCSV: () => apiCall('/reportes/export-csv'),
  exportarPDF: () => apiCall('/reportes/export-pdf'),
}

// Configuración endpoints
export const configuracionApi = {
  get: () => apiCall('/configuracion'),
  update: (data: any) => apiCall('/configuracion', { method: 'PUT', body: JSON.stringify(data) }),
}

export default apiCall
