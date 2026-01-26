"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, PieChart, BarChart3, TrendingUp, RefreshCw } from "lucide-react"
import { DescargarReporte } from "@/components/descargar-reporte"
import { ReportePreview } from "@/components/reporte-preview"
import { EstadisticasSkeleton, ReportCardSkeleton } from "@/components/reportes-skeleton"
import { reportesApi } from "@/lib/api"
import { reportesTour } from "@/lib/tours-config"

interface Reporte {
  id: number
  nombre: string
  descripcion: string
  icon: any
  tipo: string
}

const reportes: Reporte[] = [
  { id: 1, nombre: "Resumen General de Votación", descripcion: "Estadísticas generales de participación electoral", icon: PieChart, tipo: "PDF" },
  { id: 2, nombre: "Registro por Puestos", descripcion: "Detalle de votantes por cada puesto de votación", icon: BarChart3, tipo: "Excel" },

  { id: 3, nombre: "Gráficos por Lider", descripcion: "Listado completo de votantes registrados", icon: FileText, tipo: "Excel" },
  { id: 4, nombre: "Gráficos por Zona", descripcion: "Listado completo de votantes registrados", icon: FileText, tipo: "Excel" },
  { id: 5, nombre: "Gráficos por Puesto", descripcion: "Listado completo de votantes registrados", icon: FileText, tipo: "Excel" },
  { id: 6, nombre: "Gráficos por Programa", descripcion: "Listado completo de votantes registrados", icon: FileText, tipo: "Excel" },
]

interface Estadisticas {
  totalRegistros: number
  verificados: number
  pendientes: number
  rechazados: number
}

const defaultEstadisticas: Estadisticas = {
  totalRegistros: 12458,
  verificados: 8234,
  pendientes: 2124,
  rechazados: 100,
}

export default function ReportesPage() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas>(defaultEstadisticas)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        setLoading(true)
        setError(null)
        // Descomenta cuando el endpoint esté listo
        // const data = await reportesApi.getResumen()
        // setEstadisticas(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar estadísticas')
        setEstadisticas(defaultEstadisticas)
      } finally {
        setLoading(false)
      }
    }

    fetchEstadisticas()
  }, [])

  const handleDescargar = async (tipo: string) => {
    try {
      setLoading(true)
      if (tipo === "PDF") {
        // Descomenta cuando el endpoint esté listo
        // await reportesApi.exportarPDF()
      } else {
        // Descomenta cuando el endpoint esté listo
        // await reportesApi.exportarCSV()
      }
      console.log(`Descargando ${tipo}...`)
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error al descargar ${tipo}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="Reportes" tours={[{ name: "Guía de Reportes", steps: reportesTour }]} />

      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 id="reportes-titulo" className="text-lg font-semibold text-foreground">Generar Reportes</h2>
            <p className="text-sm text-muted-foreground">Descarga reportes y estadísticas del sistema</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                setLoading(true)
                try {
                  await new Promise((resolve) => setTimeout(resolve, 1000))
                  setEstadisticas(defaultEstadisticas)
                  console.log("Estadísticas actualizadas")
                } catch (err) {
                  setError("Error al actualizar estadísticas")
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Actualizando..." : "Actualizar"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className=" hidden grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          id="estadisticas-cards"
        >
          {[
            { label: "Total Registros", value: estadisticas.totalRegistros, color: "bg-blue-50" },
            { label: "Verificados", value: estadisticas.verificados, color: "bg-green-50" },
            { label: "Pendientes", value: estadisticas.pendientes, color: "bg-yellow-50" },
            { label: "Rechazados", value: estadisticas.rechazados, color: "bg-red-50" },
          ].map((stat, index) => (
            <Card key={index} className={`border-border ${stat.color}`}>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          id="reportes-list"
        >
          {loading ? (
            <>
              <ReportCardSkeleton />
              <ReportCardSkeleton />
              <ReportCardSkeleton />
              <ReportCardSkeleton />
            </>
          ) : (
            reportes.map((reporte, index) => (
              <motion.div
                key={reporte.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                id="reporte-card"
              >
                <Card className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <reporte.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{reporte.nombre}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{reporte.descripcion}</p>
                        <div className="flex items-center gap-3 mt-4">
                          <DescargarReporte reporte={reporte} />
                          <ReportePreview reporte={reporte} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 hidden"
        >
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Estadísticas Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {loading ? (
                  <EstadisticasSkeleton />
                ) : (
                  [
                    { label: "Total Registros", value: estadisticas.totalRegistros.toLocaleString(), color: "text-primary" },
                    { label: "Verificados", value: estadisticas.verificados.toLocaleString(), color: "text-accent" },
                    { label: "Pendientes", value: estadisticas.pendientes.toLocaleString(), color: "text-chart-3" },
                    { label: "Rechazados", value: estadisticas.rechazados.toLocaleString(), color: "text-destructive" },
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 rounded-lg bg-muted/50">
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
