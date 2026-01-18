/**
 * Component para aplicar los temas dinámicos desde .env
 * Carga los colores al montar el componente
 */

'use client'

import { useEffect } from 'react'
import { applyTheme } from '@/lib/theme'

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Aplicar el tema cuando el componente se monta
    applyTheme()
  }, [])

  return <>{children}</>
}
