"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Phone, MapPin } from "lucide-react"
import { votantesApi } from "@/lib/api"

interface Votante {
  id: number
  nombre: string
  cedula: string
  email: string
  telefono: string
  direccion: string
  estado: string
}

const defaultVotantes: Votante[] = [
  { id: 1, nombre: "Juan Carlos Pérez", cedula: "1234567890", email: "juan@email.com", telefono: "3001234567", direccion: "Calle 45 #23-12, Centro", estado: "activo" },
  { id: 2, nombre: "María García López", cedula: "9876543210", email: "maria@email.com", telefono: "3109876543", direccion: "Carrera 12 #34-56, La Esperanza", estado: "activo" },
  { id: 3, nombre: "Pedro Martínez Ruiz", cedula: "5678901234", email: "pedro@email.com", telefono: "3205678901", direccion: "Avenida 5 #67-89, San Antonio", estado: "inactivo" },
  { id: 4, nombre: "Ana Rodríguez Castro", cedula: "3456789012", email: "ana@email.com", telefono: "3153456789", direccion: "Calle 78 #12-34, Villa Rosa", estado: "activo" },
  { id: 5, nombre: "Carlos Sánchez Mora", cedula: "7890123456", email: "carlos@email.com", telefono: "3007890123", direccion: "Carrera 34 #56-78, El Prado", estado: "activo" },
  { id: 6, nombre: "Laura Hernández Villa", cedula: "2345678901", email: "laura@email.com", telefono: "3112345678", direccion: "Calle 23 #45-67, Centro", estado: "inactivo" },
]

interface VotantesListProps {
  searchTerm: string
}

export function VotantesList({ searchTerm }: VotantesListProps) {
  const [votantes, setVotantes] = useState<Votante[]>(defaultVotantes)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVotantes = async () => {
      try {
        setLoading(true)
        setError(null)
        // Descomenta cuando el endpoint esté listo
        // const data = await votantesApi.getAll()
        // setVotantes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar votantes')
        setVotantes(defaultVotantes) // Fallback a datos de prueba
      } finally {
        setLoading(false)
      }
    }

    fetchVotantes()
  }, [])

  const filteredVotantes = votantes.filter(
    (v) =>
      v.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.cedula.includes(searchTerm)
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {filteredVotantes.map((votante, index) => (
        <motion.div
          key={votante.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="border-border hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {votante.nombre.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-foreground truncate">{votante.nombre}</h3>
                    <Badge variant="outline" className={votante.estado === "activo" ? "bg-accent/10 text-accent border-accent/20" : "bg-muted text-muted-foreground"}>
                      {votante.estado}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">CC: {votante.cedula}</p>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{votante.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{votante.telefono}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{votante.direccion}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
