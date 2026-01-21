"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, Users, MapPin, TrendingUp } from "lucide-react"
import { sidebarTour } from "@/lib/tours-config"
import { getRoleFromToken } from "@/lib/auth"
import {
  VotosDiaChart,
  VotosPuestoChart,
  VotosPorLideresChart,
  EstadoVotantesChart,
  VotantesVsVotosChart,
} from "@/components/dashboard-charts"

const stats = [
  {
    title: "Total Votos",
    value: "12,458",
    icon: ClipboardList,
    change: "+12%",
    description: "vs mes anterior",
    gradient: "from-primary/20 to-primary/5",
    color: "text-primary",
  },
  {
    title: "Votantes Registrados",
    value: "8,234",
    icon: Users,
    change: "+8%",
    description: "crecimiento mensual",
    gradient: "from-accent/20 to-accent/5",
    color: "text-accent",
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
  {
    title: "Participación",
    value: "68%",
    icon: TrendingUp,
    change: "+5%",
    description: "nivel general",
    gradient: "from-chart-4/20 to-chart-4/5",
    color: "text-chart-4",
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

  useEffect(() => {
    const role = getRoleFromToken()
    setUserRole(role)
  }, [])

  return (
    <div className="min-h-screen bg-muted/40">
      <Header title="Dashboard" /*tours={[{ name: "Guía del Sidebar", steps: sidebarTour }]}*/ />

      <div className="p-6 space-y-10">

        {/* ================= KPIs ================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
                    {stat.value}
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

        {/* ================= ACTIVIDAD + ZONAS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Actividad Reciente */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { action: "Nuevo voto registrado", time: "Hace 2 minutos", user: "Juan Pérez" },
                { action: "Votante actualizado", time: "Hace 15 minutos", user: "María García" },
                { action: "Puesto de votación creado", time: "Hace 1 hora", user: "Admin" },
                { action: "Reporte generado", time: "Hace 2 horas", user: "Sistema" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 border-l-2 border-primary/30 pl-4 py-2"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {item.time}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Resumen por Zona */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen por Puestos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                { zona: "Zona Norte", votos: 3245, porcentaje: 72 },
                { zona: "Zona Sur", votos: 2890, porcentaje: 65 },
                { zona: "Zona Centro", votos: 4123, porcentaje: 78 },
                { zona: "Zona Este", votos: 2200, porcentaje: 58 },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.zona}</span>
                    <span className="text-muted-foreground">
                      {item.votos} votos · {item.porcentaje}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.porcentaje}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
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


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <VotosPorLideresChart />
              <EstadoVotantesChart />
              <VotosPuestoChart />
            </div>

            <div className="grid  grid-cols-1 lg:grid-cols-2 gap-6">
              <VotosDiaChart />
              <VotantesVsVotosChart />
            </div>

          </motion.div>
        )}
      </div>
    </div>
  )
}
