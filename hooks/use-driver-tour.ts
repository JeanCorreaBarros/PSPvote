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
      })

      driverInstance.drive()
    }, 500)
  }, [])

  return { startTour }
}
