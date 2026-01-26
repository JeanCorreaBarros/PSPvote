import { useCallback } from "react"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"

export interface TourStep {
  element?: string
  popover?: {
    title?: string
    description: string
    side?: "left" | "right" | "top" | "bottom"
    align?: "start" | "center" | "end"
  }
}

// Funciones para manejar cookies de tours
export const saveTourCookie = (tourName: string) => {
  document.cookie = `pspvote_tour_${tourName}=completed; path=/; max-age=${60 * 60 * 24 * 365}` // 1 año
}

export const isTourCompleted = (tourName: string): boolean => {
  return document.cookie.includes(`pspvote_tour_${tourName}=completed`)
}

export const getTourCookie = (tourName: string): string | null => {
  const name = `pspvote_tour_${tourName}=`
  const decodedCookie = decodeURIComponent(document.cookie)
  const cookieArray = decodedCookie.split(";")
  
  for (let cookie of cookieArray) {
    cookie = cookie.trim()
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length)
    }
  }
  return null
}

export function useDriverTour() {
  const startTour = useCallback((steps: TourStep[], tourName: string) => {
    // Esperar un poco para asegurar que los elementos estén en el DOM
    setTimeout(() => {
      const driverInstance = driver({
        steps: steps.map((step) => ({
          element: step.element,
          popover: {
            title: step.popover?.title || "",
            description: step.popover?.description || "",
            side: step.popover?.side || "left",
            align: step.popover?.align || "center",
          },
        })),
        showProgress: true,
        allowClose: true,
        allowKeyboardControl: true,
        onDestroyed: () => {
          // Guardar cookie cuando se termina o cierra el tour
          saveTourCookie(tourName)
          console.log(`✅ Tour "${tourName}" completado y guardado en cookie`)
        },
      })

      driverInstance.drive()
    }, 500)
  }, [])

  return { startTour, isTourCompleted, saveTourCookie }
}
