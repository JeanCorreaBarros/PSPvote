"use client"

// Dialog para editar usuarios
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface EditUsuarioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEditUsuario: () => void
  usuario: {
    id: string
    username: string
    password: string
    roleId: string
    role: {
      id: string
      name: string
    }
  } | null
}

interface Role {
  id: string
  name: string
  isActive: boolean
}

export function EditUsuarioDialog({
  open,
  onOpenChange,
  onEditUsuario,
  usuario,
}: EditUsuarioDialogProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    roleId: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [rolesLoading, setRolesLoading] = useState(true)

  // Cargar roles desde el API
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setRolesLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/roles`)
        if (!response.ok) {
          throw new Error("Error al cargar los roles")
        }
        const rolesData = await response.json()
        setRoles(rolesData)
      } catch (error) {
        console.error("Error al cargar roles:", error)
        toast.error("Error al cargar los roles del sistema")
      } finally {
        setRolesLoading(false)
      }
    }

    loadRoles()
  }, [])

  // Llenar el formulario cuando se abre el dialog
  useEffect(() => {
    if (open && usuario) {
      setFormData({
        username: usuario.username,
        password: usuario.password,
        roleId: usuario.roleId,
      })
      setErrors({})
      setShowPassword(false)
    }
  }, [open, usuario])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "El documento de identidad es requerido"
    } else if (!/^\d+$/.test(formData.username)) {
      newErrors.username = "Solo se permiten números, sin espacios"
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }
    if (!formData.roleId) {
      newErrors.roleId = "El rol es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !usuario) return

    let toastId: string | undefined
    try {
      setIsLoading(true)
      toastId = toast.loading("Actualizando usuario...", {
        position: 'top-right',
      })

      const token = localStorage.getItem('pspvote_token')

      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${usuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          roleId: formData.roleId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al actualizar el usuario")
      }

      toast.success("Usuario actualizado exitosamente", {
        id: toastId,
        duration: 4000,
      })

      // Notificar al componente padre
      onEditUsuario()
      handleClose()
    } catch (error: any) {
      const errorMessage = error?.message || "Error al actualizar el usuario"
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
      username: "",
      password: "",
      roleId: "",
    })
    setErrors({})
    setShowPassword(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Editar Usuario</DialogTitle>
          </VisuallyHidden>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Actualiza los datos del usuario
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Documento de Identidad */}
          <div className="space-y-2">
            <Label htmlFor="username" className="font-medium">
              Documento de Identidad
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="12345678"
              value={formData.username}
              onChange={(e) => {
                const value = e.target.value.replace(/\s/g, "").replace(/[^\d]/g, "")
                setFormData({ ...formData, username: value })
              }}
              className={errors.username ? "border-destructive" : ""}
            />
            {errors.username && (
              <p className="text-sm text-destructive flex gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.username}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="font-medium">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={errors.password ? "border-destructive pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive flex gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Rol */}
          <div className="space-y-2">
            <Label htmlFor="role" className="font-medium">
              Rol
            </Label>
            <Select value={formData.roleId} onValueChange={(value) => setFormData({ ...formData, roleId: value })}>
              <SelectTrigger id="role" className={errors.roleId ? "border-destructive" : ""}>
                <SelectValue placeholder="Seleccionar rol..." />
              </SelectTrigger>
              <SelectContent>
                {rolesLoading ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    Cargando roles...
                  </div>
                ) : (
                  roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.roleId && (
              <p className="text-sm text-destructive flex gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.roleId}
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
