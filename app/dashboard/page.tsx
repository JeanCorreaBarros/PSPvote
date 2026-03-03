"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, Users, MapPin, TrendingUp, X } from "lucide-react"
import { sidebarTour } from "@/lib/tours-config"
import { getRoleFromToken } from "@/lib/auth"
import {
  VotosDiaChart,
  VotosPuestoChart,
  VotosPorLideresChart,
  VotosPorPuestoChart,
  VotantesVsVotosChart,
  DashboardData,
} from "@/components/dashboard-charts"

const stats = [
  {
    title: "Total Votos",
    icon: ClipboardList,
    change: "+12%",
    description: "vs mes anterior",
    gradient: "from-primary/20 to-primary/5",
    color: "text-primary",
  },
  {
    title: "Líderes Activos",
    value: "12",
    icon: MapPin,
    change: "+2",
    description: "nuevos líderes",
    gradient: "from-chart-3/20 to-chart-3/5",
    color: "text-chart-3",
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
}

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const isAdmin = userRole === "ADMIN" || userRole === "SUPERADMIN"
  const [isModalPuestosOpen, setIsModalPuestosOpen] = useState(false)
  const [isModalActividadOpen, setIsModalActividadOpen] = useState(false)
  const [votacionesHoy, setVotacionesHoy] = useState<any[]>([])
  const [loadingActividad, setLoadingActividad] = useState(false)

  const today = new Date()
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const lastOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  const formatDate = (d: Date) => d.toISOString().slice(0, 10)

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Hace unos segundos"
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
    return date.toLocaleDateString('es-ES')
  }

  const [desde, setDesde] = useState<string>(formatDate(firstOfMonth))
  const [hasta, setHasta] = useState<string>(formatDate(lastOfMonth))
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loadingDash, setLoadingDash] = useState(false)
  const [dashError, setDashError] = useState<string | null>(null)
  useEffect(() => {
    const role = getRoleFromToken()
    setUserRole(role)
  }, [])

  useEffect(() => {
    async function fetchActividad() {
      setLoadingActividad(true)
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
        const url = `${base.replace(/\/$/, "")}/votaciones`
        const token = typeof window !== "undefined" ? localStorage.getItem("pspvote_token") : null
        const headers: Record<string, string> = { "Content-Type": "application/json" }
        if (token) headers["Authorization"] = `Bearer ${token}`
        const res = await fetch(url, { headers })
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        const data = await res.json()
      console.log("Datos de votaciones:", data)

        // Filtrar votaciones de hoy
        const today = new Date().toISOString().split('T')[0]
        const votacionesDeHoy = (Array.isArray(data) ? data : data.data || []).filter((v: any) => {
          const votationDate = new Date(v.fechaCreacion || v.createdAt || v.fecha).toISOString().split('T')[0]
          return votationDate === today
        }).sort((a: any, b: any) => {
          const dateA = new Date(b.fechaCreacion || b.createdAt || b.fecha)
          const dateB = new Date(a.fechaCreacion || a.createdAt || a.fecha)
          return dateA.getTime() - dateB.getTime()
        })

        setVotacionesHoy(votacionesDeHoy)
        console.log("Votaciones de hoy:", votacionesDeHoy)
      } catch (err: any) {
        console.error("Error fetching actividad:", err)
        setVotacionesHoy([])
      } finally {
        setLoadingActividad(false)
      }
    }

    fetchActividad()
  }, [])

  useEffect(() => {
    if (!isAdmin) return

    async function fetchDashboard() {
      setLoadingDash(true)
      setDashError(null)
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
        const url = `${base.replace(/\/$/, "")}/reports/dashboard?desde=${encodeURIComponent(desde)}&hasta=${encodeURIComponent(hasta)}`
        const token = typeof window !== "undefined" ? localStorage.getItem("pspvote_token") : null
        const headers: Record<string, string> = { "Content-Type": "application/json" }
        if (token) headers["Authorization"] = `Bearer ${token}`
        const res = await fetch(url, { headers })
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        const data = await res.json()
        setDashboardData(data)
      } catch (err: any) {
        setDashError(err?.message || "Error fetching dashboard")
        setDashboardData(null)
      } finally {
        setLoadingDash(false)
      }
    }

    fetchDashboard()
  }, [isAdmin, desde, hasta])

  return (
    <div className="min-h-screen bg-muted/40">
      <Header title="Dashboard" /*tours={[{ name: "Guía del Sidebar", steps: sidebarTour }]}*/ />

      <div className="p-6 space-y-10">

        {/* ================= KPIs ================= */}
        {isAdmin && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="relative overflow-hidden border-border bg-background hover:shadow-xl transition-all duration-300">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-70`}
                  />
                  <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent className="relative space-y-1">
                    <div className="text-3xl font-bold text-foreground">
                      {stat.title === "Total Votos" ? (dashboardData?.totalVotaciones ?? "0") : (dashboardData?.porLider?.length ?? "0")}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-primary">{stat.change}</span>
                      <span className="text-muted-foreground">{stat.description}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* ================= HERO SECTION LIDER ================= */}
        {!isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-lg"
          >
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 h-32 flex items-center justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white text-center drop-shadow-lg">
                Para Que Soledad Progrese
              </h1>
            </div>
            <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-700 h-32 flex items-center justify-center">
              <p className="text-lg md:text-xl font-semibold text-white text-center drop-shadow-lg px-6">
                Tu compromiso es nuestro progreso
              </p>
            </div>
          </motion.div>
        )}

        {/* ================= ACTIVIDAD + ZONAS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className={`grid gap-6 ${isAdmin ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-1'}`}
        >
          {/* Actividad Reciente */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Actividad Reciente</CardTitle>
              {votacionesHoy.length > 4 && (
                <Button
                  onClick={() => setIsModalActividadOpen(true)}
                  variant="outline"
                  size="sm"
                >
                  Ver más detalles
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {votacionesHoy.slice(0, 4).map((item, index) => {
                const fullName = (item.nombre1 || item.nombre || item.titulo) ? `${item.nombre1 ? `${item.nombre1}${item.apellido1 ? ` ${item.apellido1}` : ''}` : (item.nombre || item.titulo)}` : 'Votación registrada'
                const cedula = item.cedula || item.identificacion || ''
                const telefono = item.telefono || ''
                const puesto = item.puestoVotacionNombre || item.puestoVotacionLabel || item.puestoVotacion || ''
                const creator = item.leader?.name || item.lider || item.usuario || item.creadoPor || 'Sistema'

                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 border-l-2 border-primary/30 pl-4 py-2"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{fullName}</p>
                      <div className="text-xs text-muted-foreground flex flex-wrap gap-2 items-center">
                        {cedula && <span>Cédula: <strong className="text-foreground">{cedula}</strong></span>}
                        {telefono && <span>Tel: <strong className="text-foreground">{telefono}</strong></span>}
                        {puesto && <span>Puesto: <strong className="text-foreground truncate max-w-[200px]">{puesto}</strong></span>}
                        <span className="w-full text-muted-foreground">Registrado por: <strong className="text-foreground">{creator}</strong></span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTimeAgo(item.fechaCreacion || item.createdAt || item.fecha)}
                    </span>
                  </div>
                )
              })}
              {votacionesHoy.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No hay actividad registrada hoy</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Modal Actividad */}
          {isModalActividadOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-background rounded-lg w-full h-full max-w-4xl max-h-[95vh] flex flex-col shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-6">
                  <h2 className="text-2xl font-bold">Actividad del Día</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsModalActividadOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                  <div className="space-y-3 max-h-[calc(95vh-200px)] overflow-y-auto pr-2">
                    {votacionesHoy.map((item, index) => {
                      const fullName = (item.nombre1 || item.nombre || item.titulo) ? `${item.nombre1 ? `${item.nombre1}${item.apellido1 ? ` ${item.apellido1}` : ''}` : (item.nombre || item.titulo)}` : 'Votación registrada'
                      const cedula = item.cedula || item.identificacion || ''
                      const telefono = item.telefono || ''
                      const puesto = item.puestoVotacionNombre || item.puestoVotacionLabel || item.puestoVotacion || ''
                      const creator = item.leader?.name || item.lider || item.usuario || item.creadoPor || 'Sistema'

                      return (
                      <div
                        key={index}
                        className="flex items-start gap-3 border-l-4 border-primary pl-4 py-3 bg-muted/30 rounded-r-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{fullName}</p>
                          <div className="text-xs text-muted-foreground flex flex-wrap gap-2 items-center">
                            {cedula && <span>Cédula: <strong className="text-foreground">{cedula}</strong></span>}
                            {telefono && <span>Tel: <strong className="text-foreground">{telefono}</strong></span>}
                            {puesto && <span>Puesto: <strong className="text-foreground truncate max-w-[250px]">{puesto}</strong></span>}
                            <span className="w-full text-muted-foreground">Registrado por: <strong className="text-foreground">{creator}</strong></span>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTimeAgo(item.fechaCreacion || item.createdAt || item.fecha)}
                        </span>
                      </div>
                      )
                    })}
                    {votacionesHoy.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No hay actividad registrada hoy</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t p-6 flex justify-end gap-2">
                  <span className="text-xs text-muted-foreground mr-auto">
                    Total: {votacionesHoy.length} votacion{votacionesHoy.length !== 1 ? 'es' : ''}
                  </span>
                  <Button onClick={() => setIsModalActividadOpen(false)}>Cerrar</Button>
                </div>
              </div>
            </div>
          )}

          {/* Resumen por Zona - Solo para ADMIN */}
          {isAdmin && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Resumen por Puestos</CardTitle>
                {(dashboardData?.porPuestoVotacion?.length ?? 0) > 4 && (
                  <Button
                    onClick={() => setIsModalPuestosOpen(true)}
                    variant="outline"
                    size="sm"
                  >
                    Ver más
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-5">
                {(dashboardData?.porPuestoVotacion || []).slice(0, 4).map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate">{item.puestoVotacion}</span>
                      <span className="text-muted-foreground whitespace-nowrap ml-2">
                        {item.porcentajeTotal?.toFixed(1) ?? "0"}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.porcentajeTotal ?? 0}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Modal Puestos */}
          {isModalPuestosOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-background rounded-lg w-full h-full max-w-4xl max-h-[95vh] flex flex-col shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-6">
                  <h2 className="text-2xl font-bold">Todos los Puestos de Votación</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsModalPuestosOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                  <div className="space-y-4">
                    {(dashboardData?.porPuestoVotacion || []).map((item, index) => (
                      <div key={index} className="space-y-2 pb-4 border-b last:border-b-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{item.puestoVotacion}</span>
                          <span className="text-muted-foreground text-sm font-semibold">
                            {item.porcentajeTotal?.toFixed(1) ?? "0"}%
                          </span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.porcentajeTotal ?? 0}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.05 }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                        {userRole !== "LIDER" && (
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Total: {item.total} votos</span>
                            <span className="text-green-600">Pago: {item.pago} · </span>
                            <span className="text-red-600">No Pago: {item.noPago}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t p-6 flex justify-end gap-2">
                  <Button onClick={() => setIsModalPuestosOpen(false)}>Cerrar</Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* ================= GRÁFICOS ================= */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold">Gráficos y Estadísticas</h3>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6 p-4 rounded-xl border bg-background shadow-sm">
              {/* Desde */}
              <div className="flex flex-col gap-1">
                <label htmlFor="desde" className="text-xs font-medium text-muted-foreground">
                  Desde
                </label>
                <input
                  id="desde"
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                  className="h-10 rounded-md border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
                />
              </div>

              {/* Hasta */}
              <div className="flex flex-col gap-1">
                <label htmlFor="hasta" className="text-xs font-medium text-muted-foreground">
                  Hasta
                </label>
                <input
                  id="hasta"
                  type="date"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                  className="h-10 rounded-md border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
                />
              </div>

              {/* Estados */}
              <div className="flex items-center gap-3 min-h-[40px]">
                {loadingDash && (
                  <span className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Cargando datos…
                  </span>
                )}

                {dashError && (
                  <span className="text-xs text-destructive font-medium">
                    {dashError}
                  </span>
                )}
              </div>
            </div>


            {/* show percentages only per user request; do not display totalVotaciones */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VotosPorLideresChart porLider={dashboardData?.porLider} />
              <VotosPorPuestoChart porPuestoVotacion={dashboardData?.porPuestoVotacion} />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">

              <VotantesVsVotosChart porPrograma={dashboardData?.porPrograma} />
              <VotosPuestoChart porTipo={dashboardData?.porTipo} />
            </div>

          </motion.div>
        )}
      </div>
    </div>
  )
}
