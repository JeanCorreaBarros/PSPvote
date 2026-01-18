"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface Puesto {
  id: number
  nombre: string
}

interface DeletePuestoDialogProps {
  puesto: Puesto
  onPuestoDeleted?: () => void
}

export function DeletePuestoDialog({ puesto, onPuestoDeleted }: DeletePuestoDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      // Simular API call
      // Descomenta cuando el endpoint esté listo:
      // const response = await fetch(`/api/puestos/${puesto.id}`, {
      //   method: "DELETE",
      // })

      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Puesto eliminado:", puesto.id)
      onPuestoDeleted?.()
    } catch (err) {
      console.error("Error al eliminar puesto:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar puesto de votación?</AlertDialogTitle>
          <AlertDialogDescription>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="mb-2">
                Estás a punto de eliminar el puesto <strong>"{puesto.nombre}"</strong>.
              </p>
              <p className="text-red-600 font-medium">
                Esta acción no se puede deshacer. Todos los datos asociados se eliminarán permanentemente.
              </p>
            </motion.div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3 justify-end">
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 gap-2"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Eliminar
              </>
            )}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
