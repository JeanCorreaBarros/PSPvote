"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useDriverTour } from "@/hooks/use-driver-tour"
import { sidebarTour } from "@/lib/tours-config"

/**
 * Componente que maneja el tour de bienvenida del sidebar
 * Se muestra una sola vez por sesión
 */
export function SidebarTourTrigger() {
  const pathname = usePathname()
  const { startTour } = useDriverTour()
  const [hasShownTour, setHasShownTour] = useState(true) // Descomenta para mostrar tour

  useEffect(() => {
    // Solo mostrar el tour en la primera carga del dashboard
    if (pathname === "/dashboard" && !hasShownTour) {
      const timer = setTimeout(() => {
        startTour(sidebarTour, "sidebar-welcome")
        setHasShownTour(true)
        localStorage.setItem("sidebarTourShown", "true")
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [pathname, hasShownTour, startTour])

  return null
}
