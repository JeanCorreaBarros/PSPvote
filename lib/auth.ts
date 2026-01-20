export interface User {
  id?: string
  username?: string
  email?: string
  name?: string
  roleId?: string
  leaderId?: string | null
  role?: {
    id: string
    name: string
  }
  createdAt?: string
  leader?: any
}

export interface LoginResponse {
  token: string
}

export interface TokenPayload {
  sub?: string
  id?: string
  userId?: string
  username?: string
  role?: {
    id: string
    name: string
  } | string
  iat?: number
  exp?: number
  [key: string]: any
}

/**
 * Decodifica un token JWT sin validar la firma
 * Extrae el payload del token para acceder a los datos como rol
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }
    const decoded = JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf-8')
    )
    return decoded
  } catch (error) {
    console.error('Error decodificando token:', error)
    return null
  }
}

/**
 * Obtiene el rol del token JWT almacenado
 */
export function getRoleFromToken(): string | null {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem("pspvote_token")
  if (!token) return null
  
  try {
    // Decodificar manualmente el JWT (sin validar firma)
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const decoded = JSON.parse(atob(parts[1]))
    // Soporta ambas estructuras: role como string o como objeto con propiedad name
    if (typeof decoded.role === 'object' && decoded.role?.name) {
      return decoded.role.name
    }
    return decoded.role || null
  } catch (error) {
    console.error('Error al extraer rol del token:', error)
    return null
  }
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = sessionStorage.getItem("pspvote_user")
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("pspvote_token")
}

export function setToken(token: string): void {
  localStorage.setItem("pspvote_token", token)
}

export function logout() {
  localStorage.removeItem("pspvote_token")
  sessionStorage.removeItem("pspvote_user")
}
