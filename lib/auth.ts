export interface User {
  email: string
  name: string
  username?: string
}

export interface LoginResponse {
  token: string
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("pspvote_user")
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
  localStorage.removeItem("pspvote_user")
}
