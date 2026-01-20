// API service to handle all fetch requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://paraquesoledadprogrese.com/api'

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

  // Add auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('pspvote_token') : null
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
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

// Auth endpoints
export const authApi = {
  login: (credentials: { username: string; password: string }) =>
    apiCall('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => {
    localStorage.removeItem('pspvote_token')
    localStorage.removeItem('pspvote_user')
  },
}

// Users endpoints
export const usersApi = {
  getAll: () => apiCall('/users'),
  getById: (id: string) => apiCall(`/users/${id}`),
  create: (data: { username: string; password: string; roleId: string; leaderId?: string | null }) =>
    apiCall('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiCall(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiCall(`/users/${id}`, { method: 'DELETE' }),
}

// Leaders endpoints
export const leadersApi = {
  getAll: () => apiCall('/leaders'),
  getById: (id: string) => apiCall(`/leaders/${id}`),
  create: (data: { userId: string; name: string; phone: string; address: string; recommendedById?: string | null }) =>
    apiCall('/leaders', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiCall(`/leaders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiCall(`/leaders/${id}`, { method: 'DELETE' }),
  assignUser: (data: { userId: string; leaderId: string }) =>
    apiCall('/leaders/assign-user', { method: 'POST', body: JSON.stringify(data) }),
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
