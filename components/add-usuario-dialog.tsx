"use client"

// Dialog para agregar nuevos usuarios
import { useState } from "react"
import { motion } from "framer-motion"
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
import { usersApi } from "@/lib/api"

interface AddUsuarioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddUsuario: (usuario: any) => void
}

// Mapeo de roles - Estos IDs deben venir del backend idealmente
const ROLE_IDS: Record<string, string> = {
  ADMIN: "ff1f942e-cc47-4c34-907b-3b3eb88b944f",
  DIGITADOR: "c56631f8-8a73-4e7e-8509-c7018bc9ad25",
  LIDER: "122b4e4e-c580-4244-a7f1-8aff23269ccb",
}

export function AddUsuarioDialog({
  open,
  onOpenChange,
  onAddUsuario,
}: AddUsuarioDialogProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "none" as const,
    roleId: "",
    leaderId: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [leaders, setLeaders] = useState<Array<{ id: string; username: string }>>([])

  // Cargar líderes disponibles
  const loadLeaders = async () => {
    try {
      const allUsers = await usersApi.getAll() as any[]
      const leaderUsers = allUsers.filter(
        (user: any) => user.roleId === ROLE_IDS["LIDER"]
      )
      setLeaders(leaderUsers)
    } catch (error) {
      console.error("Error al cargar líderes:", error)
    }
  }

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value as any,
      roleId: value !== "none" ? ROLE_IDS[value] : "",
    })
  }

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
    if (!formData.roleId || formData.role === "none") {
      newErrors.role = "El rol es requerido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    let toastId: string | undefined
    try {
      setIsLoading(true)
      toastId = toast.loading("Creando usuario...", {
        position: 'top-right',
      })

      // Crear usuario mediante API
      const response = await usersApi.create({
        username: formData.username,
        password: formData.password,
        roleId: formData.roleId,
        leaderId: formData.leaderId && formData.leaderId !== "none" ? formData.leaderId : null,
      }) as any

      // Notificar al componente padre
      onAddUsuario({
        id: response.id,
        username: response.username,
        role: formData.role,
        estado: "activo",
        fechaCreacion: response.createdAt
          ? new Date(response.createdAt).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      })

      // Reset form
      setFormData({
        username: "",
        password: "",
        role: "none",
        roleId: "",
        leaderId: "",
      })
      setErrors({})
      
      toast.success("Usuario creado exitosamente", {
        id: toastId,
        duration: 4000,
      })
    } catch (error: any) {
      const errorMessage = error?.message || "Error al crear el usuario"
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
      role: "none",
      roleId: "",
      leaderId: "",
    })
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Completa el formulario para agregar un nuevo usuario al sistema
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

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="font-medium">
              Rol
            </Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger className={errors.role ? "border-destructive" : ""}>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Seleccionar rol</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
                <SelectItem value="DIGITADOR">Digitador</SelectItem>
                <SelectItem value="LIDER">Lider</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive flex gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.role}
              </p>
            )}
          </div>

          {/* Leader */}
          <div className="space-y-2">
            <Label htmlFor="leaderId" className="font-medium">
              Líder (Opcional)
            </Label>
            <Select value={formData.leaderId || "none"} onValueChange={(value) =>
              setFormData({ ...formData, leaderId: value === "none" ? "" : value })
            }>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un líder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin Líder</SelectItem>
                {leaders.map((leader) => (
                  <SelectItem key={leader.id} value={leader.id}>
                    {leader.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-2 text-sm text-destructive"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {errors.submit}
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Creando..." : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
