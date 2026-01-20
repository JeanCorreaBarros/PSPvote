"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useDriverTour, isTourCompleted } from "@/hooks/use-driver-tour"
import { sidebarTour } from "@/lib/tours-config"

/**
 * Componente que maneja el tour de bienvenida del sidebar
 * Se muestra automáticamente la primera vez que entras al dashboard
 * Se guarda en cookie y no se muestra de nuevo a menos que lo hagas manualmente
 */
export function SidebarTourTrigger() {
  const pathname = usePathname()
  const { startTour } = useDriverTour()

  useEffect(() => {
    // Mostrar el tour solo en la primera carga del dashboard y si no está completado
    if (pathname === "/dashboard" && !isTourCompleted("sidebar-welcome")) {
      const timer = setTimeout(() => {
        console.log("🎬 Iniciando tour de bienvenida automático...")
        startTour(sidebarTour, "sidebar-welcome")
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [pathname, startTour])

  return null
}
