"use client"

import React, { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"

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

interface MapaLideresProps {
  lideres: Lider[]
  loading?: boolean
  error?: string | null
}

// Fijar el icono por defecto de Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

// Iconos personalizados para diferentes estados
const crearIcono = (estado?: string) => {
  const color = estado === "activo" ? "#10b981" : "#ef4444"
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        cursor: pointer;
      ">
        <span style="color: white; font-weight: bold; font-size: 16px;">👤</span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
    className: "custom-marker",
  })
}

export function MapaLideres({ lideres, loading = false, error = null }: MapaLideresProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calcular el centro del mapa basado en las coordenadas de los líderes
  const calcularCentro = (): [number, number] => {
    if (lideres.length === 0) {
      return [10.9403, -74.7660] // Soledad, Atlántico por defecto
    }

    const latPromedio = lideres.reduce((sum, l) => sum + l.latitud, 0) / lideres.length
    const longPromedio = lideres.reduce((sum, l) => sum + l.longitud, 0) / lideres.length

    return [latPromedio, longPromedio]
  }

  const centro = calcularCentro()

  if (!mounted) {
    return <Spinner />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-destructive/10 rounded-lg border border-destructive">
        <p className="text-destructive font-medium">{error}</p>
      </div>
    )
  }

  if (lideres.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg border border-border">
        <p className="text-muted-foreground font-medium">No hay líderes para mostrar en el mapa</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Líderes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{lideres.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {lideres.filter((l) => l.estado === "activo").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactivos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">
              {lideres.filter((l) => l.estado === "inactivo").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Zonas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{new Set(lideres.map((l) => l.zona)).size}</p>
          </CardContent>
        </Card>
      </div>

      {/* Mapa */}
      <Card>
        <CardHeader>
          <CardTitle>Ubicación de Líderes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg overflow-hidden h-96 md:h-96 border border-border">
            <MapContainer
              center={centro}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
              className="z-0"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {lideres.map((lider) => (
                <Marker
                  key={lider.id}
                  position={[lider.latitud, lider.longitud]}
                  icon={crearIcono(lider.estado) as any}
                >
                  <Popup>
                    <div className="w-64 p-3 space-y-2">
                      <div>
                        <h3 className="font-bold text-foreground">
                          {lider.nombre} {lider.apellido}
                        </h3>
                        {lider.zona && <p className="text-xs text-muted-foreground">Zona: {lider.zona}</p>}
                      </div>

                      <div className="space-y-1 text-sm">
                        {lider.email && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">📧</span>
                            <a
                              href={`mailto:${lider.email}`}
                              className="text-primary hover:underline"
                            >
                              {lider.email}
                            </a>
                          </div>
                        )}
                        {lider.telefono && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">📱</span>
                            <a
                              href={`tel:${lider.telefono}`}
                              className="text-primary hover:underline"
                            >
                              {lider.telefono}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Badge
                          variant={lider.estado === "activo" ? "default" : "secondary"}
                          className={
                            lider.estado === "activo"
                              ? "bg-green-600"
                              : "bg-red-600"
                          }
                        >
                          {lider.estado === "activo" ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Lista de líderes */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Líderes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Nombre</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Zona</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Teléfono</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Coordenadas</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {lideres.map((lider) => (
                  <tr key={lider.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-2 px-3 font-medium">
                      {lider.nombre} {lider.apellido}
                    </td>
                    <td className="py-2 px-3 text-muted-foreground">{lider.zona || "—"}</td>
                    <td className="py-2 px-3 text-muted-foreground">{lider.telefono}</td>
                    <td className="py-2 px-3 text-xs text-muted-foreground font-mono">
                      {lider.latitud.toFixed(4)}, {lider.longitud.toFixed(4)}
                    </td>
                    <td className="py-2 px-3">
                      <Badge
                        variant={lider.estado === "activo" ? "default" : "secondary"}
                        className={
                          lider.estado === "activo" ? "bg-green-600" : "bg-red-600"
                        }
                      >
                        {lider.estado === "activo" ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
