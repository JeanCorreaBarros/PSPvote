"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Shield, Eye } from "lucide-react"
import { CertificateVerificationDialog } from "@/components/certificate-verification-dialog"
import { CertificationDetailsDialog } from "@/components/certification-details-dialog"
import { useToast } from "@/hooks/use-toast"
import { getRoleFromToken, getUser, getToken } from "@/lib/auth"

interface Votante {
  id: string
  nombre: string
  cedula: string
  telefono: string
  direccion: string
  barrio: string
  puestoVotacionNombre: string
  planilla: number
  leader?: {
    name: string
  }
  esPago: boolean
  isActive: boolean
  isDuplicate: boolean
  certificado?: boolean
  confirmado?: boolean
  codigoVotacion?: string
  imagenConfirmacion?: string
  fechaConfirmacion?: string
  confirmadoPor?: {
    id: string
    nombre: string
  }
}

const defaultVotantes: Votante[] = []

interface VotantesListProps {
  searchTerm: string
}

export function VotantesList({ searchTerm }: VotantesListProps) {
  const [votantes, setVotantes] = useState<Votante[]>(defaultVotantes)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVotante, setSelectedVotante] = useState<Votante | null>(null)
  const [certificationDialogOpen, setCertificationDialogOpen] = useState(false)
  const [certificationDetailsOpen, setCertificationDetailsOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [currentUserLeaderId, setCurrentUserLeaderId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  // 🔹 NUEVO: filtro confirmados
  const [showConfirmados, setShowConfirmados] = useState(false)

  const pageSize = 12
  const { toast } = useToast()

  useEffect(() => {
    const fetchVotantes = async () => {
      try {
        setLoading(true)
        setError(null)

        const role = getRoleFromToken()
        setUserRole(role)

        const userData = getUser()
        if (userData) {
          setUserName(userData.leader?.name || userData.username || "sin leader asociado")
          setCurrentUserLeaderId(userData.leaderId || userData.leader?.id || null)
        }

        const token = getToken()
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/votaciones`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })

        if (!res.ok) throw new Error(`Error fetching votaciones: ${res.status}`)
        const data = await res.json()

        const mapped: Votante[] = data.map((item: any) => ({
          id: item.id,
          nombre: [item.nombre1, item.nombre2, item.apellido1, item.apellido2].filter(Boolean).join(" "),
          cedula: item.cedula,
          telefono: item.telefono,
          direccion: item.direccion,
          barrio: item.barrio || "",
          puestoVotacionNombre: item.puestoVotacionNombre || item.puestoVotacion || "",
          planilla: item.planilla ?? 0,
          leader: item.leader ? { name: item.leader.name } : undefined,
          esPago: !!item.esPago,
          isActive: !!item.isActive,
          isDuplicate: !!item.isDuplicate,
          certificado: item.confirmado || false,
          confirmado: item.confirmado || false,
          codigoVotacion: item.codigoVotacion,
          imagenConfirmacion: item.imagenConfirmacion,
          fechaConfirmacion: item.fechaConfirmacion,
          confirmadoPor: item.confirmadoPor,
        }))

        setVotantes(mapped)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar votantes")
        setVotantes(defaultVotantes)
      } finally {
        setLoading(false)
      }
    }

    fetchVotantes()
  }, [])

  const query = searchTerm?.trim() || ""

  // 🔹 FILTRO COMBINADO
  const filteredVotantes = votantes.filter((v) => {
    const matchesSearch = query ? v.cedula?.includes(query) : true
    const matchesConfirmado = showConfirmados ? v.confirmado === true : true
    return matchesSearch && matchesConfirmado
  })

  const totalPages = Math.max(1, Math.ceil(filteredVotantes.length / pageSize))
  if (page > totalPages) setPage(totalPages)
  const start = (page - 1) * pageSize
  const paginatedVotantes = filteredVotantes.slice(start, start + pageSize)

  const handleCertify = (votante: Votante) => {
    setSelectedVotante(votante)
    setCertificationDialogOpen(true)
  }

  const handleViewCertificationDetails = (votante: Votante) => {
    setSelectedVotante(votante)
    setCertificationDetailsOpen(true)
  }

  const handleCertificationConfirm = async (codigoBarras: string, imageBlob?: Blob | null) => {
    if (!selectedVotante) return

    try {
      setLoading(true)

      const form = new FormData()
      form.append("codigoVotacion", codigoBarras)
      if (imageBlob) form.append("imagen", imageBlob, "imagen.jpg")

      const token = getToken()
      const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/votaciones/${selectedVotante.id}/confirmar`

      const res = await fetch(endpoint, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
      })

      if (!res.ok) throw new Error(`Error ${res.status}`)

      const result = await res.json()

      if (result.ok === true) {
        setVotantes(
          votantes.map((v) =>
            v.id === selectedVotante.id
              ? { ...v, certificado: true, confirmado: true, codigoVotacion: codigoBarras, fechaConfirmacion: new Date().toISOString() }
              : v
          )
        )

        toast({ title: "Éxito", description: result.message })
        setCertificationDialogOpen(false)
        setSelectedVotante(null)
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Error al certificar",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* BOTÓN FILTRO */}
      <div className="mb-4 flex justify-end">
        <Button
          variant={showConfirmados ? "default" : "outline"}
          onClick={() => {
            setShowConfirmados((prev) => !prev)
            setPage(1)
          }}
        >
          {showConfirmados ? "Mostrar todos" : "Mostrar confirmados"}
        </Button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedVotantes.map((votante, index) => (
          <motion.div key={votante.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <div className="relative bg-linear-to-br from-slate-50 to-slate-100 border-2 border-slate-300 rounded-lg shadow-lg hover:shadow-xl transition-all overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500" />

              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-slate-800">{votante.nombre}</h3>
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-amber-100 text-amber-900 font-bold">
                      {votante.nombre.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="border-t-2 border-dashed border-slate-300 pt-3" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Cédula:</span><span className="font-mono font-bold">{votante.cedula}</span></div>
                  <div className="flex justify-between"><span>Puesto:</span><span className="text-xs">{votante.puestoVotacionNombre}</span></div>
                  <div className="flex justify-between"><span>Teléfono:</span><span>{votante.telefono}</span></div>
                  <div className="flex justify-between"><span>Dirección:</span><span className="text-xs">{votante.direccion}</span></div>
                </div>

                <div className="border-t-2 border-dashed border-slate-300 pt-3" />

                <div className="flex gap-2">
                  <Badge className={votante.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {votante.isActive ? "Activo" : "Inactivo"}
                  </Badge>

                  {votante.certificado && (
                    <Badge className="bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Certificado
                    </Badge>
                  )}
                </div>

                {votante.confirmado ? (
                  <Button onClick={() => handleViewCertificationDetails(votante)} className="w-full bg-emerald-500 text-white">
                    <Eye className="w-4 h-4 mr-2" /> Ver detalles
                  </Button>
                ) : (
                  <Button onClick={() => handleCertify(votante)} className="w-full bg-amber-500 text-white">
                    <Shield className="w-4 h-4 mr-2" /> Certificar
                  </Button>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 via-yellow-400 to-amber-500" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* PAGINACIÓN */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-slate-600">{filteredVotantes.length} registros</span>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Anterior</Button>
          <span>{page}/{totalPages}</span>
          <Button size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Siguiente</Button>
        </div>
      </div>

      {selectedVotante && (
        <CertificateVerificationDialog
          open={certificationDialogOpen}
          onOpenChange={setCertificationDialogOpen}
          votanteNombre={selectedVotante.nombre}
          votanteCedula={selectedVotante.cedula}
          votanteId={selectedVotante.id}
          onConfirm={handleCertificationConfirm}
        />
      )}

      {selectedVotante && (
        <CertificationDetailsDialog
          open={certificationDetailsOpen}
          onOpenChange={setCertificationDetailsOpen}
          votanteNombre={selectedVotante.nombre}
          votanteCedula={selectedVotante.cedula}
          codigoVotacion={selectedVotante.codigoVotacion}
          imagenConfirmacion={selectedVotante.imagenConfirmacion}
          fechaConfirmacion={selectedVotante.fechaConfirmacion}
          confirmadoPor={selectedVotante.confirmadoPor}
        />
      )}
    </>
  )
}
