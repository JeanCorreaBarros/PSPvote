"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

import { motion, AnimatePresence } from "framer-motion"
import { Header } from "@/components/header"
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
import { Plus, Search, Edit2, Trash2, MoreVertical, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { votosApi } from "@/lib/api"

interface Votante {
  id: string
  nombres: string
  apellidos: string
  cedula: string
  telefono: string
  direccion: string
  barrio: string
  puestoVotacion: string
  estado: "registrado" | "verificado" | "pendiente"
  fechaRegistro: string
}

const initialVotantes: Votante[] = [
  {
    id: "VT-001",
    nombres: "Juan Carlos",
    apellidos: "Pérez Gómez",
    cedula: "1234567890",
    telefono: "3001234567",
    direccion: "Calle 45 #23-12",
    barrio: "Centro",
    puestoVotacion: "IE San José",
    estado: "verificado",
    fechaRegistro: "15/01/2026",
  },
  {
    id: "VT-002",
    nombres: "María Elena",
    apellidos: "García López",
    cedula: "9876543210",
    telefono: "3109876543",
    direccion: "Carrera 12 #34-56",
    barrio: "La Esperanza",
    puestoVotacion: "IE La Paz",
    estado: "registrado",
    fechaRegistro: "14/01/2026",
  },
  {
    id: "VT-003",
    nombres: "Pedro Antonio",
    apellidos: "Martínez Ruiz",
    cedula: "5678901234",
    telefono: "3205678901",
    direccion: "Avenida 5 #67-89",
    barrio: "San Antonio",
    puestoVotacion: "Coliseo Municipal",
    estado: "pendiente",
    fechaRegistro: "13/01/2026",
  },
  {
    id: "VT-004",
    nombres: "Ana Lucía",
    apellidos: "Rodríguez Castro",
    cedula: "3456789012",
    telefono: "3153456789",
    direccion: "Calle 78 #12-34",
    barrio: "Villa Rosa",
    puestoVotacion: "IE San José",
    estado: "verificado",
    fechaRegistro: "12/01/2026",
  },
  {
    id: "VT-005",
    nombres: "Carlos Eduardo",
    apellidos: "Sánchez Mora",
    cedula: "7890123456",
    telefono: "3007890123",
    direccion: "Carrera 34 #56-78",
    barrio: "El Prado",
    puestoVotacion: "IE La Paz",
    estado: "registrado",
    fechaRegistro: "11/01/2026",
  },
  {
    id: "VT-006",
    nombres: "Laura Patricia",
    apellidos: "Hernández Villa",
    cedula: "2345678901",
    telefono: "3112345678",
    direccion: "Calle 23 #45-67",
    barrio: "Centro",
    puestoVotacion: "Coliseo Municipal",
    estado: "verificado",
    fechaRegistro: "10/01/2026",
  },
  {
    id: "VT-007",
    nombres: "Roberto Luis",
    apellidos: "Díaz Vargas",
    cedula: "8901234567",
    telefono: "3208901234",
    direccion: "Avenida Principal #89-01",
    barrio: "La Esperanza",
    puestoVotacion: "IE San José",
    estado: "pendiente",
    fechaRegistro: "09/01/2026",
  },
  {
    id: "VT-008",
    nombres: "Sofía Carolina",
    apellidos: "Torres Mejía",
    cedula: "4567890123",
    telefono: "3154567890",
    direccion: "Carrera 67 #23-45",
    barrio: "San Antonio",
    puestoVotacion: "IE La Paz",
    estado: "registrado",
    fechaRegistro: "08/01/2026",
  },
]

const tabs = ["Todos", "Verificados", "Registrados", "Pendientes"]

const Loading = () => null

export default function RegistroVotosPage() {
  const searchParams = useSearchParams()
  const [votantes, setVotantes] = useState<Votante[]>(initialVotantes)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("Todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVotante, setEditingVotante] = useState<Votante | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    cedula: "",
    telefono: "",
    direccion: "",
    barrio: "",
    puestoVotacion: "",
  })

  // Cargar votos desde la API
  useEffect(() => {
    const fetchVotos = async () => {
      try {
        setLoading(true)
        setError(null)
        // Descomenta cuando el endpoint esté listo
        // const data = await votosApi.getAll()
        // Convertir a formato Votante si es necesario
        // setVotantes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar votos')
        setVotantes(initialVotantes)
      } finally {
        setLoading(false)
      }
    }

    fetchVotos()
  }, [])

  const filteredVotantes = votantes.filter((votante) => {
    const matchesSearch =
      votante.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      votante.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      votante.cedula.includes(searchTerm)

    const matchesTab =
      activeTab === "Todos" ||
      (activeTab === "Verificados" && votante.estado === "verificado") ||
      (activeTab === "Registrados" && votante.estado === "registrado") ||
      (activeTab === "Pendientes" && votante.estado === "pendiente")

    return matchesSearch && matchesTab
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingVotante) {
      setVotantes(
        votantes.map((v) =>
          v.id === editingVotante.id
            ? { ...v, ...formData }
            : v
        )
      )
    } else {
      const newVotante: Votante = {
        id: `VT-${String(votantes.length + 1).padStart(3, "0")}`,
        ...formData,
        estado: "pendiente",
        fechaRegistro: new Date().toLocaleDateString("es-CO"),
      }
      setVotantes([newVotante, ...votantes])
    }
    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (votante: Votante) => {
    setEditingVotante(votante)
    setFormData({
      nombres: votante.nombres,
      apellidos: votante.apellidos,
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
      nombres: "",
      apellidos: "",
      cedula: "",
      telefono: "",
      direccion: "",
      barrio: "",
      puestoVotacion: "",
    })
    setEditingVotante(null)
  }

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
      <Header title="Registro de Votos" />

      <div className="p-6">
        <Card className="border-border">
          <CardHeader className="border-b border-border">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <CardTitle className="text-foreground text-xl">Listado de Votantes</CardTitle>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por nombre o cédula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-9 bg-muted/50"
                  />
                </div>

                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Filter className="w-4 h-4" />
                  Filtros
                </Button>

                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open)
                  if (!open) resetForm()
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2 bg-primary text-primary-foreground">
                      <Plus className="w-4 h-4" />
                      Nuevo Registro
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">
                        {editingVotante ? "Editar Votante" : "Registrar Nuevo Votante"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nombres">Nombres</Label>
                          <Input
                            id="nombres"
                            value={formData.nombres}
                            onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apellidos">Apellidos</Label>
                          <Input
                            id="apellidos"
                            value={formData.apellidos}
                            onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cedula">Cédula</Label>
                          <Input
                            id="cedula"
                            value={formData.cedula}
                            onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telefono">Teléfono</Label>
                          <Input
                            id="telefono"
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input
                          id="direccion"
                          value={formData.direccion}
                          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="barrio">Barrio</Label>
                          <Input
                            id="barrio"
                            value={formData.barrio}
                            onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="puestoVotacion">Puesto de Votación</Label>
                          <Select
                            value={formData.puestoVotacion}
                            onValueChange={(value) => setFormData({ ...formData, puestoVotacion: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar puesto" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IE San José">IE San José</SelectItem>
                              <SelectItem value="IE La Paz">IE La Paz</SelectItem>
                              <SelectItem value="Coliseo Municipal">Coliseo Municipal</SelectItem>
                              <SelectItem value="Centro Cívico">Centro Cívico</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" className="bg-primary text-primary-foreground">
                          {editingVotante ? "Actualizar" : "Registrar"}
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
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                    activeTab === tab
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
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="text-muted-foreground font-medium">ID</TableHead>
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
                <TableBody>
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
                          <input type="checkbox" className="rounded border-border" />
                        </TableCell>
                        <TableCell className="text-foreground font-medium">{votante.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {votante.nombres.charAt(0)}{votante.apellidos.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-foreground font-medium text-sm">{votante.nombres}</p>
                              <p className="text-muted-foreground text-xs">{votante.apellidos}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground">{votante.cedula}</TableCell>
                        <TableCell className="text-foreground">{votante.telefono}</TableCell>
                        <TableCell className="text-foreground text-sm">{votante.direccion}</TableCell>
                        <TableCell className="text-foreground">{votante.barrio}</TableCell>
                        <TableCell className="text-foreground">{votante.puestoVotacion}</TableCell>
                        <TableCell>{getStatusBadge(votante.estado)}</TableCell>
                        <TableCell className="text-muted-foreground">{votante.fechaRegistro}</TableCell>
                        <TableCell>
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
                              <DropdownMenuItem
                                onClick={() => handleDelete(votante.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
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
