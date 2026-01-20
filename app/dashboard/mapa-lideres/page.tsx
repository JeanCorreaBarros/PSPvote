"use client"

import React, { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { MapaLideres } from "@/components/mapa-lideres"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Info } from "lucide-react"

interface Lider {
  id: string
  nombre: string
  apellido: string
  telefono: string
  email?: string
  latitud: number
  longitud: number
  zona?: string
  estado?: "activo" | "inactivo"
}

// Datos de prueba con líderes en Soledad, Atlántico
const lideresDemo: Lider[] = [
  {
    id: "1",
    nombre: "Juan",
    apellido: "García",
    telefono: "3001234567",
    email: "juan@example.com",
    latitud: 10.9403,
    longitud: -74.7660,
    zona: "Centro",
    estado: "activo",
  },
  {
    id: "2",
    nombre: "María",
    apellido: "López",
    telefono: "3102345678",
    email: "maria@example.com",
    latitud: 10.9450,
    longitud: -74.7700,
    zona: "Sureste",
    estado: "activo",
  },
  {
    id: "3",
    nombre: "Carlos",
    apellido: "Rodríguez",
    telefono: "3123456789",
    email: "carlos@example.com",
    latitud: 10.9350,
    longitud: -74.7600,
    zona: "Noreste",
    estado: "activo",
  },
  {
    id: "4",
    nombre: "Ana",
    apellido: "Martínez",
    telefono: "3134567890",
    email: "ana@example.com",
    latitud: 10.9300,
    longitud: -74.7750,
    zona: "Suroeste",
    estado: "inactivo",
  },
  {
    id: "5",
    nombre: "Pedro",
    apellido: "Sánchez",
    telefono: "3145678901",
    email: "pedro@example.com",
    latitud: 10.9500,
    longitud: -74.7550,
    zona: "Noroeste",
    estado: "activo",
  },
]

export default function MapaLideresPage() {
  const [lideres, setLideres] = useState<Lider[]>(lideresDemo)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLideres = async () => {
      try {
        setLoading(true)
        setError(null)

        // Intentar obtener desde la API
        const token = localStorage.getItem("pspvote_token")
        if (!token) {
          throw new Error("No hay token de autenticación")
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/lideres`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data)) {
            setLideres(data)
          }
        } else {
          // Si no está el endpoint, usar datos de prueba
          setLideres(lideresDemo)
        }
      } catch (err) {
        console.log("Usando datos de prueba:", err)
        setLideres(lideresDemo)
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
