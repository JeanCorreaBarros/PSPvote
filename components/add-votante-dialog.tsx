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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, AlertCircle, CheckCircle, Search, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AddVotanteDialogProps {
  onVotanteAdded?: () => void
}

// Puestos de votación disponibles
const PUESTOS_VOTACION = [
  { id: "puesto-1", nombre: "Puesto de Votación 1 - Centro" },
  { id: "puesto-2", nombre: "Puesto de Votación 2 - Norte" },
  { id: "puesto-3", nombre: "Puesto de Votación 3 - Sur" },
  { id: "puesto-4", nombre: "Puesto de Votación 4 - Este" },
  { id: "puesto-5", nombre: "Puesto de Votación 5 - Oeste" },
  { id: "puesto-6", nombre: "Puesto de Votación 6 - Centro Histórico" },
]

export function AddVotanteDialog({ onVotanteAdded }: AddVotanteDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [searchPuesto, setSearchPuesto] = useState("")
  const [showPuestosDropdown, setShowPuestosDropdown] = useState(false)

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    cedula: "",
    genero: "",
    edad: "",
    puesto: "",
    observaciones: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const puestosFiltered = PUESTOS_VOTACION.filter((puesto) =>
    puesto.nombre.toLowerCase().includes(searchPuesto.toLowerCase())
  )

  const puestoSeleccionado = PUESTOS_VOTACION.find((p) => p.id === formData.puesto)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      // Validar campos requeridos
      if (!formData.nombre || !formData.apellido || !formData.cedula) {
        setError("Nombre, Apellido y Cédula son campos requeridos")
        setIsLoading(false)
        return
      }

      // Simular API call
      // Descomenta cuando el endpoint esté listo:
      // const response = await fetch("/api/votantes", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // })

      // Por ahora mostramos success después de 1 segundo
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess(true)
      console.log("Votante agregado:", formData)

      // Reset form
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        cedula: "",
        genero: "",
        edad: "",
        puesto: "",
        observaciones: "",
      })

      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        onVotanteAdded?.()
      }, 2000)
    } catch (err) {
      setError("Error al agregar votante. Intenta de nuevo.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary text-primary-foreground">
          <UserPlus className="w-4 h-4" />
          Agregar Votante
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto" onClick={() => setShowPuestosDropdown(false)}>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Votante</DialogTitle>
          <DialogDescription>
            Completa el formulario para registrar un nuevo votante en el sistema
          </DialogDescription>
        </DialogHeader>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 py-4"
          onClick={(e) => e.stopPropagation()}
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
                Votante agregado exitosamente
              </AlertDescription>
            </Alert>
          )}

          {/* Grid de 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="Juan"
                value={formData.nombre}
                onChange={handleChange}
                disabled={isLoading || success}
                required
              />
            </div>

            {/* Apellido */}
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                name="apellido"
                placeholder="Pérez"
                value={formData.apellido}
                onChange={handleChange}
                disabled={isLoading || success}
                required
              />
            </div>

            {/* Cédula */}
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula *</Label>
              <Input
                id="cedula"
                name="cedula"
                placeholder="12345678-9"
                value={formData.cedula}
                onChange={handleChange}
                disabled={isLoading || success}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="juan@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading || success}
              />
            </div>

            {/* Género */}
            <div className="space-y-2">
              <Label htmlFor="genero">Género</Label>
              <Select
                value={formData.genero}
                onValueChange={(value) => handleSelectChange("genero", value)}
                disabled={isLoading || success}
              >
                <SelectTrigger id="genero">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="femenino">Femenino</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Edad */}
            <div className="space-y-2">
              <Label htmlFor="edad">Edad</Label>
              <Input
                id="edad"
                name="edad"
                type="number"
                placeholder="25"
                value={formData.edad}
                onChange={handleChange}
                disabled={isLoading || success}
              />
            </div>

            {/* Puesto de Votación */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="puesto-search">Puesto de Votación</Label>
              <div className="relative">
                <div className="flex items-center gap-2 border-2 border-input rounded-md px-3 py-2 bg-background focus-within:border-primary transition-colors">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    id="puesto-search"
                    type="text"
                    placeholder="Buscar o seleccionar puesto..."
                    value={searchPuesto}
                    onChange={(e) => setSearchPuesto(e.target.value)}
                    onClick={() => setShowPuestosDropdown(true)}
                    onFocus={() => setShowPuestosDropdown(true)}
                    disabled={isLoading || success}
                    className="flex-1 bg-transparent outline-none text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {searchPuesto && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchPuesto("")
                        setShowPuestosDropdown(true)
                      }}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Limpiar búsqueda"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {showPuestosDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 border border-border rounded-md bg-background shadow-lg z-50 max-h-64 overflow-y-auto">
                    <div className="p-2 border-b border-border text-xs text-muted-foreground">
                      {puestosFiltered.length} {puestosFiltered.length === 1 ? "puesto encontrado" : "puestos encontrados"}
                    </div>
                    {puestosFiltered.length > 0 ? (
                      puestosFiltered.map((puesto) => (
                        <button
                          key={puesto.id}
                          type="button"
                          onClick={() => {
                            handleSelectChange("puesto", puesto.id)
                            setSearchPuesto("")
                            setShowPuestosDropdown(false)
                          }}
                          disabled={isLoading || success}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-b border-border last:border-b-0 ${
                            formData.puesto === puesto.id ? "bg-accent text-accent-foreground font-medium" : ""
                          }`}
                        >
                          {puesto.nombre}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                        No se encontraron puestos
                      </div>
                    )}
                  </div>
                )}

                {formData.puesto && (
                  <div className="mt-2 p-3 bg-accent/10 rounded-md border border-accent/30 flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Puesto seleccionado:</p>
                      <p className="text-sm text-foreground font-medium">{puestoSeleccionado?.nombre}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectChange("puesto", "")
                        setSearchPuesto("")
                      }}
                      className="text-muted-foreground hover:text-foreground ml-2"
                      title="Cambiar selección"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Observaciones */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                name="observaciones"
                placeholder="Notas adicionales..."
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
                "Agregar Votante"
              )}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}
