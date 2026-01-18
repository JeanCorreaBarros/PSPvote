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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit2, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Puesto {
  id: number
  nombre: string
  direccion: string
  mesas: number
  votantes: number
  horario: string
  estado: string
}

interface EditPuestoDialogProps {
  puesto: Puesto
  onPuestoUpdated?: () => void
}

export function EditPuestoDialog({ puesto, onPuestoUpdated }: EditPuestoDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    nombre: puesto.nombre,
    direccion: puesto.direccion,
    mesas: puesto.mesas.toString(),
    horarioInicio: "06:00",
    horarioFin: "16:00",
    estado: puesto.estado,
    responsable: "",
    telefono: "",
    observaciones: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Validar campos requeridos
      if (!formData.nombre || !formData.direccion || !formData.mesas) {
        setError("Nombre, Dirección y Número de Mesas son campos requeridos")
        setIsLoading(false)
        return
      }

      if (parseInt(formData.mesas) <= 0) {
        setError("El número de mesas debe ser mayor a 0")
        setIsLoading(false)
        return
      }

      // Simular API call
      // Descomenta cuando el endpoint esté listo:
      // const response = await fetch(`/api/puestos/${puesto.id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // })

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess(true)
      console.log("Puesto actualizado:", formData)

      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        onPuestoUpdated?.()
      }, 2000)
    } catch (err) {
      setError("Error al actualizar puesto. Intenta de nuevo.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground flex-1">
          <Edit2 className="w-4 h-4" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Puesto de Votación</DialogTitle>
          <DialogDescription>
            Actualiza la información del puesto de votación
          </DialogDescription>
        </DialogHeader>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 py-4"
        >
          {/* Alerts */}
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
                Puesto actualizado exitosamente
              </AlertDescription>
            </Alert>
          )}

          {/* Grid de 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Puesto *</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={isLoading || success}
                required
              />
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => handleSelectChange("estado", value)}
                disabled={isLoading || success}
              >
                <SelectTrigger id="estado">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dirección */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="direccion">Dirección *</Label>
              <Input
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                disabled={isLoading || success}
                required
              />
            </div>

            {/* Número de Mesas */}
            <div className="space-y-2">
              <Label htmlFor="mesas">Número de Mesas *</Label>
              <Input
                id="mesas"
                name="mesas"
                type="number"
                value={formData.mesas}
                onChange={handleChange}
                disabled={isLoading || success}
                required
                min="1"
              />
            </div>

            {/* Responsable */}
            <div className="space-y-2">
              <Label htmlFor="responsable">Responsable</Label>
              <Input
                id="responsable"
                name="responsable"
                placeholder="Nombre del responsable"
                value={formData.responsable}
                onChange={handleChange}
                disabled={isLoading || success}
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                placeholder="+1 234 567 8900"
                value={formData.telefono}
                onChange={handleChange}
                disabled={isLoading || success}
              />
            </div>

            {/* Horario de Apertura */}
            <div className="space-y-2">
              <Label htmlFor="horarioInicio">Horario de Apertura</Label>
              <Input
                id="horarioInicio"
                name="horarioInicio"
                type="time"
                value={formData.horarioInicio}
                onChange={handleChange}
                disabled={isLoading || success}
              />
            </div>

            {/* Horario de Cierre */}
            <div className="space-y-2">
              <Label htmlFor="horarioFin">Horario de Cierre</Label>
              <Input
                id="horarioFin"
                name="horarioFin"
                type="time"
                value={formData.horarioFin}
                onChange={handleChange}
                disabled={isLoading || success}
              />
            </div>

            {/* Observaciones */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                name="observaciones"
                placeholder="Notas adicionales sobre el puesto..."
                value={formData.observaciones}
                onChange={handleChange}
                disabled={isLoading || success}
                rows={3}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading || success}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || success}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}
