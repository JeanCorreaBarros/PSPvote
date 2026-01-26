"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useDriverTour, isTourCompleted } from "@/hooks/use-driver-tour"

/**
 * Componente que maneja el tour de bienvenida del sidebar
 * Deshabilitado: Los tours ahora se inician manualmente desde el botón de ayuda
 */
export function SidebarTourTrigger() {
  return null
}
