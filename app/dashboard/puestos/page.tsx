"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { MapPin, Users, Clock } from "lucide-react"
import { AddPuestoDialog } from "@/components/add-puesto-dialog"
import { PuestoDetailsDialog } from "@/components/puesto-details-dialog"
import { puestosApi } from "@/lib/api"

interface Puesto {
  id: number
  nombre: string
  direccion: string
  mesas: number
  votantes: number
  horario: string
  estado: string
}

const defaultPuestos: Puesto[] = [
  { id: 1, nombre: "IE San José", direccion: "Calle 45 #12-34, Centro", mesas: 12, votantes: 2450, horario: "6:00 AM - 4:00 PM", estado: "activo" },
  { id: 2, nombre: "IE La Paz", direccion: "Carrera 23 #56-78, La Esperanza", mesas: 8, votantes: 1680, horario: "6:00 AM - 4:00 PM", estado: "activo" },
  { id: 3, nombre: "Coliseo Municipal", direccion: "Avenida Principal #89-01", mesas: 20, votantes: 4200, horario: "6:00 AM - 4:00 PM", estado: "activo" },
  { id: 4, nombre: "Centro Cívico", direccion: "Calle 67 #34-56, San Antonio", mesas: 6, votantes: 1250, horario: "6:00 AM - 4:00 PM", estado: "inactivo" },
  { id: 5, nombre: "IE Villa Rosa", direccion: "Carrera 78 #23-45, Villa Rosa", mesas: 10, votantes: 2100, horario: "6:00 AM - 4:00 PM", estado: "activo" },
  { id: 6, nombre: "Sede Comunal El Prado", direccion: "Calle 12 #67-89, El Prado", mesas: 5, votantes: 980, horario: "6:00 AM - 4:00 PM", estado: "activo" },
]

export default function PuestosPage() {
  const [puestos, setPuestos] = useState<Puesto[]>(defaultPuestos)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPuestos = async () => {
      try {
        setLoading(true)
        setError(null)
        // Descomenta cuando el endpoint esté listo
        // const data = await puestosApi.getAll()
        // setPuestos(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar puestos')
        setPuestos(defaultPuestos)
      } finally {
        setLoading(false)
      }
    }

    fetchPuestos()
  }, [])

  return (
    <div className="min-h-screen">
      <Header title="Puestos de Votación" />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Administrar Puestos</h2>
            <p className="text-sm text-muted-foreground">Gestiona los puestos de votación disponibles</p>
          </div>
          <AddPuestoDialog />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {puestos.map((puesto, index) => (
            <motion.div
              key={puesto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-border hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base text-foreground">{puesto.nombre}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">{puesto.direccion}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={puesto.estado === "activo" ? "bg-accent/10 text-accent border-accent/20" : "bg-muted text-muted-foreground"}>
                      {puesto.estado}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-3 gap-4 py-3 border-t border-border">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-foreground">{puesto.mesas}</p>
                      <p className="text-xs text-muted-foreground">Mesas</p>
                    </div>
                    <div className="text-center border-x border-border">
                      <p className="text-lg font-semibold text-foreground">{puesto.votantes.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Votantes</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{puesto.horario}</p>
                    </div>
                  </div>
                  <PuestoDetailsDialog puesto={puesto} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
