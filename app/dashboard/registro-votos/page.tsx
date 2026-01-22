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

interface Recomendado {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

interface Programa {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

interface ProgramaOpcion {
  label: string
  programaId: string
  sedeId: string | null
  tipoVinculacionId: string
  esPago: boolean
}

interface Votante {
  id: string
  idnumber: string
  nombre1: string
  nombre2?: string
  apellido1: string
  apellido2?: string
  cedula: string
  telefono: string
  direccion: string
  barrio: string
  puestoVotacion: string
  estado: "registrado" | "verificado" | "pendiente"
  fechaRegistro: string
  recomendado?: string
  programa?: string
  creadoPor?: string
}

// Los datos se cargan desde el API
const initialVotantes: Votante[] = []

const tabs = ["Todos", /*"Verificados", "Registrados", "Pendientes"*/]

const Loading = () => null

export default function RegistroVotosPage() {
  const searchParams = useSearchParams()
  const [votantes, setVotantes] = useState<Votante[]>(initialVotantes)
  const [puestosVotacion, setPuestosVotacion] = useState<PuestoVotacion[]>([])
  const [recomendados, setRecomendados] = useState<Recomendado[]>([])
  const [programas, setProgramas] = useState<Programa[]>([])
  const [programasOpciones, setProgramasOpciones] = useState<ProgramaOpcion[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("Todos")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVotante, setEditingVotante] = useState<Votante | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchPuesto, setSearchPuesto] = useState("")
  const [searchRecomendado, setSearchRecomendado] = useState("")
  const [searchPrograma, setSearchPrograma] = useState("")
  const [showPuestosDropdown, setShowPuestosDropdown] = useState(false)
  const [showRecomendadosDropdown, setShowRecomendadosDropdown] = useState(false)
  const [showProgramasDropdown, setShowProgramasDropdown] = useState(false)
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const [loadingPuestos, setLoadingPuestos] = useState(true)
  const [loadingRecomendados, setLoadingRecomendados] = useState(true)
  const [loadingProgramas, setLoadingProgramas] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Hook para el tour automático del modal
  useRegistrarVotanteTour(isDialogOpen && !editingVotante)

