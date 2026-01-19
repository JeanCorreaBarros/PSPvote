"use client"

import { useState } from "react"
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

export function AddLiderDialog({ open, onOpenChange, onAddLider }: AddLiderDialogProps) {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [lideres, setLideres] = useState<any[]>([])
  const [selectedUserId, setSelectedUserId] = useState("")
  const [selectedRecommendedById, setSelectedRecommendedById] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showUserSelect, setShowUserSelect] = useState(false)
  const [showRecommendedSelect, setShowRecommendedSelect] = useState(false)

  const handleOpenChange = async (newOpen: boolean) => {
    onOpenChange(newOpen)
    if (newOpen) {
      try {
        const [usuariosData, lideresData] = await Promise.all([
          usersApi.getAll(),
          leadersApi.getAll(),
        ])
        setUsuarios(usuariosData)
        setLideres(lideresData)
      } catch (error) {
        console.error("Error cargando datos:", error)
      }
    } else {
      resetForm()
    }
  }

  const resetForm = () => {
    setSelectedUserId("")
    setSelectedRecommendedById("")
    setName("")
    setPhone("")
    setAddress("")
    setShowUserSelect(false)
    setShowRecommendedSelect(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !phone || !address) {
      toast.error("Por favor completa los campos requeridos (Nombre, Teléfono, Dirección)", {
        duration: 4000,
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
        duration: 4000,
      })

      onAddLider(newLider)
      resetForm()
      onOpenChange(false)
    } catch (error: any) {
      const errorMessage = error.message || "Error desconocido"
      if (toastId) {
        toast.error(`Error al crear líder: ${errorMessage}`, {
          id: toastId,
          duration: 4000,
        })
      } else {
        toast.error(`Error al crear líder: ${errorMessage}`, {
          duration: 4000,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Líder</DialogTitle>
          <DialogDescription>
            Crea un nuevo líder en el sistema. Completa todos los campos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 hidden">
            <Label htmlFor="user-select">Usuario (Opcional)</Label>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowUserSelect(!showUserSelect)}
              className="w-full justify-start"
            >
              {selectedUserId
                ? usuarios.find((u) => u.id === selectedUserId)?.username || "Seleccionar usuario"
                : "Seleccionar usuario (opcional)"}
            </Button>
            {showUserSelect && (
              <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUserId("")
                    setShowUserSelect(false)
                  }}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                >
                  Sin usuario
                </button>
                {usuarios.map((usuario) => (
                  <button
                    key={usuario.id}
                    type="button"
                    onClick={() => {
                      setSelectedUserId(usuario.id)
                      setShowUserSelect(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {usuario.username} ({usuario.role?.name || "Sin rol"})
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              placeholder="Nombre del líder"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              placeholder="Ej: 3001234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              placeholder="Ej: Barrio Centro"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2 hidden">
            <Label htmlFor="recommended-select">Líder Recomendado por (Opcional)</Label>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowRecommendedSelect(!showRecommendedSelect)}
              className="w-full justify-start"
            >
              {selectedRecommendedById
                ? lideres.find((l) => l.id === selectedRecommendedById)?.name || "Seleccionar líder"
                : "Seleccionar líder (opcional)"}
            </Button>
            {showRecommendedSelect && (
              <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRecommendedById("")
                    setShowRecommendedSelect(false)
                  }}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                >
                  Sin recomendante
                </button>
                {lideres.map((lider) => (
                  <button
                    key={lider.id}
                    type="button"
                    onClick={() => {
                      setSelectedRecommendedById(lider.id)
                      setShowRecommendedSelect(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {lider.name} ({lider.phone})
                  </button>
                ))}
              </div>
            )}
          </div>

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
