"use client"

// Dialog para agregar nuevos usuarios
import { useState, useEffect } from "react"
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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"


interface AddUsuarioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddUsuario: (usuario: any) => void
}

interface Role {
  id: string
  name: string
  isActive: boolean
}

interface Leader {
  id: string
  name: string
  phone: string
  address: string
  recommendedById: string | null
  createdAt: string
  updatedAt: string
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
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [leadersLoading, setLeadersLoading] = useState(true)
  const [leaderSearchFilter, setLeaderSearchFilter] = useState("")
  const [roles, setRoles] = useState<Role[]>([])
  const [rolesLoading, setRolesLoading] = useState(true)

  // Construir ROLE_IDS dinámicamente desde los roles del API
  const ROLE_IDS = roles.reduce((acc, role) => {
    acc[role.name] = role.id
    return acc
  }, {} as Record<string, string>)

  // Filtrar líderes según el texto de búsqueda
  const filteredLeaders = leaders.filter((leader) =>
    leader.name.toLowerCase().includes(leaderSearchFilter.toLowerCase()) ||
    leader.phone.includes(leaderSearchFilter) ||
    leader.address.toLowerCase().includes(leaderSearchFilter.toLowerCase())
  )

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

  // Cargar líderes desde el API
  useEffect(() => {
    const loadLeaders = async () => {
      try {
        setLeadersLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/leaders`)
        if (!response.ok) {
          throw new Error("Error al cargar los líderes")
        }
        const leadersData = await response.json()
        setLeaders(leadersData)
      } catch (error) {
        console.error("Error al cargar líderes:", error)
        toast.error("Error al cargar los líderes del sistema")
      } finally {
        setLeadersLoading(false)
      }
    }

    loadLeaders()
  }, [])

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
      setLeaderSearchFilter("")
      setShowPassword(false)

      toast.success("Usuario creado exitosamente", {
        id: toastId,
        duration: 4000,
      })
    } catch (error: any) {
      let errorMessage = error?.message || "Error al crear el usuario"
      
      // Obtener el mensaje de error del objeto error
      const errorBody = error?.message || ""
      
      // Validar si es un error de constraint único en el campo username
      if (errorBody.includes("Unique constraint failed") && errorBody.includes("User_username_key")) {
        errorMessage = `Usuario ya registrado con ese documento de identidad`
      } else if (errorBody.includes("400") || errorBody.includes("Bad Request")) {
        errorMessage = `Usuario ya registrado con ese documento de identidad`
      }
      
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
          <VisuallyHidden>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          </VisuallyHidden>
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
            <Select value={formData.role} onValueChange={handleRoleChange} disabled={rolesLoading}>
              <SelectTrigger className={errors.role ? "border-destructive" : ""}>
                <SelectValue placeholder={rolesLoading ? "Cargando roles..." : "Selecciona un rol"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Seleccionar rol</SelectItem>
                {roles.filter(role => role.isActive).map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
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
          <div className="space-y-2 hidden">
            <Label htmlFor="leaderId" className="font-medium">
              Líder (Opcional)
            </Label>
            <Input
              type="text"
              placeholder="Buscar por nombre, teléfono o dirección"
              value={leaderSearchFilter}
              onChange={(e) => setLeaderSearchFilter(e.target.value)}
              className="mb-2"
              disabled={leadersLoading}
            />
            {leadersLoading ? (
              <p className="text-sm text-muted-foreground">Cargando líderes...</p>
            ) : leaderSearchFilter ? (
              <div className="border border-input rounded-md max-h-48 overflow-y-auto bg-background">
                {filteredLeaders.length > 0 ? (
                  <div className="space-y-1 p-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, leaderId: "" })
                        setLeaderSearchFilter("")
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm transition-colors"
                    >
                      Sin Líder
                    </button>
                    {filteredLeaders.map((leader) => (
                      <button
                        key={leader.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, leaderId: leader.id })
                          setLeaderSearchFilter(leader.name)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-sm transition-colors ${formData.leaderId === leader.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent"
                          }`}
                      >
                        <div className="font-medium">{leader.name}</div>
                        <div className="text-xs opacity-75">{leader.phone} • {leader.address}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-3">No se encontraron líderes con ese criterio</p>
                )}
              </div>
            ) : (
              <div className="border border-input rounded-md p-3 text-sm text-muted-foreground">
                Escribe para buscar líderes
              </div>
            )}
            {formData.leaderId && (
              <div className="p-2 bg-accent rounded-md text-sm">
                <span className="font-medium">Líder seleccionado:</span> {leaders.find(l => l.id === formData.leaderId)?.name}
              </div>
            )}
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
