"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye, X, Download, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ReportePreviewProps {
  reporte: {
    id: number
    nombre: string
    descripcion: string
    tipo: string
  }
}

export function ReportePreview({ reporte }: ReportePreviewProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [downloadError, setDownloadError] = useState("")

  const handleOpenPreview = async () => {
    setIsLoading(true)
    try {
      // Simular carga de datos para vista previa
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Vista previa cargada para:", reporte.nombre)
    } catch (err) {
      console.error("Error al cargar vista previa:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDescargar = async () => {
    setIsDownloading(true)
    setDownloadError("")
    setDownloadSuccess(false)

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

      setDownloadSuccess(true)
      console.log(`Reporte descargado: ${reporte.nombre}.${reporte.tipo}`)

      // Auto-cerrar mensaje de éxito después de 3 segundos
      setTimeout(() => setDownloadSuccess(false), 3000)
    } catch (err) {
      setDownloadError("Error al descargar el reporte. Intenta de nuevo.")
      console.error("Error:", err)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          onClick={handleOpenPreview}
        >
          <Eye className="w-4 h-4 mr-1" />
          Vista Previa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{reporte.nombre}</DialogTitle>
          <DialogDescription>
            {reporte.descripcion}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <>
              {/* Encabezado del Reporte */}
              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">{reporte.nombre}</h3>
                <p className="text-sm text-muted-foreground">Generado: {new Date().toLocaleDateString("es-ES")}</p>
              </div>

              {/* Tabla de Ejemplo */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base">Datos Principales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold text-foreground">Concepto</th>
                          <th className="text-right py-3 px-4 font-semibold text-foreground">Valor</th>
                          <th className="text-right py-3 px-4 font-semibold text-foreground">Porcentaje</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 text-foreground">Total Registros</td>
                          <td className="text-right py-3 px-4 text-foreground font-semibold">12,458</td>
                          <td className="text-right py-3 px-4 text-foreground">100%</td>
                        </tr>
                        <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 text-foreground">Verificados</td>
                          <td className="text-right py-3 px-4 text-accent font-semibold">8,234</td>
                          <td className="text-right py-3 px-4 text-accent font-semibold">66%</td>
                        </tr>
                        <tr className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 text-foreground">Pendientes</td>
                          <td className="text-right py-3 px-4 text-orange-600 font-semibold">2,124</td>
                          <td className="text-right py-3 px-4 text-orange-600 font-semibold">17%</td>
                        </tr>
                        <tr className="hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 text-foreground">Rechazados</td>
                          <td className="text-right py-3 px-4 text-destructive font-semibold">100</td>
                          <td className="text-right py-3 px-4 text-destructive font-semibold">1%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Gráfico de Ejemplo */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base">Distribución por Estado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">Verificados</span>
                        <span className="text-sm font-semibold text-accent">66%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "66%" }}
                          transition={{ duration: 1 }}
                          className="bg-accent h-2 rounded-full"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">Pendientes</span>
                        <span className="text-sm font-semibold text-orange-600">17%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "17%" }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="bg-orange-600 h-2 rounded-full"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">Rechazados</span>
                        <span className="text-sm font-semibold text-destructive">1%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "1%" }}
                          transition={{ duration: 1, delay: 0.4 }}
                          className="bg-destructive h-2 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Footer del Reporte */}
              <div className="bg-muted/50 p-4 rounded-lg text-xs text-muted-foreground">
                <p>Este es una vista previa del reporte. Para obtener los datos completos, descarga el archivo en formato {reporte.tipo}.</p>
              </div>

              {/* Alerts de Descarga */}
              {downloadError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{downloadError}</AlertDescription>
                </Alert>
              )}

              {downloadSuccess && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Reporte descargado exitosamente
                  </AlertDescription>
                </Alert>
              )}

              {/* Botones de Acción */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isDownloading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cerrar
                </Button>
                <Button
                  className="bg-primary text-primary-foreground gap-2"
                  onClick={handleDescargar}
                  disabled={isDownloading || downloadSuccess}
                >
                  {isDownloading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Descargando...
                    </>
                  ) : downloadSuccess ? (
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
              </div>
            </>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
