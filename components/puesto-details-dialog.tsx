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
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MapPin, Users, Clock } from "lucide-react"
import { EditPuestoDialog } from "./edit-puesto-dialog"
import { DeletePuestoDialog } from "./delete-puesto-dialog"

interface Puesto {
  id: number
  nombre: string
  direccion: string
  mesas: number
  votantes: number
  horario: string
  estado: string
}

interface PuestoDetailsDialogProps {
  puesto: Puesto
}

export function PuestoDetailsDialog({ puesto }: PuestoDetailsDialogProps) {
  const [open, setOpen] = useState(false)

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-accent/10 text-accent border-accent/20"
      case "inactivo":
        return "bg-muted text-muted-foreground"
      case "mantenimiento":
        return "bg-orange-50 text-orange-600 border-orange-200"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handlePuestoDeleted = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-3 bg-transparent" size="sm">
          Ver Detalles
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{puesto.nombre}</DialogTitle>
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
          {/* Estado */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Estado:</span>
            <Badge className={getEstadoColor(puesto.estado)}>
              {puesto.estado.charAt(0).toUpperCase() + puesto.estado.slice(1)}
            </Badge>
          </div>

          <Separator />

          {/* Grid de información */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mesas */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  Mesas de Votación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{puesto.mesas}</p>
              </CardContent>
            </Card>

            {/* Votantes */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-accent" />
                  </div>
                  Votantes Registrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">
                  {puesto.votantes.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            {/* Horario */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  Horario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base font-semibold text-foreground">{puesto.horario}</p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Estadísticas adicionales */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-foreground">Información Adicional</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Promedio de votantes por mesa</p>
                <p className="text-lg font-semibold text-foreground">
                  {Math.round(puesto.votantes / puesto.mesas).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Capacidad total</p>
                <p className="text-lg font-semibold text-foreground">
                  {(puesto.mesas * 100).toLocaleString()} votantes
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <DeletePuestoDialog puesto={puesto} onPuestoDeleted={handlePuestoDeleted} />
            <EditPuestoDialog puesto={puesto} />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
