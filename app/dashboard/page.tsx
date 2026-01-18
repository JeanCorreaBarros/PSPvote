"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, Users, MapPin, TrendingUp } from "lucide-react"

const stats = [
  { title: "Total Votos", value: "12,458", icon: ClipboardList, change: "+12%", color: "text-primary" },
  { title: "Votantes Registrados", value: "8,234", icon: Users, change: "+8%", color: "text-accent" },
  { title: "Puestos Activos", value: "45", icon: MapPin, change: "+3", color: "text-chart-3" },
  { title: "Participación", value: "68%", icon: TrendingUp, change: "+5%", color: "text-chart-4" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Header title="Dashboard" />
      
      <div className="p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="border-border hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-accent mt-1">
                    {stat.change} desde el mes pasado
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Nuevo voto registrado", time: "Hace 2 minutos", user: "Juan Pérez" },
                  { action: "Votante actualizado", time: "Hace 15 minutos", user: "María García" },
                  { action: "Puesto de votación creado", time: "Hace 1 hora", user: "Admin" },
                  { action: "Reporte generado", time: "Hace 2 horas", user: "Sistema" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Resumen por Zona</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { zona: "Zona Norte", votos: 3245, porcentaje: 72 },
                  { zona: "Zona Sur", votos: 2890, porcentaje: 65 },
                  { zona: "Zona Centro", votos: 4123, porcentaje: 78 },
                  { zona: "Zona Este", votos: 2200, porcentaje: 58 },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{item.zona}</span>
                      <span className="text-sm text-muted-foreground">{item.votos} votos ({item.porcentaje}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.porcentaje}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
