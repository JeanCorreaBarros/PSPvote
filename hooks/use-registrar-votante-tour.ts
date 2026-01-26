"use client"

import { useEffect } from "react"
import { useDriverTour, isTourCompleted } from "@/hooks/use-driver-tour"
import { registrarVotanteModalTour } from "@/lib/tours-config"

interface RegistrarVotanteTourProps {
  isOpen: boolean
}

/**
 * Hook para manejar el tour automático del modal de registrar votante
 * Se muestra solo una vez la primera vez que abren el modal
 */
export function useRegistrarVotanteTour(isOpen: boolean) {
  const { startTour } = useDriverTour()

  useEffect(() => {
    // Si el modal no está abierto, no hacer nada
    if (!isOpen) return

    // Verificar si el tour ya fue completado
    if (isTourCompleted("registrar-votante-modal")) return

    // Mostrar el tour automáticamente cuando se abre el modal
    const timer = setTimeout(() => {
      console.log("🎬 Iniciando tour del modal de registrar votante...")
      startTour(registrarVotanteModalTour, "registrar-votante-modal")
    }, 800)

    return () => clearTimeout(timer)
  }, [isOpen, startTour])
}
