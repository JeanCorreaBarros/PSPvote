"use client"

import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MapPin, Users, Home, MapPinIcon, User2, Users2 } from "lucide-react"

interface PuestoDetailsProps {
  id: string
  codUnic: string
  departamento: string
  municipio: string
  puesto: string
  mujeres: number
  hombres: number
  total: number
  mesas: number
  comuna: string | null
  direccion: string
  latitud: string
  longitud: string
  createdAt: string
  updatedAt: string
  totalVotaciones: number
  porcentajeSobreVotaciones: number
  porcentajeGeneralReal: number
  porcentajePuesto: number
}

interface PuestoDetailsDialogProps {
  puesto: PuestoDetailsProps
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PuestoDetailsDialog({ puesto, open, onOpenChange }: PuestoDetailsDialogProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">{puesto.puesto}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <MapPin className="w-4 h-4" />
            {puesto.direccion}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Ubicación */}
          <div className="bg-primary/5 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-primary" />
              Ubicación
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Departamento</p>
                <p className="font-semibold text-foreground">{puesto.departamento}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Municipio</p>
                <p className="font-semibold text-foreground">{puesto.municipio}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Comuna</p>
                <p className="font-semibold text-foreground">{puesto.comuna || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Código Único</p>
                <Badge variant="outline" className="mt-1">{puesto.codUnic}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Estadísticas de Votación */}
          <div>
            <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Estadísticas de Votación
            </h3>
            
            {/* Barras comparativas de género */}
            <div className="space-y-6 mb-6">
              {/* Total */}
              <div className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-foreground">Total Votantes</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{puesto.total.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">Registrados en el puesto de votación</p>
              </div>

              {/* Mujeres */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                    <span className="font-medium text-foreground">Mujeres</span>
                  </div>
                  <span className="text-lg font-bold text-pink-600 dark:text-pink-400">{puesto.mujeres.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(puesto.mujeres / puesto.total) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-linear-to-r from-pink-400 to-pink-600 h-full rounded-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{((puesto.mujeres / puesto.total) * 100).toFixed(1)}%</span>
                </div>
              </div>

              {/* Hombres */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="font-medium text-foreground">Hombres</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{puesto.hombres.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(puesto.hombres / puesto.total) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-linear-to-r from-blue-400 to-blue-600 h-full rounded-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{((puesto.hombres / puesto.total) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Total Votaciones y Porcentaje */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="border-border bg-linear-to-br from-orange-50 to-orange-50/50 dark:from-orange-950/30 dark:to-orange-950/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Votaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{puesto.totalVotaciones.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Votos registrados
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-linear-to-br from-cyan-50 to-cyan-50/50 dark:from-cyan-950/30 dark:to-cyan-950/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Porcentaje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{puesto.porcentajePuesto.toFixed(2)}%</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    sobre votaciones
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Información de mesas */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-border bg-linear-to-br from-purple-50 to-purple-50/50 dark:from-purple-950/30 dark:to-purple-950/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Mesas de Votación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{puesto.mesas}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {(puesto.total / puesto.mesas).toFixed(0)} votantes/mesa
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-linear-to-br from-green-50 to-green-50/50 dark:from-green-950/30 dark:to-green-950/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Promedio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{(puesto.total / puesto.mesas).toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    por mesa
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Coordenadas Geográficas */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-foreground">Coordenadas Geográficas</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Latitud</p>
                <p className="font-mono text-foreground">{puesto.latitud}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Longitud</p>
                <p className="font-mono text-foreground">{puesto.longitud}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Fechas */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Creado: {formatDate(puesto.createdAt)}</p>
            <p>Actualizado: {formatDate(puesto.updatedAt)}</p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
