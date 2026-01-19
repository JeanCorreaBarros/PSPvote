"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AddUsuarioDialog } from "@/components/add-usuario-dialog"
import { AddLiderDialog } from "@/components/add-lider-dialog"
import { AssignLiderDialog } from "@/components/assign-lider-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Edit2, Plus, Search, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { usersApi, leadersApi } from "@/lib/api"
import toast from "react-hot-toast"

interface Usuario {
  id: string
  username: string
  password: string
  roleId: string
  leaderId: string | null
  createdAt: string
  role: {
    id: string
    name: string
  }
  leader: {
    id: string
    username: string
  } | null
}

interface Lider {
  id: string
  userId: string
  name: string
  phone: string
  address: string
  recommendedById: string | null
  createdAt: string
}

// Mapeo de colores por rol
const ROLE_COLORS: Record<string, string> = {
  "ADMIN": "bg-red-100 text-red-800 border-red-200",
  "DIGITADOR": "bg-blue-100 text-blue-800 border-blue-200",
  "LIDER": "bg-green-100 text-green-800 border-green-200",
}

export default function UsuariosPage() {
  // Estado para Usuarios
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [searchTermUsuarios, setSearchTermUsuarios] = useState("")
  const [openDialogUsuario, setOpenDialogUsuario] = useState(false)
  const [deleteIdUsuario, setDeleteIdUsuario] = useState<string | null>(null)
  const [isLoadingUsuarios, setIsLoadingUsuarios] = useState(true)
  const [isDeletingUsuario, setIsDeletingUsuario] = useState(false)

  // Estado para Líderes
  const [lideres, setLideres] = useState<Lider[]>([])
  const [searchTermLideres, setSearchTermLideres] = useState("")
  const [openDialogLider, setOpenDialogLider] = useState(false)
  const [deleteIdLider, setDeleteIdLider] = useState<string | null>(null)
  const [isLoadingLideres, setIsLoadingLideres] = useState(true)
  const [isDeletingLider, setIsDeletingLider] = useState(false)

  // Estado para Asignar Líderes
  const [openDialogAsign, setOpenDialogAsign] = useState(false)

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsuarios()
    loadLideres()
  }, [])

  const loadUsuarios = async () => {
    try {
      setIsLoadingUsuarios(true)
      const data = await usersApi.getAll() as any
      setUsuarios(data)
    } catch (error: any) {
      toast.error("Error al cargar usuarios: " + error.message, {
        duration: 4000,
        position: 'top-right',
      })
    } finally {
      setIsLoadingUsuarios(false)
    }
  }

  const loadLideres = async () => {
    try {
      setIsLoadingLideres(true)
      const data = await leadersApi.getAll() as any
      setLideres(data)
    } catch (error: any) {
      toast.error("Error al cargar líderes: " + error.message, {
        duration: 4000,
        position: 'top-right',
      })
    } finally {
      setIsLoadingLideres(false)
    }
  }

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.username.toLowerCase().includes(searchTermUsuarios.toLowerCase())
  )

  const filteredLideres = lideres.filter(
    (lider) =>
      lider.name.toLowerCase().includes(searchTermLideres.toLowerCase())
  )

  const handleAddUsuario = () => {
    setOpenDialogUsuario(false)
    loadUsuarios()
  }

  const handleAddLider = () => {
    setOpenDialogLider(false)
    loadLideres()
  }

  const handleAssignLider = () => {
    setOpenDialogAsign(false)
    loadUsuarios()
  }

  const handleDeleteUsuario = async (id: string) => {
    let toastId: string | undefined
    try {
      setIsDeletingUsuario(true)
      toastId = toast.loading("Eliminando usuario...", {
        position: 'top-right',
      })
      
      await usersApi.delete(id)
      
      setUsuarios(usuarios.filter((u) => u.id !== id))
      setDeleteIdUsuario(null)
      
      toast.success("Usuario eliminado exitosamente", {
        id: toastId,
        duration: 4000,
      })
    } catch (error: any) {
      const errorMessage = error.message || "Error desconocido"
      if (toastId) {
        toast.error(`Error al eliminar usuario: ${errorMessage}`, {
          id: toastId,
          duration: 4000,
        })
      } else {
        toast.error(`Error al eliminar usuario: ${errorMessage}`, {
          duration: 4000,
        })
      }
    } finally {
      setIsDeletingUsuario(false)
    }
  }

  const handleDeleteLider = async (id: string) => {
    let toastId: string | undefined
    try {
      setIsDeletingLider(true)
      toastId = toast.loading("Eliminando líder...", {
        position: 'top-right',
      })
      
      await leadersApi.delete(id)
      
      setLideres(lideres.filter((l) => l.id !== id))
      setDeleteIdLider(null)
      
      toast.success("Líder eliminado exitosamente", {
        id: toastId,
        duration: 4000,
      })
    } catch (error: any) {
      const errorMessage = error.message || "Error desconocido"
      if (toastId) {
        toast.error(`Error al eliminar líder: ${errorMessage}`, {
          id: toastId,
          duration: 4000,
        })
      } else {
        toast.error(`Error al eliminar líder: ${errorMessage}`, {
          duration: 4000,
        })
      }
    } finally {
      setIsDeletingLider(false)
    }
  }

  const getRoleColor = (roleName: string) => {
    return ROLE_COLORS[roleName] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <div className="space-y-8">
      <Header title="Gestión de Usuarios y Líderes" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 p-9"
      >
        <Tabs defaultValue="usuarios" className="w-full">
          <TabsList>
            <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
            <TabsTrigger value="lideres">Líderes</TabsTrigger>
            <TabsTrigger value="asignar">Asignar Líderes</TabsTrigger>
          </TabsList>

          {/* TAB: USUARIOS */}
          <TabsContent value="usuarios" className="space-y-6">
            {/* Controles */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="w-full sm:w-64 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuario..."
                  value={searchTermUsuarios}
                  onChange={(e) => setSearchTermUsuarios(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => setOpenDialogUsuario(true)}
                className="bg-primary hover:bg-primary/90 gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Nuevo Usuario
              </Button>
            </div>

            {/* Tabla de Usuarios */}
            <Card>
              <CardHeader>
                <CardTitle>Usuarios del Sistema</CardTitle>
                <CardDescription>Total: {filteredUsuarios.length} usuario(s)</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUsuarios ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Cargando usuarios...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead className="font-semibold">Usuario</TableHead>
                          <TableHead className="font-semibold">Rol</TableHead>
                          <TableHead className="font-semibold">Fecha de Creación</TableHead>
                          <TableHead className="font-semibold text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsuarios.length > 0 ? (
                          filteredUsuarios.map((usuario) => (
                            <TableRow key={usuario.id} className="border-border hover:bg-muted/50">
                              <TableCell className="font-medium">{usuario.username}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getRoleColor(usuario.role.name)}>
                                  {usuario.role.name}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(usuario.createdAt).toLocaleDateString("es-ES", { 
                                  year: "numeric", 
                                  month: "2-digit", 
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                  onClick={() => setDeleteIdUsuario(usuario.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              No hay usuarios que coincidan con la búsqueda
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: LIDERES */}
          <TabsContent value="lideres" className="space-y-6">
            {/* Controles */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="w-full sm:w-64 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar líder..."
                  value={searchTermLideres}
                  onChange={(e) => setSearchTermLideres(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => setOpenDialogLider(true)}
                className="bg-primary hover:bg-primary/90 gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Nuevo Líder
              </Button>
            </div>

            {/* Tabla de Líderes */}
            <Card>
              <CardHeader>
                <CardTitle>Líderes del Sistema</CardTitle>
                <CardDescription>Total: {filteredLideres.length} líder(es)</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingLideres ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Cargando líderes...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead className="font-semibold">Nombre</TableHead>
                          <TableHead className="font-semibold">Teléfono</TableHead>
                          <TableHead className="font-semibold">Dirección</TableHead>
                          <TableHead className="font-semibold">Fecha de Creación</TableHead>
                          <TableHead className="font-semibold text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLideres.length > 0 ? (
                          filteredLideres.map((lider) => (
                            <TableRow key={lider.id} className="border-border hover:bg-muted/50">
                              <TableCell className="font-medium">{lider.name}</TableCell>
                              <TableCell>{lider.phone}</TableCell>
                              <TableCell>{lider.address}</TableCell>
                              <TableCell>
                                {new Date(lider.createdAt).toLocaleDateString("es-ES", { 
                                  year: "numeric", 
                                  month: "2-digit", 
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                  onClick={() => setDeleteIdLider(lider.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              No hay líderes que coincidan con la búsqueda
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: ASIGNAR LIDERES */}
          <TabsContent value="asignar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Asignar Líderes a Usuarios</CardTitle>
                <CardDescription>
                  Selecciona un usuario y asígnale un líder de referencia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setOpenDialogAsign(true)}
                  className="bg-primary hover:bg-primary/90 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Asignar Líder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Dialog Agregar Usuario */}
      <AddUsuarioDialog
        open={openDialogUsuario}
        onOpenChange={setOpenDialogUsuario}
        onAddUsuario={handleAddUsuario}
      />

      {/* Dialog Agregar Líder */}
      <AddLiderDialog
        open={openDialogLider}
        onOpenChange={setOpenDialogLider}
        onAddLider={handleAddLider}
      />

      {/* Dialog Asignar Líder */}
      <AssignLiderDialog
        open={openDialogAsign}
        onOpenChange={setOpenDialogAsign}
        onAssign={handleAssignLider}
      />

      {/* Dialog Eliminar Usuario */}
      <AlertDialog open={deleteIdUsuario !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Usuario</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel onClick={() => setDeleteIdUsuario(null)} disabled={isDeletingUsuario}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteIdUsuario && handleDeleteUsuario(deleteIdUsuario)}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isDeletingUsuario}
            >
              {isDeletingUsuario ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Eliminar Líder */}
      <AlertDialog open={deleteIdLider !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Líder</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar este líder? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel onClick={() => setDeleteIdLider(null)} disabled={isDeletingLider}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteIdLider && handleDeleteLider(deleteIdLider)}
              className="bg-destructive hover:bg-destructive/90"
              disabled={isDeletingLider}
            >
              {isDeletingLider ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
