"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, Eye } from "lucide-react"
import { motion } from "framer-motion"

export interface UsuarioScaneado {
  id: string
  nombre: string
  apellido: string
  cedula: string
  nacimiento: string
  genero: string
  nacionalidad: string
  fechaCaptura: string
}

interface UsuariosTableProps {
  usuarios: UsuarioScaneado[]
  onDelete: (id: string) => void
  onView: (usuario: UsuarioScaneado) => void
}

export function UsuariosTable({ usuarios, onDelete, onView }: UsuariosTableProps) {
  if (usuarios.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay usuarios escaneados aún</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border rounded-lg overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Nombre</TableHead>
            <TableHead className="font-semibold">Cédula</TableHead>
            <TableHead className="font-semibold">Nacimiento</TableHead>
            <TableHead className="font-semibold">Género</TableHead>
            <TableHead className="font-semibold">Fecha Captura</TableHead>
            <TableHead className="text-right font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios.map((usuario, index) => (
            <motion.tr
              key={usuario.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-t hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-medium">
                {usuario.nombre} {usuario.apellido}
              </TableCell>
              <TableCell className="font-mono text-sm">{usuario.cedula}</TableCell>
              <TableCell>{usuario.nacimiento}</TableCell>
              <TableCell>{usuario.genero}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(usuario.fechaCaptura).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onView(usuario)}
                  className="h-8"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(usuario.id)}
                  className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  )
}
