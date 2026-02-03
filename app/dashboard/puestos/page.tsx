"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import { AddPuestoDialog } from "@/components/add-puesto-dialog"
import { PuestoDetailsDialog } from "@/components/puesto-details-dialog"
import { puestosTour } from "@/lib/tours-config"

interface Puesto {
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
  totalVotaciones: number
  porcentajeSobreVotaciones: number
  porcentajeGeneralReal: number
  porcentajePuesto: number
}


export default function PuestosPage() {
  const [puestos, setPuestos] = useState<Puesto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPuesto, setSelectedPuesto] = useState<Puesto | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  useEffect(() => {
    const fetchPuestos = async () => {
      try {
        setLoading(true)
        setError(null)
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
          setPuestos(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar puestos')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPuestos()
  }, [])

  const filteredPuestos = puestos.filter((puesto) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      puesto.puesto.toLowerCase().includes(searchLower) ||
      puesto.direccion.toLowerCase().includes(searchLower) ||
      puesto.municipio.toLowerCase().includes(searchLower) ||
      puesto.departamento.toLowerCase().includes(searchLower) ||
      puesto.codUnic.includes(searchTerm)
    )
  })

  return (
    <div className="min-h-screen">
      <Header title="Puestos de Votación" tours={[{ name: "Guía de Puestos", steps: puestosTour }]} />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 id="puestos-titulo" className="text-lg font-semibold text-foreground">Puestos de Votación</h2>
            <p className="text-sm text-muted-foreground">{filteredPuestos.length} puestos registrados</p>
          </div>
          <div className=" hidden items-center gap-3">
            <div id="puestos-nuevo-btn">
              <AddPuestoDialog />
            </div>
          </div>
        </div>

        <div id="puestos-busqueda" className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, dirección, municipio o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="text-2xl font-bold text-primary">PSPvote</span>
          </div>
        ) : filteredPuestos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron puestos</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            id="puestos-tabla"
          >
            {filteredPuestos.map((puesto, index) => (
              <motion.div
                key={puesto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-border hover:shadow-md transition-shadow h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-semibold text-foreground line-clamp-2">{puesto.puesto}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{puesto.direccion}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">{puesto.municipio}</Badge>
                          <Badge variant="outline" className="text-xs">{puesto.codUnic}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-4 gap-2 py-3 border-t border-border">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-foreground">{puesto.mesas}</p>
                        <p className="text-xs text-muted-foreground">Mesas</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-foreground">{(puesto.total).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total General por puesto</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-foreground">{(puesto.totalVotaciones).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Total Votos Registardos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-primary">{(puesto.porcentajePuesto).toFixed(2)}%</p>
                        <p className="text-xs text-muted-foreground">Porcentaje</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-border">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs"
                        onClick={() => {
                          setSelectedPuesto(puesto)
                          setIsDetailsOpen(true)
                        }}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {selectedPuesto && (
        <PuestoDetailsDialog 
          open={isDetailsOpen} 
          onOpenChange={setIsDetailsOpen}
          puesto={selectedPuesto} 
        />
      )}
    </div>
  )
}