  // Función para cargar votos desde la API
  const refetchVotos = async () => {
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
          idnumber: votante.idnumber || 'N/A',
          id: votante.id || '',
          nombre1: votante.nombre1 || 'Sin nombre',
          nombre2: votante.nombre2 || undefined,
          apellido1: votante.apellido1 || 'Sin apellido',
          apellido2: votante.apellido2 || undefined,
          cedula: votante.cedula || 'N/A',
          telefono: votante.telefono || 'N/A',
          direccion: votante.direccion || 'N/A',
          barrio: votante.barrio || 'N/A',
          puestoVotacion: votante.puestoVotacion || 'N/A',
          estado: "registrado" as const,
          fechaRegistro: votante.createdAt ? new Date(votante.createdAt).toLocaleDateString("es-CO") : new Date().toLocaleDateString("es-CO"),
          creadoPor: votante.leader?.name || 'N/A',
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

  useEffect(() => {
    // Obtener el rol del token
    const role = getRoleFromToken()
    setUserRole(role)

    // Obtener el nombre del usuario del sessionStorage
    const userDataStr = sessionStorage.getItem('pspvote_user')
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr)
        setUserName(userData.leader?.name || userData.username || "sin leader asociado")
      } catch (err) {
        console.error('Error al parsear datos del usuario:', err)
      }
    }
  }, [])

  const initialFormData = {
    nombre1: "",
    nombre2: "",
    apellido1: "",
    apellido2: "",
    cedula: "",
    telefono: "",
    direccion: "",
    barrio: "",
    puestoVotacion: "",
    recommendedById: "",
    programaId: "",
    sedeId: "",
    tipoVinculacionId: "",
    esPago: Boolean(false),
  }

  const [formData, setFormData] = useState(initialFormData)

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

  // Cargar recomendados desde la API
  useEffect(() => {
    const fetchRecomendados = async () => {
      try {
        setLoadingRecomendados(true)
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
          throw new Error('Error al cargar los recomendados')
        }

        const data = await response.json()
        if (Array.isArray(data)) {
          setRecomendados(data)
        }
      } catch (err) {
        console.error('Error al cargar recomendados:', err)
        toast.error('Error al cargar los recomendados')
      } finally {
        setLoadingRecomendados(false)
      }
    }

    fetchRecomendados()
  }, [])

  // Cargar opciones de programas desde la API
  useEffect(() => {
    const fetchProgramasOpciones = async () => {
      try {
        setLoadingProgramas(true)
        const token = localStorage.getItem('pspvote_token')

        if (!token) {
          throw new Error('No hay token de autenticación')
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/programas/opciones`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Error al cargar las opciones de programas')
        }

        const data = await response.json()
        if (Array.isArray(data)) {
          setProgramasOpciones(data)
        }
      } catch (err) {
        console.error('Error al cargar opciones de programas:', err)
        toast.error('Error al cargar las opciones de programas')
      } finally {
        setLoadingProgramas(false)
      }
    }

    fetchProgramasOpciones()
  }, [])

  // Cargar votos desde la API al montar el componente
  useEffect(() => {
    refetchVotos()
  }, [])

  // Función para normalizar texto (remover tildes y convertir a minúsculas)
  const normalizeText = (text: string | undefined | null) => {
    if (!text) return ''
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  }

  // Función para dividir nombres o apellidos si contienen espacio
  const splitNameFields = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/)
    return {
      first: parts[0] || '',
      second: parts[1] || '',
    }
  }

  const filteredVotantes = votantes.filter((votante) => {
    const normalizedSearch = normalizeText(searchTerm)
    const matchesSearch =
      normalizeText(votante.nombre1).includes(normalizedSearch) ||
      normalizeText(votante.apellido1).includes(normalizedSearch) ||
      (votante.cedula && votante.cedula.includes(searchTerm))

    const matchesTab =
      activeTab === "Todos" ||
      (activeTab === "Verificados" && votante.estado === "verificado") ||
      (activeTab === "Registrados" && votante.estado === "registrado") ||
      (activeTab === "Pendientes" && votante.estado === "pendiente")

    return matchesSearch && matchesTab
  })

  // Lógica de paginación
  const totalPages = Math.ceil(filteredVotantes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedVotantes = filteredVotantes.slice(startIndex, endIndex)

  // Resetear a página 1 cuando cambia el filtro
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, activeTab])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!formData.nombre1 || !formData.apellido1 || !formData.cedula || !formData.puestoVotacion) {
      toast.error('Por favor completa los campos requeridos')
      return
    }


    try {
      setLoading(true)

      // Dividir nombres y apellidos si contienen espacios
      const nombreSplit = splitNameFields(formData.nombre1 || '')
      const apellidoSplit = splitNameFields(formData.apellido1 || '')

      const dataToSend = {
        nombre1: nombreSplit.first,
        nombre2: nombreSplit.second || undefined,
        apellido1: apellidoSplit.first,
        apellido2: apellidoSplit.second || undefined,
        cedula: formData.cedula || '',
        telefono: formData.telefono || '',
        direccion: formData.direccion || '',
        barrio: formData.barrio || '',
        puestoVotacion: formData.puestoVotacion || '',
        recommendedById: formData.recommendedById || undefined,
        programaId: formData.programaId || undefined,
        sedeId: formData.sedeId || undefined,
        tipoId: formData.tipoVinculacionId || undefined,
        esPago: formData.esPago,
      }

      if (editingVotante) {
        // Para edición, enviar los cambios al API
        const token = localStorage.getItem('pspvote_token')

        if (!token) {
          throw new Error('No hay token de autenticación')
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/votaciones/${editingVotante.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre1: dataToSend.nombre1,
            nombre2: dataToSend.nombre2 ?? null,
            apellido1: dataToSend.apellido1,
            apellido2: dataToSend.apellido2 ?? null,
            cedula: dataToSend.cedula,
            telefono: dataToSend.telefono,
            direccion: dataToSend.direccion,
            barrio: dataToSend.barrio,
            puestoVotacion: dataToSend.puestoVotacion,
            recommendedById: dataToSend.recommendedById ?? null,
            programaId: dataToSend.programaId ?? null,
            sedeId: dataToSend.sedeId,
            tipoId: dataToSend.tipoId ?? null,
            esPago: dataToSend.esPago,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          if (response.status === 401 || errorData.error === 'No autorizado') {
            throw new Error('El usuario no está autorizado para esta función')
          }
          throw new Error(errorData.message || 'Error al actualizar el votante')
        }

        // Recargar la lista de votantes desde la API
        await refetchVotos()
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
          body: JSON.stringify({
            nombre1: dataToSend.nombre1,
            nombre2: dataToSend.nombre2 ?? null,
            apellido1: dataToSend.apellido1,
            apellido2: dataToSend.apellido2 ?? null,
            cedula: dataToSend.cedula,
            telefono: dataToSend.telefono,
            direccion: dataToSend.direccion,
            barrio: dataToSend.barrio,
            puestoVotacion: dataToSend.puestoVotacion,
            recommendedById: dataToSend.recommendedById ?? null,
            programaId: dataToSend.programaId ?? null,
            sedeId: dataToSend.sedeId,
            tipoId: dataToSend.tipoId ?? null,
            esPago: dataToSend.esPago,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          if (response.status === 401 || errorData.error === 'No autorizado') {
            throw new Error('El usuario no está autorizado para esta función')
          }
          throw new Error(errorData.message || 'Error al registrar el votante')
        }

        const nuevoVotante = await response.json()

        // Recargar la lista de votantes desde la API
        await refetchVotos()
        toast.success('¡Votante registrado con éxito!')
      }

      resetForm()
      setIsDialogOpen(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar'
      toast.error(errorMessage)
      console.error('Error en handleSubmit:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (votante: Votante) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('pspvote_token')

      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      // Obtener los datos completos del votante desde el API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/votaciones/${votante.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('El usuario no está autorizado para esta función')
        }
        const errorData = await response.json().catch(() => ({}))
        if (errorData.error === 'No autorizado') {
          throw new Error('El usuario no está autorizado para esta función')
        }
        throw new Error('Error al cargar los datos del votante')
      }

      const votanteData = await response.json()

      setEditingVotante(votante)
      setFormData({
        nombre1: votanteData.nombre2 ? `${votanteData.nombre1} ${votanteData.nombre2}` : (votanteData.nombre1 || ""),
        nombre2: "",
        apellido1: votanteData.apellido2 ? `${votanteData.apellido1} ${votanteData.apellido2}` : (votanteData.apellido1 || ""),
        apellido2: "",
        cedula: votanteData.cedula || "",
        telefono: votanteData.telefono || "",
        direccion: votanteData.direccion || "",
        barrio: votanteData.barrio || "",
        puestoVotacion: votanteData.puestoVotacion || "",
        recommendedById: votanteData.recommendedById || "",
        programaId: votanteData.programaId || "",
        sedeId: votanteData.sedeId || "",
        tipoVinculacionId: votanteData.tipoId || "",
        esPago: votanteData.esPago || false,
      })

      // Cargar los nombres de los campos seleccionados
      const puestoSelec = puestosVotacion.find(p => p.id === votanteData.puestoVotacion)
      if (puestoSelec) {
        setSearchPuesto(puestoSelec.puesto)
      }

      const recomendadoSelec = recomendados.find(r => r.id === votanteData.recommendedById)
      if (recomendadoSelec) {
        setSearchRecomendado(recomendadoSelec.name)
      }

      const programaSelec = programasOpciones.find(
        p => p.programaId === votanteData.programaId && p.tipoVinculacionId === votanteData.tipoId
      )
      if (programaSelec) {
        setSearchPrograma(programaSelec.label)
      }

      setIsDialogOpen(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos'
      toast.error(errorMessage)
      console.error('Error en handleEdit:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    setVotantes(votantes.filter((v) => v.id !== id))
  }

  // Función para detectar si hay cambios sin guardar
  const hasUnsavedChanges = () => {
    if (editingVotante) return false // Si está editando, no mostrar confirmación

    return (
      formData.nombre1 !== "" ||
      formData.apellido1 !== "" ||
      formData.cedula !== "" ||
      formData.telefono !== "" ||
      formData.direccion !== "" ||
      formData.barrio !== "" ||
      formData.puestoVotacion !== "" ||
      formData.recommendedById !== "" ||
      formData.programaId !== "" ||
      formData.sedeId !== "" ||
      formData.tipoVinculacionId !== "" ||
      formData.esPago !== false // 👈 AÑADIR
    )
  }

  // Función para manejar el cierre del modal
  const handleCloseDialog = (open: boolean) => {
    if (!open && hasUnsavedChanges()) {
      setShowConfirmClose(true)
    } else {
      setIsDialogOpen(open)
      if (!open) resetForm()
    }
  }

  // Función para confirmar el cierre sin guardar
  const handleConfirmClose = () => {
    setShowConfirmClose(false)
    setIsDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setEditingVotante(null)
    setSearchPuesto("")
    setSearchRecomendado("")
    setSearchPrograma("")
  }

  const puestosFiltered = puestosVotacion.filter((puesto) =>
    puesto.puesto.toLowerCase().includes(searchPuesto.toLowerCase())
  )

  const recomendadosFiltered = recomendados.filter((rec) =>
    rec.name.toLowerCase().includes(searchRecomendado.toLowerCase())
  )

  const programasOpsFiltered = programasOpciones.filter((prog) =>
    prog.label.toLowerCase().includes(searchPrograma.toLowerCase())
  )

  const puestoSeleccionado = puestosVotacion.find((p) => p.id === formData.puestoVotacion)

  const recomendadoSeleccionado = recomendados.find((r) => r.id === formData.recommendedById)

  const programaSeleccionado = programasOpciones.find((p) => p.programaId === formData.programaId && p.tipoVinculacionId === formData.tipoVinculacionId)

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

                <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                  <DialogTrigger asChild>
                    <Button id="registro-nuevo-btn" size="sm" className="gap-2 w-full md:w-auto bg-primary text-primary-foreground">
                      <Plus className="w-4 h-4" />
                      Nuevo Registro
                    </Button>
                  </DialogTrigger>

                  {/* Modal personalizado */}
                  {isDialogOpen && (
                    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
                      <div className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="flex flex-col gap-3 border-b border-border p-6 pb-4 sticky top-0 bg-background">

                          {/* HEADER — NO SE TOCA */}
                          <div className="flex flex-row items-center justify-between">
                            <h2 className="text-lg font-semibold text-foreground">
                              {editingVotante ? "Editar Votante" : "Registrar Nuevo Votante"}
                            </h2>

                            <div className="flex gap-2 items-center">
                              {!editingVotante && (
                                <HelpButton tours={[{ name: "Guía del Modal", steps: registrarVotanteModalTour }]} />
                              )}
                              <button
                                onClick={() => {
                                  if (editingVotante || !hasUnsavedChanges()) {
                                    resetForm()
                                    setIsDialogOpen(false)
                                  } else {
                                    setShowConfirmClose(true)
                                  }
                                }}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                title="Cerrar"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          {/* FILA: IZQUIERDA (RJ) | DERECHA (LEADER) */}
                          <div className="flex flex-col md:flex-row gap-4 items-start">

                            {/* IZQUIERDA */}
                            {userName && (
                              <div
                                className="flex items-center gap-2 md:w-1/2"
                                id="form-registrando-para"
                              >
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                    {(userName || "")
                                      .split(" ")
                                      .map(n => n.charAt(0))
                                      .join("")
                                      .substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>

                                <div>
                                  <p className="text-xs text-muted-foreground font-medium">
                                    Registrando para <span className="font-bold">Líder</span>:
                                  </p>
                                  <p className="text-sm font-medium text-foreground">
                                    {userName || "sin líder asociado"}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* DERECHA */}
                            <div className="space-y-2 md:w-1/2" id="form-leader">
                              <Label htmlFor="leaderId">Recomendado por</Label>

                              <div className="relative">
                                <div className="flex items-center gap-2 border-2 border-input rounded-md px-3 py-2 bg-background focus-within:border-primary transition-colors">
                                  <Search className="w-4 h-4 text-muted-foreground" />
                                  <input
                                    id="leaderId"
                                    type="text"
                                    placeholder="Buscar Recomendado..."
                                    value={searchRecomendado}
                                    onChange={(e) => setSearchRecomendado(e.target.value)}
                                    onFocus={() => setShowRecomendadosDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowRecomendadosDropdown(false), 200)}
                                    className="flex-1 bg-transparent outline-none text-sm"
                                  />
                                  {searchRecomendado && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSearchRecomendado("")
                                        setShowRecomendadosDropdown(true)
                                      }}
                                      className="text-muted-foreground hover:text-foreground"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>

                                {showRecomendadosDropdown && (
                                  <div className="absolute top-full left-0 right-0 mt-1 border border-border rounded-md bg-background shadow-lg z-50 max-h-64 overflow-y-auto">
                                    {recomendadosFiltered.length > 0 ? (
                                      recomendadosFiltered.map((rec) => (
                                        <button
                                          key={rec.id}
                                          type="button"
                                          onMouseDown={() => {
                                            setFormData({ ...formData, recommendedById: rec.id })
                                            setSearchRecomendado(rec.name)
                                            setShowRecomendadosDropdown(false)
                                          }}
                                          className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
                                        >
                                          {rec.name}
                                        </button>
                                      ))
                                    ) : (
                                      <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                                        No se encontraron recomendados
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>
                        </div>


                        {/* Formulario */}
                        <form onSubmit={handleSubmit} className="space-y-4 p-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="form-nombres">Nombres</Label>
                              <Input
                                id="form-nombres"
                                value={formData.nombre1}
                                onChange={(e) => setFormData({ ...formData, nombre1: e.target.value })}
                                placeholder="Ej: Juan Manuel"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="form-apellidos">Apellidos</Label>
                              <Input
                                id="form-apellidos"
                                value={formData.apellido1}
                                onChange={(e) => setFormData({ ...formData, apellido1: e.target.value })}
                                placeholder="Ej: Martinez Lopez"
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
                                    onChange={(e) => {
                                      setSearchPuesto(e.target.value)
                                      setFormData({ ...formData, puestoVotacion: "" })
                                      setShowPuestosDropdown(true)
                                    }}
                                    onFocus={() => setShowPuestosDropdown(true)}
                                    className="flex-1 bg-transparent outline-none text-sm"
                                  />

                                  {searchPuesto && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSearchPuesto("")
                                        setFormData({ ...formData, puestoVotacion: "" })
                                        setShowPuestosDropdown(true)
                                      }}
                                      className="text-muted-foreground hover:text-foreground transition-colors"
                                      title="Limpiar"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>

                                {/* DROPDOWN */}
                                {showPuestosDropdown && (
                                  <div className="absolute top-full left-0 right-0 mt-1 border border-border rounded-md bg-background shadow-lg z-50 max-h-64 overflow-y-auto">
                                    <div className="p-2 border-b border-border text-xs text-muted-foreground">
                                      {puestosFiltered.length}{" "}
                                      {puestosFiltered.length === 1 ? "puesto encontrado" : "puestos encontrados"}
                                    </div>

                                    {puestosFiltered.length > 0 ? (
                                      puestosFiltered.map((puesto) => (
                                        <button
                                          key={puesto.id}
                                          type="button"
                                          onMouseDown={() => {
                                            setFormData({ ...formData, puestoVotacion: puesto.id })
                                            setSearchPuesto(puesto.puesto)
                                            setShowPuestosDropdown(false)
                                          }}
                                          className={`w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors border-b border-border last:border-b-0
                                            ${formData.puestoVotacion === puesto.id
                                              ? "bg-accent text-accent-foreground font-medium"
                                              : ""
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
                              </div>
                            </div>

                          </div>

                          {/* Leader */}
                          {/*<div className="space-y-2" id="form-leader">
                            <Label htmlFor="leaderId">Líder</Label>
                            <div className="relative">
                              <div className="flex items-center gap-2 border-2 border-input rounded-md px-3 py-2 bg-background focus-within:border-primary transition-colors">
                                <Search className="w-4 h-4 text-muted-foreground" />
                                <input
                                  id="leaderId"
                                  type="text"
                                  placeholder="Buscar líder..."
                                  value={searchRecomendado}
                                  onChange={(e) => setSearchRecomendado(e.target.value)}
                                  onClick={() => setShowRecomendadosDropdown(true)}
                                  onFocus={() => setShowRecomendadosDropdown(true)}
                                  onBlur={() => setTimeout(() => setShowRecomendadosDropdown(false), 200)}
                                  className="flex-1 bg-transparent outline-none text-sm"
                                />
                                {searchRecomendado && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSearchRecomendado("")
                                      setShowRecomendadosDropdown(true)
                                    }}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                    title="Limpiar búsqueda"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>

                              {showRecomendadosDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 border border-border rounded-md bg-background shadow-lg z-50 max-h-64 overflow-y-auto">
                                  <div className="p-2 border-b border-border text-xs text-muted-foreground">
                                    {recomendadosFiltered.length} {recomendadosFiltered.length === 1 ? "recomendado encontrado" : "recomendados encontrados"}
                                  </div>
                                  {recomendadosFiltered.length > 0 ? (
                                    recomendadosFiltered.map((rec) => (
                                      <button
                                        key={rec.id}
                                        type="button"
                                        onMouseDown={() => {
                                          setFormData({ ...formData, recommendedById: rec.id })
                                          setSearchRecomendado(rec.name)
                                          setShowRecomendadosDropdown(false)
                                        }}
                                        className={`w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors border-b border-border last:border-b-0 ${formData.recommendedById === rec.id ? "bg-accent text-accent-foreground font-medium" : ""
                                          }`}
                                      >
                                        {rec.name}
                                      </button>
                                    ))
                                  ) : (
                                    <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                                      No se encontraron recomendados
                                    </div>
                                  )}
                                </div>
                              )}

                              {formData.recommendedById && (
                                <div className="mt-2 p-3 bg-accent/10 rounded-md border border-accent/30 flex items-start justify-between">
                                  <div>
                                    <p className="text-xs text-muted-foreground font-medium">Líder seleccionado:</p>
                                    <p className="text-sm text-foreground font-medium">{recomendadoSeleccionado?.name}</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormData({ ...formData, recommendedById: "" })
                                      setSearchRecomendado("")
                                    }}
                                    className="text-muted-foreground hover:text-foreground ml-2"
                                    title="Cambiar selección"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>*/}

                          {/* Programa */}
                          <div className="space-y-2" id="form-programa">
                            <Label htmlFor="programa">Programa</Label>

                            <div className="relative">
                              <div className="flex items-center gap-2 border-2 border-input rounded-md px-3 py-2 bg-background focus-within:border-primary transition-colors">
                                <Search className="w-4 h-4 text-muted-foreground" />

                                <input
                                  id="programa"
                                  type="text"
                                  placeholder="Buscar programa..."
                                  value={searchPrograma}
                                  onChange={(e) => {
                                    setSearchPrograma(e.target.value)
                                    setFormData({
                                      ...formData,
                                      programaId: "",
                                      sedeId: "",
                                      tipoVinculacionId: "",
                                      esPago: false,
                                    })
                                    setShowProgramasDropdown(true)
                                  }}
                                  onFocus={() => setShowProgramasDropdown(true)}
                                  className="flex-1 bg-transparent outline-none text-sm"
                                />

                                {searchPrograma && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSearchPrograma("")
                                      setFormData({
                                        ...formData,
                                        programaId: "",
                                        sedeId: "",
                                        tipoVinculacionId: "",
                                        esPago: false,
                                      })
                                      setShowProgramasDropdown(true)
                                    }}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                    title="Limpiar"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>

                              {/* DROPDOWN */}
                              {showProgramasDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 border border-border rounded-md bg-background shadow-lg z-50 max-h-64 overflow-y-auto">
                                  <div className="p-2 border-b border-border text-xs text-muted-foreground">
                                    {programasOpsFiltered.length}{" "}
                                    {programasOpsFiltered.length === 1
                                      ? "programa encontrado"
                                      : "programas encontrados"}
                                  </div>

                                  {programasOpsFiltered.length > 0 ? (
                                    programasOpsFiltered.map((prog) => (
                                      <button
                                        key={`${prog.programaId}-${prog.sedeId}-${prog.tipoVinculacionId}`}
                                        type="button"
                                        onMouseDown={() => {
                                          setFormData({
                                            ...formData,
                                            programaId: prog.programaId,
                                            sedeId: prog.sedeId || "",
                                            tipoVinculacionId: prog.tipoVinculacionId,
                                            esPago: prog.esPago,
                                          })
                                          setSearchPrograma(prog.label)
                                          setShowProgramasDropdown(false)
                                        }}
                                        className={`w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors border-b border-border last:border-b-0
                ${formData.programaId === prog.programaId &&
                                            formData.tipoVinculacionId === prog.tipoVinculacionId
                                            ? "bg-accent text-accent-foreground font-medium"
                                            : ""
                                          }`}
                                      >
                                        {prog.label}
                                      </button>
                                    ))
                                  ) : (
                                    <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                                      No se encontraron programas
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>


                          {/* Botones */}
                          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
                            <Button type="button" variant="outline" onClick={() => {
                              if (editingVotante || !hasUnsavedChanges()) {
                                resetForm()
                                setIsDialogOpen(false)
                              } else {
                                setShowConfirmClose(true)
                              }
                            }}>
                              Cancelar
                            </Button>
                            <Button id="form-submit" type="submit" className="bg-primary text-primary-foreground" disabled={loading}>
                              {loading ? "Registrando..." : editingVotante ? "Actualizar" : "Registrar"}
                            </Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
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
                    {userRole === "ADMIN" && (
                      <TableHead className="text-muted-foreground font-medium">Creado Por</TableHead>
                    )}
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
                    {paginatedVotantes.map((votante, index) => (
                      <motion.tr
                        key={votante.id || `votante-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-border hover:bg-muted/50"
                      >
                        <TableCell>
                          <input type="checkbox" className="rounded border-border ml-5" />
                        </TableCell>
                        <TableCell className="text-foreground font-medium max-w-32 truncate" title={votante.id}>{votante.idnumber}</TableCell>
                         {userRole === "ADMIN" && (
                          <TableCell className="text-foreground font-medium max-w-32 truncate text-sm" title={votante.creadoPor}>{votante.creadoPor}</TableCell>
                        )}
                        <TableCell id="tabla-avatar">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {(votante.nombre1 || '').charAt(0)}{(votante.apellido1 || '').charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div id="tabla-nombre">
                              <p className="text-foreground font-medium text-xs">{votante.nombre1 || 'Sin nombre'}</p>
                              <p className="text-muted-foreground text-xs">{votante.apellido1 || 'Sin apellido'}</p>
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

            {/* Paginación */}
            {filteredVotantes.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
                <div className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1} a {Math.min(endIndex, filteredVotantes.length)} de {filteredVotantes.length} registros
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2 py-1 rounded text-sm transition-colors ${currentPage === page
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted-foreground/10'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de confirmación para datos sin guardar */}
      {showConfirmClose && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg max-w-sm w-full p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground mb-2">¿Descartar cambios?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Tiene datos sin guardar. Si cierra el modal, los datos se perderán.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirmClose(false)}
              >
                Continuar editando
              </Button>
              <Button
                type="button"
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleConfirmClose}
              >
                Descartar cambios
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { Loading }
