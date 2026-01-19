"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { leadersApi, usersApi } from "@/lib/api"
import toast from "react-hot-toast"

interface AssignLiderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssign: () => void
}

export function AssignLiderDialog({ open, onOpenChange, onAssign }: AssignLiderDialogProps) {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [lideres, setLideres] = useState<any[]>([])
  const [selectedUserId, setSelectedUserId] = useState("")
  const [selectedLiderId, setSelectedLiderId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (open) {
      loadData()
    }
  }, [open])

  const loadData = async () => {
    try {
      setIsLoadingData(true)
      const [usuariosData, lideresData] = await Promise.all([
        usersApi.getAll(),
        leadersApi.getAll(),
      ])
      setUsuarios(usuariosData as any[])
      setLideres(lideresData as any[])
    } catch (error) {
      console.error("Error cargando datos:", error)
      toast.error("Error al cargar los datos", {
        duration: 4000,
        position: "top-right",
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
    if (!newOpen) {
      resetForm()
    }
  }

  const resetForm = () => {
    setSelectedUserId("")
    setSelectedLiderId("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedUserId || !selectedLiderId) {
      toast.error("Por favor selecciona un usuario y un líder", {
        duration: 4000,
        position: "top-right",
      })
      return
    }

    let toastId: string | undefined
    try {
      setIsLoading(true)
      toastId = toast.loading("Asignando líder...", {
        position: "top-right",
      })

      await leadersApi.assignUser({
        userId: selectedUserId,
        leaderId: selectedLiderId,
      })

      toast.success("Líder asignado exitosamente", {
        id: toastId,
        duration: 4000,
      })

      onAssign()
      resetForm()
      onOpenChange(false)
    } catch (error: any) {
      const errorMessage = error.message || "Error desconocido"
      if (toastId) {
        toast.error(`Error al asignar líder: ${errorMessage}`, {
          id: toastId,
          duration: 4000,
        })
      } else {
        toast.error(`Error al asignar líder: ${errorMessage}`, {
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
          <DialogTitle>Asignar Líder a Usuario</DialogTitle>
          <DialogDescription>
            Selecciona un usuario y un líder para asignarlo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isLoadingData ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin inline-block w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full"></div>
                <p className="mt-2 text-sm text-muted-foreground">Cargando datos...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="usuario-select" className="text-sm font-medium">Usuario</label>
                <select
                  id="usuario-select"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  disabled={isLoading}
                >
                  <option value="">Seleccionar usuario ({usuarios.length})</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.username} ({usuario.role?.name || "Sin rol"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="lider-select" className="text-sm font-medium">Líder</label>
                <select
                  id="lider-select"
                  value={selectedLiderId}
                  onChange={(e) => setSelectedLiderId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  disabled={isLoading}
                >
                  <option value="">Seleccionar líder ({lideres.length})</option>
                  {lideres.map((lider) => (
                    <option key={lider.id} value={lider.id}>
                      {lider.name} ({lider.phone})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

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
              {isLoading ? "Asignando..." : "Asignar Líder"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
