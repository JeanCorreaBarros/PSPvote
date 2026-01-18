"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DescargarReporteProps {
  reporte: {
    id: number
    nombre: string
    tipo: string
  }
}

export function DescargarReporte({ reporte }: DescargarReporteProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleDescargar = async () => {
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Simular descarga de archivo
      // Descomenta cuando el endpoint esté listo:
      // const response = await fetch(`/api/reportes/${reporte.id}/download`, {
      //   method: "GET",
      // })
      // const blob = await response.blob()
      // const url = window.URL.createObjectURL(blob)
      // const a = document.createElement("a")
      // a.href = url
      // a.download = `${reporte.nombre}.${reporte.tipo.toLowerCase()}`
      // a.click()

      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSuccess(true)
      console.log(`Reporte descargado: ${reporte.nombre}.${reporte.tipo}`)

      // Simular descarga real
      const fileName = `${reporte.nombre}_${new Date().toLocaleDateString("es-ES").replace(/\//g, "-")}.${reporte.tipo === "PDF" ? "pdf" : "xlsx"}`
      console.log(`Archivo: ${fileName}`)

      // Auto-cerrar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("Error al descargar el reporte. Intenta de nuevo.")
      console.error("Error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        size="sm"
        className="gap-2 bg-primary text-primary-foreground w-full"
        onClick={handleDescargar}
        disabled={isLoading || success}
      >
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
            Descargando...
          </>
        ) : success ? (
          <>
            <CheckCircle className="w-4 h-4" />
            ¡Descargado!
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Descargar {reporte.tipo}
          </>
        )}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Reporte descargado exitosamente
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
