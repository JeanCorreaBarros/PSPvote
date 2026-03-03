"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { leadersApi, usersApi } from "@/lib/api"
import toast from "react-hot-toast"

interface AddLiderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddLider: (lider: any) => void
}

export function AddLiderDialog({
  open,
  onOpenChange,
  onAddLider,
}: AddLiderDialogProps) {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [lideres, setLideres] = useState<any[]>([])
  const [selectedUserId, setSelectedUserId] = useState("")
  const [selectedRecommendedById, setSelectedRecommendedById] = useState("")
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showUserSelect, setShowUserSelect] = useState(false)
  const [showRecommendedSelect, setShowRecommendedSelect] = useState(false)

  // 🔥 Usuarios disponibles (activos y sin líder asignado)
  const usuariosDisponibles = usuarios.filter(
    (u) => u.isActive && !u.leader
  )

  // 🔥 Filtrar usuarios por búsqueda
  const usuariosFiltrados = usuariosDisponibles.filter((usuario) =>
    usuario.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    usuario.role?.name?.toLowerCase().includes(userSearchTerm.toLowerCase())
  )

  // Función para cargar los usuarios
  const loadUsuarios = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`)
      if (!response.ok) {
        throw new Error("Error al cargar los usuarios")
      }
      const userData = await response.json()
      setUsuarios(userData)
    } catch (error) {
      console.error("Error al cargar usuarios:", error)
      toast.error("Error al cargar los usuarios del sistema")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsuarios()
  }, [])

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
    if (!newOpen) {
      resetForm()
    }
  }

  const resetForm = () => {
    setSelectedUserId("")
    setSelectedRecommendedById("")
    setUserSearchTerm("")
    setName("")
    setPhone("")
    setAddress("")
    setShowUserSelect(false)
    setShowRecommendedSelect(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !phone || !address) {
      toast.error("Completa los campos obligatorios", {
        position: "top-right",
      })
      return
    }

    let toastId: string | undefined

    try {
      setIsLoading(true)
      toastId = toast.loading("Creando líder...", {
        position: "top-right",
      })

      const newLider = await leadersApi.create({
        userId: selectedUserId || null,
        name,
        phone,
        address,
        recommendedById: selectedRecommendedById || null,
      })

      toast.success("Líder creado exitosamente", {
        id: toastId,
      })

      onAddLider(newLider)
      resetForm()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(
        `Error al crear líder: ${error?.message || "Error desconocido"}`,
        { id: toastId }
      )
    } finally {
      setIsLoading(false)
    }
  }

  console.log("usuariosDisponibles", usuariosDisponibles)
  console.log("selectedUserId", usuarios)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Líder</DialogTitle>
          <DialogDescription>
            Completa la información para crear un nuevo líder.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ================= USUARIO ================= */}
          <div className="space-y-2">
            <Label>Usuario (Opcional)</Label>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowUserSelect(!showUserSelect)
                if (!showUserSelect) {
                  loadUsuarios()
                }
              }}
              className="w-full justify-between"
            >
              {selectedUserId
                ? usuarios.find((u) => u.id === selectedUserId)?.username
                : "Seleccionar usuario"}
            </Button>

            {showUserSelect && (
              <div className="border rounded-md p-2 bg-background space-y-2">
                <Input
                  type="text"
                  placeholder="Buscar usuario o rol..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="h-8"
                  autoFocus
                />
                <div className="max-h-48 overflow-y-auto space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUserId("")
                      setShowUserSelect(false)
                      setUserSearchTerm("")
                    }}
                    className="w-full text-left px-3 py-2 rounded text-muted-foreground hover:bg-muted"
                  >
                    Sin usuario
                  </button>

                  {usuariosFiltrados.map((usuario) => (
                    <button
                      key={usuario.id}
                      type="button"
                      onClick={() => {
                        setSelectedUserId(usuario.id)
                        setShowUserSelect(false)
                        setUserSearchTerm("")
                      }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-muted"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {usuario.username}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Rol: {usuario.role?.name}
                        </span>
                      </div>
                    </button>
                  ))}

                  {usuariosFiltrados.length === 0 && (
                    <p className="px-3 py-2 text-sm text-muted-foreground text-center">
                      No hay usuarios disponibles
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ================= NOMBRE ================= */}
          <div className="space-y-2">
            <Label>Nombre *</Label>
            <Input
              placeholder="Nombre del líder"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* ================= TELÉFONO ================= */}
          <div className="space-y-2">
            <Label>Teléfono *</Label>
            <Input
              placeholder="Ej: 3001234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* ================= DIRECCIÓN ================= */}
          <div className="space-y-2">
            <Label>Dirección *</Label>
            <Input
              placeholder="Ej: Barrio Centro"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* ================= BOTONES ================= */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creando..." : "Crear Líder"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
