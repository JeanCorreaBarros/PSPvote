"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Calendar, User, Code } from "lucide-react"
import { motion } from "framer-motion"

interface CertificationDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  votanteNombre: string
  votanteCedula: string
  codigoVotacion?: string
  imagenConfirmacion?: string
  fechaConfirmacion?: string
  confirmadoPor?: {
    id: string
    nombre: string
  }
}

export function CertificationDetailsDialog({
  open,
  onOpenChange,
  votanteNombre,
  votanteCedula,
  codigoVotacion,
  imagenConfirmacion,
  fechaConfirmacion,
  confirmadoPor,
}: CertificationDetailsDialogProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return undefined

    // Si ya es una URL completa, devolverla tal cual
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath
    }

    // Si es una ruta relativa, construir la URL completa
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"
    const baseUrl = apiBaseUrl.replace("/api", "")
    return `${baseUrl}${imagePath}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles de Certificación</DialogTitle>
          <DialogDescription>
            Información del votante certificado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pr-4">
          {/* Encabezado - Votante */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-emerald-900">Votante Certificado</h3>
            </div>
            <p className="font-semibold text-emerald-800">{votanteNombre}</p>
            <p className="text-sm text-emerald-700 font-mono">CC: {votanteCedula}</p>
          </motion.div>

          {/* Código de votación */}
          {codigoVotacion && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-1">
                <Code className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">Código de Votación</span>
              </div>
              <p className="font-mono font-bold text-blue-900 text-sm break-all">{codigoVotacion}</p>
            </motion.div>
          )}

          {/* Imagen de confirmación */}
          {imagenConfirmacion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <span className="text-xs font-semibold text-slate-700">Imagen de Certificado</span>
              <div className="relative rounded-lg overflow-hidden border-2 border-slate-300 bg-slate-100">
                <img
                  src={getImageUrl(imagenConfirmacion)}
                  alt="Certificado"
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e2e8f0' width='100' height='100'/%3E%3Ctext x='50' y='50' font-size='14' fill='%23666' text-anchor='middle' dominant-baseline='middle'%3EImagen no disponible%3C/text%3E%3C/svg%3E"
                  }}
                />
                <Badge className="absolute top-2 right-2 bg-emerald-600">✓ Adjunta</Badge>
              </div>
            </motion.div>
          )}

          {/* Fecha de confirmación */}
          {fechaConfirmacion && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700">Fecha de Confirmación</span>
              </div>
              <p className="text-amber-900 text-sm">{formatDate(fechaConfirmacion)}</p>
            </motion.div>
          )}

          {/* Certificado por */}
          {confirmadoPor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-3 bg-purple-50 border border-purple-200 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-purple-700">Certificado Por</span>
              </div>
              <p className="font-semibold text-purple-900 text-sm">{confirmadoPor.nombre}</p>
              <p className="text-xs text-purple-700 font-mono mt-1">{confirmadoPor.id}</p>
            </motion.div>
          )}

          {/* Badge de estado */}
          <Alert className="bg-emerald-50 border-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-900">
              Este votante ha sido certificado correctamente
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
