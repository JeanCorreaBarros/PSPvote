"use client"

import React, { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { MapaLideres } from "@/components/mapa-lideres"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Info } from "lucide-react"
import { getToken } from "@/lib/auth"

interface Lider {
  id: string
  name: string
  phone: string
  address: string
  recommendedById?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  recommendedBy?: any
  recommendations?: any[]
  users?: any[]
  lat?: number | null
  lng?: number | null
}

// Datos de prueba con líderes en Soledad, Atlántico
const lideresDemo: Lider[] = []

export default function MapaLideresPage() {
  const [lideres, setLideres] = useState<Lider[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLideres = async () => {
      try {
        setLoading(true)
        setError(null)

        // Obtener token usando getToken()
        const token = getToken()
        if (!token) {
          throw new Error("No hay token de autenticación")
        }

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        const response = await fetch(
          `${apiBaseUrl}/leaders`,
          {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data)) {
            // Transformar datos si es necesario
            setLideres(data)
            console.log("✅ Líderes cargados:", data)
          }
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Error desconocido"
        console.error("❌ Error al cargar líderes:", errorMsg)
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    fetchLideres()
  }, [])

  return (
    <div className="min-h-screen">
      <Header title="Mapa de Líderes" />

      <div className="p-6 space-y-6">
        {/* Alert informativo */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Mapa interactivo de ubicación</AlertTitle>
          <AlertDescription>
            Visualiza la ubicación geográfica de todos los líderes registrados. Haz clic en los marcadores para ver más detalles.
          </AlertDescription>
        </Alert>

        {/* Mapa */}
        <MapaLideres lideres={lideres} loading={loading} error={error} />

        {/* Leyenda */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Leyenda</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                style={{
                  backgroundColor: "#10b981",
                  border: "3px solid white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "10px" }}>👤</span>
              </div>
              <span className="text-sm">Líder activo</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                style={{
                  backgroundColor: "#ef4444",
                  border: "3px solid white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "10px" }}>👤</span>
              </div>
              <span className="text-sm">Líder inactivo</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
