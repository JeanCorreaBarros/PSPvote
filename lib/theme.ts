/**
 * Theme Configuration
 * Importa los colores desde .env y los pone disponibles en toda la app
 */

// Obtener colores desde las variables de entorno
const PRIMARY_COLOR = process.env.NEXT_PUBLIC_COLOR_PRIMARY || '#3b82f6'
const SECONDARY_COLOR = process.env.NEXT_PUBLIC_COLOR_SECONDARY || '#8b5cf6'
const ACCENT_COLOR = process.env.NEXT_PUBLIC_COLOR_ACCENT || '#ec4899'

export const theme = {
  colors: {
    primary: PRIMARY_COLOR,
    secondary: SECONDARY_COLOR,
    accent: ACCENT_COLOR,
  },
}

/**
 * Inyecta las variables de CSS en el documento
 * Llama esta función en el layout.tsx
 */
export function applyTheme() {
  if (typeof document !== 'undefined') {
    const root = document.documentElement
    root.style.setProperty('--color-primary', PRIMARY_COLOR)
    root.style.setProperty('--color-secondary', SECONDARY_COLOR)
    root.style.setProperty('--color-accent', ACCENT_COLOR)
    
    // Variables adicionales derivadas
    root.style.setProperty('--color-primary-light', PRIMARY_COLOR + '20')
    root.style.setProperty('--color-secondary-light', SECONDARY_COLOR + '20')
    root.style.setProperty('--color-accent-light', ACCENT_COLOR + '20')
  }
}

export default theme
