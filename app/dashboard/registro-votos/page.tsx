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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Search, Edit2, Trash2, MoreVertical, Filter, X, Power, PowerOff } from "lucide-react"
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
  isDuplicate?: boolean
  isActive?: boolean
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
  const [searchLider, setSearchLider] = useState("")
  const [showPuestosDropdown, setShowPuestosDropdown] = useState(false)
  const [showRecomendadosDropdown, setShowRecomendadosDropdown] = useState(false)
  const [showProgramasDropdown, setShowProgramasDropdown] = useState(false)
  const [showLiderDropdown, setShowLiderDropdown] = useState(false)
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const [loadingPuestos, setLoadingPuestos] = useState(true)
  const [loadingRecomendados, setLoadingRecomendados] = useState(true)
  const [loadingProgramas, setLoadingProgramas] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [toggleStatusId, setToggleStatusId] = useState<string | null>(null)
  const [isTogglingStatus, setIsTogglingStatus] = useState(false)
  const [observation, setObservation] = useState("")

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
          isDuplicate: votante.isDuplicate || false,
          isActive: votante.isActive || false,
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
    leaderId: "",
    programaId: "",
    programaLabel: "",
    sedeId: null as string | null,
    tipoVinculacionId: "",
    esPago: Boolean(false),
  }

  // Función para generar IDs únicos
  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  type VotanteRowType = typeof initialFormData & {
    id: string
    error?: string
  }

  const [votanteRows, setVotanteRows] = useState<VotanteRowType[]>([
    { ...initialFormData, id: generateUniqueId() }
  ])
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

  // Sincronizar leaderId y recommendedById de la cabecera a todas las filas en modo creación
  useEffect(() => {
    if (!editingVotante && isDialogOpen && votanteRows.length > 0) {
      setVotanteRows(prev => prev.map(row => ({
        ...row,
        leaderId: formData.leaderId,
        recommendedById: formData.recommendedById
      })))
    }
  }, [formData.leaderId, formData.recommendedById, editingVotante, isDialogOpen])

  // Sincronizar programaLabel cuando se carguen los programasOpciones en modo edición
  useEffect(() => {
    if (editingVotante && formData.programaId && !formData.programaLabel && programasOpciones.length > 0) {
      const programaEncontrado = programasOpciones.find(
        p => p.programaId === formData.programaId && 
             p.tipoVinculacionId === formData.tipoVinculacionId &&
             (p.sedeId === formData.sedeId || (p.sedeId === null && formData.sedeId === null))
      )
      if (programaEncontrado) {
        setFormData(prev => ({
          ...prev,
          programaLabel: programaEncontrado.label
        }))
      }
    }
  }, [editingVotante, programasOpciones, formData.programaId, formData.tipoVinculacionId, formData.sedeId])

  const addNewRow = () => {
    const newId = generateUniqueId()
    // Nueva fila hereda automáticamente leaderId y recommendedById de la cabecera (formData)
    setVotanteRows([...votanteRows, { 
      ...initialFormData, 
      id: newId,
      leaderId: formData.leaderId,
      recommendedById: formData.recommendedById
    }])
  }

  const updateRow = (id: string, updates: Partial<VotanteRowType>) => {
    setVotanteRows(votanteRows.map(row =>
      row.id === id ? { ...row, ...updates, error: undefined } : row
    ))
  }

  const deleteRow = (id: string) => {
    if (votanteRows.length > 1) {
      setVotanteRows(votanteRows.filter(row => row.id !== id))
    } else {
      toast.error('Debe haber al menos una fila en el formulario')
    }
  }

  const handleSubmitRows = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const token = localStorage.getItem('pspvote_token')

      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      let failedCount = 0
      const updatedRows: VotanteRowType[] = []

      // Validar todos los registros
      for (const row of votanteRows) {
        if (!row.nombre1 || !row.apellido1 || !row.cedula || !row.telefono || !row.direccion || !row.barrio || !row.puestoVotacion || !row.programaId) {
          updatedRows.push({
            ...row,
            error: 'Campos incompletos'
          })
          failedCount++
        }
      }

      // Si hay errores, mostrar y detener
      if (failedCount > 0) {
        setVotanteRows(updatedRows.filter(row => row.error))
        toast.error(`${failedCount} votante(s) con error (marcados en rojo)`)
        setLoading(false)
        return
      }

      // Preparar array de votantes válidos para enviar al bulk
      const votantesParaEnviar = votanteRows.map(row => {
        const nombreSplit = splitNameFields(row.nombre1 || '')
        const apellidoSplit = splitNameFields(row.apellido1 || '')

        return {
          nombre1: nombreSplit.first,
          nombre2: nombreSplit.second || null,
          apellido1: apellidoSplit.first,
          apellido2: apellidoSplit.second || null,
          cedula: row.cedula,
          telefono: row.telefono,
          direccion: row.direccion,
          barrio: row.barrio,
          puestoVotacion: row.puestoVotacion,
          recommendedById: row.recommendedById || null,
          leaderId: row.leaderId || null,
          programaId: row.programaId || null,
          sedeId: row.sedeId || null,
          tipoId: row.tipoVinculacionId || null,
          esPago: row.esPago,
        }
      })

      // Enviar al endpoint bulk
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/votaciones/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(votantesParaEnviar),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Error al registrar votantes')
      }

      const result = await response.json()

      // Limpiar formulario y cerrar modal
      setVotanteRows([{ ...initialFormData, id: generateUniqueId() }])
      setIsDialogOpen(false)

      toast.success(`${votantesParaEnviar.length} votante(s) registrado(s) exitosamente`)
      await refetchVotos()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar'
      toast.error(errorMessage)
      console.error('Error en handleSubmitRows:', err)
    } finally {
      setLoading(false)
    }
  }

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
        leaderId: formData.leaderId || undefined,
        programaId: formData.programaId || undefined,
        sedeId: formData.sedeId ?? null,
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
            leaderId: dataToSend.leaderId ?? null,
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
            leaderId: dataToSend.leaderId ?? null,
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
      // Asegurar que tipoVinculacionId siempre venga del tipoId del backend
      const tipoVinculacionIdValue = votanteData.tipoId || votanteData.tipoVinculacionId || ""
      
      // Buscar el label del programa que corresponde a esta combinación
      const programaEncontrado = programasOpciones.find(
        p => p.programaId === votanteData.programaId && 
             p.tipoVinculacionId === votanteData.tipoId &&
             (p.sedeId === votanteData.sedeId || (p.sedeId === null && votanteData.sedeId === null))
      )
      const programaLabelValue = programaEncontrado ? programaEncontrado.label : ""

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
        leaderId: votanteData.leaderId || "",
        programaId: votanteData.programaId || "",
        programaLabel: programaLabelValue,
        sedeId: votanteData.sedeId || null,
        tipoVinculacionId: tipoVinculacionIdValue,
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

      const liderSelec = recomendados.find(r => r.id === votanteData.leaderId)
      if (liderSelec) {
        setSearchLider(liderSelec.name)
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

  const handleToggleStatus = async (id: string) => {
    let toastId: string | undefined
    try {
      setIsTogglingStatus(true)
      const token = localStorage.getItem('pspvote_token')

      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      // Validar si se requiere observation (solo cuando se desactiva)
      const votante = votantes.find(v => v.id === id)
      if (votante?.isActive && !observation.trim()) {
        toast.error("Por favor ingresa un comentario para desactivar el registro", {
          duration: 4000,
          position: 'top-right',
        })
        setIsTogglingStatus(false)
        return
      }

      toastId = toast.loading("Actualizando estado...", {
        position: 'top-right',
      })

      const body = votante?.isActive ? { observation } : {}

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/votaciones/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del registro')
      }

      const data = await response.json()

      // Actualizar el votante en el estado
      refetchVotos()
      setToggleStatusId(null)
      setObservation("")

      const statusMessage = data.isActive ? "Registro activado exitosamente" : "Registro desactivado exitosamente"
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
      setIsTogglingStatus(false)
    }
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
      formData.leaderId !== "" ||
      formData.programaId !== "" ||
      formData.sedeId !== "" ||
      formData.tipoVinculacionId !== "" ||
      formData.esPago !== false
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
    // Primera fila hereda leaderId y recommendedById si ya estaban seleccionados
    setVotanteRows([{ 
      ...initialFormData, 
      id: generateUniqueId(),
      leaderId: formData.leaderId,
      recommendedById: formData.recommendedById
    }])
    setEditingVotante(null)
    setSearchPuesto("")
    setSearchRecomendado("")
    setSearchPrograma("")
    setSearchLider("")
  }

  const puestosFiltered = puestosVotacion.filter((puesto) =>
    (puesto.puesto || '').toLowerCase().includes(searchPuesto.toLowerCase())
  )

  const recomendadosFiltered = recomendados.filter((rec) =>
    (rec.name || '').toLowerCase().includes(searchRecomendado.toLowerCase())
  )

  const programasOpsFiltered = programasOpciones.filter((prog) =>
    (prog.label || '').toLowerCase().includes(searchPrograma.toLowerCase())
  )

  const puestoSeleccionado = puestosVotacion.find((p) => p.id === formData.puestoVotacion)

  const recomendadoSeleccionado = recomendados.find((r) => r.id === formData.recommendedById)

  const programaSeleccionado = programasOpciones.find((p) => p.programaId === formData.programaId && p.tipoVinculacionId === formData.tipoVinculacionId)

  const getStatusBadge = (estado: Votante["estado"], isDuplicate?: boolean) => {
    const styles = {
      verificado: "bg-accent/10 text-accent border-accent/20",
      registrado: isDuplicate ? "bg-red-100 text-red-700 border-red-300" : "bg-primary/10 text-primary border-primary/20",
      pendiente: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    }
    const labels = {
      verificado: "Verificado",
      registrado: isDuplicate ? "Registrado/Duplicado" : "Registrado",
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
                      <div className="bg-background border border-border rounded-lg  w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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

                          {/* FILA: IZQUIERDA (RJ) | CENTRO (RECOMENDADO) | DERECHA (LÍDER) */}
                          <div className="flex flex-col lg:flex-row gap-4 items-start w-full">

                            {/* IZQUIERDA */}
                            {userName && (
                              <div
                                className="flex items-center gap-2 lg:w-1/3"
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
                                    Registrando <span className="font-bold">Digitador</span>:
                                  </p>
                                  <p className="text-sm font-medium text-foreground">
                                    {userName || "sin líder asociado"}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Centro - LÍDER */}
                            <div className="space-y-2 lg:w-1/3" id="form-lider">
                              <Label htmlFor="liderId">Asignar Líder</Label>

                              <div id="form-lider-input" className="relative">
                                <div className="flex items-center gap-2 border-2 border-input rounded-md px-3 py-2 bg-background focus-within:border-primary transition-colors">
                                  <Search className="w-4 h-4 text-muted-foreground" />
                                  <input
                                    id="liderId"
                                    type="text"
                                    placeholder="Buscar Líder... (Enter para crear nuevo)"
                                    value={searchLider}
                                    onChange={(e) => setSearchLider(e.target.value)}
                                    onFocus={() => setShowLiderDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowLiderDropdown(false), 200)}
                                    onKeyDown={async (e) => {
                                      if (e.key === 'Enter' && searchLider.trim()) {
                                        console.log('🔍 Enter presionado - Buscando Líder:', searchLider)
                                        const existe = recomendados.some(r => r.name.toLowerCase() === searchLider.toLowerCase())

                                        console.log('📋 ¿Existe en la lista?:', existe)

                                        if (!existe) {
                                          try {
                                            console.log('✨ Creando nuevo líder:', searchLider)
                                            setLoading(true)
                                            const token = localStorage.getItem('pspvote_token')

                                            if (!token) {
                                              throw new Error('No hay token de autenticación')
                                            }

                                            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/leaders`, {
                                              method: 'POST',
                                              headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${token}`,
                                              },
                                              body: JSON.stringify({
                                                name: searchLider.trim(),
                                                phone: "0000000000",
                                                address: "0000000000"
                                              }),
                                            })

                                            if (!response.ok) {
                                              const errorData = await response.json().catch(() => ({}))
                                              throw new Error(errorData.message || 'Error al crear el líder')
                                            }

                                            const nuevoLider = await response.json()
                                            const liderData = nuevoLider.leader

                                            if (!liderData || !liderData.id) {
                                              throw new Error('El servidor no devolvió un ID válido para el nuevo líder')
                                            }

                                            setRecomendados(prev => [...prev, liderData])
                                            setFormData(prev => ({ ...prev, leaderId: liderData.id }))
                                            // Aplicar a todas las filas de votanteRows
                                            setVotanteRows(prev => prev.map(row => ({ ...row, leaderId: liderData.id })))
                                            setSearchLider(liderData.name)
                                            setShowLiderDropdown(false)

                                            toast.success(`¡Líder "${liderData.name}" creado y asignado a todos los registros!`)
                                          } catch (err) {
                                            const errorMessage = err instanceof Error ? err.message : 'Error al crear el líder'
                                            console.error('❌ Error al crear líder:', errorMessage, err)
                                            toast.error(errorMessage)
                                          } finally {
                                            setLoading(false)
                                          }
                                        }
                                      }
                                    }}
                                    className="flex-1 bg-transparent outline-none text-sm"
                                  />
                                  {searchLider && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSearchLider("")
                                        setShowLiderDropdown(true)
                                      }}
                                      className="text-muted-foreground hover:text-foreground"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>

                                {showLiderDropdown && (
                                  <div className="absolute top-full left-0 right-0 mt-1 border border-border rounded-md bg-background shadow-lg z-50 max-h-64 overflow-y-auto">
                                    {recomendados.filter(r => r.name.toLowerCase().includes(searchLider.toLowerCase())).length > 0 ? (
                                      recomendados.filter(r => r.name.toLowerCase().includes(searchLider.toLowerCase())).map((lider) => (
                                        <button
                                          key={lider.id}
                                          type="button"
                                          onMouseDown={() => {
                                            // Aplicar a formData (para edición individual)
                                            setFormData({ ...formData, leaderId: lider.id })
                                            // Aplicar a todas las filas de votanteRows (para creación masiva)
                                            setVotanteRows(prev => prev.map(row => ({ ...row, leaderId: lider.id })))
                                            setSearchLider(lider.name)
                                            setShowLiderDropdown(false)
                                          }}
                                          className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
                                        >
                                          {lider.name}
                                        </button>
                                      ))
                                    ) : (
                                      <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                                        No se encontraron líderes
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Derecha - RECOMENDADO */}
                            <div className="space-y-2 lg:w-1/3" id="form-leader">
                              <Label htmlFor="recommendedById">Recomendado por</Label>

                              <div id="form-recomendado" className="relative">
                                <div className="flex items-center gap-2 border-2 border-input rounded-md px-3 py-2 bg-background focus-within:border-primary transition-colors">
                                  <Search className="w-4 h-4 text-muted-foreground" />
                                  <input
                                    id="recommendedById"
                                    type="text"
                                    placeholder="Buscar Recomendado... (Enter para crear nuevo)"
                                    value={searchRecomendado}
                                    onChange={(e) => setSearchRecomendado(e.target.value)}
                                    onFocus={() => setShowRecomendadosDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowRecomendadosDropdown(false), 200)}
                                    onKeyDown={async (e) => {
                                      if (e.key === 'Enter' && searchRecomendado.trim()) {
                                        console.log('🔍 Enter presionado - Buscando:', searchRecomendado)
                                        const existe = recomendadosFiltered.some(r => r.name.toLowerCase() === searchRecomendado.toLowerCase())

                                        console.log('📋 ¿Existe en la lista?:', existe)

                                        if (!existe) {
                                          try {
                                            console.log('✨ Creando nuevo líder:', searchRecomendado)
                                            setLoading(true)
                                            const token = localStorage.getItem('pspvote_token')

                                            if (!token) {
                                              throw new Error('No hay token de autenticación')
                                            }

                                            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/leaders`, {
                                              method: 'POST',
                                              headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${token}`,
                                              },
                                              body: JSON.stringify({
                                                name: searchRecomendado.trim(),
                                                phone: "0000000000",
                                                address: "0000000000"
                                              }),
                                            })

                                            if (!response.ok) {
                                              const errorData = await response.json().catch(() => ({}))
                                              throw new Error(errorData.message || 'Error al crear el líder')
                                            }

                                            const nuevoLider = await response.json()

                                            // Extraer el líder del response (estructura anidada)
                                            const liderData = nuevoLider.leader

                                            console.log('✅ Líder creado exitosamente:', liderData)
                                            console.log('🆔 ID del nuevo líder:', liderData.id)

                                            if (!liderData || !liderData.id) {
                                              throw new Error('El servidor no devolvió un ID válido para el nuevo líder')
                                            }

                                            // Agregar el nuevo líder a la lista
                                            setRecomendados(prev => [...prev, liderData])
                                            console.log('📝 Añadido a lista de recomendados')

                                            // Actualizar el formulario con el nuevo líder
                                            setFormData(prev => {
                                              const updated = { ...prev, recommendedById: liderData.id }
                                              console.log('📌 recommendedById asignado a:', liderData.id)
                                              console.log('📦 FormData actualizado:', updated)
                                              return updated
                                            })

                                            // Aplicar a todas las filas de votanteRows
                                            setVotanteRows(prev => prev.map(row => ({ ...row, recommendedById: liderData.id })))
                                            console.log('📋 recommendedById aplicado a todas las filas')

                                            // Actualizar el search para mostrar el nombre del nuevo líder
                                            setSearchRecomendado(liderData.name)
                                            console.log('🏷️ Campo de búsqueda actualizado a:', liderData.name)

                                            // Cerrar el dropdown
                                            setShowRecomendadosDropdown(false)

                                            toast.success(`¡Líder "${liderData.name}" creado y asignado a todos los registros!`)
                                          } catch (err) {
                                            const errorMessage = err instanceof Error ? err.message : 'Error al crear el líder'
                                            console.error('❌ Error al crear líder:', errorMessage, err)
                                            toast.error(errorMessage)
                                          } finally {
                                            setLoading(false)
                                          }
                                        }
                                      }
                                    }}
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
                                            // Aplicar a formData (para edición individual)
                                            setFormData({ ...formData, recommendedById: rec.id })
                                            // Aplicar a todas las filas de votanteRows (para creación masiva)
                                            setVotanteRows(prev => prev.map(row => ({ ...row, recommendedById: rec.id })))
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


                        {/* MODO EDICIÓN: Formulario con estructura horizontal */}
                        {editingVotante ? (
                          <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Tabla horizontal para editar un votante */}
                            <div className="overflow-x-auto border border-border rounded-lg">
                              <table className="w-full text-sm table-fixed">
                                <colgroup>
                                  <col className="w-[120px]" />
                                  <col className="w-[120px]" />
                                  <col className="w-[110px]" />
                                  <col className="w-[110px]" />
                                  <col className="w-[130px]" />
                                  <col className="w-[110px]" />
                                  <col className="w-[130px]" />
                                  <col className="w-[140px]" />
                                </colgroup>
                                <thead>
                                  <tr className="bg-muted/50 border-b border-border">
                                    <th className="px-2 py-2 text-left font-medium text-xs">Nombres</th>
                                    <th className="px-2 py-2 text-left font-medium text-xs">Apellidos</th>
                                    <th className="px-2 py-2 text-left font-medium text-xs">Cédula</th>
                                    <th className="px-2 py-2 text-left font-medium text-xs">Teléfono</th>
                                    <th className="px-2 py-2 text-left font-medium text-xs">Dirección</th>
                                    <th className="px-2 py-2 text-left font-medium text-xs">Barrio</th>
                                    <th className="px-2 py-2 text-left font-medium text-xs">Puesto</th>
                                    <th className="px-2 py-2 text-left font-medium text-xs">Programa</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b border-border hover:bg-muted/50">
                                    <td className="px-2 py-2 overflow-hidden">
                                      <Input
                                        type="text"
                                        placeholder="Nombres"
                                        value={formData.nombre1}
                                        onChange={(e) => setFormData({ ...formData, nombre1: e.target.value })}
                                        className="h-8 text-xs w-full max-w-[120px]"
                                      />
                                    </td>
                                    <td className="px-2 py-2 overflow-hidden">
                                      <Input
                                        type="text"
                                        placeholder="Apellidos"
                                        value={formData.apellido1}
                                        onChange={(e) => setFormData({ ...formData, apellido1: e.target.value })}
                                        className="h-8 text-xs w-full max-w-[120px]"
                                      />
                                    </td>
                                    <td className="px-2 py-2 overflow-hidden">
                                      <Input
                                        type="text"
                                        placeholder="Cédula"
                                        value={formData.cedula}
                                        onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                                        className="h-8 text-xs w-full max-w-[110px]"
                                      />
                                    </td>
                                    <td className="px-2 py-2 overflow-hidden">
                                      <Input
                                        type="text"
                                        placeholder="Teléfono"
                                        value={formData.telefono}
                                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                        className="h-8 text-xs w-full max-w-[110px]"
                                      />
                                    </td>
                                    <td className="px-2 py-2 overflow-hidden">
                                      <Input
                                        type="text"
                                        placeholder="Dirección"
                                        value={formData.direccion}
                                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                        className="h-8 text-xs w-full max-w-[130px]"
                                      />
                                    </td>
                                    <td className="px-2 py-2 overflow-hidden">
                                      <Input
                                        type="text"
                                        placeholder="Barrio"
                                        value={formData.barrio}
                                        onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
                                        className="h-8 text-xs w-full max-w-[110px]"
                                      />
                                    </td>
                                    <td className="px-2 py-2 overflow-hidden">
                                      <Select value={formData.puestoVotacion} onValueChange={(value) => setFormData({ ...formData, puestoVotacion: value })}>
                                        <SelectTrigger className="h-8 text-xs w-full max-w-[130px]">
                                          <SelectValue placeholder="Sel." />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {puestosVotacion.map((puesto) => (
                                            <SelectItem key={puesto.id} value={puesto.id}>
                                              {puesto.puesto}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </td>
                                    <td className="px-2 py-2 overflow-hidden">
                                      <Select
                                        value={formData.programaLabel}
                                        onValueChange={(value) => {
                                          const prog = programasOpciones.find(p => p.label === value)
                                          if (prog) {
                                            setFormData({
                                              ...formData,
                                              programaId: prog.programaId,
                                              programaLabel: prog.label,
                                              sedeId: prog.sedeId || null,
                                              tipoVinculacionId: prog.tipoVinculacionId,
                                              esPago: prog.esPago,
                                            })
                                          }
                                        }}
                                      >
                                        <SelectTrigger className="h-8 text-xs w-full max-w-[140px]">
                                          <SelectValue placeholder="Sel." />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {programasOpciones.map((prog) => (
                                            <SelectItem key={prog.label} value={prog.label}>
                                              {prog.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Campos adicionales debajo de la tabla */}
                            <div className="space-y-4 hidden pt-4 border-t border-border">
                              {/* Recomendado Por y Líder en horizontal */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-recomendado">Recomendado Por</Label>
                                  <Select
                                    value={formData.recommendedById}
                                    onValueChange={(value) => {
                                      const rec = recomendados.find(r => r.id === value)
                                      setFormData({ ...formData, recommendedById: value })
                                      if (rec) setSearchRecomendado(rec.name)
                                    }}
                                  >
                                    <SelectTrigger id="edit-recomendado" className="h-8 text-xs">
                                      <SelectValue placeholder="Seleccionar..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {recomendados.map((rec) => (
                                        <SelectItem key={rec.id} value={rec.id}>
                                          {rec.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edit-lider">Líder</Label>
                                  <Select
                                    value={formData.leaderId}
                                    onValueChange={(value) => {
                                      const lider = recomendados.find(r => r.id === value)
                                      setFormData({ ...formData, leaderId: value })
                                      if (lider) setSearchLider(lider.name)
                                    }}
                                  >
                                    <SelectTrigger id="edit-lider" className="h-8 text-xs">
                                      <SelectValue placeholder="Seleccionar..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {recomendados.map((lider) => (
                                        <SelectItem key={lider.id} value={lider.id}>
                                          {lider.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Es Pago */}
                              <div className="flex items-center gap-2">
                                <input
                                  id="edit-pago"
                                  type="checkbox"
                                  checked={formData.esPago}
                                  onChange={(e) => setFormData({ ...formData, esPago: e.target.checked })}
                                  className="rounded border-border"
                                />
                                <Label htmlFor="edit-pago" className="text-sm">Es Pago</Label>
                              </div>
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end gap-3 pt-4">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  resetForm()
                                  setIsDialogOpen(false)
                                }}
                              >
                                Cancelar
                              </Button>
                              <Button
                                type="submit"
                                className="bg-primary text-primary-foreground"
                                disabled={loading}
                              >
                                {loading ? "Guardando..." : "Guardar Cambios"}
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <form onSubmit={handleSubmitRows} className="p-6 space-y-4">
                            {/* Tabla de Votantes - Modo Creación */}
                            {/* Tabla horizontal */}
                            <div className="overflow-x-auto border border-border rounded-lg">
                              <table className="w-full text-sm table-fixed">
                                <colgroup>
                                  <col className="w-[120px]" />
                                  <col className="w-[120px]" />
                                  <col className="w-[110px]" />
                                  <col className="w-[110px]" />
                                  <col className="w-[130px]" />
                                  <col className="w-[110px]" />
                                  <col className="w-[130px]" />
                                  <col className="w-[140px]" />
                                  <col className="w-[60px]" />
                                </colgroup>
                                <thead>
                                  <tr className="bg-muted/50 border-b border-border">
                                    <th className="px-2 py-2 text-left font-medium text-xs">Nombres</th>
                                    <th className="px-2 py-2 text-left font-medium text-xs">Apellidos</th>
                                    <th className="px-2 py-2 text-left font-medium text-xs">Cédula</th>
                                    <th className="px-2 py-2 text-left font-medium text-xs">Teléfono</th>
                                    <th className="px-2 py-2 text-left font-medium text-xs">Dirección</th>
                                    <th className="px-2 py-2 text-left font-medium text-xs">Barrio</th>
                                    <th className="px-2 py-2 text-left font-medium text-xs">Puesto</th>
                                    <th className="px-2 py-2 text-left font-medium text-xs">Programa</th>
                                    <th className="px-2 py-2 text-center font-medium text-xs">Acciones</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <AnimatePresence mode="popLayout">
                                    {votanteRows.map((row, index) => {
                                      return (
                                        <motion.tr
                                          key={`${row.id}-${index}`}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -10 }}
                                          className={`border-b border-border ${row.error ? 'bg-red-50/50' : 'hover:bg-muted/50'
                                            }`}
                                        >
                                          <td className="px-2 py-2 overflow-hidden">
                                            <Input
                                              type="text"
                                              placeholder="Nombres"
                                              value={row.nombre1}
                                              onChange={(e) => updateRow(row.id, { nombre1: e.target.value })}
                                              className={`h-8 text-xs w-full max-w-[120px] ${row.error ? 'border-red-400' : ''
                                                }`}
                                            />
                                          </td>
                                          <td className="px-2 py-2 overflow-hidden">
                                            <Input
                                              type="text"
                                              placeholder="Apellidos"
                                              value={row.apellido1}
                                              onChange={(e) => updateRow(row.id, { apellido1: e.target.value })}
                                              className={`h-8 text-xs w-full max-w-[120px] ${row.error ? 'border-red-400' : ''
                                                }`}
                                            />
                                          </td>
                                          <td className="px-2 py-2 overflow-hidden">
                                            <Input
                                              type="text"
                                              placeholder="Cédula"
                                              value={row.cedula}
                                              onChange={(e) => updateRow(row.id, { cedula: e.target.value })}
                                              className={`h-8 text-xs w-full max-w-[110px] ${row.error ? 'border-red-400' : ''
                                                }`}
                                            />
                                          </td>
                                          <td className="px-2 py-2 overflow-hidden">
                                            <Input
                                              type="text"
                                              placeholder="Teléfono"
                                              value={row.telefono}
                                              onChange={(e) => updateRow(row.id, { telefono: e.target.value })}
                                              className={`h-8 text-xs w-full max-w-[110px] ${row.error ? 'border-red-400' : ''
                                                }`}
                                            />
                                          </td>
                                          <td className="px-2 py-2 overflow-hidden">
                                            <Input
                                              type="text"
                                              placeholder="Dirección"
                                              value={row.direccion}
                                              onChange={(e) => updateRow(row.id, { direccion: e.target.value })}
                                              className={`h-8 text-xs w-full max-w-[130px] ${row.error ? 'border-red-400' : ''
                                                }`}
                                            />
                                          </td>
                                          <td className="px-2 py-2 overflow-hidden">
                                            <Input
                                              type="text"
                                              placeholder="Barrio"
                                              value={row.barrio}
                                              onChange={(e) => updateRow(row.id, { barrio: e.target.value })}
                                              className={`h-8 text-xs w-full max-w-[110px] ${row.error ? 'border-red-400' : ''
                                                }`}
                                            />
                                          </td>
                                          <td className="px-2 py-2 overflow-hidden">
                                            <Select value={row.puestoVotacion} onValueChange={(value) => updateRow(row.id, { puestoVotacion: value })}>
                                              <SelectTrigger className={`h-8 text-xs w-full max-w-[130px] ${row.error ? 'border-red-400' : ''
                                                }`}>
                                                <SelectValue placeholder="Sel." />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {puestosVotacion.map((puesto) => (
                                                  <SelectItem key={puesto.id} value={puesto.id}>
                                                    {puesto.puesto}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </td>
                                          <td className="px-2 py-2 overflow-hidden">
                                            <Select
                                              value={row.programaLabel || ""}
                                              onValueChange={(value) => {
                                                const prog = programasOpciones.find(p => p.label === value)
                                                if (prog) {
                                                  updateRow(row.id, {
                                                    programaId: prog.programaId,
                                                    programaLabel: prog.label,
                                                    sedeId: prog.sedeId || null,
                                                    tipoVinculacionId: prog.tipoVinculacionId,
                                                    esPago: prog.esPago,
                                                  })
                                                }
                                              }}
                                            >
                                              <SelectTrigger className={`h-8 text-xs w-full max-w-[140px] ${row.error ? 'border-red-400' : ''
                                                }`}>
                                                <SelectValue placeholder="Sel." />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {programasOpciones.map((prog) => (
                                                  <SelectItem key={prog.label} value={prog.label}>
                                                    {prog.label}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </td>
                                          <td className="px-2 py-2 text-center overflow-hidden">
                                            <button
                                              type="button"
                                              onClick={() => deleteRow(row.id)}
                                              className="text-muted-foreground hover:text-red-600"
                                              title="Eliminar"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </td>
                                        </motion.tr>
                                      )
                                    })}
                                  </AnimatePresence>
                                </tbody>
                              </table>
                            </div>

                            {/* Mostrar errores debajo de la tabla */}
                            {votanteRows.some(r => r.error) && (
                              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm font-semibold text-red-700 mb-2">Errores encontrados:</p>
                                {votanteRows.map((row) => row.error && (
                                  <div key={row.id} className="text-xs text-red-600 mb-1">
                                    • <strong>{row.nombre1} {row.apellido1}</strong>: {row.error}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Botón para agregar fila */}
                            <div className="flex justify-between items-center pt-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addNewRow}
                                className="gap-2"
                              >
                                <Plus className="w-4 h-4" />
                                Agregar Fila
                              </Button>

                              {/* Botones de envío */}
                              <div className="flex gap-3">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    if (!hasUnsavedChanges()) {
                                      resetForm()
                                      setIsDialogOpen(false)
                                    } else {
                                      setShowConfirmClose(true)
                                    }
                                  }}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  id="form-submit"
                                  type="submit"
                                  className="bg-primary text-primary-foreground"
                                  disabled={loading}
                                >
                                  {loading ? "Registrando..." : "Registrar Todo"}
                                </Button>
                              </div>
                            </div>
                          </form>
                        )}
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
                        className={`border-border ${votante.isDuplicate ? 'bg-red-50/50 hover:bg-red-100/50' : 'hover:bg-muted/50'}`}
                      >
                        <TableCell>
                          <input type="checkbox" className="rounded border-border ml-5" />
                        </TableCell>
                        <TableCell className={`font-medium max-w-32 truncate ${votante.isDuplicate ? 'text-red-700' : 'text-foreground'}`} title={votante.id}>{votante.idnumber}</TableCell>
                        {userRole === "ADMIN" && (
                          <TableCell className={`font-medium max-w-32 truncate text-sm ${votante.isDuplicate ? 'text-red-700' : 'text-foreground'}`} title={votante.creadoPor}>{votante.creadoPor}</TableCell>
                        )}
                        <TableCell id="tabla-avatar">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className={`text-xs ${votante.isDuplicate ? 'bg-red-200 text-red-700' : 'bg-primary/10 text-primary'}`}>
                                {(votante.nombre1 || '').charAt(0)}{(votante.apellido1 || '').charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div id="tabla-nombre">
                              <p className={`font-medium text-xs ${votante.isDuplicate ? 'text-red-700' : 'text-foreground'}`}>{votante.nombre1 || 'Sin nombre'}</p>
                              <p className={`text-xs ${votante.isDuplicate ? 'text-red-600' : 'text-muted-foreground'}`}>{votante.apellido1 || 'Sin apellido'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className={votante.isDuplicate ? 'text-red-700' : 'text-foreground'}>{votante.cedula}</TableCell>
                        <TableCell className={`max-w-20 truncate ${votante.isDuplicate ? 'text-red-700' : 'text-foreground'}`}>{votante.telefono}</TableCell>
                        <TableCell className={`max-w-20 truncate text-sm ${votante.isDuplicate ? 'text-red-700' : 'text-foreground'}`}>{votante.direccion}</TableCell>
                        <TableCell className={`max-w-32 truncate ${votante.isDuplicate ? 'text-red-700' : 'text-foreground'}`}>{votante.barrio}</TableCell>
                        <TableCell className={`max-w-32 truncate ${votante.isDuplicate ? 'text-red-700' : 'text-foreground'}`}>{votante.puestoVotacion}</TableCell>
                        <TableCell id="tabla-estado">{getStatusBadge(votante.estado, votante.isDuplicate)}</TableCell>
                        <TableCell className={votante.isDuplicate ? 'text-red-600' : 'text-muted-foreground'}>{votante.fechaRegistro}</TableCell>
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
                                  onClick={() => setToggleStatusId(votante.id)}
                                  className={votante.isActive ? "text-orange-600" : "text-green-600"}
                                >
                                  {votante.isActive ? (
                                    <>
                                      <PowerOff className="w-4 h-4 mr-2" />
                                      Desactivar {votante.isActive}
                                    </>
                                  ) : (
                                    <>
                                      <Power className="w-4 h-4 mr-2" />
                                      {votante.isActive}
                                      Activar
                                    </>
                                  )}
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

      {/* Dialog Toggle Status */}
      <AlertDialog open={toggleStatusId !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {votantes.find(v => v.id === toggleStatusId)?.isActive ? "Desactivar Registro" : "Activar Registro"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {votantes.find(v => v.id === toggleStatusId)?.isActive
                ? "¿Estás seguro de que deseas desactivar este registro de votación?"
                : "¿Estás seguro de que deseas activar este registro de votación?"}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Mostrar input de observación solo cuando se desactiva */}
          {votantes.find(v => v.id === toggleStatusId)?.isActive && (
            <div className="space-y-2">
              <label htmlFor="observation" className="text-sm font-medium">
                Comentario de desactivación *
              </label>
              <Input
                id="observation"
                placeholder="Ej: Datos incompletos, registro duplicado..."
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                disabled={isTogglingStatus}
              />
            </div>
          )}

          <div className="flex justify-end gap-3">
            <AlertDialogCancel
              onClick={() => {
                setToggleStatusId(null)
                setObservation("")
              }}
              disabled={isTogglingStatus}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toggleStatusId && handleToggleStatus(toggleStatusId)}
              className={votantes.find(v => v.id === toggleStatusId)?.isActive ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"}
              disabled={isTogglingStatus}
            >
              {isTogglingStatus ? "Actualizando..." : (votantes.find(v => v.id === toggleStatusId)?.isActive ? "Desactivar" : "Activar")}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export { Loading }
