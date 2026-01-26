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
import { EditUsuarioDialog } from "@/components/edit-usuario-dialog"
import { EditLiderDialog } from "@/components/edit-lider-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Edit2, Plus, Search, Loader2, Power, PowerOff } from "lucide-react"
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
  isActive: boolean
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
  isActive: boolean
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
  const [currentPageUsuarios, setCurrentPageUsuarios] = useState(1)
  const [openDialogUsuario, setOpenDialogUsuario] = useState(false)
  const [openEditDialogUsuario, setOpenEditDialogUsuario] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null)
  const [toggleStatusIdUsuario, setToggleStatusIdUsuario] = useState<string | null>(null)
  const [isLoadingUsuarios, setIsLoadingUsuarios] = useState(true)
  const [isTogglingStatusUsuario, setIsTogglingStatusUsuario] = useState(false)

  // Estado para Líderes
  const [lideres, setLideres] = useState<Lider[]>([])
  const [searchTermLideres, setSearchTermLideres] = useState("")
  const [currentPageLideres, setCurrentPageLideres] = useState(1)
  const [openDialogLider, setOpenDialogLider] = useState(false)
  const [openEditDialogLider, setOpenEditDialogLider] = useState(false)
  const [liderSeleccionado, setLiderSeleccionado] = useState<Lider | null>(null)
  const [toggleStatusIdLider, setToggleStatusIdLider] = useState<string | null>(null)
  const [deleteIdLider, setDeleteIdLider] = useState<string | null>(null)
  const [isLoadingLideres, setIsLoadingLideres] = useState(true)
  const [isDeletingLider, setIsDeletingLider] = useState(false)
  const [isTogglingStatusLider, setIsTogglingStatusLider] = useState(false)

  // Estado para Asignar Líderes
  const [openDialogAsign, setOpenDialogAsign] = useState(false)
  const [lideresConUsuarios, setLideresConUsuarios] = useState<any[]>([])
  const [currentPageAsign, setCurrentPageAsign] = useState(1)
  const [isLoadingAsign, setIsLoadingAsign] = useState(true)

  // Estado para rastrear la pestaña activa
  const [activeTab, setActiveTab] = useState("usuarios")

  const ITEMS_PER_PAGE = 10

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsuarios()
    loadLideres()
    loadLideresConUsuarios()
  }, [])

  // Recargar datos cuando cambia de tab
  useEffect(() => {
    if (activeTab === "usuarios") {
      loadUsuarios()
    } else if (activeTab === "lideres") {
      loadLideres()
    } else if (activeTab === "asignar") {
      loadLideresConUsuarios()
    }
  }, [activeTab])

  // Recargar usuarios cuando se abre el modal de agregar líder
  useEffect(() => {
    if (openDialogLider) {
      loadUsuarios()
    }
  }, [openDialogLider])

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

  const loadLideresConUsuarios = async () => {
    try {
      setIsLoadingAsign(true)
      const token = localStorage.getItem('pspvote_token')

      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/leaders`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Error al cargar los líderes')
      }

      const data = await response.json()
      setLideresConUsuarios(data)
    } catch (error: any) {
      toast.error("Error al cargar líderes: " + error.message, {
        duration: 4000,
        position: 'top-right',
      })
    } finally {
      setIsLoadingAsign(false)
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

  // Paginación de Usuarios
  const paginatedUsuarios = filteredUsuarios.slice(
    (currentPageUsuarios - 1) * ITEMS_PER_PAGE,
    currentPageUsuarios * ITEMS_PER_PAGE
  )
  const totalPagesUsuarios = Math.ceil(filteredUsuarios.length / ITEMS_PER_PAGE)

  // Paginación de Líderes
  const paginatedLideres = filteredLideres.slice(
    (currentPageLideres - 1) * ITEMS_PER_PAGE,
    currentPageLideres * ITEMS_PER_PAGE
  )
  const totalPagesLideres = Math.ceil(filteredLideres.length / ITEMS_PER_PAGE)

  // Paginación de Asignar Líderes
  const paginatedLideresConUsuarios = lideresConUsuarios.slice(
    (currentPageAsign - 1) * ITEMS_PER_PAGE,
    currentPageAsign * ITEMS_PER_PAGE
  )
  const totalPagesAsign = Math.ceil(lideresConUsuarios.length / ITEMS_PER_PAGE)

  const handleAddUsuario = () => {
    setOpenDialogUsuario(false)
    setCurrentPageUsuarios(1)
    loadUsuarios()
  }

  const handleEditUsuario = () => {
    setOpenEditDialogUsuario(false)
    setUsuarioSeleccionado(null)
    loadUsuarios()
  }

  const handleOpenEditDialog = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario)
    setOpenEditDialogUsuario(true)
  }

  const handleAddLider = () => {
    setOpenDialogLider(false)
    setCurrentPageLideres(1)
    loadLideres()
  }

  const handleEditLider = () => {
    setOpenEditDialogLider(false)
    setLiderSeleccionado(null)
    loadLideres()
  }

  const handleOpenEditDialogLider = (lider: Lider) => {
    setLiderSeleccionado(lider)
    setOpenEditDialogLider(true)
  }

  const handleAssignLider = () => {
    setOpenDialogAsign(false)
    loadUsuarios()
    loadLideresConUsuarios()
  }

  const handleToggleStatusUsuario = async (id: string) => {
    let toastId: string | undefined
    try {
      setIsTogglingStatusUsuario(true)
      const token = localStorage.getItem('pspvote_token')

      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      toastId = toast.loading("Actualizando estado...", {
        position: 'top-right',
      })
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del usuario')
      }

      const data = await response.json()
      const updatedUser = data.user
      
      setUsuarios(usuarios.map((u) => u.id === id ? updatedUser : u))
      setToggleStatusIdUsuario(null)
      
      const statusMessage = updatedUser.isActive ? "Usuario activado exitosamente" : "Usuario desactivado exitosamente"
      toast.success(statusMessage, {
        id: toastId,
        duration: 4000,
      })
    } catch (error: any) {
      const errorMessage = error.message || "Error desconocido"
      if (toastId) {
        toast.error(`Error al actualizar estado: ${errorMessage}`, {
          id: toastId,
          duration: 4000,
        })
      } else {
        toast.error(`Error al actualizar estado: ${errorMessage}`, {
          duration: 4000,
        })
      }
    } finally {
      setIsTogglingStatusUsuario(false)
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

  const handleToggleStatusLider = async (id: string) => {
    let toastId: string | undefined
    try {
      setIsTogglingStatusLider(true)
      const token = localStorage.getItem('pspvote_token')

      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      toastId = toast.loading("Actualizando estado...", {
        position: 'top-right',
      })
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/leaders/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del líder')
      }

      const data = await response.json()
      const updatedLider = data.leader
      
      setLideres(lideres.map((l) => l.id === id ? updatedLider : l))
      setToggleStatusIdLider(null)
      
      const statusMessage = updatedLider.isActive ? "Líder activado exitosamente" : "Líder desactivado exitosamente"
      toast.success(statusMessage, {
        id: toastId,
        duration: 4000,
      })
    } catch (error: any) {
      const errorMessage = error.message || "Error desconocido"
      if (toastId) {
        toast.error(`Error al actualizar estado: ${errorMessage}`, {
          id: toastId,
          duration: 4000,
        })
      } else {
        toast.error(`Error al actualizar estado: ${errorMessage}`, {
          duration: 4000,
        })
      }
    } finally {
      setIsTogglingStatusLider(false)
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
            <TabsTrigger value="lideres">Líderes</TabsTrigger>
            <TabsTrigger  value="asignar">Asignar Líderes</TabsTrigger>
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
                  <div>
                    <div className="overflow-x-auto" style={{ maxHeight: filteredUsuarios.length > 8 ? "500px" : "auto", overflowY: "auto" }}>
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
                          {paginatedUsuarios.length > 0 ? (
                            paginatedUsuarios.map((usuario) => (
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
                                    onClick={() => handleOpenEditDialog(usuario)}
                                    title="Editar usuario"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className={usuario.isActive ? "text-orange-600 hover:text-orange-800 hover:bg-orange-50" : "text-green-600 hover:text-green-800 hover:bg-green-50"}
                                    onClick={() => setToggleStatusIdUsuario(usuario.id)}
                                    title={usuario.isActive ? "Desactivar usuario" : "Activar usuario"}
                                  >
                                    {usuario.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
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

                    {/* Paginación */}
                    {filteredUsuarios.length > 0 && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          Mostrando {((currentPageUsuarios - 1) * ITEMS_PER_PAGE) + 1} a {Math.min(currentPageUsuarios * ITEMS_PER_PAGE, filteredUsuarios.length)} de {filteredUsuarios.length} usuarios
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPageUsuarios(Math.max(1, currentPageUsuarios - 1))}
                            disabled={currentPageUsuarios === 1}
                          >
                            Anterior
                          </Button>
                          <div className="flex items-center gap-2 px-2">
                            <span className="text-sm font-medium">
                              Página {currentPageUsuarios} de {totalPagesUsuarios}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPageUsuarios(Math.min(totalPagesUsuarios, currentPageUsuarios + 1))}
                            disabled={currentPageUsuarios === totalPagesUsuarios}
                          >
                            Siguiente
                          </Button>
                        </div>
                      </div>
                    )}
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
                  <div>
                    <div className="overflow-x-auto" style={{ maxHeight: filteredLideres.length > 8 ? "500px" : "auto", overflowY: "auto" }}>
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
                          {paginatedLideres.length > 0 ? (
                            paginatedLideres.map((lider) => (
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
                                    onClick={() => handleOpenEditDialogLider(lider)}
                                    title="Editar líder"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className={lider.isActive ? "text-orange-600 hover:text-orange-800 hover:bg-orange-50" : "text-green-600 hover:text-green-800 hover:bg-green-50"}
                                    onClick={() => setToggleStatusIdLider(lider.id)}
                                    title={lider.isActive ? "Desactivar líder" : "Activar líder"}
                                  >
                                    {lider.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
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

                    {/* Paginación */}
                    {filteredLideres.length > 0 && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          Mostrando {((currentPageLideres - 1) * ITEMS_PER_PAGE) + 1} a {Math.min(currentPageLideres * ITEMS_PER_PAGE, filteredLideres.length)} de {filteredLideres.length} líderes
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPageLideres(Math.max(1, currentPageLideres - 1))}
                            disabled={currentPageLideres === 1}
                          >
                            Anterior
                          </Button>
                          <div className="flex items-center gap-2 px-2">
                            <span className="text-sm font-medium">
                              Página {currentPageLideres} de {totalPagesLideres}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPageLideres(Math.min(totalPagesLideres, currentPageLideres + 1))}
                            disabled={currentPageLideres === totalPagesLideres}
                          >
                            Siguiente
                          </Button>
                        </div>
                      </div>
                    )}
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
                  Visualiza los líderes y los usuarios asignados a cada uno
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

            {/* Tabla de Líderes con Usuarios Asignados */}
            <Card>
              <CardHeader>
                <CardTitle>Líderes y Usuarios Asignados</CardTitle>
                <CardDescription>Total: {lideresConUsuarios.length} líder(es)</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAsign ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Cargando líderes...</span>
                  </div>
                ) : (
                  <div>
                    <div className="overflow-x-auto" style={{ maxHeight: lideresConUsuarios.length > 8 ? "500px" : "auto", overflowY: "auto" }}>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border">
                            <TableHead className="font-semibold">Nombre</TableHead>
                            <TableHead className="font-semibold">Teléfono</TableHead>
                            <TableHead className="font-semibold">Dirección</TableHead>
                            <TableHead className="font-semibold">Usuarios Asignados</TableHead>
                            <TableHead className="font-semibold text-center">Cantidad</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedLideresConUsuarios.length > 0 ? (
                            paginatedLideresConUsuarios.map((lider) => (
                              <TableRow 
                                key={lider.id} 
                                className={`border-border ${!lider.isActive ? 'bg-red-100 text-red-900' : 'hover:bg-muted/50'}`}
                              >
                                <TableCell className="font-medium">{lider.name}</TableCell>
                                <TableCell>{lider.phone}</TableCell>
                                <TableCell>{lider.address}</TableCell>
                                <TableCell>
                                  {lider.users && lider.users.length > 0 ? (
                                    <div className="space-y-1">
                                      {lider.users.map((user: any) => (
                                        <Badge key={user.id} variant="secondary" className="block w-fit">
                                          {user.username}
                                        </Badge>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">Sin usuarios asignados</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant={lider.users?.length > 0 ? "default" : "outline"}>
                                    {lider.users?.length || 0}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                No hay líderes registrados
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Paginación */}
                    {lideresConUsuarios.length > 0 && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          Mostrando {((currentPageAsign - 1) * ITEMS_PER_PAGE) + 1} a {Math.min(currentPageAsign * ITEMS_PER_PAGE, lideresConUsuarios.length)} de {lideresConUsuarios.length} líderes
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPageAsign(Math.max(1, currentPageAsign - 1))}
                            disabled={currentPageAsign === 1}
                          >
                            Anterior
                          </Button>
                          <div className="flex items-center gap-2 px-2">
                            <span className="text-sm font-medium">
                              Página {currentPageAsign} de {totalPagesAsign}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPageAsign(Math.min(totalPagesAsign, currentPageAsign + 1))}
                            disabled={currentPageAsign === totalPagesAsign}
                          >
                            Siguiente
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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

      {/* Dialog Editar Usuario */}
      <EditUsuarioDialog
        open={openEditDialogUsuario}
        onOpenChange={setOpenEditDialogUsuario}
        onEditUsuario={handleEditUsuario}
        usuario={usuarioSeleccionado}
      />

      {/* Dialog Editar Líder */}
      <EditLiderDialog
        open={openEditDialogLider}
        onOpenChange={setOpenEditDialogLider}
        onEditLider={handleEditLider}
        lider={liderSeleccionado}
      />

      {/* Dialog Asignar Líder */}
      <AssignLiderDialog
        open={openDialogAsign}
        onOpenChange={setOpenDialogAsign}
        onAssign={handleAssignLider}
      />

      {/* Dialog Toggle Status Usuario */}
      <AlertDialog open={toggleStatusIdUsuario !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {usuarios.find(u => u.id === toggleStatusIdUsuario)?.isActive ? "Desactivar Usuario" : "Activar Usuario"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {usuarios.find(u => u.id === toggleStatusIdUsuario)?.isActive 
                ? "¿Estás seguro de que deseas desactivar este usuario?" 
                : "¿Estás seguro de que deseas activar este usuario?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel onClick={() => setToggleStatusIdUsuario(null)} disabled={isTogglingStatusUsuario}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toggleStatusIdUsuario && handleToggleStatusUsuario(toggleStatusIdUsuario)}
              className={usuarios.find(u => u.id === toggleStatusIdUsuario)?.isActive ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"}
              disabled={isTogglingStatusUsuario}
            >
              {isTogglingStatusUsuario ? "Actualizando..." : (usuarios.find(u => u.id === toggleStatusIdUsuario)?.isActive ? "Desactivar" : "Activar")}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Toggle Status Líder */}
      <AlertDialog open={toggleStatusIdLider !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {lideres.find(l => l.id === toggleStatusIdLider)?.isActive ? "Desactivar Líder" : "Activar Líder"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lideres.find(l => l.id === toggleStatusIdLider)?.isActive 
                ? "¿Estás seguro de que deseas desactivar este líder?" 
                : "¿Estás seguro de que deseas activar este líder?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel onClick={() => setToggleStatusIdLider(null)} disabled={isTogglingStatusLider}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toggleStatusIdLider && handleToggleStatusLider(toggleStatusIdLider)}
              className={lideres.find(l => l.id === toggleStatusIdLider)?.isActive ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"}
              disabled={isTogglingStatusLider}
            >
              {isTogglingStatusLider ? "Actualizando..." : (lideres.find(l => l.id === toggleStatusIdLider)?.isActive ? "Desactivar" : "Activar")}
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
