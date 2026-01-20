"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import toast from "react-hot-toast"

import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/header"
import { HelpButton } from "@/components/help-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Search, Edit2, Trash2, MoreVertical, Filter, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { votosApi } from "@/lib/api"
import { logout, getRoleFromToken } from "@/lib/auth"
import { registroVotosTour, registrarVotanteTour, registrarVotanteModalTour } from "@/lib/tours-config"
import { useRegistrarVotanteTour } from "@/hooks/use-registrar-votante-tour"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"


interface PuestoVotacion {
  id: string
  codUnic: string
  departamento: string
  municipio: string
  puesto: string
  mujeres: number
  hombres: number
  total: number
  mesas: number
  comuna: string | null
  direccion: string
  latitud: string
  longitud: string
  createdAt: string
  updatedAt: string
}

interface Votante {
  id: string
  nombre1: string
  apellido1: string
  cedula: string
  telefono: string
  direccion: string
  barrio: string
  puestoVotacion: string
  estado: "registrado" | "verificado" | "pendiente"
  fechaRegistro: string
}

// Los datos se cargan desde el API
const initialVotantes: Votante[] = []

const tabs = ["Todos", /*"Verificados", "Registrados", "Pendientes"*/]

const Loading = () => null

export default function RegistroVotosPage() {
  const searchParams = useSearchParams()
  const [votantes, setVotantes] = useState<Votante[]>(initialVotantes)
  const [puestosVotacion, setPuestosVotacion] = useState<PuestoVotacion[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("Todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVotante, setEditingVotante] = useState<Votante | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchPuesto, setSearchPuesto] = useState("")
  const [showPuestosDropdown, setShowPuestosDropdown] = useState(false)
  const [loadingPuestos, setLoadingPuestos] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)

  // Hook para el tour automático del modal
  useRegistrarVotanteTour(isDialogOpen && !editingVotante)

  useEffect(() => {
    // Obtener el rol del token
    const role = getRoleFromToken()
    setUserRole(role)
  }, [])

  const [formData, setFormData] = useState({
    nombre1: "",
    apellido1: "",
    cedula: "",
    telefono: "",
    direccion: "",
    barrio: "",
    puestoVotacion: "",
  })

  // Cargar puestos de votación desde la API
  useEffect(() => {
    const fetchPuestos = async () => {
      try {
        setLoadingPuestos(true)
        const token = localStorage.getItem('pspvote_token')

        if (!token) {
          throw new Error('No hay token de autenticación')
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/puestos-votacion`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Error al cargar los puestos de votación')
        }

        const data = await response.json()
        if (Array.isArray(data)) {
          setPuestosVotacion(data)
        }
      } catch (err) {
        console.error('Error al cargar puestos:', err)
        toast.error('Error al cargar los puestos de votación')
      } finally {
        setLoadingPuestos(false)
      }
    }

    fetchPuestos()
  }, [])

  // Cargar votos desde la API
  useEffect(() => {
    const fetchVotos = async () => {
      try {
        setLoading(true)
        setError(null)
        const token = localStorage.getItem('pspvote_token')

        if (!token) {
          throw new Error('No hay token de autenticación')
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/votaciones`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error('Error al cargar los votos')
        }
        const data = await response.json()

        if (Array.isArray(data)) {
          const votantesFormateados = data.map((votante: any) => ({
            id: votante.id,
            nombre1: votante.nombre1 || '',
            apellido1: votante.apellido1 || '',
            cedula: votante.cedula,
            telefono: votante.telefono,
            direccion: votante.direccion,
            barrio: votante.barrio,
            puestoVotacion: votante.puestoVotacion,
            estado: "registrado" as const,
            fechaRegistro: new Date(votante.createdAt).toLocaleDateString("es-CO"),
          }))
          setVotantes(votantesFormateados)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar votos')
        toast.error('Error al cargar los votos desde el servidor')
      } finally {
        setLoading(false)
      }
    }

    fetchVotos()
  }, [])

  const filteredVotantes = votantes.filter((votante) => {
    const matchesSearch =
      votante.nombre1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      votante.apellido1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      votante.cedula.includes(searchTerm)

    const matchesTab =
      activeTab === "Todos" ||
      (activeTab === "Verificados" && votante.estado === "verificado") ||
      (activeTab === "Registrados" && votante.estado === "registrado") ||
      (activeTab === "Pendientes" && votante.estado === "pendiente")

    return matchesSearch && matchesTab
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)

      if (editingVotante) {
        // Para edición, solo actualizar localmente
        setVotantes(
          votantes.map((v) =>
            v.id === editingVotante.id
              ? { ...v, ...formData }
              : v
          )
        )
        toast.success('Votante actualizado correctamente')
      } else {
        // Para registro nuevo, consumir el endpoint
        const token = localStorage.getItem('pspvote_token')

        if (!token) {
          throw new Error('No hay token de autenticación')
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/votaciones`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error('Error al registrar el votante')
        }

        const nuevoVotante = await response.json()

        // Agregar el nuevo votante a la tabla
        const votanteFormateado: Votante = {
          id: nuevoVotante.id,
          nombre1: nuevoVotante.nombre1,
          apellido1: nuevoVotante.apellido1,
          cedula: nuevoVotante.cedula,
          telefono: nuevoVotante.telefono,
          direccion: nuevoVotante.direccion,
          barrio: nuevoVotante.barrio,
          puestoVotacion: nuevoVotante.puestoVotacion,
          estado: "registrado",
          fechaRegistro: new Date(nuevoVotante.createdAt).toLocaleDateString("es-CO"),
        }

        setVotantes([votanteFormateado, ...votantes])
        toast.success('¡Votante registrado con éxito!')
      }

      resetForm()
      setIsDialogOpen(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (votante: Votante) => {
    setEditingVotante(votante)
    setFormData({
      nombre1: votante.nombre1,
      apellido1: votante.apellido1,
      cedula: votante.cedula,
      telefono: votante.telefono,
      direccion: votante.direccion,
      barrio: votante.barrio,
      puestoVotacion: votante.puestoVotacion,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setVotantes(votantes.filter((v) => v.id !== id))
  }

  const resetForm = () => {
    setFormData({
      nombre1: "",
      apellido1: "",
      cedula: "",
      telefono: "",
      direccion: "",
      barrio: "",
      puestoVotacion: "",
    })
    setEditingVotante(null)
    setSearchPuesto("")
  }

  const puestosFiltered = puestosVotacion.filter((puesto) =>
    puesto.puesto.toLowerCase().includes(searchPuesto.toLowerCase())
  )

  const puestoSeleccionado = puestosVotacion.find((p) => p.id === formData.puestoVotacion)

  const getStatusBadge = (estado: Votante["estado"]) => {
    const styles = {
      verificado: "bg-accent/10 text-accent border-accent/20",
      registrado: "bg-primary/10 text-primary border-primary/20",
      pendiente: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    }
    const labels = {
      verificado: "Verificado",
      registrado: "Registrado",
      pendiente: "Pendiente",
    }
    return (
      <Badge variant="outline" className={styles[estado]}>
        {labels[estado]}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen">
      <Header title="Registro de Votos" tours={[
        { name: "Guía de Registro de Votos", steps: registroVotosTour },
      ]} />

      <div className="p-6">
        <Card className="border-border">
          <CardHeader className="border-b border-border">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <CardTitle id="registro-titulo" className="text-foreground text-xl">Listado de Votantes</CardTitle>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div id="registro-busqueda" className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por nombre o cédula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-9 bg-muted/50"
                  />
                </div>

                <Button variant="outline" size="sm" className="gap-2 hidden bg-transparent">
                  <Filter className="w-4 h-4" />
                  Filtros
                </Button>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) resetForm()
                }}>
                  <DialogTrigger asChild>
                    <Button id="registro-nuevo-btn" size="sm" className="gap-2 w-full md:w-auto bg-primary text-primary-foreground">
                      <Plus className="w-4 h-4" />
                      Nuevo Registro
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="md:max-w-2xl " onClick={() => setShowPuestosDropdown(false)}>
                    <VisuallyHidden>
                      <DialogTitle id="modal-titulo-votante">
                        {editingVotante ? "Editar Votante" : "Registrar Nuevo Votante"}
                      </DialogTitle>
                    </VisuallyHidden>


                    <DialogHeader className="flex flex-row items-center justify-between pr-8">
                      <h2 className="text-lg font-semibold text-foreground">
                        {editingVotante ? "Editar Votante" : "Registrar Nuevo Votante"}
                      </h2>
                      {!editingVotante && (
                        <HelpButton tours={[{ name: "Guía del Modal", steps: registrarVotanteModalTour }]} />
                      )}
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4" onClick={(e) => e.stopPropagation()}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="form-nombres">Nombres</Label>
                          <Input
                            id="form-nombres"
                            value={formData.nombre1}
                            onChange={(e) => setFormData({ ...formData, nombre1: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="form-apellidos">Apellidos</Label>
                          <Input
                            id="form-apellidos"
                            value={formData.apellido1}
                            onChange={(e) => setFormData({ ...formData, apellido1: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="form-cedula">Cédula</Label>
                          <Input
                            id="form-cedula"
                            value={formData.cedula}
                            onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="form-telefono">Teléfono</Label>
                          <Input
                            id="form-telefono"
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="form-direccion">Dirección</Label>
                        <Input
                          id="form-direccion"
                          value={formData.direccion}
                          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="form-barrio">Barrio</Label>
                          <Input
                            id="form-barrio"
                            value={formData.barrio}
                            onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
                            required
                          />
                        </div>
                        <div id="form-puesto" className="space-y-2">
                          <Label htmlFor="puestoVotacion">Puesto de Votación</Label>
                          <div className="relative">
                            <div className="flex items-center gap-2 border-2 border-input rounded-md px-3 py-2 bg-background focus-within:border-primary transition-colors">
                              <Search className="w-4 h-4 text-muted-foreground" />
                              <input
                                id="puestoVotacion"
                                type="text"
                                placeholder="Buscar puesto..."
                                value={searchPuesto}
                                onChange={(e) => setSearchPuesto(e.target.value)}
                                onClick={() => setShowPuestosDropdown(true)}
                                onFocus={() => setShowPuestosDropdown(true)}
                                className="flex-1 bg-transparent outline-none text-sm"
                              />
                              {searchPuesto && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSearchPuesto("")
                                    setShowPuestosDropdown(true)
                                  }}
                                  className="text-muted-foreground hover:text-foreground transition-colors"
                                  title="Limpiar búsqueda"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            {showPuestosDropdown && (
                              <div className="absolute top-full left-0 right-0 mt-1 border border-border rounded-md bg-background shadow-lg z-50 max-h-64 overflow-y-auto">
                                <div className="p-2 border-b border-border text-xs text-muted-foreground">
                                  {puestosFiltered.length} {puestosFiltered.length === 1 ? "puesto encontrado" : "puestos encontrados"}
                                </div>
                                {puestosFiltered.length > 0 ? (
                                  puestosFiltered.map((puesto) => (
                                    <button
                                      key={puesto.id}
                                      type="button"
                                      onClick={() => {
                                        setFormData({ ...formData, puestoVotacion: puesto.id })
                                        setSearchPuesto("")
                                        setShowPuestosDropdown(false)
                                      }}
                                      className={`w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors border-b border-border last:border-b-0 ${formData.puestoVotacion === puesto.id ? "bg-accent text-accent-foreground font-medium" : ""
                                        }`}
                                    >
                                      {puesto.puesto}
                                    </button>
                                  ))
                                ) : (
                                  <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                                    No se encontraron puestos
                                  </div>
                                )}
                              </div>
                            )}

                            {formData.puestoVotacion && (
                              <div className="mt-2 p-3 bg-accent/10 rounded-md border border-accent/30 flex items-start justify-between">
                                <div>
                                  <p className="text-xs text-muted-foreground font-medium">Puesto seleccionado:</p>
                                  <p className="text-sm text-foreground font-medium">{puestoSeleccionado?.puesto}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, puestoVotacion: "" })
                                    setSearchPuesto("")
                                  }}
                                  className="text-muted-foreground hover:text-foreground ml-2"
                                  title="Cambiar selección"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button id="form-submit" type="submit" className="bg-primary text-primary-foreground" disabled={loading}>
                          {loading ? "Registrando..." : editingVotante ? "Actualizar" : "Registrar"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-4 border-b border-border -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === tab
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow id="registro-tabla-header" className="border-border hover:bg-transparent">
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="text-muted-foreground font-medium max-w-32 truncate">ID</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Votante</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Cédula</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Teléfono</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Dirección</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Barrio</TableHead>
                    <TableHead className="text-muted-foreground font-medium">P. Votación</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Estado</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Fecha</TableHead>
                    <TableHead className="text-muted-foreground font-medium w-12">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody id="registro-tabla">
                  <AnimatePresence mode="popLayout">
                    {filteredVotantes.map((votante, index) => (
                      <motion.tr
                        key={votante.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-border hover:bg-muted/50"
                      >
                        <TableCell>
                          <input type="checkbox" className="rounded border-border ml-5" />
                        </TableCell>
                        <TableCell className="text-foreground font-medium max-w-32 truncate" title={votante.id}>{votante.id}</TableCell>
                        <TableCell id="tabla-avatar">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {votante.nombre1.charAt(0)}{votante.apellido1.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div id="tabla-nombre">
                              <p className="text-foreground font-medium text-xs">{votante.nombre1}</p>
                              <p className="text-muted-foreground text-xs">{votante.apellido1}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground">{votante.cedula}</TableCell>
                        <TableCell className="text-foreground  max-w-20 truncate">{votante.telefono}</TableCell>
                        <TableCell className="text-foreground  max-w-20 truncate text-sm">{votante.direccion}</TableCell>
                        <TableCell className="text-foreground  max-w-32 truncate">{votante.barrio}</TableCell>
                        <TableCell className="text-foreground  max-w-32 truncate">{votante.puestoVotacion}</TableCell>
                        <TableCell id="tabla-estado">{getStatusBadge(votante.estado)}</TableCell>
                        <TableCell className="text-muted-foreground">{votante.fechaRegistro}</TableCell>
                        <TableCell id="tabla-acciones">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(votante)}>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              {userRole === "ADMIN" && (
                                <DropdownMenuItem
                                  onClick={() => handleDelete(votante.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {filteredVotantes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron votantes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { Loading }
