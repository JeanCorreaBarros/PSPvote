"use client"

// Dialog para editar líderes
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface EditLiderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditLider: () => void
  lider: {
    id: string
    name: string
    phone: string
    address: string
  } | null
}

export function EditLiderDialog({
  open,
  onOpenChange,
  onEditLider,
  lider,
}: EditLiderDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Llenar el formulario cuando se abre el dialog
  useEffect(() => {
    if (open && lider) {
      setFormData({
        name: lider.name,
        phone: lider.phone,
        address: lider.address,
      })
      setErrors({})
    }
  }, [open, lider])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es requerido"
    }
    if (!formData.address.trim()) {
      newErrors.address = "La dirección es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !lider) return

    let toastId: string | undefined
    try {
      setIsLoading(true)
      toastId = toast.loading("Actualizando líder...", {
        position: 'top-right',
      })

      const token = localStorage.getItem('pspvote_token')

      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/leaders/${lider.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al actualizar el líder")
      }

      toast.success("Líder actualizado exitosamente", {
        id: toastId,
        duration: 4000,
      })

      // Notificar al componente padre
      onEditLider()
      handleClose()
    } catch (error: any) {
      const errorMessage = error?.message || "Error al actualizar el líder"
      if (toastId) {
        toast.error(errorMessage, {
          id: toastId,
          duration: 4000,
        })
      } else {
        toast.error(errorMessage, {
          duration: 4000,
        })
      }
      setErrors({ submit: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
    })
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Editar Líder</DialogTitle>
          </VisuallyHidden>
          <DialogTitle>Editar Líder</DialogTitle>
          <DialogDescription>
            Actualiza los datos del líder
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-medium">
              Nombre
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Nombre del líder"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive flex gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-medium">
              Teléfono
            </Label>
            <Input
              id="phone"
              type="text"
              placeholder="(123) 456-7890"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-destructive flex gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.phone}
              </p>
            )}
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label htmlFor="address" className="font-medium">
              Dirección
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="Dirección del líder"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className={errors.address ? "border-destructive" : ""}
            />
            {errors.address && (
              <p className="text-sm text-destructive flex gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.address}
              </p>
            )}
          </div>

          {/* Error General */}
          {errors.submit && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
              <p className="text-sm text-destructive flex gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Actualizando..." : "Actualizar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
