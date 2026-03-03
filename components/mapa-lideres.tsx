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
  // Propiedades antiguas (por compatibilidad)
  nombre?: string
  apellido?: string
  telefono?: string
  email?: string
  latitud?: number | null
  longitud?: number | null
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

  // Filtrar líderes con coordenadas válidas
  const lideresConUbicacion = lideres.filter((l) => {
    const lat = l.lat !== null && l.lat !== undefined ? l.lat : l.latitud
    const lng = l.lng !== null && l.lng !== undefined ? l.lng : l.longitud
    return lat != null && lng != null
  })

  // Función auxiliar para obtener nombre
  const getNombre = (lider: Lider): string => {
    return lider.name || `${lider.nombre || ''} ${lider.apellido || ''}`.trim()
  }

  // Función auxiliar para obtener teléfono
  const getTelefono = (lider: Lider): string => {
    return lider.phone || lider.telefono || ''
  }

  // Función auxiliar para obtener estado
  const getEstado = (lider: Lider): "activo" | "inactivo" => {
    return lider.isActive ? "activo" : (lider.estado || "activo")
  }

  // Función auxiliar para obtener coordenadas
  const getCoord = (lider: Lider): [number, number] => {
    const lat = lider.lat !== null && lider.lat !== undefined ? lider.lat : lider.latitud
    const lng = lider.lng !== null && lider.lng !== undefined ? lider.lng : lider.longitud
    return [lat as number, lng as number]
  }

  // Calcular el centro del mapa basado en las coordenadas de los líderes
  const calcularCentro = (): [number, number] => {
    if (lideresConUbicacion.length === 0) {
      return [10.9403, -74.7660] // Soledad, Atlántico por defecto
    }

    const coords = lideresConUbicacion.map(getCoord)
    const latPromedio = coords.reduce((sum, c) => sum + c[0], 0) / coords.length
    const longPromedio = coords.reduce((sum, c) => sum + c[1], 0) / coords.length

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

  if (lideresConUbicacion.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="text-center">
          <p className="text-yellow-800 font-medium">⚠️ No hay líderes con ubicación</p>
          <p className="text-sm text-yellow-700 mt-2">{lideres.length} líderes cargados sin coordenadas válidas</p>
        </div>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Con Ubicación</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{lideresConUbicacion.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {lideresConUbicacion.filter((l) => getEstado(l) === "activo").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Zonas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{new Set(lideresConUbicacion.map((l) => l.zona)).size}</p>
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
              {lideresConUbicacion.map((lider) => (
                <Marker
                  key={lider.id}
                  position={getCoord(lider)}
                  icon={crearIcono(getEstado(lider)) as any}
                >
                  <Popup>
                    <div className="w-64 p-3 space-y-2">
                      <div>
                        <h3 className="font-bold text-foreground">
                          {getNombre(lider)}
                        </h3>
                        {lider.zona && <p className="text-xs text-muted-foreground">Zona: {lider.zona}</p>}
                      </div>

                      <div className="space-y-1 text-sm">
                        {lider.address && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">📍</span>
                            <span className="text-primary">
                              {lider.address}
                            </span>
                          </div>
                        )}
                        {getTelefono(lider) && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">📱</span>
                            <a
                              href={`tel:${getTelefono(lider)}`}
                              className="text-primary hover:underline"
                            >
                              {getTelefono(lider)}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Badge
                          variant={getEstado(lider) === "activo" ? "default" : "secondary"}
                          className={
                            getEstado(lider) === "activo"
                              ? "bg-green-600"
                              : "bg-red-600"
                          }
                        >
                          {getEstado(lider) === "activo" ? "Activo" : "Inactivo"}
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
                {lideresConUbicacion.map((lider) => {
                  const [lat, lng] = getCoord(lider)
                  return (
                    <tr key={lider.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-2 px-3 font-medium">
                        {getNombre(lider)}
                      </td>
                      <td className="py-2 px-3 text-muted-foreground">{lider.zona || "—"}</td>
                      <td className="py-2 px-3 text-muted-foreground">{getTelefono(lider)}</td>
                      <td className="py-2 px-3 text-xs text-muted-foreground font-mono">
                        {lat.toFixed(4)}, {lng.toFixed(4)}
                      </td>
                      <td className="py-2 px-3">
                        <Badge
                          variant={getEstado(lider) === "activo" ? "default" : "secondary"}
                          className={
                            getEstado(lider) === "activo" ? "bg-green-600" : "bg-red-600"
                          }
                        >
                          {getEstado(lider) === "activo" ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
